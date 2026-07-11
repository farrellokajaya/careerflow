import type { ReactNode } from "react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { requireAuthenticatedUser } from "@/lib/auth/guards";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireAuthenticatedUser();
  const displayName = user.name?.trim() || "Pengguna CareerFlow";

  return (
    <div className="min-h-svh bg-muted/30 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
      <DashboardSidebar role={user.role} />

      <div className="min-w-0">
        <DashboardHeader
          user={{
            name: displayName,
            email: user.email,
            role: user.role,
          }}
        />

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
