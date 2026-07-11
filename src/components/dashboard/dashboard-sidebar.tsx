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
    <aside className="sticky top-0 flex h-svh flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground max-lg:hidden">
      <div className="flex h-20 shrink-0 items-center border-b border-sidebar-border px-5 xl:px-6">
        <AppLogo className="text-sidebar-foreground" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 py-6 xl:px-4">
        <p className="px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Workspace
        </p>

        <nav className="mt-3 space-y-1" aria-label="Dashboard navigation">
          {visibleNavigation.map((item) => {
            const Icon = item.icon;
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
                <Icon className="size-4 shrink-0" aria-hidden="true" />

                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="shrink-0 border-t border-sidebar-border px-5 py-4 xl:px-6">
        <p className="text-xs leading-5 text-muted-foreground">Job Application Tracker</p>
      </div>
    </aside>
  );
}
