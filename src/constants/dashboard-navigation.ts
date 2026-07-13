import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, Building2, LayoutDashboard, ShieldCheck } from "lucide-react";

import type { Role } from "@/generated/prisma/enums";

export type DashboardNavigationItem = {
  label: string;
  href: "/dashboard" | "/applications" | "/companies" | "/admin";
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
    label: "Applications",
    href: "/applications",
    icon: BriefcaseBusiness,
    activeMatch: "prefix",
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
