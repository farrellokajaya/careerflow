import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
};

export function AppLogo({ className }: AppLogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}
      aria-label="CareerFlow home"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <BriefcaseBusiness className="size-5" aria-hidden="true" />
      </span>
      <span>CareerFlow</span>
    </Link>
  );
}
