"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import {
  jobApplicationFormSchema,
  jobApplicationIdSchema,
  jobApplicationStatusUpdateSchema,
} from "@/lib/validations/job-application";
import type { ActionResult } from "@/types/action-result";

const JOB_APPLICATION_VALIDATION_MESSAGE =
  "Periksa kembali data Job Application yang Anda masukkan.";

const STATUS_VALIDATION_MESSAGE = "Periksa kembali status dan catatan yang Anda masukkan.";

const CREATE_JOB_APPLICATION_ERROR_MESSAGE = "Job Application gagal dibuat. Silakan coba kembali.";

const UPDATE_JOB_APPLICATION_ERROR_MESSAGE =
  "Job Application gagal diperbarui. Silakan coba kembali.";

const UPDATE_STATUS_ERROR_MESSAGE =
  "Status Job Application gagal diperbarui. Silakan coba kembali.";

const STATUS_UPDATE_CONFLICT_MESSAGE =
  "Status tidak dapat diperbarui karena data telah berubah. Muat ulang halaman lalu coba kembali.";

const STATUS_UNCHANGED_MESSAGE = "Status tidak berubah sehingga riwayat baru tidak dibuat.";

const COMPANY_NOT_AVAILABLE_MESSAGE =
  "Company tidak ditemukan, sudah diarsipkan, atau tidak dapat digunakan.";

const JOB_APPLICATION_NOT_FOUND_MESSAGE =
  "Job Application tidak ditemukan atau tidak dapat diakses.";

type UpdateJobApplicationResult = "updated" | "not-found" | "company-unavailable";

type UpdateJobApplicationStatusResult = "updated" | "unchanged" | "not-found" | "conflict";

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

function getJobApplicationFormInput(formData: FormData) {
  return {
    companyId: formData.get("companyId"),
    position: formData.get("position"),
    jobUrl: formData.get("jobUrl"),
    employmentType: formData.get("employmentType"),
    workType: formData.get("workType"),
    location: formData.get("location"),
    salaryMin: formData.get("salaryMin"),
    salaryMax: formData.get("salaryMax"),
    salaryCurrency: formData.get("salaryCurrency"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    source: formData.get("source"),
    appliedAt: formData.get("appliedAt"),
    deadlineAt: formData.get("deadlineAt"),
    description: formData.get("description"),
    requirements: formData.get("requirements"),
    contactName: formData.get("contactName"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone"),
  };
}

function getJobApplicationStatusInput(formData: FormData) {
  return {
    status: formData.get("status"),
    note: formData.get("note"),
  };
}

export async function createJobApplicationAction(
  previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  void previousState;

  const user = await requireAuthenticatedUser();

  const parsedInput = jobApplicationFormSchema.safeParse(getJobApplicationFormInput(formData));

  if (!parsedInput.success) {
    return {
      success: false,
      message: JOB_APPLICATION_VALIDATION_MESSAGE,
      errors: getFieldErrors(parsedInput.error),
    };
  }

  const {
    companyId,
    position,
    jobUrl,
    employmentType,
    workType,
    location,
    salaryMin,
    salaryMax,
    salaryCurrency,
    status,
    priority,
    source,
    appliedAt,
    deadlineAt,
    description,
    requirements,
    contactName,
    contactEmail,
    contactPhone,
  } = parsedInput.data;

  let createdApplicationId: string | null = null;

  try {
    createdApplicationId = await prisma.$transaction(async (transaction) => {
      const company = await transaction.company.findFirst({
        where: {
          id: companyId,
          userId: user.id,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (!company) {
        return null;
      }

      const application = await transaction.jobApplication.create({
        data: {
          userId: user.id,
          companyId: company.id,
          position,
          jobUrl,
          employmentType,
          workType,
          location,
          salaryMin,
          salaryMax,
          salaryCurrency,
          status,
          priority,
          source,
          appliedAt,
          deadlineAt,
          description,
          requirements,
          contactName,
          contactEmail,
          contactPhone,
          archivedAt: null,
          statusHistory: {
            create: {
              previousStatus: null,
              newStatus: status,
              changedById: user.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      return application.id;
    });
  } catch {
    return {
      success: false,
      message: CREATE_JOB_APPLICATION_ERROR_MESSAGE,
    };
  }

  if (!createdApplicationId) {
    return {
      success: false,
      message: COMPANY_NOT_AVAILABLE_MESSAGE,
      errors: {
        companyId: [COMPANY_NOT_AVAILABLE_MESSAGE],
      },
    };
  }

  revalidatePath("/applications");
  redirect("/applications?success=created");
}

export async function updateJobApplicationAction(
  applicationId: string,
  previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  void previousState;

  const user = await requireAuthenticatedUser();

  const parsedApplicationId = jobApplicationIdSchema.safeParse(applicationId);

  if (!parsedApplicationId.success) {
    return {
      success: false,
      message: JOB_APPLICATION_NOT_FOUND_MESSAGE,
    };
  }

  const existingApplication = await prisma.jobApplication.findFirst({
    where: {
      id: parsedApplicationId.data,
      userId: user.id,
      archivedAt: null,
      company: {
        userId: user.id,
      },
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existingApplication) {
    return {
      success: false,
      message: JOB_APPLICATION_NOT_FOUND_MESSAGE,
    };
  }

  /*
   * Status aktual berasal dari database dan menimpa input client.
   * Form edit umum tidak diperbolehkan mengubah status.
   */
  const parsedInput = jobApplicationFormSchema.safeParse({
    ...getJobApplicationFormInput(formData),
    status: existingApplication.status,
  });

  if (!parsedInput.success) {
    return {
      success: false,
      message: JOB_APPLICATION_VALIDATION_MESSAGE,
      errors: getFieldErrors(parsedInput.error),
    };
  }

  const {
    companyId,
    position,
    jobUrl,
    employmentType,
    workType,
    location,
    salaryMin,
    salaryMax,
    salaryCurrency,
    priority,
    source,
    appliedAt,
    deadlineAt,
    description,
    requirements,
    contactName,
    contactEmail,
    contactPhone,
  } = parsedInput.data;

  let updateResult: UpdateJobApplicationResult;

  try {
    updateResult = await prisma.$transaction(async (transaction) => {
      const currentApplication = await transaction.jobApplication.findFirst({
        where: {
          id: existingApplication.id,
          userId: user.id,
          archivedAt: null,
          company: {
            userId: user.id,
          },
        },
        select: {
          id: true,
          companyId: true,
        },
      });

      if (!currentApplication) {
        return "not-found";
      }

      /*
       * Company lama boleh tetap dipakai walaupun telah diarsipkan.
       * Jika company diganti, tujuan wajib aktif dan milik user.
       */
      const selectedCompany = await transaction.company.findFirst({
        where: {
          id: companyId,
          userId: user.id,
          ...(companyId === currentApplication.companyId
            ? {}
            : {
                deletedAt: null,
              }),
        },
        select: {
          id: true,
        },
      });

      if (!selectedCompany) {
        return "company-unavailable";
      }

      const result = await transaction.jobApplication.updateMany({
        where: {
          id: currentApplication.id,
          userId: user.id,
          archivedAt: null,
        },
        data: {
          companyId: selectedCompany.id,
          position,
          jobUrl,
          employmentType,
          workType,
          location,
          salaryMin,
          salaryMax,
          salaryCurrency,
          priority,
          source,
          appliedAt,
          deadlineAt,
          description,
          requirements,
          contactName,
          contactEmail,
          contactPhone,
        },
      });

      return result.count === 1 ? "updated" : "not-found";
    });
  } catch {
    return {
      success: false,
      message: UPDATE_JOB_APPLICATION_ERROR_MESSAGE,
    };
  }

  if (updateResult === "company-unavailable") {
    return {
      success: false,
      message: COMPANY_NOT_AVAILABLE_MESSAGE,
      errors: {
        companyId: [COMPANY_NOT_AVAILABLE_MESSAGE],
      },
    };
  }

  if (updateResult === "not-found") {
    return {
      success: false,
      message: JOB_APPLICATION_NOT_FOUND_MESSAGE,
    };
  }

  revalidatePath("/applications");
  revalidatePath(`/applications/${existingApplication.id}`);
  revalidatePath(`/applications/${existingApplication.id}/edit`);

  redirect("/applications?success=updated");
}

export async function updateJobApplicationStatusAction(
  applicationId: string,
  previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  void previousState;

  const user = await requireAuthenticatedUser();

  const parsedApplicationId = jobApplicationIdSchema.safeParse(applicationId);

  if (!parsedApplicationId.success) {
    return {
      success: false,
      message: JOB_APPLICATION_NOT_FOUND_MESSAGE,
    };
  }

  const parsedInput = jobApplicationStatusUpdateSchema.safeParse(
    getJobApplicationStatusInput(formData),
  );

  if (!parsedInput.success) {
    return {
      success: false,
      message: STATUS_VALIDATION_MESSAGE,
      errors: getFieldErrors(parsedInput.error),
    };
  }

  const { status, note } = parsedInput.data;

  let statusUpdateResult: UpdateJobApplicationStatusResult;

  try {
    statusUpdateResult = await prisma.$transaction(
      async (transaction): Promise<UpdateJobApplicationStatusResult> => {
        const currentApplication = await transaction.jobApplication.findFirst({
          where: {
            id: parsedApplicationId.data,
            userId: user.id,
            archivedAt: null,
            company: {
              userId: user.id,
            },
          },
          select: {
            id: true,
            status: true,
          },
        });

        if (!currentApplication) {
          return "not-found";
        }

        if (currentApplication.status === status) {
          return "unchanged";
        }

        const updateResult = await transaction.jobApplication.updateMany({
          where: {
            id: currentApplication.id,
            userId: user.id,
            archivedAt: null,
            status: currentApplication.status,
          },
          data: {
            status,
          },
        });

        if (updateResult.count !== 1) {
          return "conflict";
        }

        await transaction.applicationStatusHistory.create({
          data: {
            applicationId: currentApplication.id,
            previousStatus: currentApplication.status,
            newStatus: status,
            note,
            changedById: user.id,
          },
          select: {
            id: true,
          },
        });

        return "updated";
      },
    );
  } catch {
    return {
      success: false,
      message: UPDATE_STATUS_ERROR_MESSAGE,
    };
  }

  if (statusUpdateResult === "not-found") {
    return {
      success: false,
      message: JOB_APPLICATION_NOT_FOUND_MESSAGE,
    };
  }

  if (statusUpdateResult === "conflict") {
    return {
      success: false,
      message: STATUS_UPDATE_CONFLICT_MESSAGE,
    };
  }

  if (statusUpdateResult === "unchanged") {
    return {
      success: true,
      message: STATUS_UNCHANGED_MESSAGE,
    };
  }

  revalidatePath("/applications");
  revalidatePath(`/applications/${parsedApplicationId.data}`);
  revalidatePath(`/applications/${parsedApplicationId.data}/edit`);

  redirect("/applications?success=status-updated");
}
