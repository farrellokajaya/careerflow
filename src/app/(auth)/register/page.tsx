import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Buat Akun",
  description: "Buat akun CareerFlow baru.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
