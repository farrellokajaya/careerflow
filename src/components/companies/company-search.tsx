import { Search, X } from "lucide-react";
import Form from "next/form";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CompanySearchProps = {
  query: string;
  error: string | null;
};

export function CompanySearch({ query, error }: CompanySearchProps) {
  const errorId = error ? "company-search-error" : undefined;

  return (
    <div className="space-y-2">
      <Form action="/companies" className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            id="company-search"
            name="query"
            type="search"
            defaultValue={query}
            maxLength={100}
            placeholder="Cari nama, industry, atau lokasi..."
            autoComplete="off"
            aria-label="Cari company"
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1 sm:flex-none">
            <Search aria-hidden="true" />
            Cari
          </Button>

          {query ? (
            <Button asChild type="button" variant="outline" className="flex-1 sm:flex-none">
              <Link href="/companies">
                <X aria-hidden="true" />
                Reset
              </Link>
            </Button>
          ) : null}
        </div>
      </Form>

      {error ? (
        <p id="company-search-error" role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">Pencarian dibatasi maksimal 100 karakter.</p>
      )}
    </div>
  );
}
