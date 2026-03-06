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

/** 게시글 작성 (관리자 권한 우회 로직 완벽 재구성) */
export async function createPost(post: Omit<Post, "id" | "created_at" | "views" | "author_nickname" | "author_id">) {
  try {
    // 1. 유저 신원 확보 (일반 클라이언트 사용)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("[createPost] 인증 실패:", authError?.message);
      throw new Error("로그인이 필요합니다.");
    }

    const userId = user.id;
    console.log(`[createPost] 유저 확보 성공: ${userId}, 카테고리: ${post.category}`);

    // 2. 마스터키 적용 및 클라이언트 분기
    const isAdminCategory = post.category === "notice" || post.category === "event";
    
    // notice나 event일 경우 Admin Client(Service Role Key) 생성하여 RLS 우회
    const client = isAdminCategory ? getSupabaseAdmin() : supabase;

    // 3. 데이터 인서트 (author_id 직접 명시 필수)
    const { data, error: dbError } = await client
      .from("posts")
      .insert({
        category: post.category,
        title:    post.title,
        content:  post.content,
        author_id: userId, // 확보한 유저 ID를 직접 주입
      })
      .select()
      .single();

    if (dbError) {
      console.error(`[createPost] DB 저장 에러 (${post.category}):`, dbError.message, dbError.details);
      throw new Error(`저장 실패: ${dbError.message}`);
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
