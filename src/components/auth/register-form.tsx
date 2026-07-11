"use client";

import { Eye, EyeOff, LoaderCircle, UserPlus } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import { registerAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types/action-result";

const initialState: ActionResult = {
  success: false,
  message: "",
};

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  const nameError = state.errors?.name?.[0];
  const emailError = state.errors?.email?.[0];
  const passwordError = state.errors?.password?.[0];
  const confirmPasswordError = state.errors?.confirmPassword?.[0];

  const passwordDescription = passwordError
    ? "password-requirements password-error"
    : "password-requirements";

  return (
    <section
      className="rounded-2xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8"
      aria-labelledby="register-title"
    >
      <div className="mb-6 space-y-2 text-center">
        <h1 id="register-title" className="text-2xl font-semibold tracking-tight">
          Buat akun CareerFlow
        </h1>

        <p className="text-sm leading-6 text-muted-foreground">
          Mulai kelola seluruh proses lamaran kerja Anda dengan lebih teratur.
        </p>
      </div>

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
          <label htmlFor="name" className="text-sm font-medium">
            Nama
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Nama lengkap"
            disabled={isPending}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? "name-error" : undefined}
            className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
          />

          {nameError ? (
            <p id="name-error" className="text-sm text-destructive">
              {nameError}
            </p>
          ) : null}
        </div>

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
              autoComplete="new-password"
              placeholder="Buat password"
              disabled={isPending}
              aria-invalid={Boolean(passwordError)}
              aria-describedby={passwordDescription}
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

          <p id="password-requirements" className="text-xs leading-5 text-muted-foreground">
            Minimal 12 karakter serta memiliki huruf besar, huruf kecil, dan angka.
          </p>

          {passwordError ? (
            <p id="password-error" className="text-sm text-destructive">
              {passwordError}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Konfirmasi password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Ulangi password"
              disabled={isPending}
              aria-invalid={Boolean(confirmPasswordError)}
              aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 pr-11 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              disabled={isPending}
              className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              aria-label={
                showConfirmPassword
                  ? "Sembunyikan konfirmasi password"
                  : "Tampilkan konfirmasi password"
              }
              aria-pressed={showConfirmPassword}
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {confirmPasswordError ? (
            <p id="confirm-password-error" className="text-sm text-destructive">
              {confirmPasswordError}
            </p>
          ) : null}
        </div>

        <Button type="submit" size="lg" className="h-11 w-full" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              Membuat akun...
            </>
          ) : (
            <>
              <UserPlus aria-hidden="true" />
              Buat akun
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah memiliki akun?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Login
        </Link>
      </p>
    </section>
  );
}
