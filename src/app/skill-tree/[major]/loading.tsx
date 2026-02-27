import { Skeleton } from "@/components/ui/skeleton";

export default function SkillTreeLoading() {
  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      {/* Header skeleton */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-4 py-14">
        <div className="mx-auto max-w-4xl space-y-3">
          <Skeleton className="h-4 w-16 bg-white/10" />
          <Skeleton className="h-6 w-28 bg-white/10 rounded-full" />
          <Skeleton className="h-10 w-56 bg-white/10" />
          <Skeleton className="h-5 w-80 bg-white/10" />
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
        {/* 필수 과목 skeleton */}
        <section className="space-y-4">
          <Skeleton className="h-7 w-36" />
          <div className="rounded-xl border bg-white p-5 space-y-3">
            <Skeleton className="h-5 w-20" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full" />
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-5 space-y-3">
            <Skeleton className="h-5 w-28" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </section>

        {/* AI 추천 꿀조합 skeleton */}
        <section className="space-y-4">
          <Skeleton className="h-7 w-72" />
          <div className="rounded-xl border-2 border-blue-200 bg-white p-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border p-4 text-center space-y-2">
                  <Skeleton className="mx-auto h-8 w-8 rounded-full" />
                  <Skeleton className="mx-auto h-5 w-28" />
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-gray-50 p-4 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </section>

        {/* 추천 보고서 skeleton */}
        <section className="space-y-4">
          <Skeleton className="h-7 w-52" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border bg-white p-5 space-y-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
