export default function GuideLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center space-y-3">
          <div className="mx-auto h-6 w-28 animate-pulse rounded-full bg-white/20" />
          <div className="mx-auto h-10 w-96 animate-pulse rounded-lg bg-white/20" />
          <div className="mx-auto h-5 w-80 animate-pulse rounded-lg bg-white/10" />
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
        <div className="h-72 animate-pulse rounded-xl bg-white border border-gray-200" />
        <div className="grid gap-5 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-white border border-gray-200" />
          ))}
        </div>
      </div>
    </main>
  );
}
