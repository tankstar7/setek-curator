"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const POPULAR_MAJORS = [
  "의예과", "기계공학과", "컴퓨터공학과", "화학공학과",
  "전기전자공학과", "생명공학과", "약학과", "항공우주공학과",
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (major: string) => {
    const target = major || query.trim();
    if (!target) return;
    router.push(`/skill-tree/${encodeURIComponent(target)}`);
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
          placeholder="희망 전공을 입력하세요 (예: 기계공학과, 의예과...)"
          className="h-14 rounded-xl border-white/20 bg-white/10 text-base text-white placeholder:text-blue-200 focus-visible:ring-blue-300 backdrop-blur-sm"
        />
        <Button
          onClick={() => handleSearch(query)}
          className="h-14 rounded-xl bg-blue-500 px-6 text-base font-semibold text-white hover:bg-blue-400 shrink-0"
        >
          검색
        </Button>
      </div>

      {/* 인기 전공 바로가기 */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-blue-200 self-center">인기 전공:</span>
        {POPULAR_MAJORS.map((major) => (
          <button
            key={major}
            onClick={() => handleSearch(major)}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-blue-100 transition-colors hover:bg-white/20 hover:text-white"
          >
            {major}
          </button>
        ))}
      </div>
    </div>
  );
}
