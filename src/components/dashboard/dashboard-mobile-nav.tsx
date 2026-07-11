"use client";

import type { Role } from "@/generated/prisma/enums";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppLogo } from "@/components/shared/app-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  canViewDashboardNavigationItem,
  dashboardNavigation,
  isDashboardNavigationItemActive,
} from "@/constants/dashboard-navigation";
import { cn } from "@/lib/utils";

type DashboardMobileNavProps = {
  role: Role;
};

export function DashboardMobileNav({ role }: DashboardMobileNavProps) {
  const pathname = usePathname();

  const visibleNavigation = dashboardNavigation.filter((item) =>
    canViewDashboardNavigationItem(item, role),
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Buka navigasi dashboard"
          className="lg:hidden"
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[18rem] p-0">
        <SheetHeader className="border-b px-6 py-5 text-left">
          <SheetTitle className="sr-only">Navigasi dashboard</SheetTitle>

          <SheetDescription className="sr-only">
            Navigasi utama aplikasi CareerFlow.
          </SheetDescription>

          <AppLogo />
        </SheetHeader>

        <div className="px-4 py-6">
          <p className="px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Workspace
          </p>

          <nav className="mt-3 space-y-1" aria-label="Mobile dashboard navigation">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = isDashboardNavigationItemActive(item, pathname);

              return (
                <SheetClose key={item.href} asChild>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />

                    <span>{item.label}</span>
                  </Link>
                </SheetClose>
              );
            })}
          </nav>
        </div>

        <div className="absolute right-0 bottom-0 left-0 border-t px-6 py-4">
          <p className="text-xs leading-5 text-muted-foreground">Job Application Tracker</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
