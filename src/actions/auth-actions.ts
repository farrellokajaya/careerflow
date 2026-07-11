"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import { signIn, signOut } from "@/auth";
import { Prisma, Role } from "@/generated/prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db/prisma";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import type { ActionResult } from "@/types/action-result";

const DUPLICATE_EMAIL_MESSAGE = "Email tidak dapat digunakan. Silakan gunakan email lain.";

const REGISTER_ERROR_MESSAGE = "Registrasi gagal diproses. Silakan coba kembali.";

const INVALID_LOGIN_MESSAGE = "Email atau password tidak valid.";

const INACTIVE_ACCOUNT_MESSAGE = "Akun tidak dapat digunakan. Hubungi administrator.";

const LOGIN_ERROR_MESSAGE = "Login gagal diproses. Silakan coba kembali.";

function getFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field !== "string") {
      continue;
    }

    fieldErrors[field] ??= [];
    fieldErrors[field].push(issue.message);
  }

  return fieldErrors;
}

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function registerAction(
  previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  void previousState;

  const parsedInput = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Periksa kembali data yang Anda masukkan.",
      errors: getFieldErrors(parsedInput.error),
    };
  }

  const { name, email, password } = parsedInput.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: DUPLICATE_EMAIL_MESSAGE,
        errors: {
          email: [DUPLICATE_EMAIL_MESSAGE],
        },
      };
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: Role.USER,
        isActive: true,
      },
      select: {
        id: true,
      },
    });
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        message: DUPLICATE_EMAIL_MESSAGE,
        errors: {
          email: [DUPLICATE_EMAIL_MESSAGE],
        },
      };
    }

    return {
      success: false,
      message: REGISTER_ERROR_MESSAGE,
    };
  }

  redirect("/login?registered=1");
}

export async function loginAction(
  previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  void previousState;

  const parsedInput = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Periksa kembali data login yang Anda masukkan.",
      errors: getFieldErrors(parsedInput.error),
    };
  }

  const { email, password } = parsedInput.data;

  try {
    return await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/dashboard",
    });
  } catch (error: unknown) {
    if (error instanceof CredentialsSignin) {
      if (error.code === "account_inactive") {
        return {
          success: false,
          message: INACTIVE_ACCOUNT_MESSAGE,
        };
      }

      return {
        success: false,
        message: INVALID_LOGIN_MESSAGE,
      };
    }

    if (error instanceof AuthError) {
      return {
        success: false,
        message: LOGIN_ERROR_MESSAGE,
      };
    }

    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({
    redirectTo: "/login",
  });
}
