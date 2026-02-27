"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { standardMajors } from "@/lib/data/standardMajors";
import type { StandardMajor } from "@/lib/data/standardMajors";

// ── 태그 표시용 단축 이름 ─────────────────────────────────────────────────────
const SHORT_NAMES: Record<string, string> = {
  mechanical:                     "기계·모빌리티",
  electrical:                     "전기·전자·반도체",
  cs:                             "컴퓨터·AI·데이터",
  chemical:                       "화학·신소재",
  bio:                            "생명·바이오",
  medical:                        "의약학",
  "architecture-civil":           "건축·토목·도시",
  "industrial-system":            "산업·시스템",
  "natural-science-math-physics": "수리·물리",
  "environment-energy":           "환경·에너지",
  "health-rehab":                 "보건·재활",
  "nursing":                      "간호",
  "food-nutrition":               "식품·영양",
  "cosmetics-fine-chem":          "화장품·정밀화학",
  "agri-animal-resource":         "농생명·동물자원",
  "earth-marine-atmos":           "지구·대기·해양",
  "edu-math-science":             "수리·과학 교육",
  "nuclear-quantum":              "원자력·양자",
  "shipbuilding-naval":           "조선해양",
  "defense-aerospace":            "국방·방산",
};

// ── 검색 로직: Longest Keyword Match ─────────────────────────────────────────
// 모든 계열의 keywords를 탐색한 뒤, 가장 길이가 긴 키워드를 가진 계열을 반환.
// (예: "물리치료" 검색 시 "물리"(2글자)보다 "물리치료"(4글자)가 긴 계열이 우선)
function findMajor(query: string): StandardMajor | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  let bestMatch: StandardMajor | null = null;
  let bestLen = 0;

  for (const major of standardMajors) {
    for (const kw of major.keywords) {
      const kwLower = kw.toLowerCase();
      if (q.includes(kwLower) && kwLower.length > bestLen) {
        bestLen = kwLower.length;
        bestMatch = major;
      }
    }
  }

  return bestMatch;
}

export default function SearchSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (input: string) => {
    const q = input.trim();
    if (!q) return;
    const found = findMajor(q);
    if (found) {
      setNotFound(false);
      router.push(`/major-result/${found.id}`);
    } else {
      setNotFound(true);
    }
  };

  const handleTagClick = (major: StandardMajor) => {
    setNotFound(false);
    router.push(`/major-result/${major.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      {/* 검색 입력 */}
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setNotFound(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
          placeholder="희망 전공 계열을 입력하세요 (예: 기계, AI, 의예과...)"
          className="h-14 rounded-xl border-white/20 bg-white/10 text-base text-white placeholder:text-blue-200 focus-visible:ring-blue-300 backdrop-blur-sm"
        />
        <Button
          onClick={() => handleSearch(query)}
          className="h-14 shrink-0 rounded-xl bg-blue-500 px-6 text-base font-semibold text-white hover:bg-blue-400"
        >
          검색
        </Button>
      </div>

      {/* 인기 계열 태그 */}
      <div className="flex flex-wrap gap-2">
        <span className="self-center text-xs text-blue-200">인기 계열:</span>
        {standardMajors.map((m) => (
          <button
            key={m.id}
            onClick={() => handleTagClick(m)}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-blue-100 transition-colors hover:bg-white/20 hover:text-white"
          >
            {SHORT_NAMES[m.id] ?? m.categoryName}
          </button>
        ))}
      </div>

      {/* 검색 결과 없음 인라인 메시지 */}
      {notFound && (
        <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white backdrop-blur-sm">
          <p className="text-sm font-semibold">
            &apos;{query}&apos;에 해당하는 계열을 찾지 못했어요.
          </p>
          <p className="mt-0.5 text-xs text-blue-200">
            위 계열 태그를 클릭하거나 다른 키워드로 검색해 보세요.
          </p>
        </div>
      )}
    </div>
  );
}
