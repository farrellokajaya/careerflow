import { Building2, SearchX } from "lucide-react";

import { CompanyCard } from "@/components/companies/company-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompanyListItem } from "@/lib/data/companies";

type CompanyListProps = {
  companies: CompanyListItem[];
  searchQuery: string;
};

export function CompanyList({ companies, searchQuery }: CompanyListProps) {
  if (companies.length === 0) {
    const hasSearchQuery = searchQuery.length > 0;
    const EmptyIcon = hasSearchQuery ? SearchX : Building2;

    return (
      <Card className="border-dashed">
        <CardHeader className="items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <EmptyIcon className="size-6 text-muted-foreground" aria-hidden="true" />
          </div>

          <CardTitle>{hasSearchQuery ? "Company tidak ditemukan" : "Belum ada company"}</CardTitle>

          <CardDescription className="max-w-lg">
            {hasSearchQuery
              ? `Tidak ada company aktif yang cocok dengan pencarian “${searchQuery}”.`
              : "Anda belum memiliki company aktif. Fitur tambah company akan tersedia pada step berikutnya."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            {hasSearchQuery
              ? "Coba gunakan nama, industry, atau lokasi yang berbeda."
              : "Company milik user lain tidak akan ditampilkan di halaman ini."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3" aria-label="Daftar company aktif">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
