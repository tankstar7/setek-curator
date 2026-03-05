"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { PostList } from "@/components/board/PostList";
import { getPosts, type Post } from "@/lib/boardActions";
import { supabase } from "@/lib/supabase";
import { PenLine } from "lucide-react";

export default function InquiryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const data = await getPosts("inquiry");
      setPosts(data);
      setLoading(false);
    }
    init();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans tracking-tight">
      <section className="bg-gradient-to-br from-[#0f2540] via-[#1e3a5f] to-[#2d5282] py-16 text-white mb-12">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <SectionTitle 
            label="Support"
            title="고객센터"
            description="궁금한 점이나 건의사항을 남겨주시면 정성껏 답변해 드립니다."
            className="mb-0"
            titleClassName="text-white"
          />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-6 flex justify-end">
          <Link href="/board/inquiry/new">
            <Button className="bg-blue-600 font-bold text-white hover:bg-blue-700">
              <PenLine className="mr-2 size-4" />
              문의하기
            </Button>
          </Link>
        </div>
        <PostList posts={posts} loading={loading} category="inquiry" />
      </div>
    </main>
  );
}
