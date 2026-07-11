import type { ReactNode } from "react";

import { AppLogo } from "@/components/shared/app-logo";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-muted/30 px-4 py-10 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--color-primary)_0,transparent_28%),radial-gradient(circle_at_bottom_right,var(--color-muted)_0,transparent_32%)] opacity-[0.06]"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <AppLogo className="text-lg" />
        </div>

        {children}

        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
          Kelola perjalanan karier dan proses lamaran kerja Anda dalam satu tempat.
        </p>
      </div>
    </main>
  );
}
