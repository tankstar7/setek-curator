"use client";

export const dynamic = "force-dynamic";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Download,
  Heart,
  TrendingUp,
  CheckCircle2,
  ChevronLeft,
  Star,
  Award,
  Zap,
  Clock,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type GradeKey = "grade1" | "grade2" | "grade3";
type SubjectTabKey = "group1" | "group2" | "group3";

const GRADE_TABS: { key: GradeKey; label: string }[] = [
  { key: "grade1", label: "1학년" },
  { key: "grade2", label: "2학년" },
  { key: "grade3", label: "3학년" },
];

const SUBJECT_TABS: { key: SubjectTabKey; label: string }[] = [
  { key: "group1", label: "국어·영어·수학" },
  { key: "group2", label: "한국사·사회·과학" },
  { key: "group3", label: "기타 교과" },
];

export default function LabResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const reportRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [major, setMajor] = useState("");
  const [activeGrade, setActiveGrade] = useState<GradeKey>("grade1");
  const [activeSubjectTab, setActiveSubjectTab] = useState<SubjectTabKey>("group1");
  const [isSaved, setIsSaved] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    async function fetchResult() {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const { data: result, error: fetchError } = await supabase
          .from("analysis_results")
          .select("result_data, major, is_saved")
          .eq("id", id)
          .single();

        if (fetchError || !result) {
          throw new Error("결과를 불러올 수 없습니다.");
        }

        // DB의 저장 상태로 버튼 초기값 동기화
        setIsSaved(result.is_saved === true);

        const rawData = result.result_data || {};

        const ca = rawData.creative_activity || {};
        const bs = rawData.behavior_summary || {};
        // 창체 노드가 "데이터 없음" 상태인지 판별
        const UNAVAILABLE = "정보 미제공으로 확인 불가";
        const NO_RECORD   = "해당 학년 기록 없음";
        function creativeHasContent(node: any) {
          if (!node) return false;
          return (
            node.academic  !== UNAVAILABLE && node.academic  !== NO_RECORD ||
            node.career    !== UNAVAILABLE && node.career    !== NO_RECORD ||
            node.community !== UNAVAILABLE && node.community !== NO_RECORD
          );
        }

        // next_action_plan 우선, 없으면 grade3_action_plan fallback
        const actionPlanText = ca.next_action_plan || ca.grade3_action_plan || null;

        const transformedReport = {
          // 기본 정보
          attendance: rawData.basic_info?.attendance || "기록 없음",
          volunteer: rawData.basic_info?.volunteer || "기록 없음",
          // 창의적 체험활동 (학년별 객체 → 배열로 변환)
          // 비공개(미제공) 학년도 포함하되 isUnavailable 플래그로 컴팩트 렌더링
          creative: [
            ...(ca.grade1 ? [{ ...ca.grade1, grade: "1학년" }] : []),
            ...(ca.grade2 ? [{ ...ca.grade2, grade: "2학년", isUnavailable: !creativeHasContent(ca.grade2) }] : []),
            ...(ca.grade3 ? [{ ...ca.grade3, grade: "3학년", isUnavailable: !creativeHasContent(ca.grade3) }] : []),
            ...(actionPlanText ? [{ grade: "3학년(예정)", isActionPlan: true, desc: actionPlanText }] : []),
          ],
          // 종합 의견
          overall: {
            g1: bs.grade1 || "기록 없음",
            g2: bs.grade2 || "기록 없음",
            g3: (bs.grade3 && bs.grade3 !== "해당 학년 기록 없음") ? bs.grade3 : null,
            final: bs.final_comment || "기록 없음",
            analysis: bs.analysis || "",
          },
          // 성적 추이: { grade1: [{subject, sem1, sem2}], grade2: [...], grade3: [...] }
          grade_trends: rawData.grade_trends || {},
          // 교과 세특: { grade1: { basic: [...], explore: [...], others: [...] }, ... }
          subject_activity: rawData.subject_activity || {},
          // 5대 역량 AI 점수
          scores: rawData.scores || undefined,
          // 학업성취도 정밀 분석
          grade_analysis: rawData.grade_analysis || undefined,
        };

        setReport(transformedReport);
        setMajor(result.major || "");
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [id]);

  const downloadPDF = () => { window.print(); };

  const handleSave = async () => {
    if (!id) return;
    try {
      const res = await fetch("/api/analyze/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("저장 실패");
      const json = await res.json();
      const newState: boolean = json.is_saved;
      setIsSaved(newState);
      if (newState) {
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-lg font-bold text-gray-900">리포트를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">유효하지 않은 결과입니다.</h2>
          <p className="text-gray-500">아이디가 잘못되었거나 삭제된 데이터일 수 있습니다.</p>
        </div>
        <Button
          onClick={() => router.push("/lab")}
          className="h-12 rounded-xl bg-[#1e3a5f] px-8 font-bold text-white shadow-lg"
        >
          분석실로 돌아가기
        </Button>
      </div>
    );
  }

  // 현재 학년 기반으로 파생 데이터 계산
  const gradeRows: any[] = report.grade_trends?.[activeGrade] || [];
  const subjectCards: any[] = report.subject_activity?.[activeGrade]?.[activeSubjectTab] || [];

  function handleGradeChange(key: GradeKey) {
    setActiveGrade(key);
    setActiveSubjectTab("group1"); // 학년 변경 시 세특 탭 초기화
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans">
      <style jsx global>{`
        @media print {
          body { background-color: white !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          main { padding-bottom: 0 !important; }
          .mx-auto { max-width: 100% !important; padding: 0 !important; }
          .shadow-sm, .shadow-lg, .shadow-2xl { box-shadow: none !important; border: 1px solid #eee !important; }
          [role="tabpanel"] { display: block !important; opacity: 1 !important; transform: none !important; position: static !important; }
          .tabs-list { display: none !important; }
        }
      `}</style>

      {/* ── 상단 컨트롤바 ── */}
      <div className="no-print sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={() => router.push("/lab")}
            className="flex items-center gap-1.5 text-sm font-bold text-gray-500 transition-colors hover:text-[#1e3a5f]"
          >
            <ChevronLeft className="size-4" />
            다시 분석하기
          </button>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              className={`h-11 rounded-xl px-6 font-bold shadow-lg transition-all active:scale-95 ${
                isSaved
                  ? "bg-green-500 text-white shadow-green-500/30 hover:bg-green-600"
                  : "bg-white border border-[#1e3a5f] text-[#1e3a5f] shadow-blue-900/10 hover:bg-[#1e3a5f]/5"
              }`}
            >
              {isSaved ? (
                <><CheckCircle2 className="mr-2 size-4" />저장 완료</>
              ) : (
                <><Heart className="mr-2 size-4" />분석 리포트 저장하기</>
              )}
            </Button>
            <Button
              onClick={() => router.push(`/lab/result/pdf?id=${id}`)}
              className="h-11 rounded-xl bg-violet-600 px-6 font-bold text-white shadow-lg shadow-violet-900/20 transition-all hover:bg-violet-700 active:scale-95"
            >
              <Download className="mr-2 size-4" />
              프리미엄 PDF
            </Button>
            <Button
              onClick={downloadPDF}
              className="h-11 rounded-xl bg-[#1e3a5f] px-6 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#2d5282] active:scale-95"
            >
              <Download className="mr-2 size-4" />
              간편 PDF
            </Button>
          </div>
        </div>
      </div>

      {/* ── 저장 완료 토스트 ── */}
      {saveToast && (
        <div className="no-print fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 rounded-2xl bg-gray-900 px-6 py-3.5 shadow-2xl">
          <CheckCircle2 className="size-4 text-green-400" />
          <span className="text-sm font-semibold text-white">마이페이지에 성공적으로 저장되었습니다.</span>
        </div>
      )}

      <div ref={reportRef} id="report-content" className="mx-auto max-w-5xl px-6 py-12 space-y-16">
        {/* ── 리포트 타이틀 ── */}
        <div className="border-b-2 border-[#1e3a5f] pb-8">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1">PREMIUM REPORT</Badge>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            AI 생기부 정밀 분석 리포트
          </h1>
          <div className="mt-4 flex flex-wrap gap-6 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">희망 전공</span>
              <span className="text-[#1e3a5f] font-bold">{major || "미지정"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">분석 일시</span>
              <span className="text-gray-800 font-semibold">{new Date().toLocaleDateString("ko-KR")}</span>
            </div>
          </div>
        </div>

        {/* ── [Section 1] 기본 인적 및 이력 ── */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#1e3a5f] text-white text-sm">1</span>
            기본 인적 및 이력 사항 종합 분석
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-none bg-white shadow-sm ring-1 ring-gray-200">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50">
                  <Clock className="size-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">출결 상황</p>
                  <p className="mt-0.5 text-[14px] font-normal text-gray-800">{report.attendance}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none bg-white shadow-sm ring-1 ring-gray-200">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <Heart className="size-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">봉사 실적</p>
                  <p className="mt-0.5 text-[14px] font-normal text-gray-800">{report.volunteer}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── [Section 2] 창체활동 타임라인 ── */}
        <section className="space-y-8">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#1e3a5f] text-white text-sm">2</span>
            창의적 체험활동상황 정밀 분석
          </h2>

          <div className="relative border-l-2 border-gray-100 ml-4 pl-10 space-y-12">
            {report.creative?.map((node: any, i: number) => (
              <div key={i} className="relative">
                <div className="absolute -left-[51px] top-1 flex size-5 items-center justify-center rounded-full bg-white border-4 border-[#1e3a5f] shadow-sm" />
                <div className="space-y-4">
                  <Badge variant="outline" className="border-gray-200 text-gray-500 font-bold">{node.grade}</Badge>
                  {node.isActionPlan ? (
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8 shadow-inner">
                      <p className="text-slate-700 font-bold text-[14px] leading-relaxed break-keep">{node.desc}</p>
                    </div>
                  ) : node.isUnavailable ? (
                    <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-3">
                      <span className="text-xs font-bold text-gray-400">🔒 데이터 미제공</span>
                      <span className="text-xs text-gray-400">— 해당 학년 창체 기록이 공개되지 않았습니다.</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-col md:flex-row gap-3 rounded-xl bg-blue-50 p-4">
                        <div className="flex w-24 shrink-0 items-center justify-center whitespace-nowrap text-sm font-black text-blue-700 text-center">
                          📚 학업
                        </div>
                        <p className="text-sm leading-relaxed text-gray-700 break-keep">{node.academic}</p>
                      </div>
                      <div className="flex flex-col md:flex-row gap-3 rounded-xl bg-orange-50 p-4">
                        <div className="flex w-24 shrink-0 items-center justify-center whitespace-nowrap text-sm font-black text-orange-700 text-center">
                          🎯 진로
                        </div>
                        <p className="text-sm leading-relaxed text-gray-700 break-keep">{node.career}</p>
                      </div>
                      <div className="flex flex-col md:flex-row gap-3 rounded-xl bg-green-50 p-4">
                        <div className="flex w-24 shrink-0 items-center justify-center whitespace-nowrap text-sm font-black text-green-700 text-center">
                          🤝 공동체
                        </div>
                        <p className="text-sm leading-relaxed text-gray-700 break-keep">{node.community}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── [Section 3] 교과학습발달상황 ── */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#1e3a5f] text-white text-sm">3</span>
            교과학습발달상황 정밀 분석
          </h2>

          {/* ── 학년 탭 선택기 ── */}
          <div className="no-print flex gap-1.5 rounded-xl bg-gray-100 p-1">
            {GRADE_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleGradeChange(key)}
                className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${
                  activeGrade === key
                    ? "bg-[#1e3a5f] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── 주요 교과 성적 추이 표 ── */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <TrendingUp className="size-4 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-700">주요 교과 성적 추이</h3>
              <Badge variant="outline" className="ml-auto border-gray-200 text-gray-400 text-xs font-bold">
                {GRADE_TABS.find((g) => g.key === activeGrade)?.label}
              </Badge>
            </div>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="px-6 py-4 text-left font-bold text-gray-400">과목</th>
                  <th className="px-6 py-4 text-center">
                    <span className="inline-block bg-blue-100 text-blue-800 font-bold px-4 py-1 rounded-full text-xs">1학기</span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="inline-block bg-blue-100 text-blue-800 font-bold px-4 py-1 rounded-full text-xs">2학기</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {gradeRows.length > 0 ? (
                  gradeRows.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-800">{row.subject}</td>
                      <td className="px-6 py-4 text-center tabular-nums text-gray-500">{row.sem1?.replace(/\([^)]*\)/g, "").trim()}</td>
                      <td className="px-6 py-4 text-center tabular-nums font-black text-[#1e3a5f] bg-blue-50/30">{row.sem2?.replace(/\([^)]*\)/g, "").trim()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-400 font-medium">
                      해당 학년의 성적 데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── 학업성취도 정밀 분석 ── */}
          {report.grade_analysis && (
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <span className="text-base">📊</span>
                <h3 className="text-sm font-bold text-gray-700">학업성취도 정밀 분석</h3>
              </div>
              <div className="p-6 space-y-3">
                {report.grade_analysis.warning && (
                  <div className="flex items-start gap-3 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3">
                    <span className="mt-0.5 shrink-0 text-yellow-500">⚠️</span>
                    <p className="text-sm font-medium text-yellow-800">{report.grade_analysis.warning}</p>
                  </div>
                )}
                {[
                  { label: "균형성 분석",   value: report.grade_analysis.balance },
                  { label: "전공 연계 과목", value: report.grade_analysis.major_related },
                  { label: "학년별 추이",   value: report.grade_analysis.trend },
                  { label: "이탈 과목",     value: report.grade_analysis.outlier },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
                    <span className="mt-0.5 shrink-0 w-24 text-xs font-black text-gray-400 uppercase tracking-widest">{label}</span>
                    <p className="text-[14px] text-gray-700 leading-relaxed break-keep">{value}</p>
                  </div>
                ))}
                <div className="flex items-start gap-4 rounded-xl bg-blue-50 border border-blue-100 px-5 py-4">
                  <span className="mt-0.5 shrink-0 w-24 text-xs font-black text-[#1e3a5f] uppercase tracking-widest">종합 평가</span>
                  <p className="text-[14px] font-bold text-[#1e3a5f] leading-relaxed break-keep italic">{report.grade_analysis.overall}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── 과목별 세특 분석 ── */}
          <div className="space-y-4 no-print">
            {/* 기초/탐구/기타 서브 탭 */}
            <div className="flex gap-1.5 rounded-xl bg-gray-100 p-1">
              {SUBJECT_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveSubjectTab(key)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${
                    activeSubjectTab === key
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 세특 카드 리스트 */}
            <div className="space-y-6 mt-2">
              {subjectCards.length > 0 ? (
                subjectCards.map((sub: any, idx: number) => (
                  <div key={idx} className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
                      <span className="text-base font-bold text-white">{sub.subject}</span>
                      <Badge className="bg-blue-500 font-bold border-none">AI 분석 완료</Badge>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex shrink-0 w-24 items-center justify-center text-center text-[14px] font-black text-gray-400 uppercase tracking-widest">
                          기록 요약
                        </div>
                        <p className="text-[14px] text-gray-700 leading-relaxed break-keep font-medium">{sub.summary}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex shrink-0 w-24 items-center justify-center text-center text-[14px] font-black text-[#1e3a5f] uppercase tracking-widest">
                          역량 평가
                        </div>
                        <p className="text-[14px] text-[#1e3a5f] leading-relaxed break-keep font-bold italic">{sub.eval}</p>
                      </div>
                      <div className="flex items-center gap-4 rounded-xl bg-yellow-50 p-5 ring-1 ring-yellow-100">
                        <div className="flex shrink-0 w-24 items-center justify-center text-center text-[14px] font-black text-orange-600 uppercase tracking-widest">
                          한계 및 보완
                        </div>
                        <p className="text-[14px] leading-relaxed text-gray-900">
                          <mark className="bg-yellow-200 px-1 rounded font-bold text-gray-900">
                            {sub.limit || "제시된 한계 및 보완점이 없습니다."}
                          </mark>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                  <p className="text-3xl mb-3">📭</p>
                  <p className="text-sm font-medium text-gray-400">
                    {GRADE_TABS.find((g) => g.key === activeGrade)?.label}{" "}
                    {SUBJECT_TABS.find((t) => t.key === activeSubjectTab)?.label} 세특 데이터가 없습니다.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── 인쇄 전용: 전 학년 전체 출력 ── */}
          <div className="print-only hidden space-y-12">
            <h3 className="text-2xl font-bold text-[#1e3a5f] border-b-2 border-blue-50 pb-2">과목별 세특 정밀 분석 (전 학년)</h3>
            {GRADE_TABS.map(({ key, label: gradeLabel }) => (
              <div key={key} className="space-y-6">
                <h4 className="text-lg font-bold text-gray-700 border-b border-gray-100 pb-2">{gradeLabel}</h4>
                {/* 성적 표 */}
                {(report.grade_trends?.[key] || []).length > 0 && (
                  <table className="w-full border-collapse text-sm mb-4">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="px-4 py-3 text-left font-bold text-gray-400">과목</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-400">1학기</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-400">2학기</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(report.grade_trends[key] as any[]).map((row: any, i: number) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="px-4 py-3 font-bold text-gray-800">{row.subject}</td>
                          <td className="px-4 py-3 text-center tabular-nums text-gray-500">{row.sem1?.replace(/\([^)]*\)/g, "").trim()}</td>
                          <td className="px-4 py-3 text-center tabular-nums text-gray-500">{row.sem2?.replace(/\([^)]*\)/g, "").trim()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {/* 세특 카드 */}
                {SUBJECT_TABS.map(({ key: tabKey, label: tabLabel }) => {
                  const cards: any[] = report.subject_activity?.[key]?.[tabKey] || [];
                  if (cards.length === 0) return null;
                  return (
                    <div key={tabKey} className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">{tabLabel}</p>
                      {cards.map((sub: any, idx: number) => (
                        <div key={idx} className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                          <div className="flex items-center justify-between bg-slate-900 px-6 py-3 text-white">
                            <span className="text-sm font-bold">{sub.subject}</span>
                            <Badge className="bg-blue-500 font-bold border-none text-xs">AI 분석 완료</Badge>
                          </div>
                          <div className="p-6 space-y-3">
                            <p className="text-sm text-gray-700 leading-relaxed"><strong>[기록 요약]</strong> {sub.summary}</p>
                            <p className="text-sm text-blue-900 font-bold"><strong>[역량 평가]</strong> {sub.eval}</p>
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                              <p className="text-sm text-gray-900">
                                <strong>[한계 및 보완]</strong>{" "}
                                <mark className="bg-yellow-200 px-1 rounded font-bold">
                                  {sub.limit || "제시된 한계 및 보완점이 없습니다."}
                                </mark>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* ── [Section 4] 행동특성 및 종합의견 ── */}
        <section className="space-y-8">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#1e3a5f] text-white text-sm">4</span>
            행동특성 및 종합의견 요약
          </h2>

          <div className="space-y-4">
            <blockquote className="relative border-l-4 border-slate-200 bg-white p-6 rounded-r-2xl shadow-sm ring-1 ring-gray-100 italic text-gray-600">
              <span className="absolute -left-2 -top-4 text-6xl text-slate-100 font-serif">"</span>
              <p className="relative z-10 pl-2 text-[14px]">1학년: {report.overall.g1}</p>
            </blockquote>
            <blockquote className="relative border-l-4 border-slate-200 bg-white p-6 rounded-r-2xl shadow-sm ring-1 ring-gray-100 italic text-gray-600">
              <span className="absolute -left-2 -top-4 text-6xl text-slate-100 font-serif">"</span>
              <p className="relative z-10 pl-2 text-[14px]">2학년: {report.overall.g2}</p>
            </blockquote>
            {report.overall.g3 && (
              <blockquote className="relative border-l-4 border-slate-200 bg-white p-6 rounded-r-2xl shadow-sm ring-1 ring-gray-100 italic text-gray-600">
                <span className="absolute -left-2 -top-4 text-6xl text-slate-100 font-serif">"</span>
                <p className="relative z-10 pl-2 text-[14px]">3학년: {report.overall.g3}</p>
              </blockquote>
            )}

            {report.overall.analysis && (
              <div className="mt-8 bg-blue-50 border border-blue-200 p-8 rounded-xl">
                <h4 className="flex items-center gap-2 text-xl font-bold text-blue-800 mb-4">
                  <Lightbulb className="size-5 fill-yellow-400 text-yellow-500" />
                  AI 입학사정관 심층 분석
                </h4>
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap font-medium">
                  {report.overall.analysis}
                </p>
              </div>
            )}

            <div className="mt-10 rounded-3xl bg-gradient-to-br from-[#0f2540] to-[#1e3a5f] p-10 text-white shadow-2xl relative overflow-hidden">
              <Zap className="absolute -bottom-10 -right-10 size-48 text-white/5 rotate-12" />
              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-2 text-blue-300">
                  <Star className="size-5 fill-current" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">AI Final Verdict</span>
                </div>
                <p className="text-xl font-bold leading-relaxed break-keep">{report.overall.final}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 리포트 푸터 */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-10 sm:flex-row text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          <p>© 2025 세특큐레이터 AI 분석 엔진 v2.1</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><CheckCircle2 className="size-3" /> 데이터 정합성 검증 완료</span>
            <span className="flex items-center gap-1"><Award className="size-3" /> 대입 적합성 엔진 적용</span>
          </div>
        </div>
      </div>
    </main>
  );
}
