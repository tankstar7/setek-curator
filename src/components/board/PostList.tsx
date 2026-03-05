"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Eye, ChevronRight } from "lucide-react";
import type { Post, BoardCategory } from "@/lib/boardActions";

interface PostListProps {
  posts: Post[];
  loading: boolean;
  category: BoardCategory;
}

export function PostList({ posts, loading, category }: PostListProps) {
  if (loading) {
    return <div className="py-20 text-center text-gray-400">데이터를 불러오는 중입니다...</div>;
  }

  if (posts.length === 0) {
    return <div className="py-20 text-center text-gray-400">등록된 게시글이 없습니다.</div>;
  }

  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/board/${category}/${post.id}`}
              className="group flex items-center justify-between p-6 transition-colors hover:bg-gray-50"
            >
              <div className="flex-1 pr-4">
                <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="font-medium text-gray-600">{post.author_nickname}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="size-3.5" />
                    {post.views || 0}
                  </span>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-300 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
