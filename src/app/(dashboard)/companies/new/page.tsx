import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";

import { CompanyForm } from "@/components/companies/company-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewCompanyPage() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Button asChild variant="ghost" className="-ml-2">
          <Link href="/companies">
            <ArrowLeft aria-hidden="true" />
            Kembali ke Companies
          </Link>
        </Button>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-5" aria-hidden="true" />
            </div>

            <Badge variant="secondary">Company Management</Badge>
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Tambah company</h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Tambahkan informasi perusahaan yang berkaitan dengan proses pencarian kerja Anda.
            </p>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Informasi perusahaan</CardTitle>

            <CardDescription>
              Nama perusahaan wajib diisi. Field lainnya bersifat opsional dan dapat diperbarui
              nanti.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <CompanyForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
