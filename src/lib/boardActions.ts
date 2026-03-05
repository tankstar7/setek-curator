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
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (nickname)
    `)
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getPosts] 에러:", error);
    return [];
  }

  return data.map(post => ({
    ...post,
    author_nickname: post.profiles?.nickname || "익명"
  }));
}

/** 게시글 단건 조회 */
export async function getPostById(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (nickname)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("[getPostById] 에러:", error);
    return null;
  }

  return {
    ...data,
    author_nickname: data.profiles?.nickname || "익명"
  };
}

/** 게시글 작성 */
export async function createPost(post: Omit<Post, "id" | "created_at" | "views" | "author_nickname">) {
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single();

  if (error) {
    console.error("[createPost] 에러:", error);
    throw error;
  }

  return data;
}

/** 조회수 증가 */
export async function incrementPostViews(id: string) {
  const { error } = await supabase.rpc("increment_post_views", { post_id: id });
  if (error) {
    // RPC가 없는 경우 fallback: 단순 update (동시성 문제 가능성 있으나 데모 수준에서 허용)
    const { data: current } = await supabase.from("posts").select("views").eq("id", id).single();
    if (current) {
      await supabase.from("posts").update({ views: (current.views || 0) + 1 }).eq("id", id);
    }
  }
}
