import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, verifyAdmin } from "@/lib/supabaseAdmin";

// GET /api/admin/users — 전체 가입자 목록 반환
export async function GET(req: NextRequest) {
  // ① Bearer 토큰 추출
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();

  console.log("[admin/users] Authorization header 존재:", !!authHeader);

  if (!token) {
    console.error("[admin/users] 토큰 없음 → 401");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ② 어드민 권한 검증
  let adminId: string | null = null;
  try {
    adminId = await verifyAdmin(token);
  } catch (err) {
    console.error("[admin/users] verifyAdmin 예외:", err);
    return NextResponse.json({ error: "Internal error during auth" }, { status: 500 });
  }

  if (!adminId) {
    console.error("[admin/users] verifyAdmin → null (권한 없음 또는 환경변수 누락) → 403");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ③ Service Role 클라이언트로 전체 프로필 조회 (RLS 우회)
  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch (err) {
    console.error("[admin/users] getSupabaseAdmin 실패 (SERVICE_ROLE_KEY 누락?):", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, nickname, role, account_tier, created_at, school_name, region, dream_majors, interest_subjects")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/users] profiles 조회 실패:", error.message, error.details, error.hint);
    return NextResponse.json({ error: "DB error", detail: error.message }, { status: 500 });
  }

  console.log(`[admin/users] 조회 성공: ${data?.length ?? 0}명`);
  return NextResponse.json({ users: data });
}
