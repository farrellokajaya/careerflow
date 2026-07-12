import { Skeleton } from "@/components/ui/skeleton";

const companySkeletonItems = [1, 2, 3, 4, 5, 6];

export default function CompaniesLoading() {
  return (
    <main
      className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
      aria-busy="true"
      aria-label="Memuat Company Management"
    >
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-xl" />
              <Skeleton className="h-6 w-44 rounded-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-9 w-48 max-w-full" />
              <Skeleton className="h-5 w-[34rem] max-w-full" />
            </div>
          </div>

          <Skeleton className="h-10 w-40" />
        </section>

        <section className="flex flex-wrap items-center gap-2" aria-hidden="true">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>

            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-10 min-w-0 flex-1" />
            <Skeleton className="h-10 w-full sm:w-24" />
          </div>

          <Skeleton className="mt-3 h-3 w-56 max-w-full" />
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3" aria-hidden="true">
            {companySkeletonItems.map((item) => (
              <div
                key={item}
                className="flex min-h-80 flex-col rounded-xl border bg-card p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Skeleton className="size-11 shrink-0 rounded-xl" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-6 w-36 max-w-full" />
                    <Skeleton className="h-4 w-28 max-w-full" />
                  </div>

                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                <div className="mt-6 space-y-4">
                  <Skeleton className="h-4 w-40 max-w-full" />
                  <Skeleton className="h-4 w-48 max-w-full" />
                  <Skeleton className="h-4 w-32 max-w-full" />
                  <Skeleton className="h-4 w-44 max-w-full" />
                </div>

                <div className="mt-auto space-y-4 pt-6">
                  <Skeleton className="h-4 w-36 max-w-full" />

                  <div className="flex gap-2 border-t pt-4">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <span className="sr-only">Memuat data company...</span>
      </div>
    </main>
  );
}
