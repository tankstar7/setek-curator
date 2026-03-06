"use server";

import { supabase } from "./supabase";
import { getSupabaseAdmin } from "./supabaseAdmin";

export type BoardCategory = "notice" | "event" | "inquiry";

export interface Post {
  id: string;
  category: BoardCategory;
  title: string;
  content: string;
  author_id: string;
  author_nickname?: string;
  created_at: string;
  views: number;
  is_pinned?: boolean;
}

/** 게시글 목록 조회 (is_pinned 우선, 최신순, 키워드 검색 지원) */
export async function getPosts(category: BoardCategory, searchQuery?: string) {
  try {
    let query = supabase
      .from("posts")
      .select("*")
      .eq("category", category)
      .order("is_pinned", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (searchQuery?.trim()) {
      const q = searchQuery.trim();
      query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getPosts] Supabase 에러:", error.message);
      return [];
    }

    if (!data) return [];

    return data.map((post: any) => ({
      ...post,
      author_nickname: "익명",
    }));
  } catch (err) {
    console.error("[getPosts] 예상치 못한 에러:", err);
    return [];
  }
}

/** 게시글 단건 조회 */
export async function getPostById(id: string) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[getPostById] 에러:", error.message);
      return null;
    }

    return {
      ...data,
      author_nickname: "익명"
    };
  } catch (err) {
    console.error("[getPostById] 에러:", err);
    return null;
  }
}

/** 게시글 작성 (인증 토큰 직접 검증 및 상세 에러 노출) */
export async function createPost(
  post: Omit<Post, "id" | "created_at" | "views" | "author_nickname" | "author_id">,
  token: string // 클라이언트에서 넘겨준 access_token
) {
  try {
    if (!token) throw new Error("인증 토큰이 누락되었습니다.");

    // 1. 유저 신원 확보 (Admin Client를 사용해 토큰 직접 검증)
    // Server Action에서는 브라우저 쿠키 세션이 공유되지 않을 수 있어 토큰 검증이 가장 확실합니다.
    const admin = getSupabaseAdmin();
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    
    if (authError || !user) {
      console.error("[createPost] 토큰 검증 실패:", authError?.message);
      throw new Error(`인증 실패: ${authError?.message || "로그인 세션이 만료되었습니다. 다시 로그인해 주세요."}`);
    }

    const userId = user.id;
    console.log(`[createPost] 유저 검증 성공: ${userId}, 카테고리: ${post.category}`);

    // 2. 클라이언트 분기 (notice, event는 Admin 권한으로 RLS 우회)
    const isAdminCategory = post.category === "notice" || post.category === "event";
    const client = isAdminCategory ? admin : supabase;

    // 3. 데이터 인서트 (author_id 직접 주입)
    const { data, error: dbError } = await client
      .from("posts")
      .insert({
        category: post.category,
        title:    post.title,
        content:  post.content,
        author_id: userId,
      })
      .select()
      .single();

    if (dbError) {
      console.error(`[createPost] DB 에러 상세:`, dbError);
      const detailMsg = dbError.details ? ` (${dbError.details})` : "";
      const hintMsg = dbError.hint ? ` [Hint: ${dbError.hint}]` : "";
      throw new Error(`DB 저장 실패: ${dbError.message}${detailMsg}${hintMsg}`);
    }

    return data;
  } catch (err: any) {
    console.error("[createPost] 최종 예외 발생:", err.message);
    throw err;
  }
}

/** 조회수 증가 */
export async function incrementPostViews(id: string) {
  try {
    const { error } = await supabase.rpc("increment_post_views", { post_id: id });
    if (error) {
      const { data: current } = await supabase.from("posts").select("views").eq("id", id).single();
      if (current) {
        await supabase.from("posts").update({ views: (current.views || 0) + 1 }).eq("id", id);
      }
    }
  } catch (err) {
    console.error("[incrementPostViews] 에러:", err);
  }
}
