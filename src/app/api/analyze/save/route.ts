import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: '아이디 정보가 필요합니다.' }, { status: 400 });
    }

    // 해당 분석 결과의 is_saved를 true로 업데이트
    const { data, error } = await supabase
      .from('analysis_results')
      .update({ is_saved: true })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('리포트 저장 중 에러:', error);
    return NextResponse.json({ error: '서버 오류로 저장에 실패했습니다.' }, { status: 500 });
  }
}