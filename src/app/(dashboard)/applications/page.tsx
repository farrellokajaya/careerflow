import { BriefcaseBusiness, CircleCheckBig, Plus } from "lucide-react";
import Link from "next/link";

import { ApplicationFilters } from "@/components/applications/application-filters";
import { ApplicationList } from "@/components/applications/application-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getActiveJobApplications,
  getJobApplicationCompanyFilterOptions,
} from "@/lib/data/job-applications";

type ApplicationsPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    status?: string | string[];
    company?: string | string[];
    sort?: string | string[];
    success?: string | string[];
  }>;
};

function getFirstSearchParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getSuccessMessage(successCode: string | undefined): string | null {
  if (successCode === "created") {
    return "Job Application berhasil ditambahkan.";
  }

  if (successCode === "updated") {
    return "Job Application berhasil diperbarui.";
  }

  if (successCode === "status-updated") {
    return "Status Job Application berhasil diperbarui.";
  }

  return null;
}

export default async function ApplicationsPage({ searchParams }: ApplicationsPageProps) {
  const resolvedSearchParams = await searchParams;

  const [result, companyOptions] = await Promise.all([
    getActiveJobApplications(resolvedSearchParams),
    getJobApplicationCompanyFilterOptions(),
  ]);

  const successCode = getFirstSearchParam(resolvedSearchParams.success);
  const successMessage = getSuccessMessage(successCode);

  const hasActiveFilters = Boolean(
    result.filters.query ||
    result.filters.status ||
    result.filters.companyId ||
    result.filters.sort !== "updated-desc" ||
    Object.keys(result.filterErrors).length > 0,
  );

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {successMessage ? (
          <div
            role="status"
            className="flex items-start gap-3 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400"
          >
            <CircleCheckBig className="mt-0.5 size-4 shrink-0" aria-hidden="true" />

            <p>{successMessage}</p>
          </div>
        ) : null}

        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BriefcaseBusiness className="size-5" aria-hidden="true" />
              </div>

              <Badge variant="secondary">Job Application Management</Badge>
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Job Applications
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Pantau seluruh lamaran kerja aktif, status proses, deadline, dan company terkait
                dalam satu tempat.
              </p>
            </div>
          </div>

          <Button asChild>
            <Link href="/applications/new">
              <Plus aria-hidden="true" />
              Tambah lamaran
            </Link>
          </Button>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Cari dan filter lamaran</CardTitle>

                <CardDescription>
                  Pencarian hanya dilakukan pada Job Application aktif milik akun Anda.
                </CardDescription>
              </div>

              <Badge variant="outline">{result.applications.length} hasil</Badge>
            </div>
          </CardHeader>

          <CardContent>
            <ApplicationFilters
              filters={result.filters}
              errors={result.filterErrors}
              companyOptions={companyOptions}
            />
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Lamaran aktif</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Data ditampilkan berdasarkan pengurutan yang Anda pilih.
            </p>
          </div>

          <ApplicationList applications={result.applications} hasActiveFilters={hasActiveFilters} />
        </section>
      </div>
    </main>
  );
}
