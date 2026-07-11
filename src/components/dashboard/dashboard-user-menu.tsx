"use client";

import type { Role } from "@/generated/prisma/enums";
import { ChevronDown, LoaderCircle, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useFormStatus } from "react-dom";

import { logoutAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DashboardUserMenuProps = {
  user: {
    name: string;
    email: string;
    role: Role;
  };
};

function getUserInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "U";
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function LogoutMenuItem() {
  const { pending } = useFormStatus();

  return (
    <DropdownMenuItem asChild disabled={pending}>
      <button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <LoaderCircle className="animate-spin" aria-hidden="true" />
            Keluar...
          </>
        ) : (
          <>
            <LogOut aria-hidden="true" />
            Logout
          </>
        )}
      </button>
    </DropdownMenuItem>
  );
}

export function DashboardUserMenu({ user }: DashboardUserMenuProps) {
  const initials = getUserInitials(user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-auto max-w-full gap-2 px-2 py-1.5"
          aria-label="Buka menu akun"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </span>

          <span className="hidden min-w-0 text-left sm:block">
            <span className="block max-w-40 truncate text-sm font-medium">{user.name}</span>

            <span className="block max-w-40 truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          </span>

          <ChevronDown
            className="hidden size-4 text-muted-foreground sm:block"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="font-normal">
          <div className="space-y-1">
            <p className="truncate text-sm font-medium">{user.name}</p>

            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <UserRound aria-hidden="true" />
          Akun aktif
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <Mail aria-hidden="true" />
          <span className="truncate">{user.email}</span>
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <ShieldCheck aria-hidden="true" />
          Role: {user.role}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <form action={logoutAction}>
          <LogoutMenuItem />
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
