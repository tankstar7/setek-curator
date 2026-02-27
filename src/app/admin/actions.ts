"use server";

import { getSupabaseAdmin, verifyAdmin } from "@/lib/supabaseAdmin";

export type Tier = "user" | "premium" | "admin";
const VALID_TIERS: Tier[] = ["user", "premium", "admin"];

// ── updateUserTier ──────────────────────────────────────────────────────────
// SUPABASE_SERVICE_ROLE_KEY 기반 Admin 클라이언트로 RLS 우회하여 tier 변경.
// 자동 결제 시스템과 완전히 분리된 Manual Override 액션.
export async function updateUserTier(
  token: string,
  targetUserId: string,
  newTier: Tier
): Promise<{ ok: boolean; error?: string }> {
  // ① 호출자 어드민 검증
  const adminId = await verifyAdmin(token);
  if (!adminId) {
    return { ok: false, error: "관리자 권한이 없습니다" };
  }

  // ② 자기 자신 등급 변경 차단 (대참사 방지)
  if (adminId === targetUserId) {
    return { ok: false, error: "본인의 등급은 변경할 수 없습니다" };
  }

  // ③ 허용된 tier 값 검증
  if (!VALID_TIERS.includes(newTier)) {
    return { ok: false, error: `허용되지 않는 등급: ${newTier}` };
  }

  // ④ Service Role 클라이언트로 DB 업데이트 (RLS 우회)
  try {
    const adminClient = getSupabaseAdmin();
    const { error } = await adminClient
      .from("profiles")
      .update({ account_tier: newTier })
      .eq("id", targetUserId);

    if (error) {
      console.error("[updateUserTier] DB 오류:", error.message);
      return { ok: false, error: error.message };
    }

    console.log(`[updateUserTier] 성공: uid=${targetUserId} → ${newTier} (by admin=${adminId})`);
    return { ok: true };
  } catch (err) {
    console.error("[updateUserTier] 예외:", err);
    return { ok: false, error: "서버 오류가 발생했습니다" };
  }
}
