"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPostById, incrementPostViews, deletePost, type Post, type BoardCategory } from "@/lib/boardActions";
import { checkIsAdmin } from "@/lib/authUtils";
import { Clock, Eye, ChevronLeft, Calendar, Edit, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";

export default function PostDetailPage({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { category, id } = use(params) as { category: BoardCategory; id: string };
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadPost() {
      const data = await getPostById(id);
      if (!data) {
        alert("존재하지 않거나 삭제된 게시글입니다.");
        router.push(`/board/${category}`);
        return;
      }
      setPost(data);
      setLoading(false);
      // 조회수 증가
      incrementPostViews(id);
    }
    loadPost();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUser({ id: user.id, email: user.email });
        setIsAdmin(checkIsAdmin(user.email));
      }
    });
  }, [id, router, category]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return alert("로그인이 필요합니다.");
      
      await deletePost(id, session.access_token);
      alert("삭제되었습니다.");
      router.push(`/board/${category}`);
    } catch (err: any) {
      alert(err.message || "삭제 실패");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="animate-pulse text-gray-400">게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = currentUser?.id === post.author_id;
  const canEdit = isAdmin || isAuthor;
  const canDelete = isAdmin || (category === "inquiry" && isAuthor);

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
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href={`/board/${category}`}>
            <Button variant="outline" className="h-12 rounded-xl border-gray-300 px-8 font-bold text-gray-600 hover:bg-gray-50">
              목록보기
            </Button>
          </Link>

          {canEdit && (
            <Link href={`/board/${category}/${id}/edit`}>
              <Button variant="outline" className="h-12 rounded-xl border-blue-200 bg-blue-50/50 px-8 font-bold text-blue-600 hover:bg-blue-50">
                <Edit className="mr-2 size-4" />
                수정하기
              </Button>
            </Link>
          )}

          {canDelete && (
            <Button 
              onClick={handleDelete}
              variant="outline" 
              className="h-12 rounded-xl border-red-200 bg-red-50/50 px-8 font-bold text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 size-4" />
              삭제하기
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
