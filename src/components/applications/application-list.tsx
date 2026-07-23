import { Archive, BriefcaseBusiness, Plus, SearchX } from "lucide-react";
import Link from "next/link";

import { ApplicationCard } from "@/components/applications/application-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobApplicationListItem } from "@/lib/data/job-applications";

type ApplicationListProps = {
  applications: JobApplicationListItem[];
  hasActiveFilters: boolean;
  archived?: boolean;
};

export function ApplicationList({
  applications,
  hasActiveFilters,
  archived = false,
}: ApplicationListProps) {
  if (applications.length === 0) {
    const EmptyIcon = hasActiveFilters ? SearchX : archived ? Archive : BriefcaseBusiness;

    const title = hasActiveFilters
      ? "Lamaran tidak ditemukan"
      : archived
        ? "Belum ada Job Application di arsip"
        : "Belum ada Job Application";

    const description = hasActiveFilters
      ? archived
        ? "Tidak ada Job Application arsip yang cocok dengan pencarian atau filter saat ini."
        : "Tidak ada Job Application aktif yang cocok dengan pencarian atau filter saat ini."
      : archived
        ? "Job Application yang Anda arsipkan akan ditampilkan di halaman ini."
        : "Tambahkan lamaran pertama untuk mulai memantau proses pencarian kerja Anda.";

    const resetPath = archived ? "/applications/archived" : "/applications";

    return (
      <Card className="border-dashed">
        <CardHeader className="items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <EmptyIcon className="size-6 text-muted-foreground" aria-hidden="true" />
          </div>

          <CardTitle>{title}</CardTitle>

          <CardDescription className="max-w-lg">{description}</CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          {hasActiveFilters ? (
            <Button asChild variant="outline">
              <Link href={resetPath}>Reset filter</Link>
            </Button>
          ) : archived ? (
            <Button asChild variant="outline">
              <Link href="/applications">Lihat lamaran aktif</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/applications/new">
                <Plus aria-hidden="true" />
                Tambah lamaran
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
      aria-label={archived ? "Daftar Job Application arsip" : "Daftar Job Application aktif"}
    >
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  );
}
