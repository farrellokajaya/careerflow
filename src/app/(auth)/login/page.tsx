import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke akun CareerFlow.",
};

type LoginPageProps = {
  searchParams: Promise<{
    registered?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const registeredParam = Array.isArray(params.registered)
    ? params.registered[0]
    : params.registered;

  return <LoginForm registered={registeredParam === "1"} />;
}
