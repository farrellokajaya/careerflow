"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { companyFormSchema, companyIdSchema } from "@/lib/validations/company";
import type { ActionResult } from "@/types/action-result";

const EMPTY_COMPANY_SIZE_VALUE = "__NONE__";

const DUPLICATE_COMPANY_MESSAGE =
  "Perusahaan dengan nama tersebut sudah ada atau sedang diarsipkan.";

const COMPANY_VALIDATION_MESSAGE = "Periksa kembali data perusahaan yang Anda masukkan.";

const CREATE_COMPANY_ERROR_MESSAGE = "Company gagal dibuat. Silakan coba kembali.";

const UPDATE_COMPANY_ERROR_MESSAGE = "Company gagal diperbarui. Silakan coba kembali.";

const ARCHIVE_COMPANY_ERROR_MESSAGE = "Company gagal diarsipkan. Silakan coba kembali.";

const COMPANY_NOT_FOUND_MESSAGE = "Company tidak ditemukan atau tidak dapat diakses.";

function getFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field !== "string") {
      continue;
    }

    fieldErrors[field] ??= [];
    fieldErrors[field].push(issue.message);
  }

  return fieldErrors;
}

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function getCompanyFormInput(formData: FormData) {
  const size = formData.get("size");

  return {
    name: formData.get("name"),
    website: formData.get("website"),
    industry: formData.get("industry"),
    size: size === EMPTY_COMPANY_SIZE_VALUE ? "" : size,
    location: formData.get("location"),
    description: formData.get("description"),
    logoUrl: formData.get("logoUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
  };
}

export async function createCompanyAction(
  previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  void previousState;

  const user = await requireAuthenticatedUser();

  const parsedInput = companyFormSchema.safeParse(getCompanyFormInput(formData));

  if (!parsedInput.success) {
    return {
      success: false,
      message: COMPANY_VALIDATION_MESSAGE,
      errors: getFieldErrors(parsedInput.error),
    };
  }

  const { name, website, industry, size, location, description, logoUrl, linkedinUrl } =
    parsedInput.data;

  try {
    const existingCompany = await prisma.company.findFirst({
      where: {
        userId: user.id,
        name,
      },
      select: {
        id: true,
      },
    });

    if (existingCompany) {
      return {
        success: false,
        message: DUPLICATE_COMPANY_MESSAGE,
        errors: {
          name: [DUPLICATE_COMPANY_MESSAGE],
        },
      };
    }

    await prisma.company.create({
      data: {
        userId: user.id,
        name,
        website,
        industry,
        size,
        location,
        description,
        logoUrl,
        linkedinUrl,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        message: DUPLICATE_COMPANY_MESSAGE,
        errors: {
          name: [DUPLICATE_COMPANY_MESSAGE],
        },
      };
    }

    return {
      success: false,
      message: CREATE_COMPANY_ERROR_MESSAGE,
    };
  }

  revalidatePath("/companies");
  redirect("/companies?success=created");
}

export async function updateCompanyAction(
  companyId: string,
  previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  void previousState;

  const user = await requireAuthenticatedUser();
  const parsedCompanyId = companyIdSchema.safeParse(companyId);

  if (!parsedCompanyId.success) {
    return {
      success: false,
      message: COMPANY_NOT_FOUND_MESSAGE,
    };
  }

  const company = await prisma.company.findFirst({
    where: {
      id: parsedCompanyId.data,
      userId: user.id,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!company) {
    return {
      success: false,
      message: COMPANY_NOT_FOUND_MESSAGE,
    };
  }

  const parsedInput = companyFormSchema.safeParse(getCompanyFormInput(formData));

  if (!parsedInput.success) {
    return {
      success: false,
      message: COMPANY_VALIDATION_MESSAGE,
      errors: getFieldErrors(parsedInput.error),
    };
  }

  const { name, website, industry, size, location, description, logoUrl, linkedinUrl } =
    parsedInput.data;

  try {
    const duplicateCompany = await prisma.company.findFirst({
      where: {
        userId: user.id,
        name,
        id: {
          not: company.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicateCompany) {
      return {
        success: false,
        message: DUPLICATE_COMPANY_MESSAGE,
        errors: {
          name: [DUPLICATE_COMPANY_MESSAGE],
        },
      };
    }

    const updateResult = await prisma.company.updateMany({
      where: {
        id: company.id,
        userId: user.id,
        deletedAt: null,
      },
      data: {
        name,
        website,
        industry,
        size,
        location,
        description,
        logoUrl,
        linkedinUrl,
      },
    });

    if (updateResult.count !== 1) {
      return {
        success: false,
        message: COMPANY_NOT_FOUND_MESSAGE,
      };
    }
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        message: DUPLICATE_COMPANY_MESSAGE,
        errors: {
          name: [DUPLICATE_COMPANY_MESSAGE],
        },
      };
    }

    return {
      success: false,
      message: UPDATE_COMPANY_ERROR_MESSAGE,
    };
  }

  revalidatePath("/companies");
  revalidatePath(`/companies/${company.id}/edit`);
  redirect("/companies?success=updated");
}

export async function archiveCompanyAction(
  companyId: string,
  previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  void previousState;
  void formData;

  const user = await requireAuthenticatedUser();
  const parsedCompanyId = companyIdSchema.safeParse(companyId);

  if (!parsedCompanyId.success) {
    return {
      success: false,
      message: COMPANY_NOT_FOUND_MESSAGE,
    };
  }

  try {
    const company = await prisma.company.findFirst({
      where: {
        id: parsedCompanyId.data,
        userId: user.id,
      },
      select: {
        id: true,
        deletedAt: true,
      },
    });

    if (!company) {
      return {
        success: false,
        message: COMPANY_NOT_FOUND_MESSAGE,
      };
    }

    if (!company.deletedAt) {
      const archiveResult = await prisma.company.updateMany({
        where: {
          id: company.id,
          userId: user.id,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      if (archiveResult.count !== 1) {
        const currentCompany = await prisma.company.findFirst({
          where: {
            id: company.id,
            userId: user.id,
          },
          select: {
            deletedAt: true,
          },
        });

        if (!currentCompany?.deletedAt) {
          return {
            success: false,
            message: ARCHIVE_COMPANY_ERROR_MESSAGE,
          };
        }
      }
    }
  } catch {
    return {
      success: false,
      message: ARCHIVE_COMPANY_ERROR_MESSAGE,
    };
  }

  revalidatePath("/companies");
  revalidatePath("/companies/archived");
  redirect("/companies?success=archived");
}
