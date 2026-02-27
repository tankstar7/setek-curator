import { createClient } from "@supabase/supabase-js";

// ── 서버 전용 Admin 클라이언트 ─────────────────────────────────────────────
// SUPABASE_SERVICE_ROLE_KEY는 절대 클라이언트 번들에 포함되면 안 됨
// 이 파일은 Server Components / API Routes에서만 import할 것

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "[supabaseAdmin] 환경변수 누락: NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ── 어드민 권한 검증 헬퍼 ──────────────────────────────────────────────────
// 클라이언트가 보낸 access_token을 검증하고 admin 여부 확인
// 리턴: admin이면 userId, 아니면 null
export async function verifyAdmin(token: string): Promise<string | null> {
  try {
    const admin = getSupabaseAdmin();

    const {
      data: { user },
      error,
    } = await admin.auth.getUser(token);
    if (error) {
      console.error("[verifyAdmin] auth.getUser error:", error.message);
      return null;
    }
    if (!user) {
      console.error("[verifyAdmin] 토큰이 유효하지 않음 (user=null)");
      return null;
    }

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("account_tier")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[verifyAdmin] profiles 조회 오류:", profileError.message);
      return null;
    }

    if (profile?.account_tier !== "admin") {
      console.warn(`[verifyAdmin] 권한 부족: uid=${user.id}, tier=${profile?.account_tier ?? "없음"}`);
      return null;
    }

    return user.id;
  } catch (err) {
    console.error("[verifyAdmin] 예외 발생:", err);
    return null;
  }
}
