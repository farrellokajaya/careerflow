"use client";

import type { ApplicationStatus } from "@/generated/prisma/enums";
import { History, LoaderCircle, RefreshCw } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/types/action-result";

const initialState: ActionResult = {
  success: false,
  message: "",
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

type ApplicationStatusFormAction = (
  previousState: ActionResult,
  formData: FormData,
) => Promise<ActionResult>;

type ApplicationStatusFormProps = {
  action: ApplicationStatusFormAction;
  currentStatus: ApplicationStatus;
};

function getFieldError(errors: ActionResult["errors"], field: string): string | undefined {
  return errors?.[field]?.[0];
}

export function ApplicationStatusForm({ action, currentStatus }: ApplicationStatusFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  const statusError = getFieldError(state.errors, "status");
  const noteError = getFieldError(state.errors, "note");

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state.message ? (
        <div
          role={state.success ? "status" : "alert"}
          className={
            state.success
              ? "flex items-start gap-3 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-4 py-3 text-sm [overflow-wrap:anywhere] break-words text-emerald-700 dark:text-emerald-400"
              : "rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm [overflow-wrap:anywhere] break-words text-destructive"
          }
        >
          {state.success ? <History className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : null}

          <p className="min-w-0 [overflow-wrap:anywhere] break-words">{state.message}</p>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <Label htmlFor="application-status-update">Status baru</Label>

          <Select name="status" defaultValue={currentStatus} disabled={isPending}>
            <SelectTrigger
              id="application-status-update"
              className="w-full"
              aria-invalid={Boolean(statusError)}
              aria-describedby="application-status-update-message"
            >
              <SelectValue placeholder="Pilih status baru" />
            </SelectTrigger>

            <SelectContent>
              {applicationStatusOptions.map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {statusError ? (
            <p
              id="application-status-update-message"
              role="alert"
              className="text-sm [overflow-wrap:anywhere] break-words text-destructive"
            >
              {statusError}
            </p>
          ) : (
            <p
              id="application-status-update-message"
              className="text-xs [overflow-wrap:anywhere] break-words text-muted-foreground"
            >
              Status saat ini adalah {applicationStatusLabels[currentStatus]}.
            </p>
          )}
        </div>

        <div className="min-w-0 space-y-2">
          <Label htmlFor="application-status-note">Catatan perubahan</Label>

          <Textarea
            id="application-status-note"
            name="note"
            rows={4}
            maxLength={500}
            placeholder="Contoh: Lolos screening dan dijadwalkan interview."
            disabled={isPending}
            aria-invalid={Boolean(noteError)}
            aria-describedby="application-status-note-message"
            className="min-h-28 resize-y [overflow-wrap:anywhere] break-words whitespace-pre-wrap"
          />

          {noteError ? (
            <p
              id="application-status-note-message"
              role="alert"
              className="text-sm [overflow-wrap:anywhere] break-words text-destructive"
            >
              {noteError}
            </p>
          ) : (
            <p
              id="application-status-note-message"
              className="text-xs [overflow-wrap:anywhere] break-words text-muted-foreground"
            >
              Opsional, maksimal 500 karakter dan akan disimpan pada riwayat status.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 [overflow-wrap:anywhere] break-words text-muted-foreground">
          Perubahan status tidak otomatis mengubah tanggal melamar, deadline, atau status arsip.
        </p>

        <Button type="submit" disabled={isPending} className="sm:min-w-44">
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              Memperbarui...
            </>
          ) : (
            <>
              <RefreshCw aria-hidden="true" />
              Perbarui status
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
