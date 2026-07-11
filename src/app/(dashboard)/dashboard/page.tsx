import { BriefcaseBusiness, Building2, LayoutDashboard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LayoutDashboard className="size-5" aria-hidden="true" />
            </div>

            <Badge variant="secondary">Dashboard</Badge>
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Selamat datang di CareerFlow
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Gunakan workspace ini untuk mengelola perusahaan dan aktivitas pencarian kerja Anda
              secara terorganisir.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2" aria-label="Informasi dashboard">
          <Card>
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Building2 className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>

              <CardTitle>Company Management</CardTitle>

              <CardDescription>
                Kelola daftar perusahaan yang berkaitan dengan proses pencarian kerja Anda.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Fitur pengelolaan company akan tersedia setelah tahap dashboard foundation selesai.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <BriefcaseBusiness className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>

              <CardTitle>Job Applications</CardTitle>

              <CardDescription>
                Pantau lamaran kerja dan perkembangan proses rekrutmen Anda.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Pengelolaan job application belum dikerjakan pada Tahap 4.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
