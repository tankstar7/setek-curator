"use server";

import { supabase } from "./supabase";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { checkIsAdmin } from "./authUtils";

export type BoardCategory = "notice" | "event" | "inquiry";

/** 게시글 목록 조회 (is_pinned 우선, 최신순, 키워드 검색 지원) */
export async function getPosts(category: BoardCategory, searchQuery?: string) {
  try {
    let query = supabase
      .from("posts")
      .select("*")
      .eq("category", category)
      .order("is_pinned", { ascending: false })
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

/** 게시글 작성 */
export async function createPost(
  post: Omit<Post, "id" | "created_at" | "views" | "author_nickname" | "author_id">,
  token: string
) {
  try {
    if (!token) throw new Error("인증 토큰이 누락되었습니다.");

    const admin = getSupabaseAdmin();
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error(`인증 실패: ${authError?.message || "로그인 세션이 만료되었습니다."}`);
    }

    const userId = user.id;
    const isAdmin = checkIsAdmin(user.email);
    
    // notice, event는 관리자만 작성 가능
    if ((post.category === "notice" || post.category === "event") && !isAdmin) {
      throw new Error("관리자만 작성할 수 있는 게시판입니다.");
    }

    const client = isAdmin ? admin : supabase;

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

    if (dbError) throw new Error(`DB 저장 실패: ${dbError.message}`);

    return data;
  } catch (err: any) {
    console.error("[createPost] 에러:", err.message);
    throw err;
  }
}

/** 게시글 수정 */
export async function updatePost(
  id: string,
  post: Partial<Omit<Post, "id" | "created_at" | "views" | "author_nickname" | "author_id">>,
  token: string
) {
  try {
    if (!token) throw new Error("인증 토큰이 누락되었습니다.");

    const admin = getSupabaseAdmin();
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    
    if (authError || !user) throw new Error("인증 실패");

    // 원본 게시글 확인
    const { data: original, error: getError } = await supabase
      .from("posts")
      .select("author_id, category")
      .eq("id", id)
      .single();

    if (getError || !original) throw new Error("게시글을 찾을 수 없습니다.");

    const isAdmin = checkIsAdmin(user.email);
    const isAuthor = original.author_id === user.id;

    if (!isAdmin && !isAuthor) {
      throw new Error("수정 권한이 없습니다.");
    }

    const client = isAdmin ? admin : supabase;

    const { data, error: dbError } = await client
      .from("posts")
      .update({
        title: post.title,
        content: post.content,
        category: post.category,
      })
      .eq("id", id)
      .select()
      .single();

    if (dbError) throw new Error(`DB 수정 실패: ${dbError.message}`);

    return data;
  } catch (err: any) {
    console.error("[updatePost] 에러:", err.message);
    throw err;
  }
}

/** 게시글 삭제 */
export async function deletePost(id: string, token: string) {
  try {
    if (!token) throw new Error("인증 토큰이 누락되었습니다.");

    const admin = getSupabaseAdmin();
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    
    if (authError || !user) throw new Error("인증 실패");

    const { data: original, error: getError } = await supabase
      .from("posts")
      .select("author_id, category")
      .eq("id", id)
      .single();

    if (getError || !original) throw new Error("게시글을 찾을 수 없습니다.");

    const isAdmin = checkIsAdmin(user.email);
    const isAuthor = original.author_id === user.id;

    // 일반 유저는 inquiry 게시판의 본인 글만 삭제 가능
    if (!isAdmin) {
      if (original.category !== "inquiry" || !isAuthor) {
        throw new Error("삭제 권한이 없습니다.");
      }
    }

    const client = isAdmin ? admin : supabase;
    const { error: dbError } = await client.from("posts").delete().eq("id", id);

    if (dbError) throw new Error(`DB 삭제 실패: ${dbError.message}`);

    return { success: true };
  } catch (err: any) {
    console.error("[deletePost] 에러:", err.message);
    throw err;
  }
}

/** 상단 고정 토글 (관리자 전용) */
export async function togglePin(id: string, isPinned: boolean, token: string) {
  try {
    if (!token) throw new Error("인증 토큰이 누락되었습니다.");

    const admin = getSupabaseAdmin();
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    
    if (authError || !user) throw new Error("인증 실패");

    const isAdmin = checkIsAdmin(user.email);
    if (!isAdmin) throw new Error("관리자 권한이 필요합니다.");

    const { error: dbError } = await admin
      .from("posts")
      .update({ is_pinned: isPinned })
      .eq("id", id);

    if (dbError) throw new Error(`고정 상태 변경 실패: ${dbError.message}`);

    return { success: true };
  } catch (err: any) {
    console.error("[togglePin] 에러:", err.message);
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
