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

// ── scheduleUserDeletion ──────────────────────────────────────────────────
// 계정 삭제 예약 (현재 시간 + 72시간)
export async function scheduleUserDeletion(
  token: string,
  targetUserId: string
): Promise<{ ok: boolean; error?: string }> {
  const adminId = await verifyAdmin(token);
  if (!adminId) return { ok: false, error: "관리자 권한이 없습니다" };
  if (adminId === targetUserId) return { ok: false, error: "본인 계정은 삭제 예약할 수 없습니다" };

  try {
    const adminClient = getSupabaseAdmin();
    const scheduledAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
    
    const { error } = await adminClient
      .from("profiles")
      .update({ deletion_scheduled_at: scheduledAt })
      .eq("id", targetUserId);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "서버 오류가 발생했습니다" };
  }
}

// ── cancelUserDeletion ────────────────────────────────────────────────────
// 계정 삭제 예약 취소
export async function cancelUserDeletion(
  token: string,
  targetUserId: string
): Promise<{ ok: boolean; error?: string }> {
  const adminId = await verifyAdmin(token);
  if (!adminId) return { ok: false, error: "관리자 권한이 없습니다" };

  try {
    const adminClient = getSupabaseAdmin();
    const { error } = await adminClient
      .from("profiles")
      .update({ deletion_scheduled_at: null })
      .eq("id", targetUserId);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "서버 오류가 발생했습니다" };
  }
}

// ── deleteUserPermanently ─────────────────────────────────────────────────
// 사용자 데이터를 즉시 영구 삭제 (profiles 테이블 및 auth.users에서 제거)
export async function deleteUserPermanently(
  token: string,
  targetUserId: string
): Promise<{ ok: boolean; error?: string }> {
  const adminId = await verifyAdmin(token);
  if (!adminId) return { ok: false, error: "관리자 권한이 없습니다" };
  if (adminId === targetUserId) return { ok: false, error: "본인 계정은 삭제할 수 없습니다" };

  try {
    const adminClient = getSupabaseAdmin();
    
    // 1. profiles 테이블에서 삭제
    const { error: profileError } = await adminClient
      .from("profiles")
      .delete()
      .eq("id", targetUserId);

    if (profileError) return { ok: false, error: profileError.message };
    
    // 2. auth.users 계정 영구 삭제 (관리자 전용 API)
    const { error: authError } = await adminClient.auth.admin.deleteUser(targetUserId);
    if (authError) return { ok: false, error: authError.message };

    return { ok: true };
  } catch (err) {
    console.error("[deleteUserPermanently] 예외:", err);
    return { ok: false, error: "서버 오류가 발생했습니다" };
  }
}
