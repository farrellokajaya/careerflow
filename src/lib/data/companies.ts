import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { companyIdSchema, parseCompanySearchQuery } from "@/lib/validations/company";

const companyListSelect = {
  id: true,
  name: true,
  website: true,
  industry: true,
  size: true,
  location: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Prisma.CompanySelect;

const editableCompanySelect = {
  id: true,
  name: true,
  website: true,
  industry: true,
  size: true,
  location: true,
  description: true,
  logoUrl: true,
  linkedinUrl: true,
  updatedAt: true,
} satisfies Prisma.CompanySelect;

export type CompanyListItem = Prisma.CompanyGetPayload<{
  select: typeof companyListSelect;
}>;

export type EditableCompany = Prisma.CompanyGetPayload<{
  select: typeof editableCompanySelect;
}>;

export type ActiveCompaniesResult = {
  companies: CompanyListItem[];
  searchQuery: string;
  searchError: string | null;
};

export async function getActiveCompanies(
  searchValue: unknown = "",
): Promise<ActiveCompaniesResult> {
  const user = await requireAuthenticatedUser();
  const search = parseCompanySearchQuery(searchValue);

  if (search.error) {
    return {
      companies: [],
      searchQuery: search.query,
      searchError: search.error,
    };
  }

  const searchFilter: Prisma.CompanyWhereInput = search.query
    ? {
        OR: [
          {
            name: {
              contains: search.query,
              mode: "insensitive",
            },
          },
          {
            industry: {
              contains: search.query,
              mode: "insensitive",
            },
          },
          {
            location: {
              contains: search.query,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  const companies = await prisma.company.findMany({
    where: {
      userId: user.id,
      deletedAt: null,
      ...searchFilter,
    },
    select: companyListSelect,
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        name: "asc",
      },
    ],
  });

  return {
    companies,
    searchQuery: search.query,
    searchError: null,
  };
}

export async function getArchivedCompanies(): Promise<CompanyListItem[]> {
  const user = await requireAuthenticatedUser();

  return prisma.company.findMany({
    where: {
      userId: user.id,
      deletedAt: {
        not: null,
      },
    },
    select: companyListSelect,
    orderBy: [
      {
        deletedAt: "desc",
      },
      {
        name: "asc",
      },
    ],
  });
}

export async function getActiveCompanyById(companyId: string): Promise<EditableCompany | null> {
  const user = await requireAuthenticatedUser();
  const parsedCompanyId = companyIdSchema.safeParse(companyId);

  if (!parsedCompanyId.success) {
    return null;
  }

  return prisma.company.findFirst({
    where: {
      id: parsedCompanyId.data,
      userId: user.id,
      deletedAt: null,
    },
    select: editableCompanySelect,
  });
}

export async function getArchivedCompanyById(companyId: string): Promise<CompanyListItem | null> {
  const user = await requireAuthenticatedUser();
  const parsedCompanyId = companyIdSchema.safeParse(companyId);

  if (!parsedCompanyId.success) {
    return null;
  }

  return prisma.company.findFirst({
    where: {
      id: parsedCompanyId.data,
      userId: user.id,
      deletedAt: {
        not: null,
      },
    },
    select: companyListSelect,
  });
}
