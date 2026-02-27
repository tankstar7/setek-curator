import { Skeleton } from "@/components/ui/skeleton";

export default function GenerateLoading() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header skeleton */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-2">
          <Skeleton className="h-6 w-28 bg-white/10 rounded-full" />
          <Skeleton className="h-9 w-56 bg-white/10" />
          <Skeleton className="h-4 w-80 bg-white/10" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* 좌측 패널 skeleton */}
          <aside className="w-full shrink-0 space-y-4 lg:w-72">
            <div className="rounded-xl border bg-white p-5 space-y-4">
              <Skeleton className="h-5 w-32" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              ))}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-6 w-20 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* 우측 패널 skeleton */}
          <section className="flex-1 space-y-5">
            <div className="rounded-xl border bg-white p-5 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-40" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border bg-white p-5 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
