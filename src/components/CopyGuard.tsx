"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// ── CopyGuard ──────────────────────────────────────────────────────────────
// 전역 드래그 선택 / 우클릭 / 복사를 차단한다.
// account_tier = 'admin' 인 유저는 모든 제한이 해제된다.
// 초기 렌더(로딩 전)는 보호 상태로 시작 → admin 확인 후에만 해제.
export default function CopyGuard({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false); // 기본 false → 보호 ON

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return; // 비로그인 → 계속 보호

      const { data } = await supabase
        .from("profiles")
        .select("account_tier")
        .eq("id", session.user.id)
        .maybeSingle();

      if (data?.account_tier === "admin") setIsAdmin(true);
    })();
  }, []);

  const blockEvent = (e: React.SyntheticEvent) => e.preventDefault();

  return (
    <div
      className={isAdmin ? undefined : "select-none"}
      onContextMenu={isAdmin ? undefined : blockEvent}
      onCopy={isAdmin ? undefined : blockEvent}
    >
      {children}
    </div>
  );
}
