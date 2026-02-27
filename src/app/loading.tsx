import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero skeleton */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#2d5282] to-[#1a3a6b] px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <Skeleton className="mx-auto h-6 w-48 bg-white/10" />
          <Skeleton className="mx-auto h-14 w-3/4 bg-white/10" />
          <Skeleton className="mx-auto h-6 w-2/3 bg-white/10" />
          <Skeleton className="mx-auto h-14 w-full max-w-2xl bg-white/10 rounded-xl" />
        </div>
      </section>

      {/* Lead magnet skeleton */}
      <section className="bg-blue-600 px-4 py-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-24 bg-white/20" />
            <Skeleton className="h-7 w-72 bg-white/20" />
          </div>
          <Skeleton className="h-10 w-32 bg-white/20 rounded-lg shrink-0" />
        </div>
      </section>

      {/* Stats skeleton */}
      <section className="border-b bg-white px-4 py-6">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 text-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </section>

      {/* Trending cards skeleton */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border bg-white p-5 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
