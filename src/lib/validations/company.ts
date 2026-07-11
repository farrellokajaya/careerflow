import { CompanySize } from "@/generated/prisma/enums";
import { z } from "zod";

export const COMPANY_SEARCH_MAX_LENGTH = 100;
const MAX_URL_LENGTH = 2048;

function normalizeOptionalText(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length === 0 ? null : normalizedValue;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidLinkedInUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      (hostname === "linkedin.com" || hostname.endsWith(".linkedin.com"))
    );
  } catch {
    return false;
  }
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

const optionalLinkedInUrl = z.preprocess(
  normalizeOptionalText,
  z.union([
    z
      .string()
      .max(MAX_URL_LENGTH, {
        error: `LinkedIn URL maksimal ${MAX_URL_LENGTH} karakter.`,
      })
      .refine(isValidLinkedInUrl, {
        error: "LinkedIn URL harus menggunakan http atau https dan domain linkedin.com.",
      }),
    z.null(),
  ]),
);

const optionalCompanySize = z.preprocess(
  normalizeOptionalText,
  z.union([
    z.enum(CompanySize, {
      error: "Ukuran perusahaan tidak valid.",
    }),
    z.null(),
  ]),
);

export const companyFormSchema = z.object({
  name: z
    .string({ error: "Nama perusahaan wajib diisi." })
    .trim()
    .min(2, { error: "Nama perusahaan minimal 2 karakter." })
    .max(100, { error: "Nama perusahaan maksimal 100 karakter." }),
  website: optionalHttpUrl("Website"),
  industry: optionalTrimmedText(100, "Industry maksimal 100 karakter."),
  size: optionalCompanySize,
  location: optionalTrimmedText(150, "Lokasi maksimal 150 karakter."),
  description: optionalTrimmedText(1000, "Deskripsi maksimal 1000 karakter."),
  logoUrl: optionalHttpUrl("Logo URL"),
  linkedinUrl: optionalLinkedInUrl,
});

export const companyIdSchema = z.cuid({
  error: "Company tidak ditemukan atau tidak dapat diakses.",
});

export const companySearchSchema = z
  .string({ error: "Pencarian company tidak valid." })
  .trim()
  .max(COMPANY_SEARCH_MAX_LENGTH, {
    error: `Pencarian maksimal ${COMPANY_SEARCH_MAX_LENGTH} karakter.`,
  });

export type CompanyFormInput = z.infer<typeof companyFormSchema>;

export type CompanySearchResult = {
  query: string;
  error: string | null;
};

export function parseCompanySearchQuery(value: unknown): CompanySearchResult {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (candidate === undefined || candidate === null) {
    return {
      query: "",
      error: null,
    };
  }

  if (typeof candidate !== "string") {
    return {
      query: "",
      error: "Pencarian company tidak valid.",
    };
  }

  const parsedSearch = companySearchSchema.safeParse(candidate);

  if (!parsedSearch.success) {
    return {
      query: candidate.trim().slice(0, COMPANY_SEARCH_MAX_LENGTH),
      error: parsedSearch.error.issues[0]?.message ?? "Pencarian company tidak valid.",
    };
  }

  return {
    query: parsedSearch.data,
    error: null,
  };
}
