import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck, UserRound, Wrench } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { AppLogo } from "@/components/shared/app-logo";
import { Button } from "@/components/ui/button";
import { requireAdminUser } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Admin Area",
  description: "Halaman admin sementara CareerFlow.",
};

export default async function AdminPage() {
  const admin = await requireAdminUser();

  return (
    <main className="min-h-svh bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <AppLogo />

          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft aria-hidden="true" />
            Kembali ke dashboard
          </Link>
        </Button>

        <section className="mb-8">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">Admin Area</h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Authorization role ADMIN berhasil. Dashboard admin dan fitur pengelolaan sistem akan
            dibuat pada tahap berikutnya.
          </p>
        </section>

        <section
          className="rounded-2xl border bg-card p-6 text-card-foreground shadow-sm"
          aria-labelledby="admin-information-title"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 id="admin-information-title" className="text-lg font-semibold">
                Informasi administrator
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Data administrator yang telah diverifikasi pada server.
              </p>
            </div>

            <div className="rounded-full border bg-muted px-3 py-1 text-xs font-semibold">
              {admin.role}
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-background p-4">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserRound className="size-4" aria-hidden="true" />
                Nama
              </dt>

              <dd className="mt-2 font-medium">{admin.name}</dd>
            </div>

            <div className="rounded-xl border bg-background p-4">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" aria-hidden="true" />
                Email
              </dt>

              <dd className="mt-2 font-medium break-all">{admin.email}</dd>
            </div>

            <div className="rounded-xl border bg-background p-4 sm:col-span-2">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wrench className="size-4" aria-hidden="true" />
                Hak akses
              </dt>

              <dd className="mt-2 font-medium">{admin.role}</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
