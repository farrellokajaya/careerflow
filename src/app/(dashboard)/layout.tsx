import type { ReactNode } from "react";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { requireAuthenticatedUser } from "@/lib/auth/guards";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireAuthenticatedUser();

  return (
    <div className="min-h-svh bg-muted/30 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <DashboardSidebar role={user.role} />

      <div className="min-w-0">{children}</div>
    </div>
  );
}
