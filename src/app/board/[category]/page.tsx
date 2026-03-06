"use client";

export const dynamic = "force-dynamic";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { PostList } from "@/components/board/PostList";
import { getPosts, type Post, type BoardCategory } from "@/lib/boardActions";
import { checkIsAdmin } from "@/lib/authUtils";
import { supabase } from "@/lib/supabase";
import { PenLine, Search, X } from "lucide-react";

const CATEGORY_MAP: Record<BoardCategory, { label: string; title: string; desc: string }> = {
  notice: {
    label: "Announcement",
    title: "공지사항",
    desc: "세특큐레이터의 새로운 소식과 안내사항을 확인하세요.",
  },
  event: {
    label: "Promotion",
    title: "이벤트",
    desc: "진행 중인 이벤트와 혜택을 놓치지 마세요.",
  },
  inquiry: {
    label: "Support",
    title: "고객센터",
    desc: "궁금한 점이나 건의사항을 남겨주시면 정성껏 답변해 드립니다.",
  },
};

export default function BoardListPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params) as { category: BoardCategory };
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL의 ?q= 에서 검색어 읽기
  const searchQuery = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(searchQuery);

  const [posts, setPosts]       = useState<Post[]>([]);
  const [loading, setLoading]   = useState(true);
  const [isAdmin, setIsAdmin]   = useState(false);

  const info = CATEGORY_MAP[category] ?? {
    label: "Board",
    title: "게시판",
    desc: "게시판 정보를 불러올 수 없습니다.",
  };

  // URL이 바뀌면 (뒤로 가기 등) input 동기화
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // ── 어드민 권한 확인 (카테고리 변경 시만 재실행) ──────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsAdmin(checkIsAdmin(user.email));
      }
    });
  }, [category]);

  // ── 게시글 패칭 (카테고리 or 검색어 변경 시 재실행) ──────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getPosts(category, searchQuery)
      .then((data) => {
        if (!cancelled) setPosts(data);
      })
      .catch((err) => console.error("Failed to fetch posts:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [category, searchQuery]);

  // ── 검색 실행 (Enter 또는 버튼 클릭) ──────────────────────────────────────
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

  const showWriteButton = category === "inquiry" || isAdmin;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#0f2540] via-[#1e3a5f] to-[#2d5282] py-16 text-white mb-12">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <SectionTitle
            label={info.label}
            title={info.title}
            description={info.desc}
            className="mb-0"
            titleClassName="text-white"
            descriptionClassName="text-blue-100/80"
          />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        {/* ── 툴바: 검색 + 글쓰기 ── */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* 검색창 */}
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="제목 또는 내용 검색..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-9 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
            />
            {inputValue && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="검색어 지우기"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* 검색 버튼 (모바일용 명시 버튼) */}
            <Button
              variant="outline"
              onClick={handleSearch}
              className="h-10 border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:border-[#1e3a5f] hover:text-[#1e3a5f] sm:hidden"
            >
              검색
            </Button>

            {showWriteButton && (
              <Link href={`/board/${category}/new`}>
                <Button className="h-10 bg-blue-600 font-bold text-white hover:bg-blue-700">
                  <PenLine className="mr-2 size-4" />
                  글쓰기
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* 검색 결과 안내 */}
        {searchQuery && !loading && (
          <p className="mb-3 text-sm text-gray-500">
            <span className="font-semibold text-gray-800">&quot;{searchQuery}&quot;</span> 검색 결과{" "}
            <span className="font-semibold text-[#1e3a5f]">{posts.length}건</span>
          </p>
        )}

        <PostList posts={posts} loading={loading} category={category} />
      </div>
    </main>
  );
}
