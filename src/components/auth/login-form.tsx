"use client";

import { Eye, EyeOff, LoaderCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import { loginAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types/action-result";

const initialState: ActionResult = {
  success: false,
  message: "",
};

type LoginFormProps = {
  registered?: boolean;
};

export function LoginForm({ registered = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  const emailError = state.errors?.email?.[0];
  const passwordError = state.errors?.password?.[0];

  return (
    <section
      className="rounded-2xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8"
      aria-labelledby="login-title"
    >
      <div className="mb-6 space-y-2 text-center">
        <h1 id="login-title" className="text-2xl font-semibold tracking-tight">
          Selamat datang kembali
        </h1>

        <p className="text-sm leading-6 text-muted-foreground">
          Masukkan email dan password untuk melanjutkan ke CareerFlow.
        </p>
      </div>

      {registered ? (
        <div
          className="mb-5 rounded-lg border border-emerald-600/20 bg-emerald-600/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400"
          role="status"
        >
          Akun berhasil dibuat. Silakan login menggunakan akun baru Anda.
        </div>
      ) : null}

      {state.message ? (
        <div
          className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="space-y-5" noValidate>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="nama@email.com"
            disabled={isPending}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "email-error" : undefined}
            className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
          />

          {emailError ? (
            <p id="email-error" className="text-sm text-destructive">
              {emailError}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Masukkan password"
              disabled={isPending}
              aria-invalid={Boolean(passwordError)}
              aria-describedby={passwordError ? "password-error" : undefined}
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 pr-11 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              disabled={isPending}
              className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {passwordError ? (
            <p id="password-error" className="text-sm text-destructive">
              {passwordError}
            </p>
          ) : null}
        </div>

        <Button type="submit" size="lg" className="h-11 w-full" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              Memproses login...
            </>
          ) : (
            <>
              <LogIn aria-hidden="true" />
              Login
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Belum memiliki akun?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Buat akun
        </Link>
      </p>
    </section>
  );
}
