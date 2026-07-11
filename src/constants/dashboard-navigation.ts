import type { LucideIcon } from "lucide-react";
import { Building2, LayoutDashboard, ShieldCheck } from "lucide-react";

import type { Role } from "@/generated/prisma/enums";

export type DashboardNavigationItem = {
  label: string;
  href: "/dashboard" | "/companies" | "/admin";
  icon: LucideIcon;
  activeMatch: "exact" | "prefix";
  allowedRoles?: readonly Role[];
};

export const dashboardNavigation: readonly DashboardNavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    activeMatch: "exact",
  },
  {
    label: "Companies",
    href: "/companies",
    icon: Building2,
    activeMatch: "prefix",
  },
  {
    label: "Admin",
    href: "/admin",
    icon: ShieldCheck,
    activeMatch: "prefix",
    allowedRoles: ["ADMIN"],
  },
];

export function canViewDashboardNavigationItem(item: DashboardNavigationItem, role: Role): boolean {
  if (!item.allowedRoles) {
    return true;
  }

  return item.allowedRoles.includes(role);
}

export function isDashboardNavigationItemActive(
  item: DashboardNavigationItem,
  pathname: string,
): boolean {
  if (item.activeMatch === "exact") {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
