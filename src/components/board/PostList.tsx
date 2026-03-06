"use client";

import Link from "next/link";
import { Eye, Pin, Trash2, PinOff, MoreHorizontal } from "lucide-react";
import type { Post, BoardCategory } from "@/lib/boardActions";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { deletePost, togglePin } from "@/lib/boardActions";
import { checkIsAdmin } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PostListProps {
  posts: Post[];
  loading: boolean;
  category: BoardCategory;
}

// ── 공통 테이블 헤더 ──────────────────────────────────────────────────────────
function TableHeader({ isAdmin }: { isAdmin: boolean }) {
  return (
    <thead>
      <tr className="border-b border-gray-200 bg-gray-50">
        <th className="w-[72px] px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
          구분
        </th>
        <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
          제목
        </th>
        <th className="hidden w-20 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-400 sm:table-cell">
          조회수
        </th>
        <th className="w-32 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
          작성일
        </th>
        <th className="w-24 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
          관리
        </th>
      </tr>
    </thead>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────────
export function PostList({ posts, loading, category }: PostListProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUser({ id: user.id, email: user.email });
        setIsAdmin(checkIsAdmin(user.email));
      }
    });
  }, []);

  const handleDelete = async (postId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return alert("로그인이 필요합니다.");
      
      await deletePost(postId, session.access_token);
      alert("삭제되었습니다.");
      router.refresh();
      window.location.reload(); // 리프레시 강제 (목록 갱신)
    } catch (err: any) {
      alert(err.message || "삭제 실패");
    }
  };

  const handleTogglePin = async (postId: string, currentPinned: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return alert("로그인이 필요합니다.");

      await togglePin(postId, !currentPinned, session.access_token);
      alert(currentPinned ? "고정 해제되었습니다." : "상단에 고정되었습니다.");
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "작업 실패");
    }
  };

  // 번호 계산: 고정 글 제외한 역순 번호
  const regularCount = posts.filter((p) => !p.is_pinned).length;
  let regularIndex = 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <TableHeader isAdmin={isAdmin} />

          <tbody>
            {/* ── 로딩 스켈레톤 ── */}
            {loading && (
              <>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-4">
                      <div className="mx-auto h-4 w-8 animate-pulse rounded bg-gray-100" />
                    </td>
                    <td className="px-2 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                    </td>
                    <td className="hidden px-2 py-4 sm:table-cell">
                      <div className="mx-auto h-4 w-10 animate-pulse rounded bg-gray-100" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-100" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="mx-auto h-4 w-10 animate-pulse rounded bg-gray-100" />
                    </td>
                  </tr>
                ))}
              </>
            )}

            {/* ── 데이터 없음 ── */}
            {!loading && posts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <p className="text-2xl mb-2">📭</p>
                  <p className="text-sm text-gray-400">등록된 게시글이 없습니다.</p>
                </td>
              </tr>
            )}

            {/* ── 게시글 행 ── */}
            {!loading && posts.map((post) => {
              const isPinned = Boolean(post.is_pinned);
              const rowNum = isPinned ? null : regularCount - regularIndex++;
              const isAuthor = currentUser?.id === post.author_id;
              const canDelete = isAdmin || (category === "inquiry" && isAuthor);

              return (
                <tr
                  key={post.id}
                  className={`group border-b border-gray-100 transition-colors last:border-0 hover:bg-blue-50/40 ${
                    isPinned ? "bg-violet-50/30" : ""
                  }`}
                >
                  {/* 번호 / 공지 배지 */}
                  <td className="w-[72px] px-4 py-4 text-center">
                    {isPinned ? (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        <Pin className="size-2.5" />
                        공지
                      </span>
                    ) : (
                      <span className="text-sm tabular-nums text-gray-400">{rowNum}</span>
                    )}
                  </td>

                  {/* 제목 */}
                  <td className="py-4 pr-2">
                    <Link href={`/board/${category}/${post.id}`} className="block">
                      <p
                        className={`line-clamp-1 text-sm leading-snug transition-colors group-hover:text-[#1e3a5f] ${
                          isPinned ? "font-bold text-gray-900" : "font-medium text-gray-800"
                        }`}
                      >
                        {post.title}
                      </p>
                      {/* 모바일 전용 서브라인 */}
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-gray-400 sm:hidden">
                        <span className="flex items-center gap-0.5">
                          <Eye className="size-3" />
                          {(post.views || 0).toLocaleString()}
                        </span>
                        <span>·</span>
                        <span className="whitespace-nowrap">
                          {new Date(post.created_at).toLocaleDateString("ko-KR", {
                            year: "2-digit",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </span>
                      </p>
                    </Link>
                  </td>

                  {/* 조회수 (데스크톱) */}
                  <td className="hidden w-20 py-4 text-center sm:table-cell">
                    <Link href={`/board/${category}/${post.id}`} className="flex items-center justify-center gap-1 text-sm text-gray-400">
                      <Eye className="size-3.5" />
                      {(post.views || 0).toLocaleString()}
                    </Link>
                  </td>

                  {/* 작성일 (데스크톱) */}
                  <td className="hidden w-32 px-6 py-4 text-right sm:table-cell whitespace-nowrap">
                    <Link href={`/board/${category}/${post.id}`} className="text-sm text-gray-400">
                      {new Date(post.created_at).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </Link>
                  </td>

                  {/* 관리 컬럼 */}
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {isAdmin && (
                        <button
                          onClick={() => handleTogglePin(post.id, isPinned)}
                          className={`p-1.5 rounded-md transition-colors ${
                            isPinned ? "text-violet-600 hover:bg-violet-100" : "text-gray-300 hover:bg-gray-100 hover:text-gray-500"
                          }`}
                          title={isPinned ? "고정 해제" : "상단 고정"}
                        >
                          {isPinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
                        </button>
                      )}
                      {canDelete ? (
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      ) : (
                        <span className="p-1.5 text-gray-200">
                          <MoreHorizontal className="size-4" />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
