import { supabase } from "./supabase";

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
}

/** 게시글 목록 조회 */
export async function getPosts(category: BoardCategory) {
  try {
    // Schema Cache 에러 방지를 위해 auth.users/profiles 조인 제거
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getPosts] Supabase 에러:", error.message);
      return [];
    }

    if (!data) return [];

    // 조인 제거로 인해 닉네임은 "익명"으로 통일하거나 추후 별도 쿼리 필요
    return data.map((post: any) => ({
      ...post,
      author_nickname: "익명" 
    }));
  } catch (err) {
    console.error("[getPosts] 예상치 못한 에러:", err);
    return [];
  }
}

/** 게시글 단건 조회 */
export async function getPostById(id: string) {
  try {
    // 조인 제거
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
export async function createPost(post: Omit<Post, "id" | "created_at" | "views" | "author_nickname" | "author_id">) {
  try {
    // RLS Violation 방지를 위해 서버 측에서 세션/유저 정보 재확인 및 author_id 강제 주입
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("로그인이 필요합니다.");
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        ...post,
        author_id: user.id // payload에 author_id 명시적 포함
      })
      .select()
      .single();

    if (error) {
      console.error("[createPost] DB 에러:", error.message);
      throw error;
    }

    return data;
  } catch (err: any) {
    console.error("[createPost] 에러:", err.message);
    throw err;
  }
}

/** 조회수 증가 */
export async function incrementPostViews(id: string) {
  try {
    const { error } = await supabase.rpc("increment_post_views", { post_id: id });
    if (error) {
      // RPC가 없는 경우 fallback: 단순 update
      const { data: current } = await supabase.from("posts").select("views").eq("id", id).single();
      if (current) {
        await supabase.from("posts").update({ views: (current.views || 0) + 1 }).eq("id", id);
      }
    }
  } catch (err) {
    console.error("[incrementPostViews] 에러:", err);
  }
}
