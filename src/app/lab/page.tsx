"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionTitle } from "@/components/SectionTitle";
import { InfoCard } from "@/components/InfoCard";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle2,
  Upload,
  BarChart3,
  Users,
  BookOpen,
  Search,
  ChevronRight,
} from "lucide-react";

export default function LabPage() {
  const router = useRouter();
  const [major, setMajor] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const LOADING_MESSAGES = [
    "생기부 텍스트 데이터 추출 및 정제 중...",
    "학생의 3대 핵심 역량(학업/진로/공동체) 매핑 중...",
    "교과 세특 행간의 숨은 의미와 리더십 분석 중...",
    "개인 맞춤형 한계 극복 액션 플랜(Action Plan) 설계 중...",
    "최종 AI 생기부 분석 리포트 생성 중... 거의 다 왔습니다!",
  ];

  useEffect(() => {
    if (!isAnalyzing) return;
    setLoadingStep(0);
    setFadeIn(true);
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
        setFadeIn(true);
      }, 450);
    }, 2800);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnalyzing]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!major) return alert("희망 전공을 입력해 주세요.");
    if (!file) return alert("생기부 파일을 업로드해 주세요.");
    
    setIsAnalyzing(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email || "";

      const formData = new FormData();
      formData.append("major", major);
      formData.append("file", file);
      formData.append("user_email", userEmail);

      // Supabase Edge Function 호출 (150초 타임아웃 — Vercel 60초 제한 우회)
      // --no-verify-jwt 배포 시 Authorization 헤더 불필요, anon key로 식별만 전달
      const EDGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/analyze`;
      const response = await fetch(EDGE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: formData,
      });

      if (response.status === 429) {
        alert("요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.");
        setIsAnalyzing(false);
        return;
      }

      // 응답이 JSON이 아닌 경우(Vercel 타임아웃, 서버 크래시 등) 대비
      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("서버 처리 시간이 초과되었거나 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }

      if (result.success && result.id) {
        router.push(`/lab/result?id=${result.id}`);
      } else {
        throw new Error(result.error || "분석 요청에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("Analysis Error:", err);
      alert(err.message || "오류가 발생했습니다. 다시 시도해 주세요.");
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── 1. HERO (Perfect Sync with Guide) ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2540] via-[#1e3a5f] to-[#2d5282] px-4 py-20 text-white">
        <div className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-blue-500/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-blue-400/10" />

        <div className="relative mx-auto max-w-4xl text-center">
          <Badge className="mb-6 border-blue-400/30 bg-blue-500/20 px-4 py-1.5 text-sm text-blue-200">
            🏫 AI 생기부 분석실 · 학종 전문 분석
          </Badge>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            AI 생기부 분석실
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-blue-100 sm:text-lg">
            2027 대입 학생부종합전형의 변화된 평가 기준을 바탕으로,
            <br className="hidden sm:block" />
            당신의 생활기록부에 담긴 역량과 잠재력을 데이터로 정밀 분석합니다.
          </p>

          {/* 통계 배너 */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-10">
            {[
              { num: "3",    unit: "가지",  desc: "핵심 역량 분석"    },
              { num: "5",    unit: "개",    desc: "주요 대학 연구 기반" },
              { num: "2027", unit: "대입",  desc: "최신 기준 반영"    },
            ].map((s) => (
              <div key={s.desc}>
                <p className="text-2xl font-extrabold sm:text-4xl">
                  {s.num}
                  <span className="ml-1 text-lg text-blue-300 sm:text-2xl">{s.unit}</span>
                </p>
                <p className="mt-1 text-xs text-blue-200 sm:text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16">
        {/* ── 2. 평가 기준 완전 분석 ── */}
        <section>
          <SectionTitle 
            label="학생부종합전형 전문가의 분석 기준"
            title="학생부종합전형 평가 기준 완전 분석"
            description="블라인드 평가부터 역량 중심 진단까지, 핵심 원칙을 기반으로 설계되었습니다."
          />

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "블라인드 평가 준수",
                desc: (
                  <>
                    학교명, 지역, 부모 정보 등 배경 지식은 철저히 배제하고 <strong className="font-bold text-gray-900">오직 텍스트에 드러난 역량</strong>만 평가한다.
                  </>
                ),
                icon: <Search className="size-8 text-blue-400" />,
                badge: "평가 원칙",
              },
              {
                title: "과정 중심 평가",
                desc: (
                  <>
                    단순히 &apos;결과&apos;가 아니라, <strong className="font-bold text-gray-900">&apos;동기&apos;, &apos;탐구 과정&apos;, &apos;성장&apos;의 흐름을 데이터로 정밀하게 분석</strong>한다.
                  </>
                ),
                icon: <BarChart3 className="size-8 text-orange-400" />,
                badge: "분석 핵심",
              },
              {
                title: "3대 핵심 역량 기반",
                desc: (
                  <>
                    <strong className="font-bold text-gray-900">학업역량, 진로역량, 공동체역량</strong>의 3가지 프레임워크로 텍스트를 분류하고 점수화한다.
                  </>
                ),
                icon: <Users className="size-8 text-green-400" />,
                badge: "역량 프레임",
              },
            ].map((item, i) => (
              <InfoCard
                key={i}
                icon={item.icon}
                badge={item.badge}
                title={item.title}
                description={item.desc as any}
              />
            ))}
          </div>
          
          {/* 신뢰도 문구 추가 */}
          <p className="mt-10 text-center text-sm font-medium leading-relaxed tracking-tight text-gray-400 mx-auto">
            본 서비스는 2027 대입전형 시행계획 및 5개 주요 대학(건국대, 경희대, 연세대, 중앙대, 한국외대) 공동연구를 기준으로 설계되었습니다.
          </p>
        </section>

        {/* ── 3. 평가 요소별 상세 분석 ── */}
        <section>
          <SectionTitle 
            label="세부 역량 진단 가이드"
            title="평가 요소별 상세 분석"
            description="탭을 전환하여 2027 대입 핵심 역량별 분석 포인트를 확인하세요."
          />

          <Tabs defaultValue="academic" className="w-full">
            <div className="overflow-x-auto pb-2">
              <TabsList className="mb-6 h-12 w-full min-w-[400px] bg-slate-100 p-1">
                <TabsTrigger value="academic" className="flex-1 gap-2 text-sm font-semibold tracking-tight whitespace-nowrap">
                  <BookOpen className="size-4" />
                  학업역량
                </TabsTrigger>
                <TabsTrigger value="career" className="flex-1 gap-2 text-sm font-semibold tracking-tight whitespace-nowrap">
                  <BarChart3 className="size-4" />
                  진로역량
                </TabsTrigger>
                <TabsTrigger value="community" className="flex-1 gap-2 text-sm font-semibold tracking-tight whitespace-nowrap">
                  <Users className="size-4" />
                  공동체역량
                </TabsTrigger>
              </TabsList>
            </div>

            {/* A. 학업역량 */}
            <TabsContent value="academic">
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-md space-y-8">
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-900">
                    <BookOpen className="size-6 text-blue-500" />
                    학업역량 (Academic Competency)
                  </h3>
                  <p className="mt-2 text-base text-gray-500 font-medium">단순 성적이 아닌, 대학 수학을 위한 기초 능력과 탐구력을 평가합니다.</p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-6">
                    <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <ChevronRight className="size-4 text-blue-500" /> 분석 포인트 1: 학업 태도
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                        <CheckCircle2 className="size-4 shrink-0 text-blue-500 mt-0.5" />
                        <span>수업 중 생긴 호기심을 해결하기 위해 스스로 추가 학습(독서, 논문 검색)을 했는가?</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                        <CheckCircle2 className="size-4 shrink-0 text-blue-500 mt-0.5" />
                        <span>교사의 피드백을 수용하여 결과물을 개선한 흔적이 있는가?</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-6">
                    <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <ChevronRight className="size-4 text-blue-500" /> 분석 포인트 2: 탐구력
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                        <CheckCircle2 className="size-4 shrink-0 text-blue-500 mt-0.5" />
                        <span>교과서의 지식을 사회 현상이나 다른 교과와 연결(융합)했는가?</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                        <CheckCircle2 className="size-4 shrink-0 text-blue-500 mt-0.5" />
                        <span>탐구의 결과가 보고서, 발표, 토론 등으로 구체화되었는가?</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                        <CheckCircle2 className="size-4 shrink-0 text-blue-500 mt-0.5" />
                        <span>'데이터'나 '지식'을 활용해 비판적 사고를 거쳐 문제를 해결했는가?</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* B. 진로역량 */}
            <TabsContent value="career">
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-md space-y-8">
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-900">
                    <BarChart3 className="size-6 text-orange-500" />
                    진로역량 (Career Competency)
                  </h3>
                  <p className="mt-2 text-base text-gray-500 font-medium">전공적합성보다 넓은 개념으로, 계열 관련 교과 이수 노력과 성취를 봅니다.</p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-6">
                    <h4 className="text-base font-bold text-orange-900 mb-4 flex items-center gap-2">
                      <ChevronRight className="size-4 text-orange-500" /> 분석 포인트 1: 이수 노력
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-base text-orange-800 leading-relaxed tracking-tight">
                        <CheckCircle2 className="size-5 shrink-0 text-orange-500 mt-0.5" />
                        <span>지원 희망 전공에 맞는 '핵심 권장 과목'을 이수했는가?</span>
                      </li>
                      <li className="ml-8 text-sm text-orange-600/70 italic">* 예: 공과대학 지원자가 미적분, 기하, 물리학II를 이수했는가?</li>
                      <li className="ml-8 rounded-xl bg-white/80 p-4 text-xs leading-relaxed text-orange-700 ring-1 ring-orange-100">
                        <strong>AI 알고리즘:</strong> 희망 전공 입력 → 서울대 전공 연계 교과이수 가이드 대조 → 미이수 시 감점 피드백 반영.
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-6">
                    <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <ChevronRight className="size-4 text-blue-500" /> 분석 포인트 2: 진로 탐색 활동
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                        <CheckCircle2 className="size-4 shrink-0 text-blue-500 mt-0.5" />
                        <span>교과 수업(세특)과 동아리 활동이 유기적으로 연결되어 있는가?</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                        <CheckCircle2 className="size-4 shrink-0 text-blue-500 mt-0.5" />
                        <span>1~2학년의 관심사가 3학년에서 구체적인 '심화 탐구'로 발전했는가?</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* C. 공동체역량 */}
            <TabsContent value="community">
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-md space-y-8">
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-900">
                    <Users className="size-6 text-green-500" />
                    공동체역량 (Community Competency)
                  </h3>
                  <p className="mt-2 text-base text-gray-500 font-medium">단순한 리더 직책 경험은 평가하지 않습니다. 구체적인 행동을 찾습니다.</p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-6">
                    <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <ChevronRight className="size-4 text-blue-500" /> 분석 포인트 1: 협업 및 소통
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                        <CheckCircle2 className="size-4 shrink-0 text-blue-500 mt-0.5" />
                        <span>팀 프로젝트에서 발생한 '갈등'을 중재하거나 해결한 구체적 사례가 있는가?</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                        <CheckCircle2 className="size-4 shrink-0 text-blue-500 mt-0.5" />
                        <span>자신의 의견만 주장하지 않고 타인의 의견을 경청/수용한 서술이 있는가?</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-6">
                    <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <ChevronRight className="size-4 text-blue-500" /> 분석 포인트 2: 나눔과 배려
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                        <CheckCircle2 className="size-4 shrink-0 text-blue-500 mt-0.5" />
                        <span>멘토링이나 봉사 활동에서 자발성과 지속성이 드러나는가?</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* ── 4. AI 생기부 분석 데모 (Guide Section 5 Sync) ── */}
        <section className="rounded-2xl bg-[#0f2540] px-6 py-16 text-center text-white shadow-xl">
          <div className="mx-auto max-w-2xl">
            <span className="text-5xl" aria-hidden="true">📊</span>
            <h2 className="mt-6 text-3xl font-extrabold leading-snug tracking-tight sm:text-4xl">
              내 생기부는 <span className="text-blue-300">어떤 평가</span>를 받을까요?
            </h2>
            <p className="mt-6 text-lg font-medium leading-relaxed text-blue-100/80">
              최신 학종 평가 알고리즘을 통해 <strong className="text-white">파일 1개</strong>로
              <br className="hidden sm:block" />
              당신의 <strong className="text-white">합격 가능성</strong>을 수치로 확인하세요.
            </p>

            {isAnalyzing ? (
              /* ── 다이나믹 로딩 UI ── */
              <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-10 flex flex-col items-center gap-8">

                {/* 스캔 애니메이션 + 중앙 아이콘 */}
                <div className="relative flex items-center justify-center">
                  {/* 그라데이션 테두리 링 */}
                  <div className="ai-gradient-border absolute rounded-full" style={{ width: 120, height: 120, padding: 3 }}>
                    <div className="w-full h-full rounded-full bg-[#0f2540]" />
                  </div>
                  {/* 외부 ping 링 */}
                  <div className="absolute rounded-full bg-blue-500/15 animate-ping" style={{ width: 140, height: 140 }} />
                  {/* 스캔 레이저 라인 (overflow hidden으로 원 안에 가둠) */}
                  <div className="absolute rounded-full overflow-hidden" style={{ width: 114, height: 114 }}>
                    <div className="ai-scan-line" />
                  </div>
                  {/* 중앙 이모지 */}
                  <div className="relative z-10 flex items-center justify-center rounded-full" style={{ width: 114, height: 114 }}>
                    <span className="text-4xl select-none animate-pulse">🤖</span>
                  </div>
                </div>

                {/* 롤링 텍스트 */}
                <div className="text-center min-h-[3rem] flex flex-col items-center justify-center gap-2">
                  <p
                    className="text-base font-semibold text-white leading-snug tracking-tight transition-opacity duration-450"
                    style={{ opacity: fadeIn ? 1 : 0 }}
                  >
                    {LOADING_MESSAGES[loadingStep]}
                  </p>
                  <p className="text-xs text-blue-300/60 font-medium">AI가 생기부를 정밀 분석하고 있습니다 · 약 1분 소요</p>
                </div>

                {/* 진행 단계 도트 */}
                <div className="flex items-center gap-2">
                  {LOADING_MESSAGES.map((_, i) => (
                    <div
                      key={i}
                      className="rounded-full transition-all duration-500"
                      style={{
                        width: i === loadingStep ? 20 : 8,
                        height: 8,
                        background: i <= loadingStep ? "#3b82f6" : "rgba(255,255,255,0.15)",
                      }}
                    />
                  ))}
                </div>

                {/* 하단 안내 */}
                <p className="text-xs text-white/30 text-center">
                  창을 닫지 마세요. 분석 완료 후 자동으로 결과 페이지로 이동합니다.
                </p>
              </div>
            ) : (
              /* ── 기본 입력 폼 ── */
              <Card className="mt-12 bg-white/5 border-white/10 text-left backdrop-blur-md shadow-2xl">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold tracking-widest text-blue-200 uppercase">희망 전공</Label>
                    <Input
                      placeholder="예: 컴퓨터공학과, 의예과"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30 h-14 rounded-xl text-base focus:ring-blue-500/50"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-bold tracking-widest text-blue-200 uppercase">생기부 파일 업로드</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setFile(e.target.files[0]);
                      }}
                    />
                    <div
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all py-12 group cursor-pointer ${
                        dragActive ? "border-blue-500 bg-blue-500/10" : "border-white/20 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <Upload className="size-10 text-blue-300 mb-3 group-hover:scale-110 transition-transform" />
                      <p className="text-base font-bold text-white">
                        {file ? file.name : "파일을 여기에 끌어다 놓으세요"}
                      </p>
                      <p className="mt-2 text-xs text-white/40">클릭하거나 파일을 끌어다 놓으세요 · PDF, PNG, JPG (최대 20MB)</p>
                    </div>
                  </div>
                  <Button
                    onClick={startAnalysis}
                    className="w-full h-16 rounded-full bg-white px-8 text-lg font-extrabold text-[#0f2540] shadow-xl transition-all hover:scale-[1.02] hover:bg-blue-50 active:scale-95"
                  >
                    👉 AI 분석 시작하기
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>

    </main>
  );
}
