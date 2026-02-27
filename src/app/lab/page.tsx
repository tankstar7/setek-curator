"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getAllSkillTrees, getAllCurricula, getReports } from "@/lib/db";
import type { SkillTree, Curriculum, Report } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── Step chip selector ─────────────────────────────────────────────────────
function StepSelector({
  step, label, items, selected, onSelect, disabled = false,
}: {
  step: number;
  label: string;
  items: string[];
  selected: string | null;
  onSelect: (item: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm transition-opacity ${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1e3a5f] text-[10px] font-black text-white">
          {step}
        </span>
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selected === item
                ? "bg-[#1e3a5f] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Paywall blur section ───────────────────────────────────────────────────
function PaywallSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="select-none blur-sm pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-transparent via-white/80 to-white">
        <span className="text-2xl mb-2">🔒</span>
        <p className="text-sm font-bold text-gray-800">프리미엄 콘텐츠</p>
        <p className="mt-1 text-xs text-gray-500 text-center">로그인 후 크레딧으로 열람하세요</p>
        <Button size="sm" className="mt-3 bg-[#1e3a5f] text-white hover:bg-[#152c4a] text-xs">
          크레딧으로 열람하기
        </Button>
      </div>
    </div>
  );
}

// ── Content block ──────────────────────────────────────────────────────────
function ContentBlock({
  label, emoji, content, premium = false,
}: {
  label: string;
  emoji: string;
  content: string;
  premium?: boolean;
}) {
  const body = (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
        <span>{emoji}</span>
        {label}
        {premium && (
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">
            Premium
          </span>
        )}
      </p>
      <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{content}</p>
    </div>
  );

  return premium ? <PaywallSection>{body}</PaywallSection> : body;
}

const DEPTH_OPTIONS = ["기초 개념", "심화 탐구", "연구자 시선"];
const TYPE_OPTIONS = ["탐구 설계", "실험 보고", "문헌 조사", "시사 연계"];

// ── Main Page ──────────────────────────────────────────────────────────────
export default function LabPage() {
  const searchParams = useSearchParams();
  const initKeyword = searchParams.get("keyword") ?? "";

  const [skillTrees, setSkillTrees] = useState<SkillTree[]>([]);
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loadingReports, setLoadingReports] = useState(false);

  // 6-step filter state
  const [selMajor, setSelMajor] = useState<string | null>(null);
  const [selCourse, setSelCourse] = useState<string | null>(null);
  const [selConcept, setSelConcept] = useState<string | null>(null);
  const [selTrend, setSelTrend] = useState<string | null>(null);
  const [selDepth, setSelDepth] = useState<string | null>(null);
  const [selType, setSelType] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAllSkillTrees(), getAllCurricula()]).then(([st, cu]) => {
      setSkillTrees(st);
      setCurricula(cu);
    });
  }, []);

  // Auto-select trend from URL keyword
  useEffect(() => {
    if (initKeyword) setSelTrend(initKeyword);
  }, [initKeyword]);

  // Fetch reports when filters change
  const fetchReports = useCallback(async () => {
    setLoadingReports(true);
    setSelectedReport(null);
    try {
      const filters: Parameters<typeof getReports>[0] = {};
      if (selCourse) filters.subject = selCourse;
      if (selConcept) filters.major_unit = selConcept;
      if (selTrend) filters.trend_keyword = selTrend;
      if (selMajor) filters.target_major = selMajor;
      const r = await getReports({ ...filters, limitCount: 20 });
      setReports(r);
      if (r.length > 0) setSelectedReport(r[0]);
    } finally {
      setLoadingReports(false);
    }
  }, [selMajor, selCourse, selConcept, selTrend]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // ── Step derivations ──
  const majors = useMemo(
    () => skillTrees.map((st) => st.major_name).sort(),
    [skillTrees]
  );

  const selTree = useMemo(
    () => skillTrees.find((st) => st.major_name === selMajor) ?? null,
    [skillTrees, selMajor]
  );

  const courses = useMemo(() => {
    if (!selTree) return [];
    return [...(selTree.core_required ?? []), ...(selTree.advanced_required ?? [])];
  }, [selTree]);

  const concepts = useMemo(() => {
    if (!selCourse) return [];
    const matching = curricula.filter(
      (c) => c.course === selCourse || c.subject === selCourse
    );
    return [...new Set(matching.map((c) => c.major_unit))].sort();
  }, [curricula, selCourse]);

  const trendKeywords = useMemo(
    () => [...new Set(reports.map((r) => r.trend_keyword))].sort(),
    [reports]
  );

  // ── Handlers ──
  function pick<T>(setter: React.Dispatch<React.SetStateAction<T | null>>, ...reset: React.Dispatch<React.SetStateAction<string | null>>[]) {
    return (val: string) => {
      setter((prev: T | null) => ((prev as unknown as string) === val ? null : (val as unknown as T)));
      reset.forEach((r) => r(null));
    };
  }

  const selectMajor = pick(setSelMajor, setSelCourse, setSelConcept, setSelTrend, setSelDepth, setSelType);
  const selectCourse = pick(setSelCourse, setSelConcept, setSelTrend);
  const selectConcept = pick(setSelConcept, setSelTrend);
  const selectTrend = (v: string) => setSelTrend((p) => (p === v ? null : v));
  const selectDepth = (v: string) => setSelDepth((p) => (p === v ? null : v));
  const selectType = (v: string) => setSelType((p) => (p === v ? null : v));

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-4 py-14 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-blue-500/20 text-blue-200 border-blue-400/30">⚗️ AI 세특 연구실</Badge>
          <h1 className="text-3xl font-extrabold sm:text-4xl">AI 세특 연구실</h1>
          <p className="mt-3 text-blue-100">
            6단계 심화 필터로 나만의 탐구 주제를 정밀하게 찾고, 프리미엄 보고서 초안을 열람하세요.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          {/* ── Left: 6-step filter panel ── */}
          <div className="space-y-3">
            <StepSelector
              step={1}
              label="목표 전공"
              items={majors}
              selected={selMajor}
              onSelect={selectMajor}
            />
            <StepSelector
              step={2}
              label="과목 선택"
              items={courses}
              selected={selCourse}
              onSelect={selectCourse}
              disabled={!selMajor}
            />
            <StepSelector
              step={3}
              label="개념 (대주제)"
              items={concepts}
              selected={selConcept}
              onSelect={selectConcept}
              disabled={!selCourse}
            />
            <StepSelector
              step={4}
              label="트렌드 키워드"
              items={trendKeywords.length > 0 ? trendKeywords : (selTrend ? [selTrend] : [])}
              selected={selTrend}
              onSelect={selectTrend}
              disabled={false}
            />
            <StepSelector
              step={5}
              label="탐구 깊이"
              items={DEPTH_OPTIONS}
              selected={selDepth}
              onSelect={selectDepth}
            />
            <StepSelector
              step={6}
              label="탐구 유형"
              items={TYPE_OPTIONS}
              selected={selType}
              onSelect={selectType}
            />

            {/* Report list */}
            {reports.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                  탐구 주제 목록 ({reports.length}개)
                </p>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {reports.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedReport(r)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                        selectedReport?.id === r.id
                          ? "bg-[#1e3a5f] text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="line-clamp-2">{r.report_title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Report detail ── */}
          <div>
            {loadingReports ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-100" />
                ))}
              </div>
            ) : !selectedReport ? (
              <Card className="border-dashed border-gray-300">
                <CardContent className="py-20 text-center text-gray-400">
                  <p className="text-4xl mb-3">⚗️</p>
                  <p className="text-sm font-medium text-gray-600">전공과 과목을 선택하면</p>
                  <p className="text-sm text-gray-500">맞춤 세특 보고서 초안이 나타납니다.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Report header */}
                <Card className="border-[#1e3a5f]/20 bg-gradient-to-r from-[#1e3a5f]/5 to-white">
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className="bg-[#1e3a5f] text-white text-xs">{selectedReport.subject}</Badge>
                      <Badge variant="secondary" className="text-xs">{selectedReport.major_unit}</Badge>
                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-600">
                        #{selectedReport.trend_keyword}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-snug text-gray-900">
                      {selectedReport.report_title}
                    </CardTitle>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedReport.target_majors.map((m) => (
                        <span key={m} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                          {m}
                        </span>
                      ))}
                    </div>
                  </CardHeader>
                </Card>

                {/* Free sections */}
                <ContentBlock
                  label="탐구 동기"
                  emoji="💡"
                  content={selectedReport.golden_template.motivation}
                />
                <ContentBlock
                  label="교과서 연계 기초 지식"
                  emoji="📖"
                  content={selectedReport.golden_template.basic_knowledge}
                />
                <ContentBlock
                  label="내용 탐구"
                  emoji="🔬"
                  content={selectedReport.golden_template.application}
                />

                {/* Premium sections (paywall) */}
                <ContentBlock
                  label="석학 시선의 심화 탐구"
                  emoji="🧠"
                  content={selectedReport.golden_template.in_depth}
                  premium
                />
                <ContentBlock
                  label="전공 연계 비전"
                  emoji="🎯"
                  content={selectedReport.golden_template.major_connection}
                  premium
                />

                {/* View counter info */}
                <p className="text-right text-xs text-gray-400">
                  👁 {(selectedReport.views ?? 0).toLocaleString()}명이 열람한 주제
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
