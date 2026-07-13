import type { ApplicationStatus } from "@/generated/prisma/enums";
import { Filter, RotateCcw, Search } from "lucide-react";
import Form from "next/form";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { JobApplicationCompanyOption } from "@/lib/data/job-applications";
import type {
  JobApplicationListFilterErrors,
  JobApplicationListFilters,
} from "@/lib/validations/job-application";

type ApplicationFiltersProps = {
  filters: JobApplicationListFilters;
  errors: JobApplicationListFilterErrors;
  companyOptions: JobApplicationCompanyOption[];
};

const applicationStatusLabels = {
  WISHLIST: "Wishlist",
  APPLIED: "Melamar",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  TECHNICAL_TEST: "Tes teknis",
  OFFER: "Penawaran",
  ACCEPTED: "Diterima",
  REJECTED: "Ditolak",
  WITHDRAWN: "Dibatalkan",
} satisfies Record<ApplicationStatus, string>;

const applicationStatusOptions = Object.entries(applicationStatusLabels) as Array<
  [ApplicationStatus, string]
>;

const sortOptions = [
  ["updated-desc", "Terbaru diperbarui"],
  ["applied-desc", "Tanggal melamar terbaru"],
  ["deadline-asc", "Deadline terdekat"],
  ["priority-desc", "Prioritas tertinggi"],
  ["position-asc", "Posisi A-Z"],
] as const;

const selectClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

function FilterError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

export function ApplicationFilters({ filters, errors, companyOptions }: ApplicationFiltersProps) {
  const hasFilterErrors = Object.keys(errors).length > 0;

  const hasActiveFilters = Boolean(
    filters.query ||
    filters.status ||
    filters.companyId ||
    filters.sort !== "updated-desc" ||
    hasFilterErrors,
  );

  return (
    <div className="space-y-4">
      {hasFilterErrors ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          Satu atau beberapa filter tidak valid. Periksa field yang ditandai lalu coba lagi.
        </div>
      ) : null}

      <Form action="/applications" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2 md:col-span-2 xl:col-span-1">
            <Label htmlFor="application-search">Pencarian</Label>

            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />

              <Input
                id="application-search"
                name="q"
                type="search"
                defaultValue={filters.query}
                maxLength={100}
                placeholder="Posisi, company, lokasi, atau sumber"
                autoComplete="off"
                aria-invalid={Boolean(errors.query)}
                aria-describedby={errors.query ? "application-search-error" : undefined}
                className="pl-9"
              />
            </div>

            <FilterError id="application-search-error" message={errors.query} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="application-status-filter">Status</Label>

            <select
              id="application-status-filter"
              name="status"
              defaultValue={filters.status ?? ""}
              aria-invalid={Boolean(errors.status)}
              aria-describedby={errors.status ? "application-status-error" : undefined}
              className={selectClassName}
            >
              <option value="">Semua status</option>

              {applicationStatusOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <FilterError id="application-status-error" message={errors.status} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="application-company-filter">Company</Label>

            <select
              id="application-company-filter"
              name="company"
              defaultValue={filters.companyId ?? ""}
              aria-invalid={Boolean(errors.companyId)}
              aria-describedby={errors.companyId ? "application-company-error" : undefined}
              className={selectClassName}
            >
              <option value="">Semua company</option>

              {companyOptions.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                  {company.deletedAt ? " (Arsip)" : ""}
                </option>
              ))}
            </select>

            <FilterError id="application-company-error" message={errors.companyId} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="application-sort">Urutkan</Label>

            <select
              id="application-sort"
              name="sort"
              defaultValue={filters.sort}
              aria-invalid={Boolean(errors.sort)}
              aria-describedby={errors.sort ? "application-sort-error" : undefined}
              className={selectClassName}
            >
              {sortOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <FilterError id="application-sort-error" message={errors.sort} />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button type="submit">
            <Filter aria-hidden="true" />
            Terapkan filter
          </Button>

          {hasActiveFilters ? (
            <Button asChild variant="outline">
              <Link href="/applications">
                <RotateCcw aria-hidden="true" />
                Reset
              </Link>
            </Button>
          ) : null}

          <p className="text-xs text-muted-foreground sm:ml-auto">
            Pencarian dibatasi maksimal 100 karakter.
          </p>
        </div>
      </Form>
    </div>
  );
}
