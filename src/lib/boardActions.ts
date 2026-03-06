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

/** 게시글 작성 (관리자 권한 우회 적용) */
export async function createPost(post: Omit<Post, "id" | "created_at" | "views" | "author_nickname" | "author_id">) {
  try {
    // 1. 현재 사용자 정보 확인
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("로그인이 필요합니다.");
    }

    // 2. 카테고리에 따른 클라이언트 분기 (notice, event는 Admin 권한 사용)
    const isAdminCategory = post.category === "notice" || post.category === "event";
    const client = isAdminCategory ? getSupabaseAdmin() : supabase;

    // 3. 게시글 저장 (author_id 명시)
    const { data, error } = await client
      .from("posts")
      .insert({
        ...post,
        author_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error("[createPost] DB 에러:", error.message, error.details);
      throw new Error(error.message);
    }

    return data;
  } catch (err: any) {
    console.error("[createPost] 예외 발생:", err.message);
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
