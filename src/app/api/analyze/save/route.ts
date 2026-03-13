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

    // 현재 is_saved 값 조회
    const { data: current, error: fetchError } = await supabase
      .from('analysis_results')
      .select('is_saved')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      return NextResponse.json({ error: '리포트를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 반전(Toggle)
    const newState = !current.is_saved;

    const { error: updateError } = await supabase
      .from('analysis_results')
      .update({ is_saved: newState })
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, is_saved: newState });
  } catch (error) {
    console.error('리포트 저장 중 에러:', error);
    return NextResponse.json({ error: '서버 오류로 저장에 실패했습니다.' }, { status: 500 });
  }
}