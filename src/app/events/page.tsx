"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { PostList } from "@/components/board/PostList";
import { getPosts, type Post } from "@/lib/boardActions";
import { supabase } from "@/lib/supabase";
import { PenLine } from "lucide-react";

export default function EventsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("account_tier")
          .eq("id", user.id)
          .maybeSingle();
        if (profile?.account_tier === "admin") setIsAdmin(true);
      }
      const data = await getPosts("event");
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
            label="Promotion"
            title="이벤트"
            description="진행 중인 이벤트와 혜택을 놓치지 마세요."
            className="mb-0"
            titleClassName="text-white"
          />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        {isAdmin && (
          <div className="mb-6 flex justify-end">
            <Link href="/board/event/new">
              <Button className="bg-blue-600 font-bold text-white hover:bg-blue-700">
                <PenLine className="mr-2 size-4" />
                이벤트 등록
              </Button>
            </Link>
          </div>
        )}
        <PostList posts={posts} loading={loading} category="event" />
      </div>
    </main>
  );
}
