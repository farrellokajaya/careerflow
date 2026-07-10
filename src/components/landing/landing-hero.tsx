import { ArrowRight, BarChart3, CalendarDays, KanbanSquare } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Organized pipeline",
    description: "Track every opportunity from wishlist to accepted offer.",
    icon: KanbanSquare,
  },
  {
    title: "Interview planning",
    description: "Keep schedules, preparation notes, and follow-ups in one place.",
    icon: CalendarDays,
  },
  {
    title: "Useful analytics",
    description: "Understand response, interview, and offer conversion rates.",
    icon: BarChart3,
  },
] as const;

export function LandingHero() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground shadow-sm">
            Professional job application workspace
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Track Every Application. Land the Right Opportunity.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-pretty text-muted-foreground">
            Manage job applications, interviews, documents, and follow-ups in one organized
            workspace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Get Started
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-md border bg-background px-5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-3xl border bg-card p-5 shadow-xl shadow-black/5">
          <div id="foundation" className="scroll-mt-28 rounded-2xl border bg-background p-5">
            <p className="text-sm font-medium text-muted-foreground">Stage 1 status</p>
            <p className="mt-2 text-2xl font-semibold">Foundation ready</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Next.js, TypeScript, Tailwind CSS, shadcn/ui configuration, linting, formatting, and
              the initial architecture are prepared.
            </p>
          </div>

          <div
            id="features"
            className="grid scroll-mt-28 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
          >
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article key={feature.title} className="rounded-2xl border bg-background p-4">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  <h2 className="mt-4 font-semibold">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
