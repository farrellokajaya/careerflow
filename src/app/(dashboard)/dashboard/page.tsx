import type { Metadata } from "next";
import { BriefcaseBusiness, Mail, ShieldCheck, UserRound } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { AppLogo } from "@/components/shared/app-logo";
import { requireAuthenticatedUser } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard sementara CareerFlow.",
};

export default async function DashboardPage() {
  const user = await requireAuthenticatedUser();

  return (
    <main className="min-h-svh bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <AppLogo />

          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="mb-8">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BriefcaseBusiness className="size-6" aria-hidden="true" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Authentication berhasil. Dashboard utama, statistik, dan fitur pengelolaan lamaran akan
            dibuat pada tahap berikutnya.
          </p>
        </section>

        <section
          className="rounded-2xl border bg-card p-6 text-card-foreground shadow-sm"
          aria-labelledby="account-information-title"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 id="account-information-title" className="text-lg font-semibold">
                Informasi akun
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Data aman dari user yang sedang terautentikasi.
              </p>
            </div>

            <div className="rounded-full border bg-muted px-3 py-1 text-xs font-semibold">
              {user.role}
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-background p-4">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserRound className="size-4" aria-hidden="true" />
                Nama
              </dt>

              <dd className="mt-2 font-medium">{user.name}</dd>
            </div>

            <div className="rounded-xl border bg-background p-4">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" aria-hidden="true" />
                Email
              </dt>

              <dd className="mt-2 font-medium break-all">{user.email}</dd>
            </div>

            <div className="rounded-xl border bg-background p-4 sm:col-span-2">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Role
              </dt>

              <dd className="mt-2 font-medium">{user.role}</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
