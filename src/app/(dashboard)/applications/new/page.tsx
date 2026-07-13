import { ArrowLeft, BriefcaseBusiness, Building2, Plus } from "lucide-react";
import Link from "next/link";

import { createJobApplicationAction } from "@/actions/job-application-actions";
import { JobApplicationForm } from "@/components/applications/application-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveCompanyOptions } from "@/lib/data/job-applications";

export default async function NewJobApplicationPage() {
  const activeCompanies = await getActiveCompanyOptions();

  const companyOptions = activeCompanies.map((company) => ({
    id: company.id,
    name: company.name,
    isArchived: false,
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
              <BriefcaseBusiness className="size-5" aria-hidden="true" />
            </div>

            <Badge variant="secondary">Job Application Management</Badge>
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Tambah Job Application
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Simpan informasi lowongan dan status awal agar seluruh proses lamaran dapat dipantau
              secara terstruktur.
            </p>
          </div>
        </section>

        {companyOptions.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader className="items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Building2 className="size-6 text-muted-foreground" aria-hidden="true" />
              </div>

              <CardTitle>Company aktif belum tersedia</CardTitle>

              <CardDescription className="max-w-xl">
                Job Application harus terhubung dengan company aktif milik akun Anda. Tambahkan
                company baru atau pulihkan company yang masih berada di arsip.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/companies/new">
                  <Plus aria-hidden="true" />
                  Tambah company
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link href="/companies/archived">Lihat company arsip</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Informasi lamaran</CardTitle>

              <CardDescription>
                Company, posisi, jenis pekerjaan, dan sistem kerja wajib diisi. Field lainnya dapat
                dilengkapi sekarang atau diperbarui nanti.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <JobApplicationForm
                action={createJobApplicationAction}
                mode="create"
                companyOptions={companyOptions}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
