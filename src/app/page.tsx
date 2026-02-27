"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchSection from "@/components/SearchSection";
import { getTrendingReports } from "@/lib/db";
import type { Report } from "@/lib/db";
import { useEffect, useState } from 'react'; // useState 추가

export default function Home() {
  const [trending, setTrending] = useState<Report[]>([]);

  // 1. 카톡 탈출 및 데이터 가져오기 로직
  useEffect(() => {
    // 카톡 탈출 체크
    const isKakao = /KAKAOTALK/i.test(navigator.userAgent);
    if (isKakao) {
      window.location.href = `kakaotalk://web/openExternalApp/?url=${encodeURIComponent(window.location.href)}`;
      return;
    }

    // 트렌딩 데이터 가져오기
    getTrendingReports(10).then(data => setTrending(data));
  }, []);

  // 2. 이모지 함수
  function subjectEmoji(subject: string) {
    const map: Record<string, string> = {
      화학: "🧪", 물리학: "⚡", 생명과학: "🧬",
      지구과학: "🌍", 수학: "📐", 정보: "💻",
    };
    return map[subject] || "📚";
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#2d5282] to-[#1a3a6b] px-4 py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-blue-500/20 text-blue-200 border-blue-400/30 hover:bg-blue-500/30">
            🎓 2022 개정 교육과정 완벽 반영
          </Badge>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            이공계 진로,{" "}
            <span className="text-blue-300">세특으로</span> 완성하다
          </h1>
          <p className="mb-8 text-lg text-blue-100 sm:text-xl">
            희망 전공을 입력하면{" "}
            <strong className="text-white">22개정 필수 과목 조합</strong>과{" "}
            <strong className="text-white">맞춤 세특 탐구 주제</strong>를 바로 확인하세요.
            <br className="hidden sm:block" />
            현직 연구원이 설계한 심화 탐구로 생기부를 차별화하세요.
          </p>
          <SearchSection />
          <p className="mt-6 text-xs text-blue-300">
            현재 <span className="font-bold text-white">의약학 · 공학 · 자연과학</span> 계열 전공 지원 중
          </p>
        </div>
      </section>

      {/* ── Lead Magnet Section ── */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-white">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">무료 자료 공개</p>
            <h2 className="mt-1 text-xl font-bold">📋 15개정 vs 22개정 교육과정 비교표 보기</h2>
            <p className="mt-1 text-sm text-blue-100">무엇이 바뀌었는지, 어떤 과목을 들어야 하는지 한눈에 파악하세요.</p>
          </div>
          <Link href="/guide">
            <Button className="shrink-0 bg-white text-blue-700 font-semibold hover:bg-blue-50">
              무료 비교표 확인 →
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-b bg-white px-4 py-6">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 text-center">
          {[
            { value: "120+", label: "세특 탐구 주제" },
            { value: "30+", label: "지원 전공" },
            { value: "8종", label: "교과서 출판사 맞춤" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-extrabold text-[#1e3a5f] sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trending Section ── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">🔥 실시간 트렌드 세특 TOP 10</h2>
              <p className="mt-1 text-sm text-gray-500">현직 연구원이 직접 검증한 고퀄리티 탐구 주제</p>
            </div>
            <Link href="/explorer">
              <Button variant="outline" size="sm" className="hidden sm:flex border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white">
                전체 탐색 →
              </Button>
            </Link>
          </div>

          {trending.length === 0 ? (
            <p className="text-center text-gray-400 py-12">데이터를 불러오는 중입니다...</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {trending.map((report, index) => (
                <Link key={report.id} href={`/lab?keyword=${encodeURIComponent(report.trend_keyword)}`}>
                  <Card className="group h-full cursor-pointer border-gray-200 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-3xl">{subjectEmoji(report.subject)}</span>
                        <span className="text-4xl font-black text-gray-100">#{index + 1}</span>
                      </div>
                      <Badge variant="secondary" className="w-fit text-xs">{report.subject}</Badge>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="mb-2 text-sm font-semibold text-blue-600">#{report.trend_keyword}</p>
                      <h3 className="mb-3 text-sm font-medium leading-relaxed text-gray-800 group-hover:text-[#1e3a5f]">
                        {report.report_title}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {report.target_majors.slice(0, 2).map((major) => (
                          <span key={major} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                            {major}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                        <span>👁</span>
                        <span>{(report.views ?? 0).toLocaleString()}명 조회</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 text-center sm:hidden">
            <Link href="/explorer">
              <Button variant="outline" className="border-[#1e3a5f] text-[#1e3a5f]">전체 탐색 →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="bg-[#1e3a5f] px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">3단계로 완성하는 차별화된 세특</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "01", icon: "🎯", title: "전공 입력", desc: "희망 전공을 검색하면 22개정 교육과정 기반 필수 과목 스킬 트리를 확인할 수 있어요." },
              { step: "02", icon: "📚", title: "탐구 주제 선택", desc: "과목·단원·교과서 출판사·트렌드 키워드를 필터링해 최적의 탐구 주제를 발굴해요." },
              { step: "03", icon: "✨", title: "보고서 생성", desc: "현직 연구원 시선의 심화 분석이 담긴 프리미엄 세특 초안을 즉시 다운로드하세요." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 text-3xl">
                  {item.icon}
                </div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-300">STEP {item.step}</p>
                <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-blue-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t bg-gray-900 px-4 py-8 text-center text-sm text-gray-400">
        <p className="font-semibold text-white mb-1">세특큐레이터</p>
        <p>2022 개정 교육과정 기반 이공계 세특 플랫폼</p>
        <p className="mt-2 text-xs">© 2025 세특큐레이터. All rights reserved.</p>
      </footer>
    </main>
  );
}
