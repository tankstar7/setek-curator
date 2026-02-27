import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// ── 프리미엄 잠금 대상 access_tier 목록 ────────────────────────────────────
const PREMIUM_TIERS = new Set(["PREMIUM", "VIP"]);

// ── 접근 허용 account_tier 목록 ────────────────────────────────────────────
const ALLOWED_ACCOUNT_TIERS = new Set(["premium", "admin"]);

// GET /api/reports/[id]
// · 보고서 메타(공통) + 권한에 따라 main_content 포함 여부 결정
// · main_content는 서버에서 결정 → 미인가 시 클라이언트에 아예 내려가지 않음
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const adminClient = getSupabaseAdmin();

  // ① 보고서 조회 (service role — RLS 무관하게 항상 조회 가능)
  const { data: report, error: reportErr } = await adminClient
    .from("premium_reports")
    .select(
      "id, title, subject, preview_content, main_content, target_majors, access_tier, large_unit_name, small_unit_name"
    )
    .eq("id", id)
    .single();

  if (reportErr || !report) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ② FREE 보고서 → 권한 체크 없이 전체 반환
  if (!PREMIUM_TIERS.has(report.access_tier)) {
    return NextResponse.json({ report, hasAccess: true, accountTier: "guest" });
  }

  // ③ PREMIUM / VIP 보고서 → Bearer 토큰으로 유저 account_tier 확인
  const token = req.headers.get("authorization")?.replace("Bearer ", "").trim();
  let accountTier = "guest";

  if (token) {
    try {
      const { data: { user }, error: authErr } = await adminClient.auth.getUser(token);
      if (!authErr && user) {
        const { data: profile } = await adminClient
          .from("profiles")
          .select("account_tier")
          .eq("id", user.id)
          .maybeSingle();
        accountTier = profile?.account_tier ?? "user";
      }
    } catch (err) {
      console.error("[api/reports] auth check error:", err);
    }
  }

  const hasAccess = ALLOWED_ACCOUNT_TIERS.has(accountTier);

  // ④ 미인가 → main_content null로 마스킹 후 반환 (데이터 자체를 클라이언트에 미전송)
  return NextResponse.json({
    report: {
      ...report,
      main_content: hasAccess ? report.main_content : null,
    },
    hasAccess,
    accountTier,
  });
}
