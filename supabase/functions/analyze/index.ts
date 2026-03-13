// @ts-nocheck — Deno 환경 (Node.js 타입 불필요)
import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import { createClient } from "npm:@supabase/supabase-js";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";

// ── CORS ─────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "https://setek-curator.vercel.app",
  "http://localhost:3000",
];

function corsHeaders(origin: string) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const cors = corsHeaders(origin);

  // Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const major = formData.get("major") as string;
    const user_email = formData.get("user_email") as string;

    if (!file || !major) {
      return new Response(
        JSON.stringify({ error: "파일과 희망 전공 데이터가 누락되었습니다." }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    // PDF → Base64 (Deno 방식)
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = encodeBase64(new Uint8Array(arrayBuffer));
    const filePart = { inlineData: { data: base64Data, mimeType: "application/pdf" } };

    // Gemini 초기화 — 150초 타임아웃 여유로 thinkingBudget 16000 (full quality)
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { thinkingConfig: { thinkingBudget: 16000 } } as any,
    });

    // ── [핵심 엔진] 세특 큐레이터 전용 3대 핵심 역량 평가 가이드라인 ─────────
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

      4. 5대 역량 점수 산출 (scores 필드 — 절대 규칙, 반드시 준수)
      학생의 학생부 전체를 종합하여 아래 5개 역량을 각각 정수(Integer)로 수치화하여 scores 필드에 채워 넣는다.
      - 학업역량 / 진로역량 / 공동체역량 / 주도성 / 탐구깊이
      ※ scores 필드의 모든 값은 반드시 60 이상 95 이하의 정수여야 한다. 0이나 예시 숫자를 그대로 복사하는 것은 절대 금지한다.
      [만점 남발 금지] 모든 역량에 90점 이상을 부여하는 행위를 절대 금지한다.
      [현실적 편차 필수] 학생부 텍스트의 구체성·데이터 기반 탐구 유무·한계점을 종합하여, 반드시 강점(85~95점)과 약점(60~75점)이 뚜렷하게 대비되도록 현실적인 표준편차를 적용한다.
      [하한선 규칙] 5개 역량 중 최소 1개는 반드시 75점 이하여야 한다. 모든 역량이 76점 이상이면 규칙 위반이다.
      (채점 예시) 진로 연계 탐구가 구체적이면 진로역량 92점, 그러나 실험 데이터 검증이 없으면 탐구깊이 68점.

      [평가 작성 시 3대 절대 금지 및 필수 규칙]
      1. 추상적 표현 금지: "노력함", "우수함", "뛰어남", "관심이 많음" 등의 뻔한 칭찬 단어는 절대 배제. 반드시 구체적 팩트(탐구 주제, 역할, 성과, 읽은 책)를 기반으로 입증할 것.
      2. 행동특성 심층 분석 및 3대 역량 연계: > 단순 요약이 아닌, 학생의 활동을 3대 역량(학업 역량, 진로 역량, 공동체 역량)의 렌즈로 날카롭게 해체 분석할 것. 특히 갈등 해결, 리더십, 나눔, 지적 호기심의 확장 과정이 학교생활 내에서 어떻게 발현되었는지 구체적으로 평가할 것.
      3. 한계 및 보완(Action Plan) 의무화 및 고교 수준 현실성 확보: > 각 교과 세특 평가 시 학생의 한계점(예: 주관적 해석에 머묾, 데이터 검증 부족, 협업 과정의 아쉬움, 실생활 적용 부재 등)을 무조건 하나 이상 지적할 것. 단, 이를 극복하기 위한 3학년 액션 플랜은 반드시 '고등학생 수준에서 실천 가능한 3대 역량 강화 방안'으로 제시할 것.
      [금지 사항] 대학교 전공 서적, Nature/Science 등 전문 학술지, 고교 수준을 벗어난 무리한 랩실(Lab) 실험 요구 절대 금지.
      [권장 사항 (3대 역량 중심)] > 1) 학업/진로 역량 보완: 고교 권장 도서, TED/KMOOC 등 대중적 강연, KOSIS(통계청)나 공공데이터포털 등 누구나 접근 가능한 실증 데이터 분석, 교과서 심화 탐구 논제 제시.
      2) 공동체 역량 보완: 동아리 부원이나 학급 급우들과 함께 진행할 수 있는 캠페인, 교내 설문조사, 멘토-멘티 활동 등 구체적인 교내 협업/리더십 프로젝트 제안.
      4. 창의적 체험활동상황 정밀 분석에서, (예정)학년의 경우 ~할 것입니다. 라는 표현 대신, ~할 것을 제안합니다. 라는 표현을 사용할 것.
    `;

    const prompt = `
      당신은 2027학년도 대입 학생부종합전형 최고 권위의 전문 입시 사정관입니다.
      첨부된 학생부 PDF를 분석할 때, 아래 제시된 [우리의 평가 가이드라인]을 '절대적인 법률'로 삼아 평가를 진행하십시오.

      ${ourEvaluationCriteria}

      [지시사항 1: 성적 출력 규칙 (절대 준수)]
      - 모든 과목의 성적은 반드시 "석차등급/성취도" 형태로 출력하세요. (예: 3/A, 4/B)
      - 괄호 안의 숫자는 절대 포함하지 마세요. (예: 3/A(280) -> 3/A로 출력)
      - 석차등급이 없는 진로선택과목은 "-/성취도" 형태로 출력하세요. (예: -/A)

      [지시사항 2: 교과 분류 및 누락 방지 규칙 (핵심)]
      PDF 성적표에 기재된 모든 과목을 아래 3개 그룹에 "학년별로" 빠짐없이 배정하세요.
      - group1 (국어/수학/영어): 국어, 수학, 영어 교과군 전체
      - group2 (한국사/사회/과학): 한국사, 사회, 과학, 역사, 도덕 교과군 전체
        * 특히 1학년의 '한국사', '통합사회', '통합과학'은 반드시 이 그룹의 subject_activity에 포함되어야 함.
      - group3 (기타): 기술·가정, 제2외국어, 한문, 교양, 정보, 환경, 예술, 체육 등 나머지 모든 과목

      지원 전공: ${major}

      [출력 데이터 구조 (TypeScript Interface)]
      반드시 아래 인터페이스 구조에 맞춰 유효한 JSON 형식으로만 응답할 것. 마크다운 기호(\`\`\`) 및 문자열 설명문 절대 포함 금지.

      interface SubjectCard { subject: string; summary: string; eval: string; limit: string; }
      interface ResponseData {
        basic_info: { attendance: string; volunteer: string; };
        creative_activity: {
          grade1: { academic: string; career: string; community: string; };
          grade2: { academic: string; career: string; community: string; };
          grade3_action_plan: string;
        };
        grade_trends: {
          grade1: Array<{ subject: string; sem1: string; sem2: string; }>;
          grade2: Array<{ subject: string; sem1: string; sem2: string; }>;
          grade3: Array<{ subject: string; sem1: string; sem2: string; }>;
        };
        subject_activity: {
          grade1: { group1: SubjectCard[]; group2: SubjectCard[]; group3: SubjectCard[]; };
          grade2: { group1: SubjectCard[]; group2: SubjectCard[]; group3: SubjectCard[]; };
          grade3: { group1: SubjectCard[]; group2: SubjectCard[]; group3: SubjectCard[]; };
        };
        behavior_summary: { grade1: string; grade2: string; analysis: string; final_comment: string; };
        scores: {
          "학업역량": number;
          "진로역량": number;
          "공동체역량": number;
          "성장 주도성": number;
          "탐구 깊이": number;
        };
      }
    `;

    // Gemini 호출
    const result = await model.generateContent([prompt, filePart]);
    const responseText = result.response.text().replace(/```json|```/g, "").trim();

    let analysisData;
    try {
      analysisData = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Gemini 응답 파싱 실패: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }

    // Supabase DB 저장
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: insertData, error: dbError } = await supabase
      .from("analysis_results")
      .insert([{ major, result_data: analysisData, user_email, is_saved: false }])
      .select()
      .single();

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({ success: true, id: insertData.id }),
      { headers: { ...cors, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Edge Function 에러:", error);
    return new Response(
      JSON.stringify({
        error: "생기부 분석 중 서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
