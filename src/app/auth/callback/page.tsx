"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("로그인 처리 중...");
  const [timedOut, setTimedOut] = useState(false);

  // useRef로 handled 플래그 관리 → React StrictMode 이중 실행 방어
  // (cleanup에서 리셋하지 않아야 StrictMode 2차 실행 때 중복 처리 방지)
  const handledRef = useRef(false);

  useEffect(() => {
    const handleUser = async (user: User) => {
      if (handledRef.current) return;
      handledRef.current = true;

      setMsg("프로필 확인 중...");

      try {
        // .maybeSingle() — 신규 유저(0 rows)여도 406 에러 없이 null 반환
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          // 기존 유저: 쿠키 발급 → 탐구소
          await fetch("/api/mark-onboarded", { method: "POST" });
          router.replace("/explorer");
        } else {
          // 신규 유저: 온보딩
          router.replace("/onboarding");
        }
      } catch {
        // DB 오류라도 온보딩으로 보내 폼 채우도록 함
        router.replace("/onboarding");
      }
    };

    // ① 이미 세션이 있는 경우 즉시 처리
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) handleUser(user);
    });

    // ② OAuth PKCE 코드 교환 완료 시 SIGNED_IN 이벤트 수신
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          (event === "SIGNED_IN" || event === "INITIAL_SESSION") &&
          session?.user
        ) {
          handleUser(session.user);
        }
      }
    );

    // ③ 10초 timeout → 로그인 페이지로 fallback
    const timeout = setTimeout(() => {
      if (!handledRef.current) {
        handledRef.current = true;
        setMsg("인증 시간이 초과되었습니다.");
        setTimedOut(true);
      }
    }, 10_000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
      // handledRef는 cleanup에서 리셋하지 않음 (StrictMode 중복 처리 방지)
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        {!timedOut ? (
          <>
            <div className="mb-4 text-4xl">
              <span className="inline-block animate-spin">⚙️</span>
            </div>
            <p className="text-sm text-slate-500">{msg}</p>
          </>
        ) : (
          <>
            <div className="mb-4 text-4xl">⚠️</div>
            <p className="mb-4 text-sm font-semibold text-slate-700">
              인증 시간이 초과되었습니다.
            </p>
            <p className="mb-6 text-xs text-slate-400">
              네트워크 상태를 확인하고 다시 시도해주세요.
            </p>
            <a
              href="/login"
              className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              로그인 페이지로 돌아가기
            </a>
          </>
        )}
      </div>
    </div>
  );
}
