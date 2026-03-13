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
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          // 기존 유저: 쿠키 발급 — response.ok 검증으로 핑퐁 루프 차단
          const res = await fetch("/api/mark-onboarded", { method: "POST" });
          if (!res.ok) throw new Error("mark-onboarded failed");
          router.replace("/explorer");
        } else {
          // 신규 유저: 온보딩
          router.replace("/onboarding");
        }
      } catch {
        router.replace("/onboarding");
      }
    };

    // ① PKCE code를 URL에서 직접 추출하여 명시적으로 교환
    //    SDK 자동처리가 실패하는 환경(Safari ITP, 개인정보보호 브라우저)의 fallback
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      setMsg("인증 코드 교환 중...");
      supabase.auth.exchangeCodeForSession(code)
        .then(({ data, error }) => {
          if (error || !data?.session?.user) return; // 실패 시 ②로 fallback
          handleUser(data.session.user);
        })
        .catch(() => { /* 실패 시 ②로 fallback */ });
    }

    // ② SDK가 자동으로 코드 교환을 완료하면 이벤트 수신 (①과 중복 처리는 handledRef로 방지)
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

    // ③ 이미 세션이 있는 경우 즉시 처리 (재방문 등)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) handleUser(session.user);
    });

    // ④ 12초 timeout → 로그인 페이지로 fallback
    const timeout = setTimeout(() => {
      if (!handledRef.current) {
        handledRef.current = true;
        setMsg("인증 시간이 초과되었습니다.");
        setTimedOut(true);
      }
    }, 12_000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
