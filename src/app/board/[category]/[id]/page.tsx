"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPostById, incrementPostViews, type Post, type BoardCategory } from "@/lib/boardActions";
import { Clock, Eye, ChevronLeft, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function PostDetailPage({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { category, id } = use(params) as { category: BoardCategory; id: string };
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      const data = await getPostById(id);
      if (!data) {
        alert("존재하지 않거나 삭제된 게시글입니다.");
        router.back();
        return;
      }
      setPost(data);
      setLoading(false);
      // 조회수 증가
      incrementPostViews(id);
    }
    loadPost();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="animate-pulse text-gray-400">게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* ── Header ── */}
      <section className="bg-[#1e3a5f] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <Link 
            href={`/board/${category}`}
            className="mb-6 flex items-center gap-1 text-sm font-medium text-blue-200 transition-colors hover:text-white"
          >
            <ChevronLeft className="size-4" />
            목록으로 돌아가기
          </Link>
          <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-blue-100/70">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{post.author_nickname}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {new Date(post.created_at).toLocaleDateString("ko-KR", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="size-4" />
              조회수 {post.views || 0}
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="mx-auto -mt-8 max-w-4xl px-6">
        <Card className="border-gray-200 shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-10">
            <article className="prose prose-slate max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-headings:text-gray-900">
              {/* 마크다운 지원 */}
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </article>
          </CardContent>
        </Card>

        {/* ── Footer Actions ── */}
        <div className="mt-10 flex justify-center">
          <Link href={`/board/${category}`}>
            <Button variant="outline" className="h-12 rounded-xl border-gray-300 px-8 font-bold text-gray-600 hover:bg-gray-50">
              목록보기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
