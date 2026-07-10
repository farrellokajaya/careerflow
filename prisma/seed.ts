import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { z } from "zod";

import {
  ApplicationPriority,
  ApplicationStatus,
  CompanySize,
  DocumentType,
  EmploymentType,
  InterviewResult,
  InterviewType,
  NotificationType,
  PrismaClient,
  ReminderType,
  Role,
  WorkType,
} from "../src/generated/prisma/client";

const seedEnvSchema = z
  .object({
    DATABASE_URL: z
      .string()
      .min(1, "DATABASE_URL is required")
      .refine(
        (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
        "DATABASE_URL must be a PostgreSQL URL",
      ),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    SEED_ADMIN_EMAIL: z.email(),
    SEED_ADMIN_PASSWORD: z.string().min(12),
    SEED_USER_EMAIL: z.email(),
    SEED_USER_PASSWORD: z.string().min(12),
  })
  .superRefine((value, context) => {
    if (value.SEED_ADMIN_EMAIL === value.SEED_USER_EMAIL) {
      context.addIssue({
        code: "custom",
        path: ["SEED_USER_EMAIL"],
        message: "must be different from SEED_ADMIN_EMAIL",
      });
    }

    if (value.NODE_ENV === "production") {
      const blockedPasswords = new Set([
        "password1234",
        "admin12345678",
        "user123456789",
        "changeme12345",
      ]);

      for (const [key, password] of [
        ["SEED_ADMIN_PASSWORD", value.SEED_ADMIN_PASSWORD],
        ["SEED_USER_PASSWORD", value.SEED_USER_PASSWORD],
      ] as const) {
        if (password.length < 16 || blockedPasswords.has(password.toLowerCase())) {
          context.addIssue({
            code: "custom",
            path: [key],
            message: "must contain at least 16 characters and must not use a default password",
          });
        }
      }
    }
  });

const parsedEnv = seedEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid seed environment variables:\n${details}`);
}

const seedEnv = parsedEnv.data;
const adapter = new PrismaPg({ connectionString: seedEnv.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const toDate = (value: string) => new Date(`${value}T09:00:00+07:00`);

const companies = [
  {
    id: "seed_company_tokopedia",
    name: "Tokopedia",
    website: "https://www.tokopedia.com",
    industry: "E-commerce",
    size: CompanySize.ENTERPRISE,
    location: "Jakarta, Indonesia",
    description: "Demo company profile for an Indonesian e-commerce opportunity.",
    logoUrl: "https://placehold.co/256x256?text=Tokopedia",
    linkedinUrl: "https://www.linkedin.com/company/tokopedia",
  },
  {
    id: "seed_company_gojek",
    name: "Gojek",
    website: "https://www.gojek.com",
    industry: "Technology",
    size: CompanySize.ENTERPRISE,
    location: "Jakarta, Indonesia",
    description: "Demo company profile for a technology opportunity.",
    logoUrl: "https://placehold.co/256x256?text=Gojek",
    linkedinUrl: "https://www.linkedin.com/company/gojek",
  },
  {
    id: "seed_company_traveloka",
    name: "Traveloka",
    website: "https://www.traveloka.com",
    industry: "Travel Technology",
    size: CompanySize.LARGE,
    location: "Tangerang, Indonesia",
    description: "Demo company profile for a travel technology opportunity.",
    logoUrl: "https://placehold.co/256x256?text=Traveloka",
    linkedinUrl: "https://www.linkedin.com/company/traveloka",
  },
  {
    id: "seed_company_telkom",
    name: "Telkom Indonesia",
    website: "https://www.telkom.co.id",
    industry: "Telecommunications",
    size: CompanySize.ENTERPRISE,
    location: "Bandung, Indonesia",
    description: "Demo company profile for a telecommunications opportunity.",
    logoUrl: "https://placehold.co/256x256?text=Telkom",
    linkedinUrl: "https://www.linkedin.com/company/telkom-indonesia",
  },
  {
    id: "seed_company_bca",
    name: "Bank Central Asia",
    website: "https://www.bca.co.id",
    industry: "Financial Services",
    size: CompanySize.ENTERPRISE,
    location: "Jakarta, Indonesia",
    description: "Demo company profile for a financial services opportunity.",
    logoUrl: "https://placehold.co/256x256?text=BCA",
    linkedinUrl: "https://www.linkedin.com/company/bank-central-asia",
  },
  {
    id: "seed_company_ruangguru",
    name: "Ruangguru",
    website: "https://www.ruangguru.com",
    industry: "Education Technology",
    size: CompanySize.LARGE,
    location: "Jakarta, Indonesia",
    description: "Demo company profile for an education technology opportunity.",
    logoUrl: "https://placehold.co/256x256?text=Ruangguru",
    linkedinUrl: "https://www.linkedin.com/company/ruangguru-com",
  },
] as const;

const applications = [
  {
    id: "seed_app_001",
    companyId: "seed_company_tokopedia",
    position: "Junior Backend Engineer",
    employmentType: EmploymentType.FULL_TIME,
    workType: WorkType.HYBRID,
    status: ApplicationStatus.WISHLIST,
    priority: ApplicationPriority.HIGH,
    source: "LinkedIn",
    appliedAt: null,
    deadlineAt: toDate("2026-07-25"),
    salaryMin: "9000000",
    salaryMax: "13000000",
  },
  {
    id: "seed_app_002",
    companyId: "seed_company_gojek",
    position: "Software Engineer - Platform",
    employmentType: EmploymentType.FULL_TIME,
    workType: WorkType.HYBRID,
    status: ApplicationStatus.APPLIED,
    priority: ApplicationPriority.HIGH,
    source: "Company website",
    appliedAt: toDate("2026-07-03"),
    deadlineAt: toDate("2026-07-20"),
    salaryMin: "11000000",
    salaryMax: "16000000",
  },
  {
    id: "seed_app_003",
    companyId: "seed_company_traveloka",
    position: "Associate Frontend Engineer",
    employmentType: EmploymentType.FULL_TIME,
    workType: WorkType.HYBRID,
    status: ApplicationStatus.SCREENING,
    priority: ApplicationPriority.MEDIUM,
    source: "JobStreet",
    appliedAt: toDate("2026-06-28"),
    deadlineAt: toDate("2026-07-18"),
    salaryMin: "8500000",
    salaryMax: "12500000",
  },
  {
    id: "seed_app_004",
    companyId: "seed_company_telkom",
    position: "Junior Web Developer",
    employmentType: EmploymentType.CONTRACT,
    workType: WorkType.ONSITE,
    status: ApplicationStatus.INTERVIEW,
    priority: ApplicationPriority.HIGH,
    source: "Referral",
    appliedAt: toDate("2026-06-20"),
    deadlineAt: null,
    salaryMin: "7500000",
    salaryMax: "10500000",
  },
  {
    id: "seed_app_005",
    companyId: "seed_company_bca",
    position: "IT Developer Program",
    employmentType: EmploymentType.FULL_TIME,
    workType: WorkType.ONSITE,
    status: ApplicationStatus.TECHNICAL_TEST,
    priority: ApplicationPriority.HIGH,
    source: "Career fair",
    appliedAt: toDate("2026-06-15"),
    deadlineAt: null,
    salaryMin: "8000000",
    salaryMax: "12000000",
  },
  {
    id: "seed_app_006",
    companyId: "seed_company_ruangguru",
    position: "Frontend Developer",
    employmentType: EmploymentType.FULL_TIME,
    workType: WorkType.REMOTE,
    status: ApplicationStatus.OFFER,
    priority: ApplicationPriority.HIGH,
    source: "Glints",
    appliedAt: toDate("2026-05-30"),
    deadlineAt: null,
    salaryMin: "8500000",
    salaryMax: "11500000",
  },
  {
    id: "seed_app_007",
    companyId: "seed_company_tokopedia",
    position: "Software Engineer Intern",
    employmentType: EmploymentType.INTERNSHIP,
    workType: WorkType.HYBRID,
    status: ApplicationStatus.ACCEPTED,
    priority: ApplicationPriority.MEDIUM,
    source: "LinkedIn",
    appliedAt: toDate("2026-04-15"),
    deadlineAt: null,
    salaryMin: "4500000",
    salaryMax: "6000000",
  },
  {
    id: "seed_app_008",
    companyId: "seed_company_gojek",
    position: "Data Analyst",
    employmentType: EmploymentType.FULL_TIME,
    workType: WorkType.HYBRID,
    status: ApplicationStatus.REJECTED,
    priority: ApplicationPriority.MEDIUM,
    source: "JobStreet",
    appliedAt: toDate("2026-04-01"),
    deadlineAt: null,
    salaryMin: "8000000",
    salaryMax: "12000000",
  },
  {
    id: "seed_app_009",
    companyId: "seed_company_traveloka",
    position: "QA Engineer",
    employmentType: EmploymentType.FULL_TIME,
    workType: WorkType.HYBRID,
    status: ApplicationStatus.WITHDRAWN,
    priority: ApplicationPriority.LOW,
    source: "Company website",
    appliedAt: toDate("2026-03-15"),
    deadlineAt: null,
    salaryMin: "7500000",
    salaryMax: "10000000",
  },
  {
    id: "seed_app_010",
    companyId: "seed_company_telkom",
    position: "Backend Developer",
    employmentType: EmploymentType.CONTRACT,
    workType: WorkType.REMOTE,
    status: ApplicationStatus.APPLIED,
    priority: ApplicationPriority.MEDIUM,
    source: "LinkedIn",
    appliedAt: toDate("2026-07-07"),
    deadlineAt: toDate("2026-07-30"),
    salaryMin: "8000000",
    salaryMax: "11000000",
  },
  {
    id: "seed_app_011",
    companyId: "seed_company_bca",
    position: "Business Intelligence Analyst",
    employmentType: EmploymentType.FULL_TIME,
    workType: WorkType.ONSITE,
    status: ApplicationStatus.SCREENING,
    priority: ApplicationPriority.MEDIUM,
    source: "Kalibrr",
    appliedAt: toDate("2026-07-01"),
    deadlineAt: toDate("2026-07-22"),
    salaryMin: "8500000",
    salaryMax: "12500000",
  },
  {
    id: "seed_app_012",
    companyId: "seed_company_ruangguru",
    position: "Freelance UI Engineer",
    employmentType: EmploymentType.FREELANCE,
    workType: WorkType.REMOTE,
    status: ApplicationStatus.WISHLIST,
    priority: ApplicationPriority.LOW,
    source: "Community",
    appliedAt: null,
    deadlineAt: toDate("2026-08-05"),
    salaryMin: "6000000",
    salaryMax: "9000000",
  },
  {
    id: "seed_app_013",
    companyId: "seed_company_tokopedia",
    position: "Part-time Content Platform Developer",
    employmentType: EmploymentType.PART_TIME,
    workType: WorkType.REMOTE,
    status: ApplicationStatus.INTERVIEW,
    priority: ApplicationPriority.MEDIUM,
    source: "Referral",
    appliedAt: toDate("2026-06-25"),
    deadlineAt: null,
    salaryMin: "5000000",
    salaryMax: "7500000",
  },
  {
    id: "seed_app_014",
    companyId: "seed_company_gojek",
    position: "Machine Learning Engineer Intern",
    employmentType: EmploymentType.INTERNSHIP,
    workType: WorkType.HYBRID,
    status: ApplicationStatus.TECHNICAL_TEST,
    priority: ApplicationPriority.HIGH,
    source: "Campus hiring",
    appliedAt: toDate("2026-06-18"),
    deadlineAt: null,
    salaryMin: "5000000",
    salaryMax: "7000000",
  },
  {
    id: "seed_app_015",
    companyId: "seed_company_traveloka",
    position: "Product Operations Associate",
    employmentType: EmploymentType.CONTRACT,
    workType: WorkType.ONSITE,
    status: ApplicationStatus.REJECTED,
    priority: ApplicationPriority.LOW,
    source: "Glints",
    appliedAt: toDate("2026-05-10"),
    deadlineAt: null,
    salaryMin: "7000000",
    salaryMax: "9500000",
  },
] as const;

const histories = [
  ...applications.map((application) => ({
    id: `seed_history_${application.id}_initial`,
    applicationId: application.id,
    previousStatus: null,
    newStatus: application.status,
    note: "Initial status created by demo seed.",
    createdAt: application.appliedAt ?? toDate("2026-07-01"),
  })),
  {
    id: "seed_history_app_003_applied",
    applicationId: "seed_app_003",
    previousStatus: ApplicationStatus.WISHLIST,
    newStatus: ApplicationStatus.APPLIED,
    note: "Application submitted through JobStreet.",
    createdAt: toDate("2026-06-28"),
  },
  {
    id: "seed_history_app_003_screening",
    applicationId: "seed_app_003",
    previousStatus: ApplicationStatus.APPLIED,
    newStatus: ApplicationStatus.SCREENING,
    note: "Recruiter started CV screening.",
    createdAt: toDate("2026-07-02"),
  },
  {
    id: "seed_history_app_004_interview",
    applicationId: "seed_app_004",
    previousStatus: ApplicationStatus.SCREENING,
    newStatus: ApplicationStatus.INTERVIEW,
    note: "HR interview scheduled.",
    createdAt: toDate("2026-07-05"),
  },
  {
    id: "seed_history_app_006_offer",
    applicationId: "seed_app_006",
    previousStatus: ApplicationStatus.INTERVIEW,
    newStatus: ApplicationStatus.OFFER,
    note: "Offer received by email.",
    createdAt: toDate("2026-07-08"),
  },
];

const interviews = [
  {
    id: "seed_interview_001",
    applicationId: "seed_app_004",
    title: "HR Interview",
    interviewType: InterviewType.HR,
    scheduledAt: new Date("2026-07-14T10:00:00+07:00"),
    durationMinutes: 45,
    location: "Telkom Indonesia Office",
    meetingUrl: null,
    interviewerName: "Nadia",
    interviewerEmail: "nadia@example.com",
    notes: "Prepare introduction and internship experience.",
    result: InterviewResult.PENDING,
  },
  {
    id: "seed_interview_002",
    applicationId: "seed_app_005",
    title: "Technical Assessment Review",
    interviewType: InterviewType.TECHNICAL,
    scheduledAt: new Date("2026-07-16T13:00:00+07:00"),
    durationMinutes: 60,
    location: null,
    meetingUrl: "https://meet.example.com/technical-review",
    interviewerName: "Rizky",
    interviewerEmail: "rizky@example.com",
    notes: "Review SQL and programming assessment.",
    result: InterviewResult.PENDING,
  },
  {
    id: "seed_interview_003",
    applicationId: "seed_app_006",
    title: "Final Interview",
    interviewType: InterviewType.FINAL,
    scheduledAt: new Date("2026-07-06T15:00:00+07:00"),
    durationMinutes: 60,
    location: null,
    meetingUrl: "https://meet.example.com/final-interview",
    interviewerName: "Sinta",
    interviewerEmail: "sinta@example.com",
    notes: "Discussed role expectations and compensation.",
    result: InterviewResult.PASSED,
  },
  {
    id: "seed_interview_004",
    applicationId: "seed_app_013",
    title: "User Interview",
    interviewType: InterviewType.USER,
    scheduledAt: new Date("2026-07-18T11:00:00+07:00"),
    durationMinutes: 45,
    location: null,
    meetingUrl: "https://meet.example.com/user-interview",
    interviewerName: "Andi",
    interviewerEmail: "andi@example.com",
    notes: "Prepare frontend portfolio walkthrough.",
    result: InterviewResult.PENDING,
  },
] as const;

const notes = [
  ["seed_note_001", "seed_app_002", "Platform role", "Review distributed systems basics.", true],
  ["seed_note_002", "seed_app_003", "Portfolio", "Highlight Next.js and dashboard projects.", true],
  ["seed_note_003", "seed_app_004", "Interview preparation", "Prepare STAR examples.", true],
  ["seed_note_004", "seed_app_005", "Technical test", "Practice SQL joins and API design.", false],
  ["seed_note_005", "seed_app_006", "Offer questions", "Ask about benefits and start date.", false],
  ["seed_note_006", "seed_app_010", "Follow-up", "Follow up after five business days.", false],
  [
    "seed_note_007",
    "seed_app_013",
    "Frontend topics",
    "Review accessibility and performance.",
    false,
  ],
  ["seed_note_008", "seed_app_014", "ML preparation", "Review model evaluation metrics.", false],
] as const;

const documents = [
  {
    id: "seed_document_001",
    applicationId: null,
    name: "General CV.pdf",
    type: DocumentType.CV,
    fileUrl: "https://example.com/demo-documents/general-cv.pdf",
    fileSize: 245760,
    mimeType: "application/pdf",
  },
  {
    id: "seed_document_002",
    applicationId: null,
    name: "Portfolio.pdf",
    type: DocumentType.PORTFOLIO,
    fileUrl: "https://example.com/demo-documents/portfolio.pdf",
    fileSize: 1048576,
    mimeType: "application/pdf",
  },
  {
    id: "seed_document_003",
    applicationId: "seed_app_004",
    name: "Telkom Cover Letter.pdf",
    type: DocumentType.COVER_LETTER,
    fileUrl: "https://example.com/demo-documents/telkom-cover-letter.pdf",
    fileSize: 180224,
    mimeType: "application/pdf",
  },
  {
    id: "seed_document_004",
    applicationId: "seed_app_005",
    name: "Academic Transcript.pdf",
    type: DocumentType.TRANSCRIPT,
    fileUrl: "https://example.com/demo-documents/transcript.pdf",
    fileSize: 512000,
    mimeType: "application/pdf",
  },
] as const;

const reminders = [
  {
    id: "seed_reminder_001",
    applicationId: "seed_app_001",
    interviewId: null,
    type: ReminderType.APPLICATION_DEADLINE,
    title: "Apply to Tokopedia",
    description: "Review CV before the application deadline.",
    remindAt: new Date("2026-07-23T09:00:00+07:00"),
  },
  {
    id: "seed_reminder_002",
    applicationId: "seed_app_004",
    interviewId: "seed_interview_001",
    type: ReminderType.INTERVIEW,
    title: "Telkom HR interview",
    description: "Join or arrive 15 minutes early.",
    remindAt: new Date("2026-07-14T08:00:00+07:00"),
  },
  {
    id: "seed_reminder_003",
    applicationId: "seed_app_005",
    interviewId: "seed_interview_002",
    type: ReminderType.INTERVIEW,
    title: "BCA technical review",
    description: "Prepare test solution explanation.",
    remindAt: new Date("2026-07-16T10:00:00+07:00"),
  },
  {
    id: "seed_reminder_004",
    applicationId: "seed_app_010",
    interviewId: null,
    type: ReminderType.FOLLOW_UP,
    title: "Follow up Telkom application",
    description: "Send a polite recruiter follow-up.",
    remindAt: new Date("2026-07-17T09:00:00+07:00"),
  },
  {
    id: "seed_reminder_005",
    applicationId: "seed_app_012",
    interviewId: null,
    type: ReminderType.APPLICATION_DEADLINE,
    title: "Review Ruangguru freelance role",
    description: "Confirm availability and portfolio fit.",
    remindAt: new Date("2026-08-01T09:00:00+07:00"),
  },
  {
    id: "seed_reminder_006",
    applicationId: null,
    interviewId: null,
    type: ReminderType.CUSTOM,
    title: "Update general CV",
    description: "Add the latest CareerFlow project.",
    remindAt: new Date("2026-07-20T19:00:00+07:00"),
  },
] as const;

const tags = [
  { id: "seed_tag_priority", name: "Priority", color: "#EF4444" },
  { id: "seed_tag_remote", name: "Remote", color: "#3B82F6" },
  { id: "seed_tag_referral", name: "Referral", color: "#8B5CF6" },
  { id: "seed_tag_portfolio", name: "Portfolio", color: "#10B981" },
] as const;

const applicationTags = [
  ["seed_app_001", "seed_tag_priority"],
  ["seed_app_002", "seed_tag_priority"],
  ["seed_app_004", "seed_tag_referral"],
  ["seed_app_006", "seed_tag_remote"],
  ["seed_app_010", "seed_tag_remote"],
  ["seed_app_012", "seed_tag_remote"],
  ["seed_app_013", "seed_tag_portfolio"],
] as const;

const notifications = [
  [
    "seed_notification_001",
    "Application deadline",
    "Tokopedia application deadline is approaching.",
    NotificationType.APPLICATION,
    false,
    "/applications/seed_app_001",
  ],
  [
    "seed_notification_002",
    "Interview scheduled",
    "Telkom HR interview has been scheduled.",
    NotificationType.INTERVIEW,
    false,
    "/applications/seed_app_004",
  ],
  [
    "seed_notification_003",
    "Technical review",
    "BCA technical assessment review is coming up.",
    NotificationType.INTERVIEW,
    false,
    "/applications/seed_app_005",
  ],
  [
    "seed_notification_004",
    "Offer received",
    "An offer was recorded for the Ruangguru application.",
    NotificationType.APPLICATION,
    true,
    "/applications/seed_app_006",
  ],
  [
    "seed_notification_005",
    "Follow-up reminder",
    "Follow up the Telkom backend application.",
    NotificationType.REMINDER,
    false,
    "/applications/seed_app_010",
  ],
  [
    "seed_notification_006",
    "CV reminder",
    "Remember to update your general CV.",
    NotificationType.REMINDER,
    false,
    "/documents",
  ],
  [
    "seed_notification_007",
    "Welcome to CareerFlow",
    "Your demo workspace is ready.",
    NotificationType.SYSTEM,
    true,
    "/",
  ],
  [
    "seed_notification_008",
    "Application updated",
    "Traveloka application moved to screening.",
    NotificationType.APPLICATION,
    true,
    "/applications/seed_app_003",
  ],
] as const;

const activityLogs = [
  ["seed_activity_001", "CREATE", "JobApplication", "seed_app_001", { status: "WISHLIST" }],
  ["seed_activity_002", "CREATE", "JobApplication", "seed_app_002", { status: "APPLIED" }],
  [
    "seed_activity_003",
    "UPDATE_STATUS",
    "JobApplication",
    "seed_app_003",
    { from: "APPLIED", to: "SCREENING" },
  ],
  [
    "seed_activity_004",
    "CREATE",
    "Interview",
    "seed_interview_001",
    { applicationId: "seed_app_004" },
  ],
  ["seed_activity_005", "CREATE", "Document", "seed_document_001", { type: "CV" }],
  ["seed_activity_006", "CREATE", "Reminder", "seed_reminder_006", { type: "CUSTOM" }],
  [
    "seed_activity_007",
    "UPDATE_STATUS",
    "JobApplication",
    "seed_app_006",
    { from: "INTERVIEW", to: "OFFER" },
  ],
  ["seed_activity_008", "CREATE", "Tag", "seed_tag_remote", { name: "Remote" }],
] as const;

async function main() {
  const [adminPassword, userPassword] = await Promise.all([
    hash(seedEnv.SEED_ADMIN_PASSWORD, 12),
    hash(seedEnv.SEED_USER_PASSWORD, 12),
  ]);

  await prisma.$transaction(
    async (tx) => {
      const admin = await tx.user.upsert({
        where: { email: seedEnv.SEED_ADMIN_EMAIL },
        update: {
          name: "CareerFlow Admin",
          password: adminPassword,
          role: Role.ADMIN,
          isActive: true,
          timezone: "Asia/Jakarta",
        },
        create: {
          id: "seed_user_admin",
          name: "CareerFlow Admin",
          email: seedEnv.SEED_ADMIN_EMAIL,
          password: adminPassword,
          role: Role.ADMIN,
          timezone: "Asia/Jakarta",
        },
      });

      const user = await tx.user.upsert({
        where: { email: seedEnv.SEED_USER_EMAIL },
        update: {
          name: "CareerFlow Demo User",
          password: userPassword,
          role: Role.USER,
          isActive: true,
          timezone: "Asia/Jakarta",
        },
        create: {
          id: "seed_user_demo",
          name: "CareerFlow Demo User",
          email: seedEnv.SEED_USER_EMAIL,
          password: userPassword,
          role: Role.USER,
          timezone: "Asia/Jakarta",
        },
      });

      for (const company of companies) {
        await tx.company.upsert({
          where: { id: company.id },
          update: { ...company, userId: user.id, deletedAt: null },
          create: { ...company, userId: user.id },
        });
      }

      for (const application of applications) {
        const data = {
          ...application,
          userId: user.id,
          jobUrl: `https://example.com/jobs/${application.id}`,
          location: companies.find((company) => company.id === application.companyId)?.location,
          salaryCurrency: "IDR",
          description: `Demo description for ${application.position}.`,
          requirements: "Relevant technical skills, communication, and willingness to learn.",
          contactName: null,
          contactEmail: null,
          contactPhone: null,
          archivedAt:
            application.status === ApplicationStatus.REJECTED ||
            application.status === ApplicationStatus.WITHDRAWN
              ? toDate("2026-07-01")
              : null,
        };

        await tx.jobApplication.upsert({
          where: { id: application.id },
          update: data,
          create: data,
        });
      }

      for (const history of histories) {
        await tx.applicationStatusHistory.upsert({
          where: { id: history.id },
          update: { ...history, changedById: user.id },
          create: { ...history, changedById: user.id },
        });
      }

      for (const interview of interviews) {
        await tx.interview.upsert({
          where: { id: interview.id },
          update: interview,
          create: interview,
        });
      }

      for (const [id, applicationId, title, content, isPinned] of notes) {
        await tx.note.upsert({
          where: { id },
          update: { userId: user.id, applicationId, title, content, isPinned },
          create: { id, userId: user.id, applicationId, title, content, isPinned },
        });
      }

      for (const document of documents) {
        await tx.document.upsert({
          where: { id: document.id },
          update: { ...document, userId: user.id },
          create: { ...document, userId: user.id },
        });
      }

      for (const reminder of reminders) {
        await tx.reminder.upsert({
          where: { id: reminder.id },
          update: {
            ...reminder,
            userId: user.id,
            isCompleted: false,
            sentAt: null,
          },
          create: {
            ...reminder,
            userId: user.id,
            isCompleted: false,
            sentAt: null,
          },
        });
      }

      for (const tag of tags) {
        await tx.tag.upsert({
          where: { id: tag.id },
          update: { ...tag, userId: user.id },
          create: { ...tag, userId: user.id },
        });
      }

      for (const [applicationId, tagId] of applicationTags) {
        await tx.applicationTag.upsert({
          where: {
            applicationId_tagId: {
              applicationId,
              tagId,
            },
          },
          update: {},
          create: {
            applicationId,
            tagId,
          },
        });
      }

      for (const [id, title, message, type, isRead, link] of notifications) {
        await tx.notification.upsert({
          where: { id },
          update: {
            userId: user.id,
            title,
            message,
            type,
            isRead,
            link,
          },
          create: {
            id,
            userId: user.id,
            title,
            message,
            type,
            isRead,
            link,
          },
        });
      }

      for (const [id, action, entityType, entityId, metadata] of activityLogs) {
        await tx.activityLog.upsert({
          where: { id },
          update: {
            userId: user.id,
            action,
            entityType,
            entityId,
            metadata,
            ipAddress: "127.0.0.1",
            userAgent: "CareerFlow seed script",
          },
          create: {
            id,
            userId: user.id,
            action,
            entityType,
            entityId,
            metadata,
            ipAddress: "127.0.0.1",
            userAgent: "CareerFlow seed script",
          },
        });
      }

      await tx.activityLog.upsert({
        where: { id: "seed_activity_admin" },
        update: {
          userId: admin.id,
          action: "SEED_DATABASE",
          entityType: "System",
          metadata: {
            environment: seedEnv.NODE_ENV,
          },
        },
        create: {
          id: "seed_activity_admin",
          userId: admin.id,
          action: "SEED_DATABASE",
          entityType: "System",
          metadata: {
            environment: seedEnv.NODE_ENV,
          },
        },
      });
    },
    {
      maxWait: 10_000,
      timeout: 30_000,
    },
  );

  const [
    userCount,
    companyCount,
    applicationCount,
    historyCount,
    interviewCount,
    noteCount,
    reminderCount,
    notificationCount,
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
    prisma.reminder.count({
      where: {
        id: {
          startsWith: "seed_reminder_",
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

  console.log("CareerFlow seed completed successfully.");
  console.log({
    userCount,
    companyCount,
    applicationCount,
    historyCount,
    interviewCount,
    noteCount,
    reminderCount,
    notificationCount,
  });
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Unknown seed error");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
