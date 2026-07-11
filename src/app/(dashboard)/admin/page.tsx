import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminUser } from "@/lib/auth/guards";

export default async function AdminPage() {
  const user = await requireAdminUser();
  const displayName = user.name?.trim() || "Administrator CareerFlow";

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </div>

            <Badge variant="secondary">ADMIN</Badge>
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Admin Workspace</h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Halaman ini hanya dapat diakses oleh administrator CareerFlow.
            </p>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Akses administrator aktif</CardTitle>

            <CardDescription>
              Authorization halaman ini diperiksa kembali pada server.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Nama
                </dt>

                <dd className="mt-2 text-sm font-medium break-words">{displayName}</dd>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Email
                </dt>

                <dd className="mt-2 text-sm font-medium break-all">{user.email}</dd>
              </div>
            </dl>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Pengelolaan user dan fitur administrasi lanjutan belum dikerjakan pada tahap ini.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
