import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-muted-foreground">404</p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">Page not found</h1>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </main>
  );
}
