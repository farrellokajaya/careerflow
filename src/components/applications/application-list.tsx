import { BriefcaseBusiness, Plus, SearchX } from "lucide-react";
import Link from "next/link";

import { ApplicationCard } from "@/components/applications/application-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobApplicationListItem } from "@/lib/data/job-applications";

type ApplicationListProps = {
  applications: JobApplicationListItem[];
  hasActiveFilters: boolean;
};

export function ApplicationList({ applications, hasActiveFilters }: ApplicationListProps) {
  if (applications.length === 0) {
    const EmptyIcon = hasActiveFilters ? SearchX : BriefcaseBusiness;

    return (
      <Card className="border-dashed">
        <CardHeader className="items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <EmptyIcon className="size-6 text-muted-foreground" aria-hidden="true" />
          </div>

          <CardTitle>
            {hasActiveFilters ? "Lamaran tidak ditemukan" : "Belum ada Job Application"}
          </CardTitle>

          <CardDescription className="max-w-lg">
            {hasActiveFilters
              ? "Tidak ada Job Application aktif yang cocok dengan pencarian atau filter saat ini."
              : "Tambahkan lamaran pertama untuk mulai memantau proses pencarian kerja Anda."}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          {hasActiveFilters ? (
            <Button asChild variant="outline">
              <Link href="/applications">Reset filter</Link>
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
      aria-label="Daftar Job Application aktif"
    >
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  );
}
