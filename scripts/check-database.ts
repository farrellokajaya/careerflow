import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { compare } from "bcryptjs";
import { z } from "zod";

import { PrismaClient } from "../src/generated/prisma/client";

const environmentSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
      "DATABASE_URL must be a PostgreSQL connection URL",
    ),
  SEED_ADMIN_EMAIL: z
    .string()
    .min(1, "SEED_ADMIN_EMAIL is required")
    .email("SEED_ADMIN_EMAIL must be a valid email"),
  SEED_ADMIN_PASSWORD: z.string().min(1, "SEED_ADMIN_PASSWORD is required"),
  SEED_USER_EMAIL: z
    .string()
    .min(1, "SEED_USER_EMAIL is required")
    .email("SEED_USER_EMAIL must be a valid email"),
  SEED_USER_PASSWORD: z.string().min(1, "SEED_USER_PASSWORD is required"),
});

const parsedEnvironment = environmentSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
  SEED_USER_EMAIL: process.env.SEED_USER_EMAIL,
  SEED_USER_PASSWORD: process.env.SEED_USER_PASSWORD,
});

if (!parsedEnvironment.success) {
  const details = parsedEnvironment.error.issues
    .map((issue) => {
      const variableName = issue.path.join(".") || "environment";

      return `- ${variableName}: ${issue.message}`;
    })
    .join("\n");

  throw new Error(`Invalid database check environment:\n${details}`);
}

const environment = parsedEnvironment.data;

const adapter = new PrismaPg({
  connectionString: environment.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function verifyDatabaseConnection() {
  await prisma.$queryRaw`SELECT 1`;
}

async function verifySeedUsers() {
  const [admin, user] = await Promise.all([
    prisma.user.findUnique({
      where: {
        email: environment.SEED_ADMIN_EMAIL,
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    }),
    prisma.user.findUnique({
      where: {
        email: environment.SEED_USER_EMAIL,
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    }),
  ]);

  if (!admin) {
    throw new Error(`Seed admin was not found for ${environment.SEED_ADMIN_EMAIL}.`);
  }

  if (!user) {
    throw new Error(`Seed user was not found for ${environment.SEED_USER_EMAIL}.`);
  }

  if (!admin.password) {
    throw new Error("Seed admin does not have a password hash.");
  }

  if (!user.password) {
    throw new Error("Seed user does not have a password hash.");
  }

  const [adminPasswordMatches, userPasswordMatches] = await Promise.all([
    compare(environment.SEED_ADMIN_PASSWORD, admin.password),
    compare(environment.SEED_USER_PASSWORD, user.password),
  ]);

  if (!adminPasswordMatches) {
    throw new Error("Seed admin password hash verification failed.");
  }

  if (!userPasswordMatches) {
    throw new Error("Seed user password hash verification failed.");
  }

  if (admin.password === environment.SEED_ADMIN_PASSWORD) {
    throw new Error("Admin password is stored as plaintext.");
  }

  if (user.password === environment.SEED_USER_PASSWORD) {
    throw new Error("User password is stored as plaintext.");
  }

  return {
    adminEmail: admin.email,
    adminRole: admin.role,
    userEmail: user.email,
    userRole: user.role,
  };
}

async function verifySeedCounts() {
  const [
    users,
    companies,
    applications,
    statusHistories,
    interviews,
    notes,
    documents,
    reminders,
    tags,
    applicationTags,
    activityLogs,
    notifications,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        id: {
          startsWith: "seed_user_",
        },
      },
    }),
    prisma.company.count({
      where: {
        id: {
          startsWith: "seed_company_",
        },
      },
    }),
    prisma.jobApplication.count({
      where: {
        id: {
          startsWith: "seed_app_",
        },
      },
    }),
    prisma.applicationStatusHistory.count({
      where: {
        id: {
          startsWith: "seed_history_",
        },
      },
    }),
    prisma.interview.count({
      where: {
        id: {
          startsWith: "seed_interview_",
        },
      },
    }),
    prisma.note.count({
      where: {
        id: {
          startsWith: "seed_note_",
        },
      },
    }),
    prisma.document.count({
      where: {
        id: {
          startsWith: "seed_document_",
        },
      },
    }),
    prisma.reminder.count({
      where: {
        id: {
          startsWith: "seed_reminder_",
        },
      },
    }),
    prisma.tag.count({
      where: {
        id: {
          startsWith: "seed_tag_",
        },
      },
    }),
    prisma.applicationTag.count({
      where: {
        applicationId: {
          startsWith: "seed_app_",
        },
      },
    }),
    prisma.activityLog.count({
      where: {
        id: {
          startsWith: "seed_activity_",
        },
      },
    }),
    prisma.notification.count({
      where: {
        id: {
          startsWith: "seed_notification_",
        },
      },
    }),
  ]);

  if (users < 2) {
    throw new Error(`Expected at least 2 seed users, found ${users}.`);
  }

  if (companies < 6) {
    throw new Error(`Expected at least 6 seed companies, found ${companies}.`);
  }

  if (applications < 15) {
    throw new Error(`Expected at least 15 seed applications, found ${applications}.`);
  }

  if (statusHistories < 15) {
    throw new Error(`Expected at least 15 status histories, found ${statusHistories}.`);
  }

  if (interviews < 4) {
    throw new Error(`Expected at least 4 seed interviews, found ${interviews}.`);
  }

  if (notes < 8) {
    throw new Error(`Expected at least 8 seed notes, found ${notes}.`);
  }

  if (reminders < 6) {
    throw new Error(`Expected at least 6 seed reminders, found ${reminders}.`);
  }

  if (notifications < 8) {
    throw new Error(`Expected at least 8 seed notifications, found ${notifications}.`);
  }

  return {
    users,
    companies,
    applications,
    statusHistories,
    interviews,
    notes,
    documents,
    reminders,
    tags,
    applicationTags,
    activityLogs,
    notifications,
  };
}

async function verifyApplicationRelations() {
  const sampleApplication = await prisma.jobApplication.findFirst({
    where: {
      id: {
        startsWith: "seed_app_",
      },
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      statusHistory: {
        select: {
          id: true,
          previousStatus: true,
          newStatus: true,
        },
      },
      interviews: {
        select: {
          id: true,
          title: true,
        },
      },
      notes: {
        select: {
          id: true,
          title: true,
        },
      },
      applicationTags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!sampleApplication) {
    throw new Error("No seeded job application was found.");
  }

  if (!sampleApplication.company) {
    throw new Error("Seeded application does not have a company relation.");
  }

  if (sampleApplication.statusHistory.length === 0) {
    throw new Error("Seeded application does not have application status history.");
  }

  return {
    application: sampleApplication.position,
    company: sampleApplication.company.name,
    statusHistoryCount: sampleApplication.statusHistory.length,
    interviewCount: sampleApplication.interviews.length,
    noteCount: sampleApplication.notes.length,
    tags: sampleApplication.applicationTags.map((applicationTag) => applicationTag.tag.name),
  };
}

async function main() {
  console.log("Checking CareerFlow database...");

  await verifyDatabaseConnection();

  const users = await verifySeedUsers();
  const counts = await verifySeedCounts();
  const relation = await verifyApplicationRelations();

  console.log("Database connection and seed verification passed.");

  console.log({
    connection: true,
    users,
    counts,
    relation,
    passwordsStoredAsHashes: true,
  });
}

main()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown database verification error";

    console.error("Database verification failed.");
    console.error(message);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
