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

    // 3초 내 응답 없으면 로그인 폼 표시 (네트워크 불량 대비)
    const timeout = setTimeout(() => {
      if (!done) { done = true; setPhase('ready'); }
    }, 3000);

    // getSession(): localStorage에서 즉시 읽음 (네트워크 요청 없음 → 빠르고 안정적)
    // getUser()는 매번 서버 검증 요청을 날려 느리고 네트워크 환경에 민감함
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        if (done) return;
        clearTimeout(timeout);
        done = true;

        if (!session?.user) {
          // 세션 없음 → 로그인 폼 표시
          setPhase('ready');
          return;
        }

        const user = session.user;

        // ── 이미 로그인됨: 프로필 확인 후 적절한 페이지로 ──────────────────
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          // 쿠키 발급 — response.ok 검증으로 실패 시 핑퐁 리다이렉트 차단
          const res = await fetch('/api/mark-onboarded', { method: 'POST' });
          if (!res.ok) {
            // 쿠키 세팅 실패: 무한 루프 방지를 위해 에러 상태로 전환
            setPhase('error');
            return;
          }
          router.replace('/explorer');
        } else {
          // 프로필 없음 → 온보딩으로
          router.replace('/onboarding');
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        done = true;
        setPhase('ready'); // 에러 시 폼 표시 (로그인 시도는 가능해야 함)
      });

    return () => {
      clearTimeout(timeout);
      done = true;
    };
  // router는 Next.js에서 안정적 참조이나 exhaustive-deps 경고 억제
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
  };

  const handleKakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
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

        <div className="flex flex-col gap-3">
          <button
            onClick={handleKakaoLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border-0 bg-[#FEE500] px-6 py-3.5 font-bold text-[#191919] shadow-sm transition-all hover:bg-[#f5dc00] hover:shadow-md active:scale-95"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.677 5.08 4.2 6.502l-1.07 3.99a.3.3 0 0 0 .46.327L9.92 19.2A11.64 11.64 0 0 0 12 19.4c5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z" />
            </svg>
            카카오로 로그인 / 가입하기
          </button>

          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-95"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Google로 로그인 / 가입하기
          </button>
        </div>

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
