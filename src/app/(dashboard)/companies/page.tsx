import { Archive, Building2, Plus } from "lucide-react";
import Link from "next/link";

import { CompanyList } from "@/components/companies/company-list";
import { CompanySearch } from "@/components/companies/company-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveCompanies } from "@/lib/data/companies";

type CompaniesPageProps = {
  searchParams: Promise<{
    query?: string | string[];
  }>;
};

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const resolvedSearchParams = await searchParams;
  const result = await getActiveCompanies(resolvedSearchParams.query);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="size-5" aria-hidden="true" />
              </div>

              <Badge variant="secondary">Company Management</Badge>
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Companies</h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Kelola daftar perusahaan yang berkaitan dengan proses pencarian kerja Anda.
              </p>
            </div>
          </div>

          <Button disabled title="Tersedia pada Step 11">
            <Plus aria-hidden="true" />
            Tambah company
          </Button>
        </section>

        <section className="flex flex-wrap items-center gap-2" aria-label="Navigasi status company">
          <Button asChild size="sm">
            <Link href="/companies">
              <Building2 aria-hidden="true" />
              Aktif
            </Link>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled
            title="Daftar arsip tersedia pada Step 14"
          >
            <Archive aria-hidden="true" />
            Arsip
          </Button>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Cari company</CardTitle>

                <CardDescription>
                  Pencarian hanya dilakukan pada company aktif milik akun Anda.
                </CardDescription>
              </div>

              <Badge variant="outline">{result.companies.length} hasil</Badge>
            </div>
          </CardHeader>

          <CardContent>
            <CompanySearch query={result.searchQuery} error={result.searchError} />
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Company aktif</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Diurutkan berdasarkan pembaruan terbaru.
            </p>
          </div>

          <CompanyList companies={result.companies} searchQuery={result.searchQuery} />
        </section>
      </div>
    </main>
  );
}
