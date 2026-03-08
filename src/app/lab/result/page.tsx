"use client";

export const dynamic = "force-dynamic";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Calendar, 
  Heart, 
  TrendingUp, 
  CheckCircle2, 
  ChevronLeft,
  Star,
  Award,
  Zap,
  Clock,
  BookOpen,
  ChevronRight,
  Loader2,
  Lightbulb,
  Library,
  Target,
  Users
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LabResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  
  const reportRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [major, setMajor] = useState("");

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
          .select("result_data, major")
          .eq("id", id)
          .single();

        if (fetchError || !result) {
          throw new Error("결과를 불러올 수 없습니다.");
        }

        const rawData = result.result_data || {};
        
        // 데이터 구조 변환 및 매핑
        const transformedReport = {
          ...rawData,
          // 1. 창의적 체험활동 매핑
          creative: [
            ...(rawData.creative_activity?.grade1 ? [{ 
              ...rawData.creative_activity.grade1, 
              grade: "1학년",
              title: rawData.creative_activity.grade1.title || "1학년 활동 분석",
              desc: rawData.creative_activity.grade1.desc || rawData.creative_activity.grade1.limit || ""
            }] : []),
            ...(rawData.creative_activity?.grade2 ? [{ 
              ...rawData.creative_activity.grade2, 
              grade: "2학년",
              title: rawData.creative_activity.grade2.title || "2학년 활동 분석",
              desc: rawData.creative_activity.grade2.desc || rawData.creative_activity.grade2.limit || ""
            }] : []),
            ...(rawData.creative_activity?.grade3_action_plan ? [{ 
              grade: "3학년(예정)",
              isActionPlan: true,
              desc: rawData.creative_activity.grade3_action_plan
            }] : [])
          ],
          // 2. 기본 정보 매핑
          attendance: rawData.basic_info?.attendance || rawData.attendance || "기록 없음",
          volunteer: rawData.basic_info?.volunteer || rawData.volunteer || "기록 없음",
          // 3. 교과 세특 매핑 (limit을 action으로 매핑)
          subjectAnalysis: {
            foundational: (rawData.subject_activity?.basic || []).map((s: any) => ({ ...s, action: s.limit || s.action })),
            exploration: (rawData.subject_activity?.explore || []).map((s: any) => ({ ...s, action: s.limit || s.action })),
            other: (rawData.subject_activity?.others || []).map((s: any) => ({ ...s, action: s.limit || s.action }))
          },
          // 4. 종합 의견 매핑
          overall: {
            g1: rawData.behavior_summary?.grade1 || rawData.overall?.g1 || "기록 없음",
            g2: rawData.behavior_summary?.grade2 || rawData.overall?.g2 || "기록 없음",
            final: rawData.behavior_summary?.final_comment || rawData.overall?.final || "기록 없음",
            analysis: rawData.behavior_summary?.analysis || ""
          },
          // 5. 내신 성적 추이
          grade_trends: rawData.grade_trends || rawData.grades || []
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

  const downloadPDF = () => {
    window.print();
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
          
          /* 탭 컨텐츠 강제 노출 */
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
          <Button 
            onClick={downloadPDF}
            className="h-11 rounded-xl bg-[#1e3a5f] px-6 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#2d5282] active:scale-95"
          >
            <Download className="mr-2 size-4" />
            리포트 PDF 다운로드
          </Button>
        </div>
      </div>

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
                  <p className="mt-0.5 text-base font-bold text-gray-800">{report?.attendance || "기록 없음"}</p>
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
                  <p className="mt-0.5 text-base font-bold text-gray-800">{report?.volunteer || "기록 없음"}</p>
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
            {report?.creative?.map((node: any, i: number) => (
              <div key={i} className="relative">
                {/* 타임라인 노드 아이콘 */}
                <div className="absolute -left-[51px] top-1 flex size-5 items-center justify-center rounded-full bg-white border-4 border-[#1e3a5f] shadow-sm"></div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-gray-200 text-gray-500 font-bold">{node?.grade}</Badge>
                  </div>
                  {node?.isActionPlan ? (
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8 shadow-inner">
                      <p className="text-slate-700 font-bold text-base leading-relaxed break-keep">
                        {node?.desc}
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-gray-900">{node?.title}</h3>
                      <p className="text-base leading-relaxed text-gray-600 break-keep">{node?.desc}</p>
                      
                      {/* 역량별 간이 평가 */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <div className="flex items-center gap-2 rounded-xl bg-blue-50/80 px-4 py-2 text-xs font-bold text-blue-700 ring-1 ring-blue-100 whitespace-nowrap min-w-[80px] justify-center">
                          <Library className="size-3.5 text-blue-500" />
                          <span>학업</span> <span className="ml-1 text-blue-900">{node?.academic || "0"}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-orange-50/80 px-4 py-2 text-xs font-bold text-orange-700 ring-1 ring-orange-100 whitespace-nowrap min-w-[80px] justify-center">
                          <Target className="size-3.5 text-orange-500" />
                          <span>진로</span> <span className="ml-1 text-orange-900">{node?.career || "0"}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50/80 px-4 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100 whitespace-nowrap min-w-[80px] justify-center">
                          <Users className="size-3.5 text-emerald-500" />
                          <span>공동체</span> <span className="ml-1 text-emerald-900">{node?.community || "0"}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── [Section 3] 교과학습발달상황 ── */}
        <section className="space-y-8">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#1e3a5f] text-white text-sm">3</span>
            교과학습발달상황 정밀 분석
          </h2>

          {/* 내신 성적 추이 표 */}
          <Card className="overflow-hidden border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <TrendingUp className="size-4 text-blue-600" /> 주요 교과 성적 추이
              </h3>
            </div>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="px-6 py-4 text-left font-bold text-gray-400">교과</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-400">1학년</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-400">2학년</th>
                  <th className="px-6 py-4 text-center font-bold text-[#1e3a5f]">3학년(예상)</th>
                </tr>
              </thead>
              <tbody>
                {report?.grade_trends?.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800">{row?.subject}</td>
                    <td className="px-6 py-4 text-center text-gray-500 tabular-nums">{row?.g1 || row?.grade1}</td>
                    <td className="px-6 py-4 text-center text-gray-500 tabular-nums">{row?.g2 || row?.grade2}</td>
                    <td className="px-6 py-4 text-center font-black text-[#1e3a5f] bg-blue-50/30 tabular-nums">{row?.g3 || row?.grade3}</td>
                  </tr>
                ))}
                {(!report?.grade_trends || report.grade_trends.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400 font-medium">성적 추이 데이터가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>

          {/* 과목별 세특 분석 탭 */}
          <Tabs defaultValue="foundational" className="w-full no-print">
            <TabsList className="grid w-full grid-cols-3 h-14 bg-gray-100 rounded-xl p-1 tabs-list">
              <TabsTrigger value="foundational" className="rounded-lg font-bold">기초 교과</TabsTrigger>
              <TabsTrigger value="exploration" className="rounded-lg font-bold">탐구 교과</TabsTrigger>
              <TabsTrigger value="other" className="rounded-lg font-bold">기타 교과</TabsTrigger>
            </TabsList>

            {(Object.keys(report.subjectAnalysis) as Array<keyof typeof report.subjectAnalysis>).map((key) => (
              <TabsContent key={key} value={key} className="mt-6 space-y-6">
                {report.subjectAnalysis[key]?.map((sub: any, idx: number) => (
                  <div key={idx} className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
                      <Badge className="bg-blue-500 font-bold border-none ml-auto">AI 분석 완료</Badge>
                    </div>
                    <div className="p-8 space-y-6">
                      {/* 과목명 표시 강제 추가 */}
                      <h3 className="text-2xl font-extrabold text-blue-900 mb-2">{sub?.name || sub?.subject}</h3>
                      
                      <div className="flex gap-4">
                        <span className="shrink-0 w-24 text-[10px] font-black text-gray-300 uppercase tracking-widest pt-1">기록 요약</span>
                        <p className="text-sm text-gray-700 leading-relaxed break-keep font-medium">{sub?.summary}</p>
                      </div>
                      <div className="flex gap-4">
                        <span className="shrink-0 w-24 text-[10px] font-black text-[#1e3a5f] uppercase tracking-widest pt-1">역량 평가</span>
                        <p className="text-sm text-[#1e3a5f] leading-relaxed break-keep font-bold italic">{sub?.eval}</p>
                      </div>
                      <div className="flex gap-4 rounded-xl bg-yellow-50 p-5 ring-1 ring-yellow-100">
                        <span className="shrink-0 w-24 text-[10px] font-black text-orange-600 uppercase tracking-widest pt-1">한계 및 보완</span>
                        <p className="text-sm leading-relaxed text-gray-900">
                          <mark className="bg-yellow-200 px-1 rounded font-bold text-gray-900">
                            {sub?.action}
                          </mark>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>

          {/* 인쇄 전용 전체 리스트 (탭 구분 없이 모두 출력) */}
          <div className="print-only hidden space-y-8">
            <h3 className="text-2xl font-bold text-[#1e3a5f] border-b-2 border-blue-50 pb-2">과목별 세특 정밀 분석</h3>
            {(Object.keys(report.subjectAnalysis) as Array<keyof typeof report.subjectAnalysis>).map((key) => (
              <div key={key} className="space-y-6">
                {report.subjectAnalysis[key]?.map((sub: any, idx: number) => (
                  <div key={idx} className="rounded-2xl border border-gray-100 bg-white p-8 space-y-6">
                    <h3 className="text-2xl font-extrabold text-blue-900">{sub?.name || sub?.subject}</h3>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-700 leading-relaxed"><strong>[기록 요약]</strong> {sub?.summary}</p>
                      <p className="text-sm text-blue-900 font-bold"><strong>[역량 평가]</strong> {sub?.eval}</p>
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <p className="text-sm text-gray-900"><strong>[한계 및 보완]</strong> <mark className="bg-yellow-200 px-1 rounded font-bold">{sub?.action}</mark></p>
                      </div>
                    </div>
                  </div>
                ))}
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
              <p className="relative z-10 pl-2">1학년: {report?.overall?.g1 || "기록 없음"}</p>
            </blockquote>
            <blockquote className="relative border-l-4 border-slate-200 bg-white p-6 rounded-r-2xl shadow-sm ring-1 ring-gray-100 italic text-gray-600">
              <span className="absolute -left-2 -top-4 text-6xl text-slate-100 font-serif">"</span>
              <p className="relative z-10 pl-2">2학년: {report?.overall?.g2 || "기록 없음"}</p>
            </blockquote>

            {/* [💡 AI 입학사정관 심층 분석] 박스 신설 */}
            {report?.overall?.analysis && (
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
                <p className="text-xl font-bold leading-relaxed break-keep">
                  {report?.overall?.final || "기록 없음"}
                </p>
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
