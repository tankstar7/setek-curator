"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { PostList } from "@/components/board/PostList";
import { getPosts, type Post, type BoardCategory } from "@/lib/boardActions";
import { supabase } from "@/lib/supabase";
import { PenLine } from "lucide-react";

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const info = CATEGORY_MAP[category] || {
    label: "Board",
    title: "게시판",
    desc: "게시판 정보를 불러올 수 없습니다.",
  };

  useEffect(() => {
    async function init() {
      // 1. 유저 권한 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("account_tier")
          .eq("id", user.id)
          .maybeSingle();
        if (profile?.account_tier === "admin") setIsAdmin(true);
      }

      // 2. 게시글 목록 로드
      try {
        const data = await getPosts(category);
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [category]);

  const showWriteButton = category === "inquiry" || isAdmin;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-br from-[#0f2540] via-[#1e3a5f] to-[#2d5282] py-16 text-white mb-12">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <SectionTitle 
            label={info.label}
            title={info.title}
            description={info.desc}
            className="mb-0"
            titleClassName="text-white"
            descriptionClassName="text-blue-100/80" // 설명도 밝은 색으로
          />
          {/* SectionTitle 내부의 description 스타일 보완 (컴포넌트 수정 예정) */}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-6 flex justify-end">
          {showWriteButton && (
            <Link href={`/board/${category}/new`}>
              <Button className="bg-blue-600 font-bold text-white hover:bg-blue-700">
                <PenLine className="mr-2 size-4" />
                글쓰기
              </Button>
            </Link>
          )}
        </div>

        <PostList posts={posts} loading={loading} category={category} />
      </div>
    </main>
  );
}
