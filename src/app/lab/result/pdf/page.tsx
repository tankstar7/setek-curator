"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { Loader2, Printer, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import PremiumReportPDF from "@/components/PremiumReportPDF";

const pageStyle = `
  @page {
    size: A4;
    margin: 0;
  }

  @media print {
    html, body {
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
    }
    .no-print { display: none !important; }
    .print-break-before { page-break-before: always; break-before: page; }
    .print-break-inside-avoid { break-inside: avoid; }
  }
`;

export default function PdfPreviewPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [report, setReport]       = useState<any>(null);
  const [major, setMajor]         = useState("");
  const [createdAt, setCreatedAt] = useState<string | undefined>();

  // react-to-print 인쇄 대상 ref
  const pdfTargetRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: pdfTargetRef,
    documentTitle: `세특큐레이터_AI분석리포트_${major || "미지정"}`,
    pageStyle,
  });

  useEffect(() => {
    async function fetchData() {
      if (!id) { setError(true); setLoading(false); return; }
      try {
        const { data, error: fetchError } = await supabase
          .from("analysis_results")
          .select("result_data, major, created_at")
          .eq("id", id)
          .single();

        if (fetchError || !data) throw new Error("데이터 없음");

        const rawData = data.result_data || {};
        setReport({
          attendance: rawData.basic_info?.attendance || "기록 없음",
          volunteer:  rawData.basic_info?.volunteer  || "기록 없음",
          creative: [
            ...(rawData.creative_activity?.grade1
              ? [{ ...rawData.creative_activity.grade1, grade: "1학년" }] : []),
            ...(rawData.creative_activity?.grade2
              ? [{ ...rawData.creative_activity.grade2, grade: "2학년" }] : []),
            ...(rawData.creative_activity?.grade3_action_plan
              ? [{ grade: "3학년(예정)", isActionPlan: true, desc: rawData.creative_activity.grade3_action_plan }] : []),
          ],
          overall: {
            g1:       rawData.behavior_summary?.grade1        || "기록 없음",
            g2:       rawData.behavior_summary?.grade2        || "기록 없음",
            final:    rawData.behavior_summary?.final_comment || "기록 없음",
            analysis: rawData.behavior_summary?.analysis      || "",
          },
          grade_trends:     rawData.grade_trends     || {},
          subject_activity: rawData.subject_activity || {},
        });
        setMajor(data.major || "");
        setCreatedAt(data.created_at);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // ─────────────────────────────────────────────────────────
  // Loading / Error states
  // ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="font-bold text-gray-700">PDF 리포트를 준비하는 중입니다...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-2xl font-bold text-gray-800">유효하지 않은 리포트입니다.</p>
        <a href="/lab" className="text-sm text-blue-600 underline">분석실로 돌아가기</a>
      </div>
    );
  }

  return (
    <>
      {/* ── 화면 전용 컨트롤바 (고정 상단) ── */}
      <div
        className="no-print fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 shadow-lg"
        style={{ background: "#1e3a5f" }}
      >
        {/* 왼쪽: 로고 + 제목 */}
        <div className="flex items-center gap-3">
          <span className="text-xl">🎓</span>
          <div>
            <p className="m-0 text-[13px] font-extrabold text-white leading-tight">세특큐레이터 — PDF 미리보기</p>
            <p className="m-0 text-[10px] text-white/60">{major} 계열 AI 생기부 분석 리포트</p>
          </div>
        </div>

        {/* 오른쪽: 버튼 그룹 */}
        <div className="flex items-center gap-2">
          <a
            href={`/lab/result?id=${id}`}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12px] font-semibold text-white transition"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <ChevronLeft size={13} />
            결과 페이지로
          </a>

          {/* ★ PDF 인쇄/저장 버튼 — react-to-print 방식 */}
          <button
            onClick={() => handlePrint()}
            className="flex items-center gap-2 rounded-lg px-5 py-2 text-[12px] font-bold text-white transition"
            style={{ background: "#3b82f6" }}
          >
            <Printer size={13} />
            PDF 저장 (인쇄)
          </button>
        </div>
      </div>

      {/* ── 리포트 미리보기 영역 ── */}
      <div className="pt-14 bg-[#6b7280] min-h-screen">
        <div className="flex flex-col items-center gap-2 py-4">

          {/* ★ react-to-print 인쇄 대상 */}
          <div
            ref={pdfTargetRef}
            className="bg-white"
            style={{ width: "210mm" }}
          >
            <PremiumReportPDF report={report} major={major} createdAt={createdAt} />
          </div>

        </div>
      </div>
    </>
  );
}
