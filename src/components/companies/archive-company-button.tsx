"use client";

import { Archive, LoaderCircle, TriangleAlert } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ActionResult } from "@/types/action-result";

const initialState: ActionResult = {
  success: false,
  message: "",
};

type ArchiveCompanyAction = (
  previousState: ActionResult,
  formData: FormData,
) => Promise<ActionResult>;

type ArchiveCompanyButtonProps = {
  companyName: string;
  action: ArchiveCompanyAction;
};

export function ArchiveCompanyButton({
  companyName,
  action,
}: ArchiveCompanyButtonProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialState,
  );

  return (
    <div className="space-y-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={isPending}
          >
            <Archive aria-hidden="true" />
            Archive
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <TriangleAlert className="size-5" aria-hidden="true" />
            </div>

            <AlertDialogTitle>
              Archive company?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Company{" "}
              <span className="font-medium text-foreground">
                {companyName}
              </span>{" "}
              akan dipindahkan dari daftar aktif ke daftar arsip.
              Record dan Job Application yang terhubung tidak akan
              dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form action={formAction}>
            <AlertDialogFooter>
              <AlertDialogCancel type="button" disabled={isPending}>
                Batal
              </AlertDialogCancel>

              <AlertDialogAction asChild>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <LoaderCircle
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Mengarsipkan...
                    </>
                  ) : (
                    <>
                      <Archive aria-hidden="true" />
                      Ya, archive
                    </>
                  )}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {state.message ? (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}