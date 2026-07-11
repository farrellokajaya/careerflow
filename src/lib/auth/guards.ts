import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function requireAuthenticatedUser() {
  const session = await auth();

  if (!session?.user?.id || !session.user.isActive) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    redirect("/login");
  }

  return user;
}

export async function requireAdminUser() {
  const user = await requireAuthenticatedUser();

  if (user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  return user;
}
