"use client";

/**
 * PremiumReportPDF.tsx
 *
 * 인쇄 4원칙 (globals.css의 @page { margin:0 } 와 세트로 작동)
 * ① @page margin:0 → 브라우저 URL/날짜 제거 / 내부 padding이 인쇄 여백
 * ② flex·grid 부모에 print:block → 인쇄 모드 레이아웃 충돌 방지
 * ③ print:break-before-page → 학년 대분류에만 / 카드 컨테이너 금지
 * ④ print:break-inside-avoid → 가장 작은 단위의 개별 카드에만 적용
 */

import React from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Legend,
} from "recharts";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
type GradeKey = "grade1" | "grade2" | "grade3";
type SubjectTabKey = "group1" | "group2" | "group3";

interface SubjectCard { subject: string; summary: string; eval: string; limit: string; }
interface CreativeItem {
  grade: string; isActionPlan?: boolean; desc?: string;
  academic?: string; career?: string; community?: string;
}
interface GradeAnalysis {
  balance: string; major_related: string; trend: string;
  outlier: string; overall: string; warning: string;
}
interface ReportData {
  attendance: string; volunteer: string; creative: CreativeItem[];
  overall: { g1: string; g2: string; g3?: string | null; final: string; analysis: string };
  scores?: { 학업역량?: number; 진로역량?: number; 공동체역량?: number; "성장 주도성"?: number; "탐구 깊이"?: number };
  grade_trends: Record<string, Array<{ subject: string; sem1: string; sem2: string }>>;
  grade_analysis?: GradeAnalysis;
  subject_activity: Record<string, Record<string, SubjectCard[]>>;
}
export interface PremiumReportPDFProps {
  report: ReportData; major: string; createdAt?: string;
}

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────
const GRADE_KEYS: GradeKey[] = ["grade1", "grade2", "grade3"];
const GRADE_LABELS: Record<GradeKey, string> = { grade1: "1학년", grade2: "2학년", grade3: "3학년" };
const SUBJECT_TABS: Array<{ key: SubjectTabKey; label: string }> = [
  { key: "group1", label: "국어·영어·수학" },
  { key: "group2", label: "한국사·사회·과학" },
  { key: "group3", label: "기타 교과" },
];
const NAVY = "#1e3a5f";
const LIGHT_NAVY = "#2d5282";

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

function parseGradeScore(s: string): number | null {
  if (!s) return null;
  const clean = s.replace(/\([^)]*\)/g, "").trim();
  const n = clean.match(/^(\d)/);
  if (n) {
    const m: Record<number, number> = { 1: 95, 2: 85, 3: 75, 4: 65, 5: 55, 6: 45, 7: 35, 8: 25, 9: 15 };
    return m[parseInt(n[1])] ?? null;
  }
  const ach: Record<string, number> = { A: 95, B: 80, C: 65, D: 50, E: 35 };
  const l = clean.toUpperCase().match(/^([ABCDE])/)?.[1];
  return l ? (ach[l] ?? null) : null;
}
function fmtDate(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
function strip(s: string): string { return s?.replace(/\([^)]*\)/g, "").trim() || "—"; }

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────

/**
 * PdfPage — A4 논리 페이지 래퍼
 * - 화면: 210mm × 277mm 카드
 * - 인쇄: print:w-full print:min-h-0 → 브라우저가 A4 크기 처리
 * - breakBefore: 학년 페이지만 print:break-before-page
 */
function PdfPage({
  children,
  isFirst = false,
}: { children: React.ReactNode; isFirst?: boolean }) {
  return (
    <div
      className={[
        "bg-white",
        // 화면에서 A4 크기 유지
        // 인쇄에서 width·minHeight 해제 → 밀림/짤림 방지
        "print:w-full print:min-h-0 print:overflow-visible",
        // ③ 학년 대분류 페이지에만 강제 페이지 넘김 (첫 페이지 제외)
        !isFirst ? "print:break-before-page" : "",
      ].join(" ")}
      style={{
        width: "210mm",
        minHeight: "277mm",   // @page margin:10mm 보정값
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

/** 페이지 공통 헤더 (로고 + 날짜) */
function PageHeader({ major, createdAt }: { major: string; createdAt?: string }) {
  return (
    // ② flex 부모 → print:block
    <div
      className="flex items-center justify-between print:block"
      style={{ marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid #e5e7eb` }}
    >
      <span style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>🎓 세특큐레이터 AI 분석 리포트</span>
      <span style={{ fontSize: 9, color: "#9ca3af" }}>{major} · {fmtDate(createdAt)}</span>
    </div>
  );
}

/** 섹션 제목 구분선 */
function SectionHeading({ icon, title, color = NAVY }: { icon: string; title: string; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, borderBottom: `2px solid ${color}`, paddingBottom: 5 }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <h3 style={{ margin: 0, fontSize: 12, fontWeight: 800, color, letterSpacing: "-0.3px" }}>{title}</h3>
    </div>
  );
}

/**
 * SubjectCardBlock — 가장 작은 단위의 개별 카드
 * ④ 여기에만 print:break-inside-avoid 적용
 *    overflow는 반드시 visible (hidden이면 인쇄 시 두동강 원인)
 */
function SubjectCardBlock({ card }: { card: SubjectCard }) {
  return (
    <div
      className="print:break-inside-avoid"   // ④ 개별 카드 단위에만
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        marginBottom: 10,
        overflow: "visible",                   // hidden 절대 금지
      }}
    >
      <div style={{ background: NAVY, padding: "5px 12px", borderRadius: "8px 8px 0 0" }}>
        <span style={{ color: "white", fontWeight: 700, fontSize: 11 }}>{card.subject}</span>
      </div>
      <div style={{ padding: "10px 12px", fontSize: 9.5, lineHeight: 1.75, color: "#374151" }}>
        <div style={{ marginBottom: 7 }}>
          <span style={{ fontWeight: 700, color: "#6366f1" }}>📋 기록 요약</span>
          <p style={{ margin: "3px 0 0", orphans: 3, widows: 3 }}>{card.summary || "—"}</p>
        </div>
        <div style={{ marginBottom: 7 }}>
          <span style={{ fontWeight: 700, color: "#0ea5e9" }}>🔍 역량 평가</span>
          <p style={{ margin: "3px 0 0", orphans: 3, widows: 3 }}>{card.eval || "—"}</p>
        </div>
        <div style={{ background: "#fef9c3", borderRadius: 4, padding: "6px 8px" }}>
          <span style={{ fontWeight: 700, color: "#92400e" }}>⚠️ 한계 및 액션플랜</span>
          <p style={{ margin: "3px 0 0", orphans: 3, widows: 3 }}>{card.limit || "제시된 한계 및 보완점이 없습니다."}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────
export default function PremiumReportPDF({ report, major, createdAt }: PremiumReportPDFProps) {

  // 역량 레이더 데이터
  const s = report.scores;
  const radarData = [
    { axis: "학업역량",    score: s?.학업역량   ?? 0 },
    { axis: "진로역량",    score: s?.진로역량   ?? 0 },
    { axis: "공동체역량",  score: s?.공동체역량 ?? 0 },
    { axis: "탐구 깊이",   score: s?.["탐구 깊이"]   ?? 0 },
    { axis: "성장 주도성", score: s?.["성장 주도성"] ?? 0 },
  ];

  // 성적 추이 바 차트 데이터
  const gradeBarData = GRADE_KEYS.map((gk) => {
    const rows = report.grade_trends?.[gk] || [];
    const scores = rows.flatMap((r) => [parseGradeScore(r.sem1), parseGradeScore(r.sem2)]).filter((v): v is number => v !== null);
    return { name: GRADE_LABELS[gk], 평균점수: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0 };
  });

  return (
    <>
      {/* ════════════════════════════════════════════════════
          PAGE 1 — Cover + Executive Summary
          isFirst=true → print:break-before-page 없음
      ════════════════════════════════════════════════════ */}
      <PdfPage isFirst>
        {/* ── 커버 그라데이션 블록
            ② flex 컬럼이지만 단일 뷰라 안전. print:block 불필요 */}
        <div style={{
          background: `linear-gradient(145deg, ${NAVY} 0%, ${LIGHT_NAVY} 60%, #3b82f6 100%)`,
          padding: "22mm 18mm 14mm",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          {/* 로고 */}
          <div style={{ marginBottom: 26 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "7px 15px" }}>
              <span style={{ fontSize: 18 }}>🎓</span>
              <span style={{ color: "white", fontWeight: 900, fontSize: 13, letterSpacing: "-0.5px" }}>세특큐레이터</span>
            </div>
          </div>

          {/* 타이틀 */}
          <div style={{ borderLeft: "4px solid rgba(255,255,255,0.5)", paddingLeft: 18, marginBottom: 28 }}>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 9.5, fontWeight: 600, margin: "0 0 7px", letterSpacing: "2px", textTransform: "uppercase" }}>
              Premium AI Report
            </p>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 8px", lineHeight: 1.3, letterSpacing: "-1px" }}>
              AI 생기부<br />정밀 분석 리포트
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, margin: 0 }}>
              2027학년도 대입 학생부종합전형 대비
            </p>
          </div>

          {/* 희망 전공 / 분석 일시 — ② flex 행 → print:block */}
          <div className="flex gap-3 print:block print:space-y-2">
            {[{ label: "희망 전공", value: major || "미지정" }, { label: "분석 일시", value: fmtDate(createdAt) }].map(({ label, value }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "9px 14px", flex: 1 }}>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 8, margin: "0 0 2px", fontWeight: 600, letterSpacing: "1px" }}>{label}</p>
                <p style={{ color: "white", fontSize: 12, fontWeight: 800, margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Executive Summary */}
        <div style={{ padding: "20px 18mm 16mm" }}>
          <h2 style={{ fontSize: 12, fontWeight: 800, color: NAVY, margin: "0 0 12px", borderBottom: `2px solid ${NAVY}`, paddingBottom: 5 }}>
            📊 Executive Summary — 핵심 역량 분석
          </h2>

          {/* ② flex 행 → print:block / ④ 차트 래퍼 → print:break-inside-avoid print:block */}
          <div className="flex gap-4 items-start print:block">

            {/* 레이더 차트 래퍼 — ④ 차트는 직접 부모에만 break-inside-avoid */}
            <div className="print:break-inside-avoid print:block shrink-0">
              <RadarChart
                width={220} height={200}
                data={radarData}
                outerRadius="65%"
                margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
              >
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fontSize: 8, fill: "#374151", fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={90} domain={[50, 100]} tick={false} axisLine={false} />
                <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2}
                  label={{ fontSize: 8, fontWeight: 700, fill: "#1e3a5f" }}
                />
              </RadarChart>
            </div>

            {/* 기본 정보 + 최종 평결 */}
            <div style={{ flex: 1 }}>
              {/* ② grid → print:block */}
              <div className="grid grid-cols-2 gap-2 mb-3 print:block print:space-y-2">
                {/* ④ 개별 정보 박스에 break-inside-avoid */}
                <div className="print:break-inside-avoid" style={{ background: "#f0f9ff", borderRadius: 8, padding: "8px 10px", border: "1px solid #bae6fd" }}>
                  <p style={{ margin: 0, fontWeight: 700, color: "#0369a1", fontSize: 8.5 }}>📅 출결 사항</p>
                  <p style={{ margin: "2px 0 0", color: "#374151", fontSize: 8.5, orphans: 3, widows: 3 }}>{report.attendance}</p>
                </div>
                <div className="print:break-inside-avoid" style={{ background: "#f0fdf4", borderRadius: 8, padding: "8px 10px", border: "1px solid #bbf7d0" }}>
                  <p style={{ margin: 0, fontWeight: 700, color: "#15803d", fontSize: 8.5 }}>🤝 봉사 활동</p>
                  <p style={{ margin: "2px 0 0", color: "#374151", fontSize: 8.5, orphans: 3, widows: 3 }}>{report.volunteer}</p>
                </div>
              </div>
              {/* ④ 최종 평결 박스 */}
              <div className="print:break-inside-avoid" style={{ background: "#fafafa", borderRadius: 8, padding: "10px 12px", border: "1px solid #e5e7eb" }}>
                <p style={{ margin: "0 0 3px", fontWeight: 700, color: NAVY, fontSize: 9.5 }}>🏆 AI 최종 평결</p>
                <p style={{ margin: 0, color: "#374151", fontSize: 8.5, lineHeight: 1.8, orphans: 3, widows: 3 }}>
                  {report.overall.final || "종합 평가 내용이 없습니다."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </PdfPage>

      {/* ════════════════════════════════════════════════════
          PAGE 2 — 성적 추이 + 행동 특성
          ③ print:break-before-page → 무조건 새 페이지
      ════════════════════════════════════════════════════ */}
      <PdfPage>
        <div className="report-section" style={{ padding: "6mm 18mm" }}>
          <PageHeader major={major} createdAt={createdAt} />

          {/* 투명 범퍼: 잘려서 넘어온 페이지 최상단에 15mm 공간 자동 주입 */}
          <table className="w-full">
            <thead className="hidden print:table-header-group">
              <tr><td><div className="h-[8mm]"></div></td></tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <SectionHeading icon="📈" title="학년별 성적 추이 분석" />

                  {/* ④ 차트 래퍼 — 직접 부모에 break-inside-avoid + print:block */}
                  <div className="print:break-inside-avoid print:block" style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
                    <BarChart width={450} height={165} data={gradeBarData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 8.5 }} tickFormatter={(v) => `${v}점`} />
                      <Bar dataKey="평균점수" radius={[5, 5, 0, 0]} maxBarSize={54}>
                        {gradeBarData.map((_, i) => <Cell key={i} fill={i === 0 ? "#3b82f6" : i === 1 ? LIGHT_NAVY : NAVY} />)}
                      </Bar>
                      <Legend wrapperStyle={{ fontSize: 9.5 }} />
                    </BarChart>
                  </div>

                  {/* 성적 테이블 — 각 학년 테이블을 print:break-inside-avoid로 보호 */}
                  {GRADE_KEYS.map((gk) => {
                    const rows = report.grade_trends?.[gk] || [];
                    if (!rows.length) return null;
                    return (
                      <div key={gk} className="print:break-inside-avoid" style={{ marginBottom: 14 }}>
                        <h4 style={{ margin: "0 0 5px", fontSize: 10.5, fontWeight: 700, color: NAVY }}>
                          {GRADE_LABELS[gk]} 과목별 성적
                        </h4>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8.5 }}>
                          <thead>
                            <tr style={{ background: NAVY, color: "white" }}>
                              {["과목명", "1학기", "2학기"].map((h, i) => (
                                <th key={h} style={{ padding: "5px 10px", textAlign: i === 0 ? "left" : "center", fontWeight: 700 }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, i) => (
                              <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "white" }}>
                                <td style={{ padding: "4px 10px", color: "#374151", fontWeight: 500 }}>{strip(row.subject)}</td>
                                <td style={{ padding: "4px 10px", textAlign: "center", color: "#1e40af", fontWeight: 600 }}>{strip(row.sem1)}</td>
                                <td style={{ padding: "4px 10px", textAlign: "center", color: "#1e40af", fontWeight: 600 }}>{strip(row.sem2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}

                  {/* 학업성취도 정밀 분석 */}
                  {report.grade_analysis && (() => {
                    const ga = report.grade_analysis;
                    const rows: { label: string; value: string; bold?: boolean }[] = [
                      { label: "균형성 분석",   value: ga.balance },
                      { label: "전공 연계 과목", value: ga.major_related },
                      { label: "학년별 추이",   value: ga.trend },
                      { label: "이탈 과목",     value: ga.outlier },
                      { label: "종합 평가",     value: ga.overall, bold: true },
                    ];
                    return (
                      <div className="print:break-inside-avoid" style={{ marginBottom: 16 }}>
                        <SectionHeading icon="📊" title="학업성취도 정밀 분석" />
                        {ga.warning && (
                          <div style={{ background: "#fefce8", border: "1px solid #fde047", borderRadius: 6, padding: "6px 10px", marginBottom: 8, display: "flex", gap: 6, alignItems: "flex-start" }}>
                            <span style={{ fontSize: 9, color: "#a16207", flexShrink: 0 }}>⚠️</span>
                            <p style={{ margin: 0, fontSize: 8, color: "#92400e", lineHeight: 1.5 }}>{ga.warning}</p>
                          </div>
                        )}
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8.5 }}>
                          <tbody>
                            {rows.map(({ label, value, bold }) => (
                              <tr key={label} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "5px 10px", width: "22%", fontWeight: 700, color: NAVY, background: "#f8fafc", whiteSpace: "nowrap" }}>{label}</td>
                                <td style={{ padding: "5px 10px", color: "#374151", lineHeight: 1.65, fontWeight: bold ? 700 : 400 }}>{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}

                  {/* 행동 특성 */}
                  <SectionHeading icon="📝" title="행동 특성 및 종합 의견" />

                  {/* ② grid → print:block */}
                  <div className="grid grid-cols-2 gap-3 mb-3 print:block print:space-y-3">
                    {[{ label: "1학년", text: report.overall.g1 }, { label: "2학년", text: report.overall.g2 }].map(({ label, text }) => (
                      /* ④ 개별 의견 박스 */
                      <div key={label} className="print:break-inside-avoid" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 11px" }}>
                        <p style={{ margin: "0 0 3px", fontSize: 9.5, fontWeight: 700, color: NAVY }}>{label} 종합</p>
                        <p style={{ margin: 0, fontSize: 8.5, lineHeight: 1.75, color: "#374151", orphans: 3, widows: 3 }}>{text || "기록 없음"}</p>
                      </div>
                    ))}
                  </div>
                  {report.overall.g3 && (
                    <div className="print:break-inside-avoid" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 11px", marginBottom: 12 }}>
                      <p style={{ margin: "0 0 3px", fontSize: 9.5, fontWeight: 700, color: NAVY }}>3학년 종합</p>
                      <p style={{ margin: 0, fontSize: 8.5, lineHeight: 1.75, color: "#374151", orphans: 3, widows: 3 }}>{report.overall.g3}</p>
                    </div>
                  )}

                  {report.overall.analysis && (
                    /* ④ 심층 분석 박스 */
                    <div className="print:break-inside-avoid" style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "9px 11px" }}>
                      <p style={{ margin: "0 0 3px", fontSize: 9.5, fontWeight: 700, color: "#1e40af" }}>🔍 심층 분석</p>
                      <p style={{ margin: 0, fontSize: 8.5, lineHeight: 1.75, color: "#374151", orphans: 3, widows: 3 }}>{report.overall.analysis}</p>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </PdfPage>

      {/* ════════════════════════════════════════════════════
          PAGE 3~5 — 학년별 창체 + 교과 세특
          ③ 각 학년 PdfPage → print:break-before-page (PdfPage 기본 동작)
      ════════════════════════════════════════════════════ */}
      {GRADE_KEYS.map((gk) => {
        const gradeLabel    = GRADE_LABELS[gk];
        const creativeItem  = report.creative.find((c) => c.grade === gradeLabel);
        const actionPlan    = report.creative.find((c) => c.grade === "3학년(예정)");
        const subjectAct    = report.subject_activity?.[gk] || {};

        return (
          <PdfPage key={gk}>
            {/* ① 내부 padding이 인쇄 여백 역할 (@page margin:0 보정) */}
            <div className="report-section" style={{ padding: "6mm 18mm" }}>
              <PageHeader major={major} createdAt={createdAt} />

              {/* 투명 범퍼: 잘려서 넘어온 페이지 최상단에 15mm 공간 자동 주입 */}
              <table className="w-full">
                <thead className="hidden print:table-header-group">
                  <tr><td><div className="h-[8mm]"></div></td></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {/* ③ 학년 뱃지 — 대분류 타이틀. break-before는 PdfPage가 담당 */}
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: NAVY, color: "white", borderRadius: 10,
                        padding: "7px 18px", marginBottom: 18,
                      }}>
                        <span style={{ fontSize: 13 }}>📚</span>
                        <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: "-0.5px" }}>{gradeLabel} 세부 분석</span>
                      </div>

                      {/* 창의적 체험활동 — 섹션 컨테이너에는 break-inside 없음
                          ② grid → print:block, ④ 개별 역량 박스에만 적용 */}
                      {creativeItem && !creativeItem.isActionPlan && (
                        <div style={{ marginBottom: 18 }}>
                          <SectionHeading icon="🌟" title="창의적 체험활동 종합 평가" />
                          <div className="grid grid-cols-3 gap-2 print:block print:space-y-2">
                            {[
                              { icon: "📚", label: "학업역량",   text: creativeItem.academic },
                              { icon: "🎯", label: "진로역량",   text: creativeItem.career },
                              { icon: "🤝", label: "공동체역량", text: creativeItem.community },
                            ].map(({ icon, label, text }) => (
                              /* ④ 개별 역량 박스 */
                              <div key={label} className="print:break-inside-avoid" style={{
                                background: "#f8fafc", border: "1px solid #e2e8f0",
                                borderRadius: 8, padding: "9px 11px",
                                borderTop: `3px solid ${NAVY}`,
                              }}>
                                <p style={{ margin: "0 0 4px", fontSize: 9.5, fontWeight: 700, color: NAVY }}>{icon} {label}</p>
                                <p style={{ margin: 0, fontSize: 8.5, lineHeight: 1.75, color: "#374151", orphans: 3, widows: 3 }}>{text || "기록 없음"}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3학년 Action Plan — ④ 단독 박스 */}
                      {gk === "grade3" && actionPlan?.isActionPlan && (
                        <div className="print:break-inside-avoid" style={{ marginBottom: 18 }}>
                          <SectionHeading icon="🚀" title="3학년 창체활동 방향 제언 (AI Action Plan)" />
                          <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 8, padding: "11px 13px" }}>
                            <p style={{ margin: 0, fontSize: 8.5, lineHeight: 1.8, color: "#374151", orphans: 3, widows: 3 }}>
                              {actionPlan.desc || "제시된 내용이 없습니다."}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 교과 세특 — 섹션 래퍼에는 break 없음, SubjectCardBlock 내부에서만 처리 */}
                      {SUBJECT_TABS.map(({ key: tabKey, label: tabLabel }) => {
                        const cards: SubjectCard[] = subjectAct[tabKey] || [];
                        if (!cards.length) return null;
                        return (
                          <div key={tabKey} style={{ marginBottom: 14 }}>
                            <SectionHeading icon="📖" title={`교과 세특 — ${tabLabel}`} color={LIGHT_NAVY} />
                            {/* ④ SubjectCardBlock 내부에서 print:break-inside-avoid 처리 */}
                            {cards.map((card, idx) => <SubjectCardBlock key={idx} card={card} />)}
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </PdfPage>
        );
      })}

      {/* ════════════════════════════════════════════════════
          FINAL PAGE — 워터마크
      ════════════════════════════════════════════════════ */}
      <PdfPage>
        <div className="report-section" style={{
          minHeight: "277mm",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: `linear-gradient(145deg, ${NAVY} 0%, ${LIGHT_NAVY} 100%)`,
          padding: "0 40mm",
        }}>
          <span style={{ fontSize: 42, marginBottom: 18 }}>🎓</span>
          <h2 style={{ color: "white", fontSize: 19, fontWeight: 900, margin: "0 0 10px", textAlign: "center", letterSpacing: "-1px" }}>
            세특큐레이터
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, textAlign: "center", margin: "0 0 26px", lineHeight: 1.9 }}>
            22개정 이공계 세특/생기부 큐레이션 및 생성 플랫폼<br />
            본 리포트는 AI가 분석한 참고 자료입니다.
          </p>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 18, textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 9.5, margin: 0, lineHeight: 1.8 }}>
              분석 일시: {fmtDate(createdAt)} · 희망 전공: {major}<br />
              © 2025 세특큐레이터. All rights reserved.
            </p>
          </div>
        </div>
      </PdfPage>
    </>
  );
}
