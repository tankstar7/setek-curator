import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// GET /api/analyzer/majors?universityId=<uuid>
// 해당 대학에 실제 데이터가 존재하는 전공(target_majors) 목록만 반환
// univ_subject_requirements를 통해 데이터가 있는 major_id만 필터링
export async function GET(req: NextRequest) {
  const universityId = req.nextUrl.searchParams.get("universityId");
  if (!universityId) {
    return NextResponse.json({ error: "universityId required" }, { status: 400 });
  }

  try {
    const admin = getSupabaseAdmin();

    // ① 해당 대학에 매핑된 major_id 목록 취득
    const { data: reqData, error: reqErr } = await admin
      .from("univ_subject_requirements")
      .select("major_id")
      .eq("university_id", universityId);

    if (reqErr) {
      console.error("[api/analyzer/majors] requirements 조회 오류:", reqErr.message);
      return NextResponse.json({ error: reqErr.message }, { status: 500 });
    }

    // ② major_id 중복 제거
    const majorIds = [...new Set((reqData ?? []).map((r) => r.major_id))];

    if (majorIds.length === 0) {
      return NextResponse.json({ majors: [] });
    }

    // ③ target_majors에서 해당 ID의 전공 정보 조회
    const { data: majors, error: majorErr } = await admin
      .from("target_majors")
      .select("id, major_name")
      .in("id", majorIds)
      .order("major_name");

    if (majorErr) {
      console.error("[api/analyzer/majors] target_majors 조회 오류:", majorErr.message);
      return NextResponse.json({ error: majorErr.message }, { status: 500 });
    }

    return NextResponse.json({ majors: majors ?? [] });
  } catch (err) {
    console.error("[api/analyzer/majors] 예외:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
