export const maxDuration = 60; // Vercel

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// 환경변수 세팅 (env.local 파일에 키가 있어야 합니다)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const major = formData.get('major') as string;
    const user_email = formData.get('user_email') as string;

    console.log('1. 파일 및 데이터 수신 완료', { fileName: file?.name, major });

    if (!file || !major) {
      return NextResponse.json({ error: '파일과 희망 전공 데이터가 누락되었습니다.' }, { status: 400 });
    }

    // PDF 파일을 Base64로 변환 (Gemini Native 지원)
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');
    const filePart = { inlineData: { data: base64Data, mimeType: 'application/pdf' } };

    // 가성비와 속도가 뛰어난 flash 모델 사용 (더 깊은 추론이 필요하면 pro 사용)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
// 👇 [핵심 엔진] 세특 큐레이터 전용 3대 핵심 역량 평가 가이드라인 (하드코딩)
    const ourEvaluationCriteria = `
      [세특 큐레이터 전용 3대 핵심 역량 평가 가이드라인 (절대 기준)]
      입학사정관으로서 학생부를 평가할 때, 반드시 아래의 구체적인 세부 평가 기준을 잣대로 삼아 분석할 것.

      1. 학업역량 (학업성취도, 학업태도, 탐구력)
      - 지적 호기심: 새로운 지식, 정보, 경험에 대해 비판적 사고로 문제를 도출하고 해결했는가? 
      - 심화/확장: 수업 중 생긴 호기심을 수행평가나 교내 활동으로 연계하여 지식을 확장했는가? 도서, 논문 등 다양한 자료를 활용했는가?
      - 주도성: 학업 목표를 세워 꾸준히 노력하며, 발표/토론/과제에 주도적이고 적극적으로 참여하는가?
      - 융합적 사고: 여러 교과목의 기초 지식을 융합하여 새로운 것을 창출하거나 자신만의 사고를 할 수 있는가?

      2. 진로역량 (전공 관련 교과 이수 노력, 전공 관련 교과 성취도, 진로 탐색 활동과 경험)
      - 과목 선택: 희망 전공(계열)에 필요한 과목을 위계에 맞게 주도적으로 선택하고 심화 이수(도전)하였는가?
      - 학업 깊이: 전공 관련 교과 학습에서 지적 호기심을 해소하기 위해 주도적으로 과제를 수행하고 깊이 있는 탐구를 했는가?
      - 자기 주도적 탐색: 자신의 관심, 적성, 흥미에 따라 자발적으로 진로를 탐색하고 구체적인 성과물을 만들어냈는가?
      - 활동 연계: 교과에서 배운 지식을 심화·확장하기 위해 다양한 프로그램(실험, 동아리, 진로활동 등)에 적극 참여했는가?

      3. 공동체역량 (협업과 소통, 나눔과 배려, 성실성, 리더십)
      - 갈등 조율: 공동체에 갈등이 발생했을 때, 합리적 타협 방법을 찾아 제안하고 대화로 의견 차이를 조율했는가?
      - 협업 성과: 구성원들과 협력을 통해 공동의 과제를 수행하고 결과물을 만들어냈는가?
      - 솔선수범: 타인이 꺼리는 일을 나서서 하거나, 공익을 위해 자발적으로 자신의 시간과 노력을 제공했는가?
      - 리더십: 단체 활동에서 지도자가 되어 참여를 이끌어내고, 발전적인 의견을 주장하며 목표 달성을 주도했는가?

      [평가 작성 시 3대 절대 금지 및 필수 규칙]
      1. 추상적 표현 금지: "노력함", "우수함", "뛰어남", "관심이 많음" 등의 뻔한 칭찬 단어는 절대 배제. 반드시 구체적 팩트(탐구 주제, 역할, 성과, 읽은 책)를 기반으로 입증할 것.
      2. 행동특성 심층 분석: 단순 요약이 아닌, 위 3대 역량(특히 공동체 역량 내 갈등 해결, 리더십, 나눔)을 렌즈로 삼아 학생의 인성과 사회성을 날카롭게 해체 분석할 것.
      3. 한계 및 보완(Action Plan) 의무화: 각 교과 세특 평가 시 학생의 한계점(예: 주관적 해석에 머묾, 데이터 검증 부족, 후속 연구 부재 등)을 무조건 하나 이상 찾아내어 지적할 것. 그리고 이를 극복하기 위해 3학년 때 추가로 읽어야 할 도서, 실증 데이터 분석, 구체적인 후속 논제 등 '실천 가능한 액션 플랜'을 명확히 제시할 것.
    `;

const prompt = `
      당신은 2027학년도 대입 학생부종합전형 최고 권위의 전문 입시 사정관입니다.
      첨부된 학생부 PDF를 분석할 때, 아래 제시된 [우리의 평가 가이드라인]을 '절대적인 법률'로 삼아 평가를 진행하십시오.

      ${ourEvaluationCriteria}

      [지시사항 1: 성적 출력 규칙 (절대 준수)]
      - 모든 과목의 성적은 반드시 "석차등급/성취도" 형태로 출력하세요. (예: 3/A, 4/B) [cite: 7, 117]
      - 괄호 안의 숫자는 절대 포함하지 마세요. (예: 3/A(280) -> 3/A로 출력) 
      - 석차등급이 없는 진로선택과목은 "-/성취도" 형태로 출력하세요. (예: -/A) 

      [지시사항 2: 교과 분류 규칙 (절대 준수)]
      PDF 성적표의 '교과' 열을 기준으로 아래 group에 빠짐없이 배정하세요.
      - group1 (국어/수학/영어): 교과명이 국어, 수학, 영어인 모든 과목 (예: 문학, 언어와 매체, 수학 I, 영어 I 등) [cite: 108]
      - group2 (한국사/사회/과학): 교과명이 한국사, 사회, 과학, 역사, 도덕인 모든 과목 (예: 통합사회, 세계사, 사회문제 탐구, 통합과학, 과학탐구실험 등) 
      - group3 (기타): 기술·가정, 제2외국어, 한문, 교양, 정보, 환경 등 나머지 모든 과목 

      지원 전공: ${major}

      [출력 양식: JSON]
      반드시 아래 JSON 형식으로만 응답하고, 마크다운 기호(\`\`\`)는 제외하세요.
      {
        "basic_info": { "attendance": "출결 분석", "volunteer": "봉사 분석" },
        "creative_activity": {
          "grade1": { "academic": "...", "career": "...", "community": "..." },
          "grade2": { "academic": "...", "career": "...", "community": "..." },
          "grade3_action_plan": "1,2학년 활동의 한계를 짚고 3학년 때 수행할 구체적 실증 탐구와 도서명을 포함한 액션플랜 3문장"
        },
        "grade_trends": {
          "grade1": [ { "subject": "과목명", "sem1": "등급/성취도", "sem2": "등급/성취도" } ],
          "grade2": [ { "subject": "과목명", "sem1": "등급/성취도", "sem2": "등급/성취도" } ],
          "grade3": [ { "subject": "과목명", "sem1": "등급/성취도", "sem2": "등급/성취도" } ]
        },
        "subject_activity": {
          "grade1": {
            "group1": [ { "subject": "과목명", "summary": "팩트 요약", "eval": "역량 평가", "limit": "한계점 및 3학년 보완 액션플랜(필수)" } ],
            "group2": [],
            "group3": []
          },
          "grade2": { "group1": [], "group2": [], "group3": [] },
          "grade3": { "group1": [], "group2": [], "group3": [] }
        },
        "behavior_summary": { 
          "grade1": "...", "grade2": "...", "analysis": "최종 심층 분석", "final_comment": "총평" 
        }
      }
    `;

    console.log('2. Gemini API 호출 시작');
    // 분석 실행
    const result = await model.generateContent([prompt, filePart]);
    const responseText = result.response.text().replace(/```json|```/g, '').trim();
    
    console.log('3. Gemini 응답 완료, JSON 파싱 시작');
    console.log('Gemini 응답 원본 텍스트:', responseText);
    
    let analysisData;
    try {
      analysisData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON 파싱 에러:', parseError);
      throw new Error(`Gemini 응답 파싱 실패: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }

    console.log('4. Supabase DB 저장 시작');
// 기존 코드 어딘가에 있는 Supabase Insert 부분 수정
    const { data: insertData, error: dbError } = await supabase
      .from('analysis_results')
      .insert([
        { 
          major: major, 
          result_data: analysisData,
          user_email: user_email, // 👈 이 줄을 반드시 추가하세요! (프론트에서 받아온 이메일)
          is_saved: false // 👈 기본값은 false (열람만 한 상태)
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Supabase 저장 에러:', dbError);
      throw dbError;
    }

    console.log('5. 분석 및 저장 완료', { id: insertData.id });
    // 성공 시 고유 ID 반환
    return NextResponse.json({ success: true, id: insertData.id });

  } catch (error) {
    console.error('API 분석 최종 에러:', error);
    return NextResponse.json({ 
      error: '생기부 분석 중 서버 오류가 발생했습니다.', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}