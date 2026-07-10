"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto size-10 text-destructive" aria-hidden="true" />

        <h1 className="mt-5 text-2xl font-semibold">Something went wrong</h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page could not be loaded. Please try again.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    </main>
  );
}
