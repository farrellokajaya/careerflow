import { Building2, LayoutDashboard, SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompanyNotFound() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center">
        <Card className="w-full border-dashed">
          <CardHeader className="items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="size-7" aria-hidden="true" />
            </div>

            <CardTitle>Company tidak ditemukan atau tidak dapat diakses</CardTitle>

            <CardDescription className="max-w-xl">
              Company mungkin tidak tersedia, sudah diarsipkan, memiliki ID yang tidak valid, atau
              bukan milik akun yang sedang aktif.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <p className="text-center text-sm leading-6 text-muted-foreground">
              Demi keamanan, CareerFlow tidak menampilkan informasi lebih rinci mengenai company
              tersebut.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/companies">
                  <Building2 aria-hidden="true" />
                  Kembali ke Companies
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <LayoutDashboard aria-hidden="true" />
                  Kembali ke dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
