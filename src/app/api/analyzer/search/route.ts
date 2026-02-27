import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// GET /api/analyzer/search?universityId=<uuid>&majorId=<uuid>
// univ_subject_requirements 조회 + curriculum_subjects JOIN
// requirement_level 기준으로 그룹핑된 과목 목록 반환
export async function GET(req: NextRequest) {
  const universityId = req.nextUrl.searchParams.get("universityId");
  const majorId      = req.nextUrl.searchParams.get("majorId");

  if (!universityId || !majorId) {
    return NextResponse.json(
      { error: "universityId and majorId are required" },
      { status: 400 }
    );
  }

  try {
    const admin = getSupabaseAdmin();

    // univ_subject_requirements → curriculum_subjects 조인
    const { data, error } = await admin
      .from("univ_subject_requirements")
      .select(
        "requirement_level, curriculum_subjects(id, name, category)"
      )
      .eq("university_id", universityId)
      .eq("major_id", majorId)
      .order("requirement_level");

    if (error) {
      console.error("[api/analyzer/search] 조회 오류:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({ found: true, requirements: data });
  } catch (err) {
    console.error("[api/analyzer/search] 예외:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
