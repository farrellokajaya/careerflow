import type { CompanySize } from "@/generated/prisma/enums";
import {
  Archive,
  ArchiveRestore,
  Building2,
  CalendarClock,
  Factory,
  MapPin,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { restoreCompanyAction } from "@/actions/company-actions";
import { RestoreCompanyButton } from "@/components/companies/restore-company-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getArchivedCompanies } from "@/lib/data/companies";

const companySizeLabels = {
  STARTUP: "Startup",
  SMALL: "Small",
  MEDIUM: "Medium",
  LARGE: "Large",
  ENTERPRISE: "Enterprise",
} satisfies Record<CompanySize, string>;

const archivedAtFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

export default async function ArchivedCompaniesPage() {
  const companies = await getArchivedCompanies();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Archive className="size-5" aria-hidden="true" />
            </div>

            <Badge variant="secondary">Company Management</Badge>
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Company arsip</h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Pulihkan company yang sebelumnya dipindahkan dari daftar aktif.
            </p>
          </div>
        </section>

        <section className="flex flex-wrap items-center gap-2" aria-label="Navigasi status company">
          <Button asChild size="sm" variant="outline">
            <Link href="/companies">
              <Building2 aria-hidden="true" />
              Aktif
            </Link>
          </Button>

          <Button asChild size="sm">
            <Link href="/companies/archived">
              <Archive aria-hidden="true" />
              Arsip
            </Link>
          </Button>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Daftar company arsip</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Hanya company arsip milik akun aktif yang ditampilkan.
              </p>
            </div>

            <Badge variant="outline">{companies.length} arsip</Badge>
          </div>

          {companies.length === 0 ? (
            <Card className="border-dashed">
              <CardHeader className="items-center text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <ArchiveRestore className="size-6 text-muted-foreground" aria-hidden="true" />
                </div>

                <CardTitle>Belum ada company arsip</CardTitle>

                <CardDescription className="max-w-lg">
                  Company yang Anda archive akan tampil di halaman ini dan dapat dipulihkan kembali.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex justify-center">
                <Button asChild variant="outline">
                  <Link href="/companies">
                    <Building2 aria-hidden="true" />
                    Kembali ke company aktif
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
              aria-label="Daftar company arsip"
            >
              {companies.map((company) => {
                const restoreAction = restoreCompanyAction.bind(null, company.id);

                const archivedAt = company.deletedAt
                  ? archivedAtFormatter.format(company.deletedAt)
                  : "Waktu arsip tidak tersedia";

                return (
                  <Card key={company.id} className="h-full">
                    <CardHeader>
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                          <Archive className="size-5" aria-hidden="true" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-lg break-words">{company.name}</CardTitle>

                          <CardDescription className="mt-1">
                            {company.industry ?? "Industry belum diisi"}
                          </CardDescription>
                        </div>

                        <Badge variant="outline" className="shrink-0">
                          Arsip
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col gap-4">
                      <dl className="space-y-3 text-sm">
                        <div className="flex min-w-0 items-start gap-3">
                          <Factory
                            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />

                          <div className="min-w-0">
                            <dt className="sr-only">Industry</dt>

                            <dd className="break-words">
                              {company.industry ?? "Industry belum tersedia"}
                            </dd>
                          </div>
                        </div>

                        <div className="flex min-w-0 items-start gap-3">
                          <MapPin
                            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />

                          <div className="min-w-0">
                            <dt className="sr-only">Lokasi</dt>

                            <dd className="break-words">
                              {company.location ?? "Lokasi belum tersedia"}
                            </dd>
                          </div>
                        </div>

                        <div className="flex min-w-0 items-start gap-3">
                          <UsersRound
                            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />

                          <div className="min-w-0">
                            <dt className="sr-only">Ukuran perusahaan</dt>

                            <dd>
                              {company.size
                                ? companySizeLabels[company.size]
                                : "Ukuran belum tersedia"}
                            </dd>
                          </div>
                        </div>

                        <div className="flex min-w-0 items-start gap-3">
                          <CalendarClock
                            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />

                          <div className="min-w-0">
                            <dt className="sr-only">Waktu archive</dt>

                            <dd>Diarsipkan {archivedAt}</dd>
                          </div>
                        </div>
                      </dl>

                      <div className="mt-auto border-t pt-4">
                        <RestoreCompanyButton action={restoreAction} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
