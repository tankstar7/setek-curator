export default function ExplorerLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-4 py-14">
        <div className="mx-auto max-w-4xl text-center space-y-3">
          <div className="mx-auto h-6 w-24 animate-pulse rounded-full bg-white/20" />
          <div className="mx-auto h-10 w-80 animate-pulse rounded-lg bg-white/20" />
          <div className="mx-auto h-5 w-96 animate-pulse rounded-lg bg-white/10" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-white border border-gray-200" />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-xl bg-white border border-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
