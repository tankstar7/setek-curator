"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPostById, updatePost, type BoardCategory } from "@/lib/boardActions";
import { checkIsAdmin } from "@/lib/authUtils";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Save } from "lucide-react";

export default function EditPostPage({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { category, id } = use(params) as { category: BoardCategory; id: string };
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("로그인이 필요합니다.");
        router.replace("/login");
        return;
      }

      const post = await getPostById(id);
      if (!post) {
        alert("게시글을 찾을 수 없습니다.");
        router.replace(`/board/${category}`);
        return;
      }

      const isAdmin = checkIsAdmin(user.email);
      const isAuthor = post.author_id === user.id;

      if (!isAdmin && !isAuthor) {
        alert("수정 권한이 없습니다.");
        router.replace(`/board/${category}/${id}`);
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setLoading(false);
    }
    init();
  }, [category, id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해 주세요.");
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert("로그인 세션이 유효하지 않습니다.");
        return;
      }

      await updatePost(id, {
        title: title.trim(),
        content: content.trim(),
      }, token);

      alert("게시글이 수정되었습니다.");
      router.push(`/board/${category}/${id}`);
      router.refresh();
    } catch (err: any) {
      alert(`수정 실패: ${err.message || "오류가 발생했습니다."}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="animate-pulse text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans">
      <section className="bg-[#1e3a5f] py-12 text-white">
        <div className="mx-auto max-w-3xl px-6">
          <button 
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-1 text-sm font-medium text-blue-200 transition-colors hover:text-white"
          >
            <ChevronLeft className="size-4" />
            뒤로 가기
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight">글 수정하기</h1>
          <p className="mt-2 text-blue-100/70">게시글 내용을 수정해 주세요.</p>
        </div>
      </section>

      <div className="mx-auto -mt-8 max-w-3xl px-6">
        <Card className="border-gray-200 shadow-xl rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-bold text-gray-700 ml-1">제목</Label>
                <Input 
                  id="title"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-bold text-gray-700 ml-1">내용</Label>
                <textarea 
                  id="content"
                  rows={15}
                  placeholder="내용을 입력하세요 (마크다운 지원)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 min-h-[300px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="h-14 flex-1 rounded-xl border-gray-300 font-bold text-gray-600"
                >
                  취소
                </Button>
                <Button 
                  type="submit"
                  disabled={saving}
                  className="h-14 flex-[2] rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {saving ? "수정 중..." : (
                    <>
                      <Save className="mr-2 size-5" />
                      수정 완료
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
