export default function Loading() {
  return (
    <main className="mx-auto flex min-h-svh max-w-7xl items-center justify-center px-6">
      <div className="w-full max-w-md space-y-4" aria-label="Loading page">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
      </div>
    </main>
  );
}
