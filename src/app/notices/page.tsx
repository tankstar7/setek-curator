"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { PostList } from "@/components/board/PostList";
import { getPosts, type Post } from "@/lib/boardActions";
import { supabase } from "@/lib/supabase";
import { PenLine, Search, X } from "lucide-react";

export default function NoticesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  
  const [inputValue, setInputValue] = useState(searchQuery);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("account_tier")
          .eq("id", user.id)
          .maybeSingle();
        if (profile?.account_tier === "admin") setIsAdmin(true);
      }
    }
    init();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPosts("notice", searchQuery)
      .then((data) => { if (!cancelled) setPosts(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [searchQuery]);

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString());
    if (inputValue.trim()) params.set("q", inputValue.trim());
    else params.delete("q");
    router.push(`?${params.toString()}`, { scroll: false });
  }

  function clearSearch() {
    setInputValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans tracking-tight">
      <section className="bg-gradient-to-br from-[#0f2540] via-[#1e3a5f] to-[#2d5282] py-16 text-white mb-12">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <SectionTitle 
            label="Announcement"
            title="공지사항"
            description="세특큐레이터의 새로운 소식과 안내사항을 확인하세요."
            className="mb-0"
            titleClassName="text-white"
            descriptionClassName="text-blue-100/80"
          />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        {/* ── 툴바: 검색 + 글쓰기 (상시 노출) ── */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="공지사항 검색..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-9 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
            />
            {inputValue && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSearch} className="h-10 border-gray-200 px-4 text-sm font-semibold text-gray-600 sm:hidden">
              검색
            </Button>
            {isAdmin && (
              <Link href="/board/notice/new">
                <Button className="h-10 bg-blue-600 font-bold text-white hover:bg-blue-700">
                  <PenLine className="mr-2 size-4" />
                  공지 작성
                </Button>
              </Link>
            )}
          </div>
        </div>

        {searchQuery && !loading && (
          <p className="mb-3 text-sm text-gray-500">
            &quot;{searchQuery}&quot; 검색 결과 <span className="font-semibold text-[#1e3a5f]">{posts.length}건</span>
          </p>
        )}

        <PostList posts={posts} loading={loading} category="notice" />
      </div>
    </main>
  );
}
