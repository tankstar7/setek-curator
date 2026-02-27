"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { universityData } from "@/lib/data/universities";

// ── 타입 ──────────────────────────────────────────────────────────────────────
interface University       { id: string; name: string; }
interface Major            { id: string; major_name: string; }
interface AnalysisResult {
  university:          string;
  major:               string;
  evaluationStyle:     string;
  evaluationNotice:    string;
  coreSubjects:        string[];
  recommendedSubjects: string[];
  keywords?:           string[];
  books?:              string[];
  deepTopics?:         string[];
  notes:               string[];
  isFallback:          boolean;
  fallbackMajorName:   string;
}

/** 공백 제거 + 소문자 — 대학명/학과명 비교용 */
const norm = (s: string) => s.replace(/\s/g, "").toLowerCase();


function ResultSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="h-5 w-40 animate-pulse rounded-full bg-gray-200" />
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="h-10 w-full animate-pulse rounded-xl bg-gray-100" style={{ animationDelay: `${j * 80}ms` }} />
          ))}
        </div>
      ))}
    </div>
  );
}
function SelectSkeleton() {
  return <div className="h-[46px] w-full animate-pulse rounded-xl bg-gray-100" />;
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────
export default function TargetAnalyzerPage() {
  const [universities,   setUniversities]   = useState<University[]>([]);
  const [majors,         setMajors]         = useState<Major[]>([]);
  const [initLoading,    setInitLoading]    = useState(true);
  const [majorsLoading,  setMajorsLoading]  = useState(false);

  const [selectedUnivId,    setSelectedUnivId]    = useState("");
  const [selectedMajorId,   setSelectedMajorId]   = useState("");
  const [selectedUnivName,  setSelectedUnivName]  = useState("");
  const [selectedMajorName, setSelectedMajorName] = useState("");

  const [searching, setSearching] = useState(false);
  const [result,    setResult]    = useState<AnalysisResult | null>(null);
  const [noData,    setNoData]    = useState(false);

  // 화면에 직접 표시할 raw 에러 (Supabase error 객체 그대로)
  const [rawError, setRawError] = useState<unknown>(null);

  const canSearch = selectedUnivId && selectedMajorId && !searching;

  // ── ① 대학 목록 로딩 — 연구원 분석 완료 대학만 노출 ──────────────────────
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("universities")
        .select("id, name")
        .order("name");

      if (error) { setRawError(error); setInitLoading(false); return; }

      // universityData(연구원 분석 완료 목록)에 있는 대학만 필터링
      const analyzedNames = new Set(universityData.map((u) => norm(u.university)));
      const filtered = (data ?? []).filter((u) => analyzedNames.has(norm(u.name)));

      setUniversities(filtered);
      setInitLoading(false);
    })();
  }, []);

  // ── ② 대학 선택 → 전공 목록 로딩 ────────────────────────────────────────
  const handleUnivChange = async (univId: string, univName: string) => {
    setSelectedUnivId(univId);
    setSelectedUnivName(univName);
    setSelectedMajorId("");
    setSelectedMajorName("");
    setMajors([]);
    setResult(null);
    setNoData(false);
    setRawError(null);
    if (!univId) return;

    setMajorsLoading(true);

    // Step A: univ_subject_requirements 에서 major_id 추출
    const { data: reqData, error: reqErr } = await supabase
      .from("univ_subject_requirements")
      .select("major_id")
      .eq("university_id", univId);

    if (reqErr) { setRawError(reqErr); setMajorsLoading(false); return; }

    const majorIds = [...new Set((reqData ?? []).map((r) => r.major_id as string))];
    if (majorIds.length === 0) { setMajors([]); setMajorsLoading(false); return; }

    // Step B: target_majors 에서 이름 조회
    const { data: majorData, error: majorErr } = await supabase
      .from("target_majors")
      .select("id, major_name")
      .in("id", majorIds)
      .order("major_name");

    if (majorErr) { setRawError(majorErr); setMajorsLoading(false); return; }

    // 연구원 분석 완료 학과만 노출
    const univGuide = universityData.find((u) => norm(u.university) === norm(univName));
    const analyzedMajorNames = (univGuide?.majors ?? []).map((m) => m.name);
    const filtered = (majorData ?? []).filter((m) =>
      analyzedMajorNames.some((name) => {
        const a = norm(name), b = norm(m.major_name);
        return a === b || a.includes(b) || b.includes(a);
      })
    );

    setMajors(filtered);
    setMajorsLoading(false);
  };

  // ── ③ 검색 실행 ──────────────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!canSearch) return;
    setSearching(true);
    setResult(null);
    setNoData(false);
    setRawError(null);

    // ── A: 로컬 프리미엄 데이터 (드롭다운이 이미 universityData 기준으로 필터링됨)
    const univGuide  = universityData.find((u) => norm(u.university) === norm(selectedUnivName));
    const majorGuide = univGuide?.majors.find((m) => {
      const a = norm(m.name), b = norm(selectedMajorName);
      return a === b || a.includes(b) || b.includes(a);
    });

    if (!majorGuide) {
      setNoData(true);
      setSearching(false);
      return;
    }

    // ── B: Supabase에서 입시처 공식 비고(note)만 조회
    let { data: reqRows, error: reqErr } = await supabase
      .from("univ_subject_requirements")
      .select("note")
      .eq("university_id", selectedUnivId)
      .eq("major_id", selectedMajorId);

    if (reqErr) { setRawError(reqErr); setSearching(false); return; }

    // ── Fallback: 해당 학과 note 없으면 계열 공통 전공으로 대체 (한양대 등)
    let isFallback = false;
    let fallbackMajorName = "";
    const hasNotes = (rows: { note: unknown }[] | null) =>
      (rows ?? []).some((r) => (r.note as string | null)?.trim());

    if (!hasNotes(reqRows)) {
      const FALLBACK_NAMES = ["전모집단위", "자연계열", "공학계열", "이공계열"];
      const fallback = majors.find((m) => FALLBACK_NAMES.includes(norm(m.major_name)));
      if (fallback) {
        const { data: fallbackRows, error: fallbackErr } = await supabase
          .from("univ_subject_requirements")
          .select("note")
          .eq("university_id", selectedUnivId)
          .eq("major_id", fallback.id);

        if (fallbackErr) { setRawError(fallbackErr); setSearching(false); return; }
        if (hasNotes(fallbackRows)) {
          reqRows = fallbackRows;
          isFallback = true;
          fallbackMajorName = fallback.major_name;
        }
      }
    }

    const notes = [...new Set(
      (reqRows ?? []).map((r) => (r.note as string | null)?.trim()).filter(Boolean) as string[]
    )];

    setResult({
      university:          selectedUnivName,
      major:               selectedMajorName,
      evaluationStyle:     majorGuide.evaluationStyle,
      evaluationNotice:    majorGuide.evaluationNotice,
      coreSubjects:        majorGuide.coreSubjects,
      recommendedSubjects: majorGuide.recommendedSubjects,
      keywords:            majorGuide.keywords,
      books:               majorGuide.books,
      deepTopics:          majorGuide.deepTopics,
      notes,
      isFallback,
      fallbackMajorName,
    });
    setSearching(false);
  };

  // ── 에러가 있으면 화면 정중앙에 즉시 출력 ────────────────────────────────
  if (rawError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-10">
        <div className="w-full max-w-2xl rounded-2xl border border-red-300 bg-red-50 p-8 shadow-lg">
          <p className="mb-4 text-xl font-bold text-red-600">🚨 에러 발생</p>
          <pre className="overflow-auto rounded-xl bg-white p-4 text-sm text-red-700 shadow-inner whitespace-pre-wrap break-all">
            {JSON.stringify(rawError, null, 2)}
          </pre>
          <button
            onClick={() => { setRawError(null); setInitLoading(true); window.location.reload(); }}
            className="mt-6 rounded-xl bg-red-600 px-6 py-2.5 font-bold text-white hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-50 pb-24">

      {/* ── 헤더 ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2544] via-[#1e3a5f] to-[#2d5282] px-4 py-6 text-white">
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1">
            <span className="text-xs font-bold text-amber-300">PREMIUM</span>
            <span className="h-1 w-1 rounded-full bg-amber-400/60" />
            <span className="text-xs text-amber-200">세특큐레이터 독자 분석 서비스</span>
          </div>
          <h1 className="mb-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
            목표 대학 정밀 분석기
          </h1>
          <p className="text-sm text-blue-200">
            희망 대학·학과의 <strong className="text-white">공식 권장 과목</strong>과{" "}
            <strong className="text-white">세특큐레이터 독자 전략</strong>을 한 눈에 비교하세요.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4">

        {/* ── 검색 카드 ── */}
        <div className="mt-8 mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">

            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">목표 대학교</label>
              {initLoading ? <SelectSkeleton /> : (
                <select
                  value={selectedUnivId}
                  onChange={(e) => {
                    const opt = e.target.options[e.target.selectedIndex];
                    handleUnivChange(e.target.value, opt.text);
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">{universities.length === 0 ? "⚠ 데이터 없음" : "대학교 선택"}</option>
                  {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              )}
            </div>

            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">모집단위 / 전공</label>
              {initLoading ? <SelectSkeleton /> : (
                <div className="relative">
                  <select
                    value={selectedMajorId}
                    onChange={(e) => {
                      const opt = e.target.options[e.target.selectedIndex];
                      setSelectedMajorId(e.target.value);
                      setSelectedMajorName(opt.text);
                      setResult(null);
                      setNoData(false);
                    }}
                    disabled={!selectedUnivId || majorsLoading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {majorsLoading ? "불러오는 중..." : majors.length === 0 && selectedUnivId ? "⚠ 데이터 없음" : "전공 선택"}
                    </option>
                    {majors.map((m) => <option key={m.id} value={m.id}>{m.major_name}</option>)}
                  </select>
                  {majorsLoading && (
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="h-4 w-4 animate-spin text-blue-400" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleSearch}
              disabled={!canSearch}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a5f] to-[#2d5282] px-8 py-3 font-bold text-white transition hover:from-[#152c4a] hover:to-[#1e3a5f] disabled:cursor-not-allowed disabled:opacity-40 sm:shrink-0"
            >
              {searching ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  분석 중...
                </span>
              ) : "분석 시작 →"}
            </button>
          </div>
        </div>

        {/* ── 초기 안내 ── */}
        {!searching && !result && !noData && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-violet-50 text-5xl shadow-inner">🎯</div>
            <h2 className="mb-2 text-xl font-bold text-gray-800">목표 대학을 선택하세요</h2>
            <p className="max-w-sm text-sm leading-relaxed text-gray-500">
              대학교와 전공을 선택하고 분석 시작 버튼을 누르면<br />공식 권장 과목을 즉시 확인할 수 있습니다.
            </p>
          </div>
        )}

        {/* ── 검색 로딩 ── */}
        {searching && (
          <div>
            <div className="mb-6 flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-sm font-semibold text-blue-700">{selectedUnivName} {selectedMajorName} 데이터를 불러오는 중...</span>
            </div>
            <ResultSkeleton />
          </div>
        )}

        {/* ── 데이터 없음 ── */}
        {noData && !searching && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <h2 className="mb-2 text-lg font-bold text-gray-700">해당 대학/학과의 정밀 분석 데이터가 업데이트 중입니다.</h2>
            <p className="text-sm text-gray-500">
              <strong>{selectedUnivName} {selectedMajorName}</strong>의 데이터는 현재 준비 중이에요.
            </p>
          </div>
        )}

        {/* ── 결과 영역 ── */}
        {result && !searching && (
          <div className="space-y-6">

            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏫</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">분석 대상</p>
                  <p className="text-base font-extrabold text-gray-900">{result.university} &middot; {result.major}</p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-bold text-green-700">✓ 분석 완료</span>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] text-gray-500">2025학년도 기준</span>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
              <span className="mt-0.5 shrink-0 text-base">⚠️</span>
              <p className="text-xs leading-relaxed text-amber-800">
                <strong className="font-bold">안내:</strong>{" "}
                본 분석 자료는 대교협 공식 발표 및 대학별 가이드라인을 바탕으로 제공되는 참고용 자료입니다.
                실제 대입 지원 시에는 반드시 해당 대학의 당해 연도 최종 모집요강을 확인하시기 바랍니다.
              </p>
            </div>

            {/* ── 메인 그리드: 좌(프리미엄 분석) / 우(공식 가이드라인) ── */}
            <div className="grid gap-5 lg:grid-cols-2">

              {/* ── 좌측: 세특큐레이터 프리미엄 분석 ── */}
              <div className="flex flex-col overflow-hidden rounded-2xl border border-violet-200/60 bg-white shadow-sm">
                <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white text-base">🔬</div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Exclusive Premium</p>
                      <h2 className="text-base font-extrabold text-gray-900">세특큐레이터 독자 분석</h2>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">PREMIUM</span>
                        <span className="text-[11px] text-gray-400">연구원 직접 분석 · 22개정 기준</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-6 p-6">

                  {/* 입학사정관의 시선 */}
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">💡 입학사정관의 시선</p>
                    <span className="mb-3 inline-block rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700">
                      {result.evaluationStyle}
                    </span>
                    <p className="text-sm leading-relaxed text-slate-700">{result.evaluationNotice}</p>
                  </div>

                  {/* 핵심 이수 과목 */}
                  {result.coreSubjects.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-violet-600" />
                        <p className="text-xs font-bold text-gray-700">핵심 이수 과목</p>
                        <span className="ml-auto rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-bold text-white">필수</span>
                      </div>
                      <ul className="space-y-2">
                        {result.coreSubjects.map((s, i) => (
                          <li key={i} className="flex items-center gap-2.5 rounded-xl border border-violet-100 bg-violet-50/70 px-3 py-2.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-extrabold text-white">✓</span>
                            <span className="text-sm font-semibold text-violet-900">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 권장 이수 과목 */}
                  {result.recommendedSubjects.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                        <p className="text-xs font-bold text-gray-700">권장 이수 과목</p>
                      </div>
                      <ul className="space-y-2">
                        {result.recommendedSubjects.map((s, i) => (
                          <li key={i} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-500">▸</span>
                            <span className="text-sm font-medium text-slate-700">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 핵심 키워드 (있을 때만) */}
                  {result.keywords && result.keywords.length > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">🏷 핵심 키워드</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.keywords.map((kw, i) => (
                          <span key={i} className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 추천 도서 (있을 때만) */}
                  {result.books && result.books.length > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">📚 추천 도서</p>
                      <ol className="list-decimal list-inside space-y-1">
                        {result.books.map((book, i) => (
                          <li key={i} className="text-sm text-slate-700">{book}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* 심화 탐구 주제 (있을 때만) */}
                  {result.deepTopics && result.deepTopics.length > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">🔭 심화 탐구 주제</p>
                      <div className="space-y-2">
                        {result.deepTopics.map((topic, i) => (
                          <div key={i} className="rounded-xl border border-violet-100 bg-violet-50/60 px-3 py-2.5 text-sm text-slate-700">
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── 우측: 입시처 공식 가이드라인 ── */}
              <div className="flex flex-col overflow-hidden rounded-2xl border border-blue-200/60 bg-white shadow-sm">
                <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-slate-50 px-6 py-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white text-base">📋</div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Official</p>
                      <h2 className="text-base font-extrabold text-gray-900">입시처 공식 가이드라인</h2>
                      <p className="mt-0.5 text-[11px] text-gray-400">대교협 발표 · 해당 대학 모집요강 비고</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {result.isFallback && (
                    <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5">
                      <p className="text-xs text-blue-700">
                        ℹ️ <strong>{result.fallbackMajorName}</strong> 기준 데이터 적용 (계열 공통)
                      </p>
                    </div>
                  )}
                  {result.notes.length > 0 ? (
                    <ul className="space-y-3">
                      {result.notes.map((note, i) => (
                        <li key={i} className="flex gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                          <span className="mt-0.5 shrink-0 text-blue-400">📌</span>
                          <p className="text-sm leading-relaxed text-slate-700">{note}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-1 items-center justify-center py-10 text-center">
                      <div>
                        <p className="mb-2 text-2xl">📭</p>
                        <p className="text-sm font-semibold text-gray-500">등록된 비고 없음</p>
                        <p className="mt-1 text-xs text-gray-400">해당 학과는 별도 입시처 비고가 없습니다.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e3a5f] to-[#2d5282] p-8 shadow-lg">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                <div className="shrink-0 text-4xl">🚀</div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-300">다음 단계</p>
                  <h3 className="mt-0.5 text-xl font-extrabold text-white">{result.major}에 최적화된 프리미엄 세특 보고서 보기</h3>
                  <p className="mt-1 text-sm text-blue-200">위 과목들과 연계된 심화 탐구 보고서를 즉시 확인하세요.</p>
                </div>
                <Link
                  href={`/lab?keyword=${encodeURIComponent(result.major)}`}
                  className="shrink-0 rounded-xl bg-white px-8 py-3.5 font-extrabold text-[#1e3a5f] shadow-md transition hover:bg-blue-50"
                >
                  보고서 확인하기 →
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
