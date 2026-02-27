"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  // 세 가지 상태: 'checking' | 'ready' | 'error'
  const [phase, setPhase] = useState<'checking' | 'ready' | 'error'>('checking');

  useEffect(() => {
    let done = false;

    // 5초 내 응답 없으면 로그인 폼 표시 (네트워크 불량 대비)
    const timeout = setTimeout(() => {
      if (!done) { done = true; setPhase('ready'); }
    }, 5000);

    supabase.auth.getUser()
      .then(async ({ data: { user } }) => {
        if (done) return;
        clearTimeout(timeout);
        done = true;

        if (!user) {
          // 세션 없음 → 로그인 폼 표시
          setPhase('ready');
          return;
        }

        // ── 이미 로그인됨: 프로필 확인 후 적절한 페이지로 ──────────────────
        // .maybeSingle() — 신규 유저(0 rows)여도 406 에러 없이 null 반환
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          // 프로필 있음 → 쿠키 복구 후 탐구소로
          await fetch('/api/mark-onboarded', { method: 'POST' });
          router.replace('/explorer');
        } else {
          // 프로필 없음 → 온보딩으로
          router.replace('/onboarding');
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        done = true;
        setPhase('error');
      });

    return () => {
      clearTimeout(timeout);
      done = true;
    };
  }, [router]);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
  };

  // 강제 초기화 (쿠키·세션 완전 삭제 후 새로 시작)
  const handleForceReset = async () => {
    try {
      await supabase.auth.signOut();
      await fetch('/api/mark-onboarded', { method: 'DELETE' });
    } catch { /* ignore */ }
    window.location.href = '/login';
  };

  // ── 세션 확인 중 ─────────────────────────────────────────────────────────
  if (phase === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 font-sans">
        <div className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-xl">
          <div className="mb-4 text-4xl animate-pulse">🔄</div>
          <p className="text-sm text-slate-400">세션 확인 중...</p>
          <button
            onClick={handleForceReset}
            className="mt-6 text-xs text-slate-300 underline underline-offset-2 hover:text-slate-500"
          >
            강제로 처음부터 시작하기
          </button>
        </div>
      </div>
    );
  }

  // ── 에러 상태 ─────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 font-sans">
        <div className="w-full max-w-sm rounded-3xl border border-red-100 bg-white p-10 text-center shadow-xl">
          <div className="mb-4 text-4xl">⚠️</div>
          <h2 className="mb-2 font-bold text-slate-800">연결에 문제가 생겼어요</h2>
          <p className="mb-6 text-sm text-slate-400">
            네트워크를 확인한 뒤 다시 시도해주세요.
          </p>
          <button
            onClick={handleForceReset}
            className="w-full rounded-xl bg-red-500 py-3 font-bold text-white hover:bg-red-600"
          >
            초기화 후 재시작
          </button>
        </div>
      </div>
    );
  }

  // ── 로그인 폼 ─────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-xl">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
          👋
        </div>
        <h1 className="mb-2 text-2xl font-extrabold text-slate-900">반가워요!</h1>
        <p className="mb-8 text-sm leading-relaxed text-slate-500">
          1초 만에 구글로 로그인하고<br />
          프리미엄 세특 보고서를 확인하세요.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-95"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Google로 시작하기
        </button>

        <p className="mt-8 text-xs text-slate-400">
          로그인 시 서비스 이용약관 및<br />개인정보 처리방침에 동의하게 됩니다.
        </p>

        <button
          onClick={handleForceReset}
          className="mt-4 text-[11px] text-slate-300 underline underline-offset-2 hover:text-slate-500"
        >
          문제가 있나요? 초기화 후 재시작
        </button>
      </div>
    </div>
  );
}
