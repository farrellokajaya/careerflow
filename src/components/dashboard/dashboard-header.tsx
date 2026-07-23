import type { Role } from "@/generated/prisma/enums";

import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";
import { DashboardUserMenu } from "@/components/dashboard/dashboard-user-menu";
import { AppLogo } from "@/components/shared/app-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

type DashboardHeaderProps = {
  user: {
    name: string;
    email: string;
    role: Role;
  };
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 min-w-0 items-center gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 lg:hidden">
          <DashboardMobileNav role={user.role} />

          <AppLogo className="min-w-0" />
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-medium">CareerFlow Workspace</p>

          <p className="text-xs text-muted-foreground">Kelola aktivitas pencarian kerja Anda</p>
        </div>

        <div className="ml-auto flex min-w-0 items-center gap-2">
          <ThemeToggle />

          <DashboardUserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
