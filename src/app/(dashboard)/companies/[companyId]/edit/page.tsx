import { ArrowLeft, Building2, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateCompanyAction } from "@/actions/company-actions";
import { CompanyForm } from "@/components/companies/company-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveCompanyById } from "@/lib/data/companies";

type EditCompanyPageProps = {
  params: Promise<{
    companyId: string;
  }>;
};

export default async function EditCompanyPage({ params }: EditCompanyPageProps) {
  const { companyId } = await params;
  const company = await getActiveCompanyById(companyId);

  if (!company) {
    notFound();
  }

  const updateAction = updateCompanyAction.bind(null, company.id);

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
              <Pencil className="size-5" aria-hidden="true" />
            </div>

            <Badge variant="secondary">Company Management</Badge>
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Edit company</h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Perbarui informasi perusahaan milik akun Anda.
            </p>
          </div>
        </section>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Building2
                className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />

              <div>
                <CardTitle>{company.name}</CardTitle>

                <CardDescription>
                  Company arsip tidak dapat diedit sebelum dipulihkan.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <CompanyForm
              action={updateAction}
              mode="edit"
              initialValues={{
                name: company.name,
                website: company.website,
                industry: company.industry,
                size: company.size,
                location: company.location,
                description: company.description,
                logoUrl: company.logoUrl,
                linkedinUrl: company.linkedinUrl,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
