import type { ApplicationStatus } from "@/generated/prisma/enums";
import { ArrowRight, Clock3, History, MessageSquareText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { JobApplicationDetail } from "@/lib/data/job-applications";

type ApplicationStatusHistoryProps = {
  history: JobApplicationDetail["statusHistory"];
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

const applicationStatusClasses = {
  WISHLIST: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  APPLIED: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  SCREENING: "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  INTERVIEW: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  TECHNICAL_TEST: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  OFFER: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  ACCEPTED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REJECTED: "border-destructive/30 bg-destructive/10 text-destructive",
  WITHDRAWN: "border-zinc-500/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
} satisfies Record<ApplicationStatus, string>;

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge variant="outline" className={applicationStatusClasses[status]}>
      {applicationStatusLabels[status]}
    </Badge>
  );
}

export function ApplicationStatusHistory({ history }: ApplicationStatusHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-dashed px-4 py-8 text-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-muted">
          <History className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>

        <p className="mt-3 font-medium">Riwayat status belum tersedia</p>

        <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
          Perubahan status Job Application akan ditampilkan pada bagian ini.
        </p>
      </div>
    );
  }

  return (
    <ol className="space-y-4" aria-label="Riwayat perubahan status Job Application">
      {history.map((entry, index) => {
        const previousStatus = entry.previousStatus;

        return (
          <li key={entry.id} className="min-w-0 rounded-xl border p-4 sm:p-5">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <History className="size-4" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {previousStatus === null ? (
                    <>
                      <Badge variant="secondary">Status awal</Badge>

                      <ArrowRight
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />

                      <StatusBadge status={entry.newStatus} />
                    </>
                  ) : (
                    <>
                      <StatusBadge status={previousStatus} />

                      <ArrowRight
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />

                      <StatusBadge status={entry.newStatus} />
                    </>
                  )}

                  {index === 0 ? <Badge variant="outline">Terbaru</Badge> : null}
                </div>

                <p className="text-sm font-medium [overflow-wrap:anywhere] break-words">
                  {previousStatus === null
                    ? `Status awal ditetapkan menjadi ${applicationStatusLabels[entry.newStatus]}.`
                    : `Status diubah dari ${applicationStatusLabels[previousStatus]} menjadi ${
                        applicationStatusLabels[entry.newStatus]
                      }.`}
                </p>

                {entry.note ? (
                  <div className="flex min-w-0 items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-sm">
                    <MessageSquareText
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />

                    <p className="min-w-0 [overflow-wrap:anywhere] break-words whitespace-pre-wrap">
                      {entry.note}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Tidak ada catatan untuk perubahan ini.
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />

                  <time dateTime={entry.createdAt.toISOString()}>
                    {dateTimeFormatter.format(entry.createdAt)}
                  </time>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
