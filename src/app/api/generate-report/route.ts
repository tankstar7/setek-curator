import { NextRequest, NextResponse } from 'next/server';
import { generateSetekReport, ReportParams } from '@/lib/generateReport';
import { saveGeneratedReportToSupabase } from '@/lib/saveReport';
import { createClient } from '@supabase/supabase-js';

// Vercel 서버리스 타임아웃 방지용 (AI 생성은 시간이 걸리므로 최대치로 설정)
export const maxDuration = 60; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: NextRequest) {
  try {
    const body: ReportParams = await req.json();

    // 1. 필수 파라미터 검증 (키워드 및 주제는 에이전트가 자동 생성)
    if (!body.subject || !body.units || body.units.length === 0 || !body.majors) {
      return NextResponse.json(
        { error: '교과목명, 단원명(units), 희망 전공 정보가 필수입니다.' },
        { status: 400 }
      );
    }

    // 2. Gemini API를 통해 보고서(JSON 형식 텍스트) 생성
    const rawAiOutput = await generateSetekReport(body);
    
    // 3. 에이전트 자동 매핑 및 Supabase DB 저장 함수 호출
    const { id, mappedData } = await saveGeneratedReportToSupabase(rawAiOutput);
    
    // -- 결과 반환 --
    return NextResponse.json({ 
      success: true, 
      id,
      mappedData
    });

  } catch (error) {
    console.error('보고서 생성 에러:', error);
    return NextResponse.json(
      { error: '보고서 자동 생성 중 서버 오류가 발생했습니다.', details: (error as Error).message },
      { status: 500 }
    );
  }
}
