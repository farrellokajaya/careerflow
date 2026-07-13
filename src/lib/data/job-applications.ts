import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import {
  jobApplicationIdSchema,
  parseJobApplicationListQuery,
  type JobApplicationListFilterErrors,
  type JobApplicationListFilters,
  type JobApplicationListQueryInput,
  type JobApplicationSort,
} from "@/lib/validations/job-application";

const applicationCompanySelect = {
  id: true,
  name: true,
  deletedAt: true,
} satisfies Prisma.CompanySelect;

const jobApplicationListSelect = {
  id: true,
  position: true,
  jobUrl: true,
  employmentType: true,
  workType: true,
  location: true,
  salaryMin: true,
  salaryMax: true,
  salaryCurrency: true,
  status: true,
  priority: true,
  source: true,
  appliedAt: true,
  deadlineAt: true,
  updatedAt: true,
  archivedAt: true,
  company: {
    select: applicationCompanySelect,
  },
} satisfies Prisma.JobApplicationSelect;

const editableJobApplicationSelect = {
  id: true,
  companyId: true,
  position: true,
  jobUrl: true,
  employmentType: true,
  workType: true,
  location: true,
  salaryMin: true,
  salaryMax: true,
  salaryCurrency: true,
  status: true,
  priority: true,
  source: true,
  appliedAt: true,
  deadlineAt: true,
  description: true,
  requirements: true,
  contactName: true,
  contactEmail: true,
  contactPhone: true,
  updatedAt: true,
  archivedAt: true,
  company: {
    select: applicationCompanySelect,
  },
} satisfies Prisma.JobApplicationSelect;

const jobApplicationDetailSelect = {
  id: true,
  companyId: true,
  position: true,
  jobUrl: true,
  employmentType: true,
  workType: true,
  location: true,
  salaryMin: true,
  salaryMax: true,
  salaryCurrency: true,
  status: true,
  priority: true,
  source: true,
  appliedAt: true,
  deadlineAt: true,
  description: true,
  requirements: true,
  contactName: true,
  contactEmail: true,
  contactPhone: true,
  createdAt: true,
  updatedAt: true,
  archivedAt: true,
  company: {
    select: applicationCompanySelect,
  },
  statusHistory: {
    select: {
      id: true,
      previousStatus: true,
      newStatus: true,
      note: true,
      createdAt: true,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
  },
} satisfies Prisma.JobApplicationSelect;

const companyOptionSelect = {
  id: true,
  name: true,
  deletedAt: true,
} satisfies Prisma.CompanySelect;

type RawJobApplicationListItem = Prisma.JobApplicationGetPayload<{
  select: typeof jobApplicationListSelect;
}>;

type RawEditableJobApplication = Prisma.JobApplicationGetPayload<{
  select: typeof editableJobApplicationSelect;
}>;

type RawJobApplicationDetail = Prisma.JobApplicationGetPayload<{
  select: typeof jobApplicationDetailSelect;
}>;

export type JobApplicationListItem = Omit<RawJobApplicationListItem, "salaryMin" | "salaryMax"> & {
  salaryMin: string | null;
  salaryMax: string | null;
};

export type EditableJobApplication = Omit<RawEditableJobApplication, "salaryMin" | "salaryMax"> & {
  salaryMin: string | null;
  salaryMax: string | null;
};

export type JobApplicationDetail = Omit<RawJobApplicationDetail, "salaryMin" | "salaryMax"> & {
  salaryMin: string | null;
  salaryMax: string | null;
};

export type JobApplicationCompanyOption = Prisma.CompanyGetPayload<{
  select: typeof companyOptionSelect;
}>;

export type JobApplicationListResult = {
  applications: JobApplicationListItem[];
  filters: JobApplicationListFilters;
  filterErrors: JobApplicationListFilterErrors;
};

function serializeSalaryFields<
  T extends {
    salaryMin: Prisma.Decimal | null;
    salaryMax: Prisma.Decimal | null;
  },
>(
  application: T,
): Omit<T, "salaryMin" | "salaryMax"> & {
  salaryMin: string | null;
  salaryMax: string | null;
} {
  return {
    ...application,
    salaryMin: application.salaryMin?.toString() ?? null,
    salaryMax: application.salaryMax?.toString() ?? null,
  };
}

function getJobApplicationOrderBy(
  sort: JobApplicationSort,
): Prisma.JobApplicationOrderByWithRelationInput[] {
  switch (sort) {
    case "applied-desc":
      return [
        {
          appliedAt: {
            sort: "desc",
            nulls: "last",
          },
        },
        {
          updatedAt: "desc",
        },
        {
          id: "asc",
        },
      ];

    case "deadline-asc":
      return [
        {
          deadlineAt: {
            sort: "asc",
            nulls: "last",
          },
        },
        {
          updatedAt: "desc",
        },
        {
          id: "asc",
        },
      ];

    case "priority-desc":
      return [
        {
          priority: "desc",
        },
        {
          updatedAt: "desc",
        },
        {
          id: "asc",
        },
      ];

    case "position-asc":
      return [
        {
          position: "asc",
        },
        {
          company: {
            name: "asc",
          },
        },
        {
          id: "asc",
        },
      ];

    case "updated-desc":
    default:
      return [
        {
          updatedAt: "desc",
        },
        {
          position: "asc",
        },
        {
          id: "asc",
        },
      ];
  }
}

function buildJobApplicationWhere(
  userId: string,
  archived: boolean,
  filters: JobApplicationListFilters,
): Prisma.JobApplicationWhereInput {
  const searchFilter: Prisma.JobApplicationWhereInput = filters.query
    ? {
        OR: [
          {
            position: {
              contains: filters.query,
              mode: "insensitive",
            },
          },
          {
            location: {
              contains: filters.query,
              mode: "insensitive",
            },
          },
          {
            source: {
              contains: filters.query,
              mode: "insensitive",
            },
          },
          {
            company: {
              name: {
                contains: filters.query,
                mode: "insensitive",
              },
            },
          },
        ],
      }
    : {};

  return {
    userId,
    archivedAt: archived
      ? {
          not: null,
        }
      : null,
    company: {
      userId,
    },
    ...(filters.status
      ? {
          status: filters.status,
        }
      : {}),
    ...(filters.companyId
      ? {
          companyId: filters.companyId,
        }
      : {}),
    ...searchFilter,
  };
}

async function getJobApplications(
  archived: boolean,
  queryInput: JobApplicationListQueryInput,
): Promise<JobApplicationListResult> {
  const user = await requireAuthenticatedUser();
  const parsedQuery = parseJobApplicationListQuery(queryInput);

  if (Object.keys(parsedQuery.errors).length > 0) {
    return {
      applications: [],
      filters: parsedQuery.filters,
      filterErrors: parsedQuery.errors,
    };
  }

  const applications = await prisma.jobApplication.findMany({
    where: buildJobApplicationWhere(user.id, archived, parsedQuery.filters),
    select: jobApplicationListSelect,
    orderBy: getJobApplicationOrderBy(parsedQuery.filters.sort),
  });

  return {
    applications: applications.map(serializeSalaryFields),
    filters: parsedQuery.filters,
    filterErrors: {},
  };
}

export async function getActiveJobApplications(
  queryInput: JobApplicationListQueryInput = {},
): Promise<JobApplicationListResult> {
  return getJobApplications(false, queryInput);
}

export async function getArchivedJobApplications(
  queryInput: JobApplicationListQueryInput = {},
): Promise<JobApplicationListResult> {
  return getJobApplications(true, queryInput);
}

export async function getJobApplicationById(
  applicationId: string,
): Promise<JobApplicationDetail | null> {
  const user = await requireAuthenticatedUser();
  const parsedApplicationId = jobApplicationIdSchema.safeParse(applicationId);

  if (!parsedApplicationId.success) {
    return null;
  }

  const application = await prisma.jobApplication.findFirst({
    where: {
      id: parsedApplicationId.data,
      userId: user.id,
      company: {
        userId: user.id,
      },
    },
    select: jobApplicationDetailSelect,
  });

  return application ? serializeSalaryFields(application) : null;
}

export async function getActiveJobApplicationForEdit(
  applicationId: string,
): Promise<EditableJobApplication | null> {
  const user = await requireAuthenticatedUser();
  const parsedApplicationId = jobApplicationIdSchema.safeParse(applicationId);

  if (!parsedApplicationId.success) {
    return null;
  }

  const application = await prisma.jobApplication.findFirst({
    where: {
      id: parsedApplicationId.data,
      userId: user.id,
      archivedAt: null,
      company: {
        userId: user.id,
      },
    },
    select: editableJobApplicationSelect,
  });

  return application ? serializeSalaryFields(application) : null;
}

export async function getActiveCompanyOptions(): Promise<JobApplicationCompanyOption[]> {
  const user = await requireAuthenticatedUser();

  return prisma.company.findMany({
    where: {
      userId: user.id,
      deletedAt: null,
    },
    select: companyOptionSelect,
    orderBy: [
      {
        name: "asc",
      },
      {
        id: "asc",
      },
    ],
  });
}

export async function getApplicationCompanyOptionsForEdit(
  applicationId: string,
): Promise<JobApplicationCompanyOption[] | null> {
  const user = await requireAuthenticatedUser();
  const parsedApplicationId = jobApplicationIdSchema.safeParse(applicationId);

  if (!parsedApplicationId.success) {
    return null;
  }

  const application = await prisma.jobApplication.findFirst({
    where: {
      id: parsedApplicationId.data,
      userId: user.id,
      archivedAt: null,
      company: {
        userId: user.id,
      },
    },
    select: {
      companyId: true,
    },
  });

  if (!application) {
    return null;
  }

  return prisma.company.findMany({
    where: {
      userId: user.id,
      OR: [
        {
          deletedAt: null,
        },
        {
          id: application.companyId,
        },
      ],
    },
    select: companyOptionSelect,
    orderBy: [
      {
        name: "asc",
      },
      {
        id: "asc",
      },
    ],
  });
}

export async function getJobApplicationCompanyFilterOptions(
  archived = false,
): Promise<JobApplicationCompanyOption[]> {
  const user = await requireAuthenticatedUser();

  return prisma.company.findMany({
    where: {
      userId: user.id,
      jobApplications: {
        some: {
          userId: user.id,
          archivedAt: archived
            ? {
                not: null,
              }
            : null,
        },
      },
    },
    select: companyOptionSelect,
    orderBy: [
      {
        name: "asc",
      },
      {
        id: "asc",
      },
    ],
  });
}
