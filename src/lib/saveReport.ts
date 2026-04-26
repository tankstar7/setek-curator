import { createClient } from '@supabase/supabase-js';

// 관리자(서버) 환경변수, RLS 우회하여 강제 INSERT 목적.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Gemini 또는 텍스트 생성 API로부터 반환받은 원본 텍스트(JSON 형태)를 인자로 받아,
 * 파싱 및 정제 후 Supabase premium_reports 테이블에 INSERT 하는 함수
 */
export async function saveGeneratedReportToSupabase(rawResponseText: string) {
  try {
    // 1. Markdown 텍스트에서 JSON 객체만 추출 (```json ... ``` 로 감싸진 경우 대처)
    const jsonString = rawResponseText.replace(/```json|```/gi, '').trim();
    
    // 2. 파싱
    const parsedData = JSON.parse(jsonString);

    // 3. Supabase Schema 매핑 (에이전트 자동 매핑 처리)
    // - 생성 일자(created_at)는 DB 단말에서 기본값(now)으로 처리하거나 여기서 명시적으로 지정 가능
    // - 배열 타입 변환 등 스키마에 맞게 정제
    const mappedData = {
      curriculum_year: parsedData.curriculum_year?.toString() || '2022',
      subject_type: parsedData.subject_type || '',
      subject: parsedData.subject || '',
      large_unit_name: parsedData.large_unit_name || '',
      large_unit_order: Number(parsedData.large_unit_order) || null,
      small_unit_name: parsedData.small_unit_name || '',
      small_unit_order: Number(parsedData.small_unit_order) || null,
      target_majors: Array.isArray(parsedData.target_majors) 
        ? parsedData.target_majors 
        : [parsedData.target_majors].filter(Boolean),
      title: parsedData.title || '제목 없음',
      preview_content: parsedData.preview_content || '',
      main_content: parsedData.main_content || '',
      keywords: parsedData.keywords || '', 
      access_tier: parsedData.access_tier || 'premium',
      // 필요 시 현재 타임스탬프 고정
      // created_at: new Date().toISOString()
    };

    console.log('[Supabase Insert] 업로드 대상 매핑 데이터:', mappedData.title);

    // 4. Supabase DB 삽입
    const { data, error } = await supabaseAdmin
      .from('premium_reports')
      .insert([mappedData])
      .select('id')
      .single();

    if (error) {
      throw new Error(`Supabase 업로드 에러: ${error.message}`);
    }

    console.log('[Supabase Insert] 성공 🎉 / row ID:', data?.id);
    return { success: true, id: data.id, mappedData };

  } catch (error) {
    console.error('[Supabase Insert] 데이터 매핑 및 저장 실패:', error);
    throw error;
  }
}
