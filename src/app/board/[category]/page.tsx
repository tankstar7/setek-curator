"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { PostList } from "@/components/board/PostList";
import { getPosts, type Post, type BoardCategory } from "@/lib/boardActions";
import { supabase } from "@/lib/supabase";
import { PenLine } from "lucide-react";

// ... (CATEGORY_MAP 동일) ...

export default function BoardListPage({ params }: { params: Promise<{ category: string }> }) {
  // ... (기존 로직 동일) ...

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-br from-[#0f2540] via-[#1e3a5f] to-[#2d5282] py-16 text-white mb-12">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <SectionTitle 
            label={info.label}
            title={info.title}
            description={info.desc}
            className="mb-0"
            titleClassName="text-white" // 제목을 흰색으로
          />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-6 flex justify-end">
          {showWriteButton && (
            <Link href={`/board/${category}/new`}>
              <Button className="bg-blue-600 font-bold text-white hover:bg-blue-700">
                <PenLine className="mr-2 size-4" />
                글쓰기
              </Button>
            </Link>
          )}
        </div>

        <PostList posts={posts} loading={loading} category={category} />
      </div>
    </main>
  );
}
