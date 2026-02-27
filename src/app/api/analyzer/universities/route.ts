import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// GET /api/analyzer/universities
// universities 테이블에서 전체 대학 목록 반환
export async function GET() {
  try {
    const admin = getSupabaseAdmin();

    const { data, error } = await admin
      .from("universities")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("[api/analyzer/universities] 조회 오류:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ universities: data ?? [] });
  } catch (err) {
    console.error("[api/analyzer/universities] 예외:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
