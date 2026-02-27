import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, verifyAdmin } from "@/lib/supabaseAdmin";

// POST /api/admin/update-tier — 특정 유저의 account_tier 변경
// Body: { userId: string, newTier: "user" | "premium" }
// ⚠️ 'admin' 티어로는 변경 불가 (API를 통한 어드민 승격 차단)
export async function POST(req: NextRequest) {
  // ① Bearer 토큰 추출
  const token = req.headers.get("authorization")?.replace("Bearer ", "").trim();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ② 어드민 권한 검증
  const adminId = await verifyAdmin(token);
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ③ 바디 파싱 및 유효성 검사
  let userId: string;
  let newTier: string;
  try {
    const body = await req.json();
    userId = body.userId;
    newTier = body.newTier;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!userId || !newTier) {
    return NextResponse.json({ error: "userId, newTier 필수" }, { status: 400 });
  }

  // 'admin' 티어로의 승격은 API로 불가 (DB에서 직접 설정해야 함)
  const ALLOWED_TIERS = ["user", "premium"];
  if (!ALLOWED_TIERS.includes(newTier)) {
    return NextResponse.json(
      { error: `허용되지 않는 tier: ${newTier}. 허용: ${ALLOWED_TIERS.join(", ")}` },
      { status: 400 }
    );
  }

  // ④ Service Role 클라이언트로 업데이트 (RLS 우회)
  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ account_tier: newTier })
    .eq("id", userId);

  if (error) {
    console.error("[admin/update-tier] DB error:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, userId, newTier });
}
