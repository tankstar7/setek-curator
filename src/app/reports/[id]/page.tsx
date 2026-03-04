"use client";

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

interface Report {
  id: string;
  title: string;
  subject: string;
  preview_content: string | null;
  main_content: string | null; // 미인가 시 서버에서 null로 마스킹되어 내려옴
  target_majors: string[];
  access_tier: string;
  large_unit_name: string;
  small_unit_name: string | null;
}

export default function ReportDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [report, setReport]       = useState<Report | null>(null);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);

  // hasAccess: 서버가 판별 → main_content 존재 여부로 확정
  const [hasAccess, setHasAccess]     = useState(false);
  // accountTier: 잠금 UI 메시지 분기용 (guest / user / premium / admin)
  const [accountTier, setAccountTier] = useState<string>("guest");
  const [isSaved, setIsSaved]         = useState(false); // 저장 상태 추가

  useEffect(() => {
    if (!id) return;
    let live = true;

    const fetchReport = async (): Promise<void> => {
      try {
        // ── ① 세션 토큰 취득 ──
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token ?? null;

        // ── ② 서버 API 호출 ──
        const res = await fetch(`/api/reports/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!live) return;
        if (res.status === 404 || !res.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const json = await res.json();
        setReport(json.report);
        setHasAccess(json.hasAccess);
        setAccountTier(json.accountTier ?? "guest");

        // ── ③ 저장 상태 확인 (로그인 유저인 경우) ──
        if (session?.user?.id) {
          const { data: savedData } = await supabase
            .from("report_user_saved")
            .select("id")
            .eq("user_id", session.user.id)
            .eq("report_id", id)
            .maybeSingle();
          if (savedData) setIsSaved(true);
        }

        setLoading(false);

        // ── ④ 열람 기록 남기기 (로그인 유저인 경우) ──
        if (session?.user?.id) {
          await supabase.from("report_user_history").upsert({
            user_id: session.user.id,
            report_id: id,
            viewed_at: new Date().toISOString(),
          }, { onConflict: 'user_id, report_id' });
        }
      } catch {
        if (!live) return;
        setNotFound(true);
        setLoading(false);
      }
    };

    fetchReport();
    return () => { live = false; };
  }, [id]);

  // 저장 토글 핸들러
  const handleToggleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("로그인이 필요한 기능입니다.");
        return;
      }

      if (isSaved) {
        const { error } = await supabase
          .from("report_user_saved")
          .delete()
          .eq("user_id", session.user.id)
          .eq("report_id", id);
        
        if (error) throw error;
        setIsSaved(false);
        alert("보고서 저장을 취소했습니다.");
      } else {
        const { error } = await supabase
          .from("report_user_saved")
          .insert({ user_id: session.user.id, report_id: id });
        
        if (error) {
          if (error.code === '23505') { // 중복 저장 에러 처리
            setIsSaved(true);
            return;
          }
          throw error;
        }
        setIsSaved(true);
        alert("보고서를 저장했습니다. 마이페이지에서 확인하실 수 있습니다.");
      }
    } catch (err: any) {
      console.error("[ReportDetail] 저장 토글 에러:", err);
      alert(`처리 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`);
    }
  };

  // ── 로딩 ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <p className="animate-pulse text-slate-400">불러오는 중...</p>
      </div>
    );
  }

  // ── 404 ────────────────────────────────────────────────────────────────────
  if (notFound || !report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f8fafc] text-center">
        <p className="text-3xl">🔍</p>
        <p className="font-semibold text-slate-700">보고서를 찾을 수 없습니다.</p>
        <a href="/explorer" className="mt-2 text-sm text-blue-600 underline">
          탐구 목록으로 돌아가기
        </a>
      </div>
    );
  }

  // ── 잠금 필요 여부: PREMIUM / VIP 등급 보고서에만 적용 ──────────────────
  const isPremiumReport = report.access_tier === "PREMIUM" || report.access_tier === "VIP";
  const isGuest = accountTier === "guest";
  const isRegularUser = accountTier === "user";

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

        {/* ── 상단 헤더 ── */}
        <div className="bg-slate-900 px-10 py-8 text-white">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm font-semibold tracking-wide text-blue-400">
              <span className="rounded-full border border-blue-700/50 bg-blue-900/50 px-3 py-1">
                {report.subject}
              </span>
              <span>•</span>
              <span>{report.target_majors[0]} 추천</span>
              {isPremiumReport && (
                <span className="rounded-full bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                  PREMIUM
                </span>
              )}
            </div>
            {/* 저장 버튼 추가 */}
            <button
              onClick={handleToggleSave}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                isSaved 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "bg-white/10 text-blue-200 hover:bg-white/20"
              }`}
            >
              {isSaved ? "🔖 저장됨" : "📂 보고서 저장"}
            </button>
          </div>
          <h1 className="mb-2 text-3xl font-extrabold leading-tight">
            {report.title}
          </h1>
        </div>

        {/* ── 본문 영역 ── */}
        <div className="p-10 pb-24 md:p-14">

          {/* ── 주의사항 배너 ── */}
          <div className="mb-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <span className="mt-0.5 shrink-0 text-xl">⚠️</span>
            <div>
              <p className="mb-1.5 text-sm font-extrabold text-amber-900">
                탐구 보고서 활용 시 주의사항
                <span className="ml-2 font-semibold text-amber-700">📢 무단 전재 및 단순 복사 금지</span>
              </p>
              <p className="text-xs leading-relaxed text-amber-800">
                본 보고서는 학생의 주도적인 탐구 활동을 돕기 위한 참고용 가이드라인입니다.
                수록된 내용을 그대로 제출할 경우 표절로 간주될 수 있으며, 학교생활기록부 기재 시 불이익을 받을 수 있습니다.
                반드시 본인의 실천 사례와 배운 점을 포함하여 독창적인 보고서를 작성하시기 바랍니다.
              </p>
            </div>
          </div>

          <article className="prose prose-slate max-w-none">

            {/* 무료 미리보기 — 항상 표시 */}
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {report.preview_content ?? ''}
            </ReactMarkdown>

            {/* ── 프리미엄 본문 영역 ── */}
            {isPremiumReport && (
              hasAccess ? (
                /* ✅ 접근 허용 — main_content는 서버가 이미 인가 후 전달 */
                <div className="mb-12 mt-8 border-t-2 border-dashed border-slate-200 pt-8">
                  <div className="mb-6 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-800">
                    🎉 프리미엄 본문이 공개되었습니다
                  </div>
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {report.main_content ?? ''}
                  </ReactMarkdown>
                </div>
              ) : (
                /* 🔒 잠금 — main_content는 서버에서 이미 null 처리됨 (클라이언트에 미전송) */
                <div className="mt-10">
                  <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl">
                      🔒
                    </div>

                    {isGuest ? (
                      /* 비로그인 */
                      <>
                        <h3 className="mb-2 text-xl font-bold text-slate-900">로그인이 필요합니다</h3>
                        <p className="mb-6 text-sm text-slate-500">
                          로그인 후 프리미엄 멤버십을 구독하면<br />전체 내용을 확인할 수 있습니다.
                        </p>
                        <a
                          href="/login"
                          className="block w-full rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-md transition-all hover:bg-blue-700"
                        >
                          지금 바로 로그인하기
                        </a>
                      </>
                    ) : isRegularUser ? (
                      /* 로그인 O, 일반 유저 */
                      <>
                        <h3 className="mb-2 text-xl font-bold text-slate-900">프리미엄 전용 콘텐츠</h3>
                        <p className="mb-1 text-sm text-slate-500">
                          이 보고서는 <span className="font-semibold text-amber-600">프리미엄 회원 전용</span> 콘텐츠입니다.
                        </p>
                        <p className="mb-6 text-sm text-slate-400">
                          멤버십을 구독하고 모든 심화 탐구 내용을 확인하세요.
                        </p>
                        <a
                          href="/pricing"
                          className="block w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 font-bold text-white shadow-md transition-all hover:from-amber-600 hover:to-amber-700"
                        >
                          ⭐ 프리미엄 멤버십 구독하기
                        </a>
                        <p className="mt-3 text-[11px] text-slate-400">
                          월 구독 · 언제든지 해지 가능
                        </p>
                      </>
                    ) : (
                      /* 예외: 알 수 없는 tier */
                      <>
                        <h3 className="mb-2 text-xl font-bold text-slate-900">접근 권한이 없습니다</h3>
                        <p className="mb-6 text-sm text-slate-500">관리자에게 문의하세요.</p>
                      </>
                    )}
                  </div>
                </div>
              )
            )}

            {/* FREE 보고서는 전체 본문 바로 노출 */}
            {!isPremiumReport && report.main_content && (
              <div className="mt-8 border-t-2 border-dashed border-slate-200 pt-8">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {report.main_content}
                </ReactMarkdown>
              </div>
            )}

          </article>
        </div>
      </div>
    </div>
  );
}
