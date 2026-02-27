export default function MypageLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-4 py-12">
        <div className="mx-auto max-w-4xl flex items-center gap-5">
          <div className="h-16 w-16 animate-pulse rounded-full bg-white/20" />
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
            <div className="h-7 w-32 animate-pulse rounded bg-white/20" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <div className="h-32 animate-pulse rounded-xl bg-white border border-gray-200" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-white border border-gray-200" />
          ))}
        </div>
        <div className="h-24 animate-pulse rounded-xl bg-white border border-gray-200" />
      </div>
    </main>
  );
}
