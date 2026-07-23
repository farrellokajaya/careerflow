import type {
  ApplicationPriority,
  ApplicationStatus,
  EmploymentType,
  WorkType,
} from "@/generated/prisma/enums";
import {
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CalendarDays,
  ExternalLink,
  MapPin,
  Pencil,
  Radio,
} from "lucide-react";
import Link from "next/link";

import {
  archiveJobApplicationAction,
  restoreJobApplicationAction,
} from "@/actions/job-application-actions";
import { ApplicationArchiveAction } from "@/components/applications/application-archive-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobApplicationListItem } from "@/lib/data/job-applications";

type ApplicationCardProps = {
  application: JobApplicationListItem;
};

const applicationStatusLabels = {
  WISHLIST: "Wishlist",
  APPLIED: "Melamar",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  TECHNICAL_TEST: "Tes teknis",
  OFFER: "Penawaran",
  ACCEPTED: "Diterima",
  REJECTED: "Ditolak",
  WITHDRAWN: "Dibatalkan",
} satisfies Record<ApplicationStatus, string>;

const applicationStatusClasses = {
  WISHLIST: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  APPLIED: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  SCREENING: "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  INTERVIEW: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  TECHNICAL_TEST: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  OFFER: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  ACCEPTED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REJECTED: "border-destructive/30 bg-destructive/10 text-destructive",
  WITHDRAWN: "border-zinc-500/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
} satisfies Record<ApplicationStatus, string>;

const applicationPriorityLabels = {
  LOW: "Prioritas rendah",
  MEDIUM: "Prioritas sedang",
  HIGH: "Prioritas tinggi",
} satisfies Record<ApplicationPriority, string>;

const employmentTypeLabels = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Kontrak",
  INTERNSHIP: "Magang",
  FREELANCE: "Freelance",
} satisfies Record<EmploymentType, string>;

const workTypeLabels = {
  ONSITE: "On-site",
  HYBRID: "Hybrid",
  REMOTE: "Remote",
} satisfies Record<WorkType, string>;

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeZone: "Asia/Jakarta",
});

function formatCurrency(value: string, currency: string): string {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return `${currency} ${value}`;
  }

  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency,
      currencyDisplay: "code",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericValue);
  } catch {
    return `${currency} ${value}`;
  }
}

function formatSalary(application: JobApplicationListItem): string {
  const { salaryMin, salaryMax, salaryCurrency } = application;

  if (salaryMin && salaryMax) {
    return `${formatCurrency(salaryMin, salaryCurrency)} sampai ${formatCurrency(
      salaryMax,
      salaryCurrency,
    )}`;
  }

  if (salaryMin) {
    return `Mulai dari ${formatCurrency(salaryMin, salaryCurrency)}`;
  }

  if (salaryMax) {
    return `Hingga ${formatCurrency(salaryMax, salaryCurrency)}`;
  }

  return "Gaji belum tersedia";
}

function getPriorityVariant(priority: ApplicationPriority) {
  if (priority === "HIGH") {
    return "destructive" as const;
  }

  if (priority === "MEDIUM") {
    return "secondary" as const;
  }

  return "outline" as const;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const isArchived = application.archivedAt !== null;

  const archiveAction = archiveJobApplicationAction.bind(null, application.id);

  const restoreAction = restoreJobApplicationAction.bind(null, application.id);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BriefcaseBusiness className="size-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg [overflow-wrap:anywhere] break-words">
              {application.position}
            </CardTitle>

            <CardDescription className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5">
              <Building2 className="size-4 shrink-0" aria-hidden="true" />

              <span className="min-w-0 [overflow-wrap:anywhere] break-words">
                {application.company.name}
              </span>

              {application.company.deletedAt ? (
                <Badge variant="outline" className="shrink-0">
                  Company arsip
                </Badge>
              ) : null}
            </CardDescription>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline" className={applicationStatusClasses[application.status]}>
            {applicationStatusLabels[application.status]}
          </Badge>

          <Badge variant={getPriorityVariant(application.priority)}>
            {applicationPriorityLabels[application.priority]}
          </Badge>

          {isArchived ? <Badge variant="secondary">Diarsipkan</Badge> : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <dl className="space-y-3 text-sm">
          <div className="flex min-w-0 items-start gap-3">
            <BriefcaseBusiness
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <dt className="sr-only">Jenis pekerjaan dan sistem kerja</dt>

              <dd className="[overflow-wrap:anywhere] break-words">
                {employmentTypeLabels[application.employmentType]} /{" "}
                {workTypeLabels[application.workType]}
              </dd>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />

            <div className="min-w-0">
              <dt className="sr-only">Lokasi</dt>

              <dd className="[overflow-wrap:anywhere] break-words">
                {application.location ?? "Lokasi belum tersedia"}
              </dd>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-3">
            <Banknote className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />

            <div className="min-w-0">
              <dt className="sr-only">Rentang gaji</dt>

              <dd className="[overflow-wrap:anywhere] break-words">{formatSalary(application)}</dd>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-3">
            <CalendarDays
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <dt className="sr-only">Tanggal melamar</dt>

              <dd>
                {application.appliedAt
                  ? `Melamar ${dateFormatter.format(application.appliedAt)}`
                  : "Belum melamar"}
              </dd>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-3">
            <CalendarClock
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <dt className="sr-only">Deadline lamaran</dt>

              <dd>
                {application.deadlineAt
                  ? `Deadline ${dateFormatter.format(application.deadlineAt)}`
                  : "Tidak ada deadline"}
              </dd>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-3">
            <Radio className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />

            <div className="min-w-0">
              <dt className="sr-only">Sumber lowongan</dt>

              <dd className="[overflow-wrap:anywhere] break-words">
                {application.source ?? "Sumber belum tersedia"}
              </dd>
            </div>
          </div>
        </dl>

        <div className="mt-auto space-y-3 border-t pt-4">
          <p className="text-xs text-muted-foreground">
            {application.archivedAt
              ? `Diarsipkan ${dateFormatter.format(application.archivedAt)}`
              : `Diperbarui ${dateFormatter.format(application.updatedAt)}`}
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {isArchived ? (
              <ApplicationArchiveAction
                action={restoreAction}
                mode="restore"
                position={application.position}
                companyName={application.company.name}
              />
            ) : (
              <>
                <Button asChild size="sm" className="w-full sm:w-fit">
                  <Link href={`/applications/${application.id}/edit`}>
                    <Pencil aria-hidden="true" />
                    Edit lamaran
                  </Link>
                </Button>

                <ApplicationArchiveAction
                  action={archiveAction}
                  mode="archive"
                  position={application.position}
                  companyName={application.company.name}
                />
              </>
            )}

            {application.jobUrl ? (
              <Button asChild size="sm" variant="outline" className="w-full sm:w-fit">
                <a href={application.jobUrl} target="_blank" rel="noreferrer">
                  <ExternalLink aria-hidden="true" />
                  Buka lowongan
                  <span className="sr-only">
                    {` untuk posisi ${application.position} di tab baru`}
                  </span>
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
