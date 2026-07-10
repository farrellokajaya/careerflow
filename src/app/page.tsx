import { LandingHero } from "@/components/landing/landing-hero";
import { AppLogo } from "@/components/shared/app-logo";

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <AppLogo />

          <nav className="flex items-center gap-3" aria-label="Primary navigation">
            <a
              href="#features"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Features
            </a>

            <a
              href="#foundation"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Foundation
            </a>
          </nav>
        </div>
      </header>

      <LandingHero />
    </div>
  );
}
