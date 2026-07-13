"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { jobApplicationFormSchema } from "@/lib/validations/job-application";
import type { ActionResult } from "@/types/action-result";

const JOB_APPLICATION_VALIDATION_MESSAGE =
  "Periksa kembali data Job Application yang Anda masukkan.";

const CREATE_JOB_APPLICATION_ERROR_MESSAGE = "Job Application gagal dibuat. Silakan coba kembali.";

const COMPANY_NOT_AVAILABLE_MESSAGE =
  "Company tidak ditemukan, sudah diarsipkan, atau tidak dapat digunakan.";

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
