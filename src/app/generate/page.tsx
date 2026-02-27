"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getReports } from "@/lib/db";
import type { Report } from "@/lib/db";
import { generatePageFilters } from "@/lib/mockData";

// ── 우측 패널 로딩 스켈레톤
function ReportSkeleton() {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-white p-5 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-40" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border bg-white p-5 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

// ── 자유 공개 섹션
function ReportSection({ icon, title, content }: { icon: string; title: string; content: string }) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-800">
            <span>{icon}</span>{title}
          </CardTitle>
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            무료 공개
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-gray-700">{content}</p>
      </CardContent>
    </Card>
  );
}

// ── 잠금 섹션 (Paywall)
function LockedSection({ icon, title, description, onUnlock }: {
  icon: string; title: string; description: string; onUnlock: () => void;
}) {
  return (
    <Card className="relative overflow-hidden border-orange-200 shadow-sm" style={{ minHeight: 160 }}>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/85 backdrop-blur-sm px-4">
        <span className="mb-2 text-3xl">🔒</span>
        <p className="mb-1 text-sm font-bold text-gray-800">{title}</p>
        <p className="mb-4 max-w-xs text-center text-xs text-gray-500">{description}</p>
        <Button onClick={onUnlock} size="sm" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500 font-semibold px-5">
          잠금 해제하기
        </Button>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-800">
          <span>{icon}</span>{title}
          <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-600">프리미엄</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-5/6 rounded bg-gray-200" />
          <div className="h-3 w-4/5 rounded bg-gray-200" />
          <div className="h-3 w-3/5 rounded bg-gray-200" />
        </div>
      </CardContent>
    </Card>
  );
}

// ── 메인 페이지
export default function GeneratePage() {
  const searchParams = useSearchParams();

  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [publisher, setPublisher] = useState("");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");

  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);

  const units = generatePageFilters.units[subject] ?? [];

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setSelectedReport(null);
    try {
      const results = await getReports({
        subject: subject || undefined,
        major_unit: unit || undefined,
        publisher: publisher || undefined,
        trend_keyword: keyword || undefined,
        limitCount: 20,
      });
      setReports(results);
      setSelectedReport(results[0] ?? null);
    } finally {
      setLoading(false);
    }
  }, [subject, unit, publisher, keyword]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* ── Page Header ── */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-4 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <Badge className="mb-3 bg-blue-500/20 text-blue-200 border-blue-400/30">세특 보고서 생성</Badge>
          <h1 className="text-2xl font-extrabold sm:text-3xl">맞춤형 세특 탐구 보고서</h1>
          <p className="mt-1 text-sm text-blue-100">
            과목·단원·출판사·트렌드 키워드를 선택하고 최적의 탐구 주제와 초안을 확인하세요.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 lg:flex-row">

          {/* ── 좌측: 필터 + 결과 목록 ── */}
          <aside className="w-full shrink-0 space-y-4 lg:w-72">
            {/* 필터 */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-gray-700">🔍 탐구 조건 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-600">과목</label>
                  <select
                    value={subject}
                    onChange={(e) => { setSubject(e.target.value); setUnit(""); }}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">전체</option>
                    {generatePageFilters.subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-600">대단원</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">전체</option>
                    {units.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-600">교과서 출판사</label>
                  <select
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택 안 함</option>
                    {generatePageFilters.publishers.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-600">트렌드 키워드</label>
                  <div className="flex flex-wrap gap-1.5">
                    {generatePageFilters.trendKeywords.map((kw) => (
                      <button
                        key={kw}
                        onClick={() => setKeyword(kw === keyword ? "" : kw)}
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                          keyword === kw
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
                        }`}
                      >
                        #{kw}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 검색 결과 목록 */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-gray-500 flex items-center justify-between">
                  <span>검색 결과</span>
                  {!loading && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                      {reports.length}건
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-1.5 rounded-lg border p-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : reports.length === 0 ? (
                  <p className="py-4 text-center text-xs text-gray-400">조건에 맞는 보고서가 없습니다.</p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {reports.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => { setSelectedReport(r); setShowPaywall(false); }}
                        className={`w-full rounded-lg border p-3 text-left transition-all ${
                          selectedReport?.id === r.id
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50"
                        }`}
                      >
                        <p className="mb-1.5 text-xs font-semibold leading-snug text-gray-800 line-clamp-2">
                          {r.report_title}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                            {r.subject}
                          </span>
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-600">
                            #{r.trend_keyword}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* ── 우측: 보고서 본문 ── */}
          <section className="flex-1">
            {loading ? (
              <ReportSkeleton />
            ) : !selectedReport ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border bg-white text-center p-8">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-semibold text-gray-700">조건에 맞는 탐구 주제가 없습니다</p>
                <p className="mt-1 text-sm text-gray-400">필터 조건을 변경해 보세요.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* 보고서 메타 */}
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="pt-5">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="secondary">{selectedReport.subject}</Badge>
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        #{selectedReport.trend_keyword}
                      </Badge>
                      {selectedReport.target_majors.map((m) => (
                        <Badge key={m} className="bg-blue-50 text-blue-700 border-blue-200 text-xs">{m}</Badge>
                      ))}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 leading-snug">
                      {selectedReport.report_title}
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      {selectedReport.major_unit} · {selectedReport.publisher}
                    </p>
                  </CardContent>
                </Card>

                <ReportSection icon="💡" title="탐구 동기" content={selectedReport.golden_template.motivation} />
                <ReportSection icon="📖" title="교과서 연계 기초 지식" content={selectedReport.golden_template.basic_knowledge} />
                <ReportSection icon="🔬" title="내용 탐구" content={selectedReport.golden_template.application} />

                <LockedSection
                  icon="🧪"
                  title="석학 시선의 심화 탐구"
                  description="현직 연구원이 직접 작성한 대학원 수준의 심화 분석이 포함되어 있습니다."
                  onUnlock={() => setShowPaywall(true)}
                />
                <LockedSection
                  icon="🎓"
                  title="전공 연계 비전"
                  description="이 탐구가 목표 전공의 어떤 세부 연구 분야와 연결되는지 구체적으로 제시합니다."
                  onUnlock={() => setShowPaywall(true)}
                />
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── Paywall Modal ── */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-4xl mb-3">🔓</p>
              <h2 className="text-xl font-bold text-gray-900 mb-2">프리미엄 보고서 잠금 해제</h2>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                심화 탐구 & 전공 연계 비전을 포함한<br />
                <strong>완전한 세특 보고서</strong>를 확인하고 다운로드하세요.
              </p>
              <div className="mb-5 rounded-xl bg-blue-50 p-4 text-left space-y-2">
                {["✅ 석학 시선의 심화 탐구 전문", "✅ 전공 연계 비전 & 진로 로드맵", "✅ 출판사 맞춤 교과서 연계 심화", "✅ PDF 다운로드 및 복사 가능"].map((item) => (
                  <p key={item} className="text-sm text-gray-700">{item}</p>
                ))}
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-[#1e3a5f] text-white font-bold py-5 text-base rounded-xl mb-3">
                프리미엄 결제하고 전체 보고서 확인하기
              </Button>
              <button onClick={() => setShowPaywall(false)} className="text-xs text-gray-400 hover:text-gray-600">닫기</button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Floating Paywall Bar ── */}
      {selectedReport && !loading && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white px-4 py-3 shadow-2xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-gray-900">🔒 심화 탐구 · 전공 연계 파트가 잠겨 있어요</p>
              <p className="text-xs text-gray-500">프리미엄 결제 후 전체 보고서를 확인하고 다운로드하세요</p>
            </div>
            <Button
              onClick={() => setShowPaywall(true)}
              className="shrink-0 bg-gradient-to-r from-blue-600 to-[#1e3a5f] px-5 py-4 font-bold text-white hover:from-blue-500 hover:to-[#2d5282] rounded-xl text-sm"
            >
              프리미엄 결제하기
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
