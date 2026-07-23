import type {
  ApplicationPriority,
  ApplicationStatus,
  EmploymentType,
  WorkType,
} from "@/generated/prisma/enums";
import {
  Archive,
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CalendarDays,
  CircleDotDashed,
  ExternalLink,
  FileText,
  History,
  Link2,
  ListChecks,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Radio,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  archiveJobApplicationAction,
  restoreJobApplicationAction,
} from "@/actions/job-application-actions";
import { ApplicationArchiveAction } from "@/components/applications/application-archive-action";
import { ApplicationStatusHistory } from "@/components/applications/application-status-history";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobApplicationById, type JobApplicationDetail } from "@/lib/data/job-applications";

type JobApplicationDetailPageProps = {
  params: Promise<{
    applicationId: string;
  }>;
};

type DetailItemProps = {
  icon: ReactNode;
  label: string;
  children: ReactNode;
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

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
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

function formatSalary(application: JobApplicationDetail): string {
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

  return "Belum tersedia";
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

function DetailItem({ icon, label, children }: DetailItemProps) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-lg border p-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </div>

      <div className="min-w-0">
        <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </dt>

        <dd className="mt-1 min-w-0 text-sm [overflow-wrap:anywhere] break-words">{children}</dd>
      </div>
    </div>
  );
}

export default async function JobApplicationDetailPage({ params }: JobApplicationDetailPageProps) {
  const { applicationId } = await params;

  const application = await getJobApplicationById(applicationId);

  if (!application) {
    notFound();
  }

  const isArchived = application.archivedAt !== null;

  const backHref = isArchived ? "/applications/archived" : "/applications";

  const archiveAction = archiveJobApplicationAction.bind(null, application.id);

  const restoreAction = restoreJobApplicationAction.bind(null, application.id);

  const hasContactInformation = Boolean(
    application.contactName || application.contactEmail || application.contactPhone,
  );

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <Button asChild variant="ghost" className="-ml-2">
          <Link href={backHref}>
            <ArrowLeft aria-hidden="true" />
            {isArchived ? "Kembali ke arsip" : "Kembali ke Applications"}
          </Link>
        </Button>

        <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={applicationStatusClasses[application.status]}>
                {applicationStatusLabels[application.status]}
              </Badge>

              <Badge variant={getPriorityVariant(application.priority)}>
                {applicationPriorityLabels[application.priority]}
              </Badge>

              {isArchived ? <Badge variant="secondary">Diarsipkan</Badge> : null}

              {application.company.deletedAt ? (
                <Badge variant="outline">Company arsip</Badge>
              ) : null}
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight [overflow-wrap:anywhere] break-words sm:text-3xl">
                {application.position}
              </h1>

              <div className="mt-2 flex min-w-0 items-start gap-2 text-muted-foreground">
                <Building2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />

                <p className="min-w-0 text-sm [overflow-wrap:anywhere] break-words sm:text-base">
                  {application.company.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
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
        </section>

        {isArchived ? (
          <div
            role="status"
            className="flex items-start gap-3 rounded-lg border border-amber-600/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300"
          >
            <Archive className="mt-0.5 size-4 shrink-0" aria-hidden="true" />

            <p className="[overflow-wrap:anywhere] break-words">
              Job Application ini sedang diarsipkan. Informasi dan riwayatnya tetap dapat dilihat,
              tetapi edit dan perubahan status dinonaktifkan sampai lamaran dipulihkan.
            </p>
          </div>
        ) : null}

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="min-w-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <BriefcaseBusiness
                      className="size-5 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <CardTitle>Ringkasan lamaran</CardTitle>

                    <CardDescription className="mt-1">
                      Informasi utama mengenai posisi dan proses lamaran.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <dl className="grid min-w-0 gap-3 sm:grid-cols-2">
                  <DetailItem
                    label="Status"
                    icon={<CircleDotDashed className="size-4" aria-hidden="true" />}
                  >
                    {applicationStatusLabels[application.status]}
                  </DetailItem>

                  <DetailItem
                    label="Prioritas"
                    icon={<ListChecks className="size-4" aria-hidden="true" />}
                  >
                    {applicationPriorityLabels[application.priority]}
                  </DetailItem>

                  <DetailItem
                    label="Jenis pekerjaan"
                    icon={<BriefcaseBusiness className="size-4" aria-hidden="true" />}
                  >
                    {employmentTypeLabels[application.employmentType]}
                  </DetailItem>

                  <DetailItem
                    label="Sistem kerja"
                    icon={<Building2 className="size-4" aria-hidden="true" />}
                  >
                    {workTypeLabels[application.workType]}
                  </DetailItem>

                  <DetailItem
                    label="Lokasi"
                    icon={<MapPin className="size-4" aria-hidden="true" />}
                  >
                    {application.location ?? "Belum tersedia"}
                  </DetailItem>

                  <DetailItem
                    label="Rentang gaji"
                    icon={<Banknote className="size-4" aria-hidden="true" />}
                  >
                    {formatSalary(application)}
                  </DetailItem>

                  <DetailItem
                    label="Tanggal melamar"
                    icon={<CalendarDays className="size-4" aria-hidden="true" />}
                  >
                    {application.appliedAt
                      ? dateFormatter.format(application.appliedAt)
                      : "Belum melamar"}
                  </DetailItem>

                  <DetailItem
                    label="Deadline"
                    icon={<CalendarClock className="size-4" aria-hidden="true" />}
                  >
                    {application.deadlineAt
                      ? dateFormatter.format(application.deadlineAt)
                      : "Tidak ada deadline"}
                  </DetailItem>

                  <DetailItem
                    label="Sumber lowongan"
                    icon={<Radio className="size-4" aria-hidden="true" />}
                  >
                    {application.source ?? "Belum tersedia"}
                  </DetailItem>

                  <DetailItem
                    label="Tautan lowongan"
                    icon={<Link2 className="size-4" aria-hidden="true" />}
                  >
                    {application.jobUrl ? (
                      <a
                        href={application.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-w-0 items-center gap-1.5 text-primary underline underline-offset-4 hover:text-primary/80"
                      >
                        <span className="min-w-0 [overflow-wrap:anywhere] break-words">
                          Buka halaman lowongan
                        </span>

                        <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />

                        <span className="sr-only">
                          {` untuk posisi ${application.position} di tab baru`}
                        </span>
                      </a>
                    ) : (
                      "Belum tersedia"
                    )}
                  </DetailItem>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <FileText className="size-5 text-muted-foreground" aria-hidden="true" />
                  </div>

                  <div>
                    <CardTitle>Deskripsi pekerjaan</CardTitle>

                    <CardDescription className="mt-1">
                      Ringkasan pekerjaan yang disimpan pada Job Application.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm leading-7 [overflow-wrap:anywhere] break-words whitespace-pre-wrap">
                  {application.description ?? "Deskripsi pekerjaan belum tersedia."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <ListChecks className="size-5 text-muted-foreground" aria-hidden="true" />
                  </div>

                  <div>
                    <CardTitle>Persyaratan</CardTitle>

                    <CardDescription className="mt-1">
                      Persyaratan dan kualifikasi untuk posisi ini.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm leading-7 [overflow-wrap:anywhere] break-words whitespace-pre-wrap">
                  {application.requirements ?? "Persyaratan pekerjaan belum tersedia."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <History className="size-5 text-muted-foreground" aria-hidden="true" />
                  </div>

                  <div>
                    <CardTitle>Status History</CardTitle>

                    <CardDescription className="mt-1">
                      Perubahan status ditampilkan mulai dari yang terbaru.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ApplicationStatusHistory history={application.statusHistory} />
              </CardContent>
            </Card>
          </div>

          <aside className="min-w-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Building2 className="size-5 text-muted-foreground" aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <CardTitle>Company</CardTitle>

                    <CardDescription className="mt-1">
                      Company yang terkait dengan lamaran ini.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="font-medium [overflow-wrap:anywhere] break-words">
                  {application.company.name}
                </p>

                {application.company.deletedAt ? (
                  <Badge variant="outline">Company diarsipkan</Badge>
                ) : (
                  <Badge variant="secondary">Company aktif</Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <UserRound className="size-5 text-muted-foreground" aria-hidden="true" />
                  </div>

                  <div>
                    <CardTitle>Informasi kontak</CardTitle>

                    <CardDescription className="mt-1">
                      Kontak recruiter atau pihak company.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {hasContactInformation ? (
                  <dl className="space-y-4">
                    {application.contactName ? (
                      <div className="flex min-w-0 items-start gap-3">
                        <UserRound
                          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />

                        <div className="min-w-0">
                          <dt className="text-xs text-muted-foreground">Nama</dt>

                          <dd className="mt-1 text-sm [overflow-wrap:anywhere] break-words">
                            {application.contactName}
                          </dd>
                        </div>
                      </div>
                    ) : null}

                    {application.contactEmail ? (
                      <div className="flex min-w-0 items-start gap-3">
                        <Mail
                          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />

                        <div className="min-w-0">
                          <dt className="text-xs text-muted-foreground">Email</dt>

                          <dd className="mt-1 min-w-0 text-sm">
                            <a
                              href={`mailto:${application.contactEmail}`}
                              className="[overflow-wrap:anywhere] break-words text-primary underline underline-offset-4 hover:text-primary/80"
                            >
                              {application.contactEmail}
                            </a>
                          </dd>
                        </div>
                      </div>
                    ) : null}

                    {application.contactPhone ? (
                      <div className="flex min-w-0 items-start gap-3">
                        <Phone
                          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />

                        <div className="min-w-0">
                          <dt className="text-xs text-muted-foreground">Telepon</dt>

                          <dd className="mt-1 min-w-0 text-sm">
                            <a
                              href={`tel:${application.contactPhone}`}
                              className="[overflow-wrap:anywhere] break-words text-primary underline underline-offset-4 hover:text-primary/80"
                            >
                              {application.contactPhone}
                            </a>
                          </dd>
                        </div>
                      </div>
                    ) : null}
                  </dl>
                ) : (
                  <p className="text-sm leading-6 text-muted-foreground">
                    Informasi kontak belum tersedia.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi record</CardTitle>

                <CardDescription>Waktu pencatatan Job Application.</CardDescription>
              </CardHeader>

              <CardContent>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Dibuat</dt>

                    <dd className="mt-1">
                      <time dateTime={application.createdAt.toISOString()}>
                        {dateTimeFormatter.format(application.createdAt)}
                      </time>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-muted-foreground">Terakhir diperbarui</dt>

                    <dd className="mt-1">
                      <time dateTime={application.updatedAt.toISOString()}>
                        {dateTimeFormatter.format(application.updatedAt)}
                      </time>
                    </dd>
                  </div>

                  {application.archivedAt ? (
                    <div>
                      <dt className="text-xs text-muted-foreground">Diarsipkan</dt>

                      <dd className="mt-1">
                        <time dateTime={application.archivedAt.toISOString()}>
                          {dateTimeFormatter.format(application.archivedAt)}
                        </time>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
