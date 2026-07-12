"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { companyFormSchema } from "@/lib/validations/company";
import type { ActionResult } from "@/types/action-result";

const DUPLICATE_COMPANY_MESSAGE =
  "Perusahaan dengan nama tersebut sudah ada atau sedang diarsipkan.";

const COMPANY_VALIDATION_MESSAGE = "Periksa kembali data perusahaan yang Anda masukkan.";

const CREATE_COMPANY_ERROR_MESSAGE = "Company gagal dibuat. Silakan coba kembali.";

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

export async function createCompanyAction(
  previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  void previousState;

  const user = await requireAuthenticatedUser();

  const parsedInput = companyFormSchema.safeParse({
    name: formData.get("name"),
    website: formData.get("website"),
    industry: formData.get("industry"),
    size: formData.get("size"),
    location: formData.get("location"),
    description: formData.get("description"),
    logoUrl: formData.get("logoUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
  });

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
        deletedAt: true,
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
