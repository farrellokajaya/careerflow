"use client";

import { Archive, LoaderCircle, RotateCcw, TriangleAlert } from "lucide-react";
import { useActionState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types/action-result";

const initialState: ActionResult = {
  success: false,
  message: "",
};

type ApplicationArchiveActionMode = "archive" | "restore";

type ApplicationArchiveServerAction = (
  previousState: ActionResult,
  formData: FormData,
) => Promise<ActionResult>;

type ApplicationArchiveActionProps = {
  action: ApplicationArchiveServerAction;
  mode: ApplicationArchiveActionMode;
  position: string;
  companyName: string;
};

const actionCopy = {
  archive: {
    triggerLabel: "Arsipkan",
    dialogTitle: "Arsipkan Job Application?",
    confirmLabel: "Ya, arsipkan",
    pendingLabel: "Mengarsipkan...",
    description:
      "Lamaran akan dipindahkan dari daftar aktif ke halaman arsip. Data, status, dan riwayatnya tidak akan dihapus.",
  },
  restore: {
    triggerLabel: "Pulihkan",
    dialogTitle: "Pulihkan Job Application?",
    confirmLabel: "Ya, pulihkan",
    pendingLabel: "Memulihkan...",
    description:
      "Lamaran akan dikembalikan ke daftar aktif dengan informasi dan status terakhirnya.",
  },
} satisfies Record<
  ApplicationArchiveActionMode,
  {
    triggerLabel: string;
    dialogTitle: string;
    confirmLabel: string;
    pendingLabel: string;
    description: string;
  }
>;

export function ApplicationArchiveAction({
  action,
  mode,
  position,
  companyName,
}: ApplicationArchiveActionProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  const copy = actionCopy[mode];
  const TriggerIcon = mode === "archive" ? Archive : RotateCcw;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant={mode === "archive" ? "outline" : "default"}
          className="w-full sm:w-fit"
        >
          <TriggerIcon aria-hidden="true" />
          {copy.triggerLabel}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <form action={formAction} className="grid min-w-0 gap-4">
          <AlertDialogHeader>
            <AlertDialogMedia>
              {mode === "archive" ? (
                <TriangleAlert className="text-amber-600" aria-hidden="true" />
              ) : (
                <RotateCcw className="text-primary" aria-hidden="true" />
              )}
            </AlertDialogMedia>

            <AlertDialogTitle>{copy.dialogTitle}</AlertDialogTitle>

            <AlertDialogDescription className="min-w-0 [overflow-wrap:anywhere] break-words">
              {copy.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="min-w-0 rounded-lg border bg-muted/40 px-3 py-2.5 text-sm">
            <p className="font-medium [overflow-wrap:anywhere] break-words">{position}</p>

            <p className="mt-1 [overflow-wrap:anywhere] break-words text-muted-foreground">
              {companyName}
            </p>
          </div>

          {state.message ? (
            <div
              role={state.success ? "status" : "alert"}
              className={
                state.success
                  ? "rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-3 py-2.5 text-sm [overflow-wrap:anywhere] break-words text-emerald-700 dark:text-emerald-400"
                  : "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm [overflow-wrap:anywhere] break-words text-destructive"
              }
            >
              {state.message}
            </div>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={isPending}>
              Batal
            </AlertDialogCancel>

            <Button
              type="submit"
              variant={mode === "archive" ? "destructive" : "default"}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                  {copy.pendingLabel}
                </>
              ) : (
                <>
                  <TriggerIcon aria-hidden="true" />
                  {copy.confirmLabel}
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
