"use client";

import { LoaderCircle, RotateCcw } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types/action-result";

const initialState: ActionResult = {
  success: false,
  message: "",
};

type RestoreCompanyAction = (
  previousState: ActionResult,
  formData: FormData,
) => Promise<ActionResult>;

type RestoreCompanyButtonProps = {
  action: RestoreCompanyAction;
};

export function RestoreCompanyButton({ action }: RestoreCompanyButtonProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              Memulihkan...
            </>
          ) : (
            <>
              <RotateCcw aria-hidden="true" />
              Restore
            </>
          )}
        </Button>
      </form>

      {state.message ? (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
