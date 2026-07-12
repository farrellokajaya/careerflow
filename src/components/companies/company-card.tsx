import type { CompanySize } from "@/generated/prisma/enums";
import {
  Building2,
  CalendarClock,
  ExternalLink,
  Factory,
  MapPin,
  Pencil,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompanyListItem } from "@/lib/data/companies";

type CompanyCardProps = {
  company: CompanyListItem;
};

const companySizeLabels = {
  STARTUP: "Startup",
  SMALL: "Small",
  MEDIUM: "Medium",
  LARGE: "Large",
  ENTERPRISE: "Enterprise",
} satisfies Record<CompanySize, string>;

const updatedAtFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeZone: "Asia/Jakarta",
});

function getWebsiteLabel(website: string): string {
  try {
    const url = new URL(website);

    return url.hostname.replace(/^www\./, "");
  } catch {
    return website;
  }
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg break-words">{company.name}</CardTitle>

            <CardDescription className="mt-1">
              {company.industry ?? "Industry belum diisi"}
            </CardDescription>
          </div>

          {company.size ? (
            <Badge variant="secondary" className="shrink-0">
              {companySizeLabels[company.size]}
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <dl className="space-y-3 text-sm">
          <div className="flex min-w-0 items-start gap-3">
            <Factory className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />

            <div className="min-w-0">
              <dt className="sr-only">Industry</dt>
              <dd className="break-words">{company.industry ?? "Belum tersedia"}</dd>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />

            <div className="min-w-0">
              <dt className="sr-only">Lokasi</dt>
              <dd className="break-words">{company.location ?? "Lokasi belum tersedia"}</dd>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-3">
            <UsersRound
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <dt className="sr-only">Ukuran perusahaan</dt>
              <dd>{company.size ? companySizeLabels[company.size] : "Ukuran belum tersedia"}</dd>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-3">
            <CalendarClock
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <dt className="sr-only">Terakhir diperbarui</dt>

              <dd>Diperbarui {updatedAtFormatter.format(company.updatedAt)}</dd>
            </div>
          </div>
        </dl>

        <div className="mt-auto space-y-4">
          {company.website ? (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit max-w-full items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              <span className="truncate">{getWebsiteLabel(company.website)}</span>

              <ExternalLink className="size-4 shrink-0" aria-hidden="true" />

              <span className="sr-only">Buka website {company.name} di tab baru</span>
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">Website belum tersedia.</p>
          )}

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button asChild size="sm" variant="outline">
              <Link href={`/companies/${company.id}/edit`}>
                <Pencil aria-hidden="true" />
                Edit
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
