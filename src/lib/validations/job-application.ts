import {
  ApplicationPriority,
  ApplicationStatus,
  EmploymentType,
  WorkType,
} from "@/generated/prisma/enums";
import { companyIdSchema } from "@/lib/validations/company";
import { z } from "zod";

export const JOB_APPLICATION_SEARCH_MAX_LENGTH = 100;
export const DEFAULT_JOB_APPLICATION_SORT = "updated-desc";

export const JOB_APPLICATION_SORT_VALUES = [
  "updated-desc",
  "applied-desc",
  "deadline-asc",
  "priority-desc",
  "position-asc",
] as const;

const MAX_URL_LENGTH = 2048;
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SALARY_PATTERN = /^\d{1,13}(?:\.\d{1,2})?$/;

function normalizeOptionalText(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length === 0 ? null : normalizedValue;
}

function normalizeOptionalUppercaseText(value: unknown): unknown {
  const normalizedValue = normalizeOptionalText(value);

  return typeof normalizedValue === "string" ? normalizedValue.toUpperCase() : normalizedValue;
}

function applyDefaultWhenEmpty(defaultValue: string) {
  return (value: unknown): unknown => {
    const normalizedValue = normalizeOptionalText(value);

    return normalizedValue === null || normalizedValue === undefined
      ? defaultValue
      : normalizedValue;
  };
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidDateOnly(value: string): boolean {
  if (!DATE_ONLY_PATTERN.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function salaryToMinorUnit(value: string): number {
  return Math.round(Number(value) * 100);
}

function optionalTrimmedText(maxLength: number, message: string) {
  return z.preprocess(
    normalizeOptionalText,
    z.union([z.string().max(maxLength, { error: message }), z.null()]),
  );
}

function optionalHttpUrl(label: string) {
  return z.preprocess(
    normalizeOptionalText,
    z.union([
      z
        .string()
        .max(MAX_URL_LENGTH, {
          error: `${label} maksimal ${MAX_URL_LENGTH} karakter.`,
        })
        .refine(isValidHttpUrl, {
          error: `${label} harus berupa URL http atau https yang valid.`,
        }),
      z.null(),
    ]),
  );
}

function optionalDateOnly(label: string) {
  return z
    .preprocess(
      normalizeOptionalText,
      z.union([
        z.string().refine(isValidDateOnly, {
          error: `${label} harus berupa tanggal yang valid.`,
        }),
        z.null(),
      ]),
    )
    .transform((value) => (value === null ? null : new Date(`${value}T00:00:00.000Z`)));
}

const optionalSalary = z.preprocess(
  normalizeOptionalText,
  z.union([
    z.string().regex(SALARY_PATTERN, {
      error: "Nominal gaji harus berupa angka non-negatif dengan maksimal 2 angka desimal.",
    }),
    z.null(),
  ]),
);

const salaryCurrencySchema = z.preprocess(
  (value) => {
    const normalizedValue = normalizeOptionalUppercaseText(value);

    return normalizedValue === null || normalizedValue === undefined ? "IDR" : normalizedValue;
  },
  z.string().regex(/^[A-Z]{3}$/, {
    error: "Mata uang harus menggunakan 3 huruf, contoh IDR atau USD.",
  }),
);

const jobApplicationCompanyIdSchema = z
  .string({ error: "Company wajib dipilih." })
  .trim()
  .min(1, { error: "Company wajib dipilih." })
  .pipe(companyIdSchema);

const optionalContactEmail = z.preprocess(
  normalizeOptionalText,
  z.union([
    z
      .string()
      .max(254, { error: "Email kontak maksimal 254 karakter." })
      .email({ error: "Email kontak tidak valid." }),
    z.null(),
  ]),
);

export const jobApplicationFormSchema = z
  .object({
    companyId: jobApplicationCompanyIdSchema,
    position: z
      .string({ error: "Posisi wajib diisi." })
      .trim()
      .min(2, { error: "Posisi minimal 2 karakter." })
      .max(150, { error: "Posisi maksimal 150 karakter." }),
    jobUrl: optionalHttpUrl("Job URL"),
    employmentType: z.enum(EmploymentType, {
      error: "Jenis pekerjaan tidak valid.",
    }),
    workType: z.enum(WorkType, {
      error: "Sistem kerja tidak valid.",
    }),
    location: optionalTrimmedText(150, "Lokasi maksimal 150 karakter."),
    salaryMin: optionalSalary,
    salaryMax: optionalSalary,
    salaryCurrency: salaryCurrencySchema,
    status: z.preprocess(
      applyDefaultWhenEmpty(ApplicationStatus.WISHLIST),
      z.enum(ApplicationStatus, {
        error: "Status lamaran tidak valid.",
      }),
    ),
    priority: z.preprocess(
      applyDefaultWhenEmpty(ApplicationPriority.MEDIUM),
      z.enum(ApplicationPriority, {
        error: "Prioritas lamaran tidak valid.",
      }),
    ),
    source: optionalTrimmedText(100, "Sumber lowongan maksimal 100 karakter."),
    appliedAt: optionalDateOnly("Tanggal melamar"),
    deadlineAt: optionalDateOnly("Batas lamaran"),
    description: optionalTrimmedText(5000, "Deskripsi maksimal 5000 karakter."),
    requirements: optionalTrimmedText(5000, "Persyaratan maksimal 5000 karakter."),
    contactName: optionalTrimmedText(100, "Nama kontak maksimal 100 karakter."),
    contactEmail: optionalContactEmail,
    contactPhone: optionalTrimmedText(30, "Nomor telepon kontak maksimal 30 karakter."),
  })
  .superRefine((data, context) => {
    if (
      data.salaryMin !== null &&
      data.salaryMax !== null &&
      salaryToMinorUnit(data.salaryMin) > salaryToMinorUnit(data.salaryMax)
    ) {
      context.addIssue({
        code: "custom",
        path: ["salaryMax"],
        message: "Gaji maksimum harus sama dengan atau lebih besar dari gaji minimum.",
      });
    }
  });

const seedJobApplicationIdSchema = z.string().regex(/^seed_app_[a-z0-9_]+$/, {
  error: "Job Application tidak ditemukan atau tidak dapat diakses.",
});

export const jobApplicationIdSchema = z.union([
  z.cuid({
    error: "Job Application tidak ditemukan atau tidak dapat diakses.",
  }),
  seedJobApplicationIdSchema,
]);

export const jobApplicationStatusUpdateSchema = z.object({
  status: z.enum(ApplicationStatus, {
    error: "Status lamaran tidak valid.",
  }),
  note: optionalTrimmedText(500, "Catatan perubahan status maksimal 500 karakter."),
});

const jobApplicationSearchSchema = z
  .string({ error: "Pencarian Job Application tidak valid." })
  .trim()
  .max(JOB_APPLICATION_SEARCH_MAX_LENGTH, {
    error: `Pencarian maksimal ${JOB_APPLICATION_SEARCH_MAX_LENGTH} karakter.`,
  });

const jobApplicationSortSchema = z.enum(JOB_APPLICATION_SORT_VALUES, {
  error: "Pengurutan Job Application tidak valid.",
});

export type JobApplicationFormInput = z.infer<typeof jobApplicationFormSchema>;
export type JobApplicationStatusUpdateInput = z.infer<typeof jobApplicationStatusUpdateSchema>;
export type JobApplicationSort = z.infer<typeof jobApplicationSortSchema>;

export type JobApplicationListQueryInput = {
  q?: unknown;
  status?: unknown;
  company?: unknown;
  sort?: unknown;
};

export type JobApplicationListFilters = {
  query: string;
  status: ApplicationStatus | null;
  companyId: string | null;
  sort: JobApplicationSort;
};

export type JobApplicationListFilterErrors = Partial<
  Record<"query" | "status" | "companyId" | "sort", string>
>;

export type JobApplicationListQueryResult = {
  filters: JobApplicationListFilters;
  errors: JobApplicationListFilterErrors;
};

function getSingleQueryValue(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value;
}

export function parseJobApplicationListQuery(
  input: JobApplicationListQueryInput = {},
): JobApplicationListQueryResult {
  const errors: JobApplicationListFilterErrors = {};

  const queryCandidate = getSingleQueryValue(input.q);
  let query = "";

  if (queryCandidate !== undefined && queryCandidate !== null) {
    const parsedQuery = jobApplicationSearchSchema.safeParse(queryCandidate);

    if (parsedQuery.success) {
      query = parsedQuery.data;
    } else {
      query =
        typeof queryCandidate === "string"
          ? queryCandidate.trim().slice(0, JOB_APPLICATION_SEARCH_MAX_LENGTH)
          : "";

      errors.query =
        parsedQuery.error.issues[0]?.message ?? "Pencarian Job Application tidak valid.";
    }
  }

  const statusCandidate = normalizeOptionalText(getSingleQueryValue(input.status));
  let status: ApplicationStatus | null = null;

  if (statusCandidate !== undefined && statusCandidate !== null) {
    const parsedStatus = z.enum(ApplicationStatus).safeParse(statusCandidate);

    if (parsedStatus.success) {
      status = parsedStatus.data;
    } else {
      errors.status = "Filter status tidak valid.";
    }
  }

  const companyCandidate = normalizeOptionalText(getSingleQueryValue(input.company));
  let companyId: string | null = null;

  if (companyCandidate !== undefined && companyCandidate !== null) {
    const parsedCompanyId = companyIdSchema.safeParse(companyCandidate);

    if (parsedCompanyId.success) {
      companyId = parsedCompanyId.data;
    } else {
      errors.companyId = "Filter company tidak valid.";
    }
  }

  const sortCandidate = normalizeOptionalText(getSingleQueryValue(input.sort));
  let sort: JobApplicationSort = DEFAULT_JOB_APPLICATION_SORT;

  if (sortCandidate !== undefined && sortCandidate !== null) {
    const parsedSort = jobApplicationSortSchema.safeParse(sortCandidate);

    if (parsedSort.success) {
      sort = parsedSort.data;
    } else {
      errors.sort = "Pengurutan Job Application tidak valid.";
    }
  }

  return {
    filters: {
      query,
      status,
      companyId,
      sort,
    },
    errors,
  };
}
