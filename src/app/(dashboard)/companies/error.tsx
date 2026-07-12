"use client";

import { AlertTriangle, LayoutDashboard, LoaderCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CompaniesErrorProps = {
  error: Error & {
    digest?: string;
  };
  unstable_retry: () => void;
};

export default function CompaniesError({ unstable_retry }: CompaniesErrorProps) {
  const [isRetrying, startRetryTransition] = useTransition();

  function handleRetry() {
    startRetryTransition(() => {
      unstable_retry();
    });
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center">
        <Card className="w-full border-destructive/30">
          <CardHeader className="items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-7" aria-hidden="true" />
            </div>

            <CardTitle>Company Management tidak dapat dimuat</CardTitle>

            <CardDescription className="max-w-xl">
              Terjadi gangguan sementara ketika memuat data company. Data sensitif dan detail error
              tidak ditampilkan pada halaman ini.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <p className="text-center text-sm leading-6 text-muted-foreground">
              Coba muat ulang data. Apabila masalah tetap terjadi, periksa koneksi database dan
              terminal development server.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                aria-busy={isRetrying}
              >
                {isRetrying ? (
                  <>
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                    Mencoba lagi...
                  </>
                ) : (
                  <>
                    <RefreshCw aria-hidden="true" />
                    Coba lagi
                  </>
                )}
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
