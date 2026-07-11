"use client";

import type { Role } from "@/generated/prisma/enums";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppLogo } from "@/components/shared/app-logo";
import {
  canViewDashboardNavigationItem,
  dashboardNavigation,
  isDashboardNavigationItemActive,
} from "@/constants/dashboard-navigation";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  role: Role;
};

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();

  const visibleNavigation = dashboardNavigation.filter((item) =>
    canViewDashboardNavigationItem(item, role),
  );

  return (
    <aside className="sticky top-0 hidden h-svh border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <div className="flex h-20 shrink-0 items-center border-b border-sidebar-border px-6">
        <AppLogo className="text-sidebar-foreground" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-6">
        <p className="px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Workspace
        </p>

        <nav className="mt-3 space-y-1" aria-label="Dashboard navigation">
          {visibleNavigation.map((item) => {
            const Icon = item.icon;

            if (item.href === "/companies") {
              return (
                <div
                  key={item.href}
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/70"
                >
                  <Icon className="size-4" aria-hidden="true" />

                  <span className="flex-1">{item.label}</span>

                  <span className="rounded-full border border-sidebar-border px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide uppercase">
                    Segera
                  </span>
                </div>
              );
            }

            const isActive = isDashboardNavigationItemActive(item, pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="shrink-0 border-t border-sidebar-border px-6 py-4">
        <p className="text-xs leading-5 text-muted-foreground">Job Application Tracker</p>
      </div>
    </aside>
  );
}
