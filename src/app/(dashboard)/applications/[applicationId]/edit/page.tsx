import { Archive, ArrowLeft, BriefcaseBusiness, Building2, Pencil, RefreshCw } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  updateJobApplicationAction,
  updateJobApplicationStatusAction,
} from "@/actions/job-application-actions";
import { JobApplicationForm } from "@/components/applications/application-form";
import { ApplicationStatusForm } from "@/components/applications/application-status-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getActiveJobApplicationForEdit,
  getApplicationCompanyOptionsForEdit,
} from "@/lib/data/job-applications";

type EditJobApplicationPageProps = {
  params: Promise<{
    applicationId: string;
  }>;
};

function formatDateInput(value: Date | null): string | null {
  return value?.toISOString().slice(0, 10) ?? null;
}

export default async function EditJobApplicationPage({ params }: EditJobApplicationPageProps) {
  const { applicationId } = await params;

  const [application, availableCompanies] = await Promise.all([
    getActiveJobApplicationForEdit(applicationId),
    getApplicationCompanyOptionsForEdit(applicationId),
  ]);

  if (!application || !availableCompanies) {
    notFound();
  }

  const updateAction = updateJobApplicationAction.bind(null, application.id);

  const updateStatusAction = updateJobApplicationStatusAction.bind(null, application.id);

  const companyOptions = availableCompanies.map((company) => ({
    id: company.id,
    name: company.name,
    isArchived: Boolean(company.deletedAt),
  }));

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <Button asChild variant="ghost" className="-ml-2">
          <Link href="/applications">
            <ArrowLeft aria-hidden="true" />
            Kembali ke Applications
          </Link>
        </Button>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Pencil className="size-5" aria-hidden="true" />
            </div>

            <Badge variant="secondary">Job Application Management</Badge>
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Edit Job Application
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Perbarui informasi dan status Job Application aktif milik akun Anda.
            </p>
          </div>
        </section>

        {application.company.deletedAt ? (
          <div
            role="status"
            className="flex items-start gap-3 rounded-lg border border-amber-600/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300"
          >
            <Archive className="mt-0.5 size-4 shrink-0" aria-hidden="true" />

            <p>
              Company saat ini sudah diarsipkan. Relasi tetap dipertahankan dan perubahan status Job
              Application masih diperbolehkan. Jika company diganti, company tujuan harus aktif dan
              menjadi milik akun Anda.
            </p>
          </div>
        ) : null}

        <Card>
          <CardHeader>
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                <RefreshCw className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>

              <div>
                <CardTitle>Perbarui status lamaran</CardTitle>

                <CardDescription className="mt-1">
                  Setiap perubahan status akan dicatat pada riwayat Job Application.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ApplicationStatusForm action={updateStatusAction} currentStatus={application.status} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                <BriefcaseBusiness className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <CardTitle className="break-words">{application.position}</CardTitle>

                <CardDescription className="mt-1 flex min-w-0 items-center gap-1.5">
                  <Building2 className="size-4 shrink-0" aria-hidden="true" />

                  <span className="truncate">{application.company.name}</span>

                  {application.company.deletedAt ? (
                    <Badge variant="outline" className="shrink-0">
                      Company arsip
                    </Badge>
                  ) : null}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <JobApplicationForm
              action={updateAction}
              mode="edit"
              companyOptions={companyOptions}
              initialValues={{
                companyId: application.companyId,
                position: application.position,
                jobUrl: application.jobUrl,
                employmentType: application.employmentType,
                workType: application.workType,
                location: application.location,
                salaryMin: application.salaryMin,
                salaryMax: application.salaryMax,
                salaryCurrency: application.salaryCurrency,
                status: application.status,
                priority: application.priority,
                source: application.source,
                appliedAt: formatDateInput(application.appliedAt),
                deadlineAt: formatDateInput(application.deadlineAt),
                description: application.description,
                requirements: application.requirements,
                contactName: application.contactName,
                contactEmail: application.contactEmail,
                contactPhone: application.contactPhone,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
