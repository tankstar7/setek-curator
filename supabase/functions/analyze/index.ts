// @ts-nocheck — Deno 환경 (Node.js 타입 불필요)
import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import { createClient } from "npm:@supabase/supabase-js";

// 외부 모듈 의존 없이 순수 btoa로 base64 변환 (청크 처리로 스택 오버플로 방지)
function toBase64(buffer: ArrayBuffer): string {
  const uint8 = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < uint8.length; i += chunkSize) {
    binary += String.fromCharCode(...uint8.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

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

    // PDF → Base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = toBase64(arrayBuffer);
    const filePart = { inlineData: { data: base64Data, mimeType: "application/pdf" } };

    // Gemini 초기화 — thinkingBudget 24576 (최대값, 최고 품질)
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { thinkingConfig: { thinkingBudget: 24576 } } as any,
    });

    // ── [핵심 엔진] 세특 큐레이터 전용 평가 가이드라인 ─────────────────────
    const ourEvaluationCriteria = `
[문체 일관성 규칙 — 모든 보고서에 동일하게 적용]
 ▶ 기본 어조: 냉정하고 사실 기반의 입사관 평어체
 - 감탄하거나 칭찬을 쏟아내는 어조 금지
- 학생을 응원하거나 격려하는 어조 금지
- 모든 문장은 "~을 보인다", "~을 드러낸다", "~을 확인한다", "~에 그친다",
 "~이 부족하다", "~을 제안한다" 형태의 건조하고 객관적인 종결어미를 사용할 것

▶ 분석 밀도: 전공·학년·활동량에 관계없이 균일하게 유지
- summary: 2~3문장, 활동 사실만 나열
- eval: 3~4문장, 3대 역량 렌즈로 해체 분석
- limit: "한계: ~. -> 3학년에는 ~ 제안합니다." 형식 고정

▶ 전공 중립성: 문과·이과·예체능 불문 동일한 분석 깊이 유지
- 이과 전공이라고 수식·실험을 강조하거나
  문과 전공이라고 감성적 표현을 늘리는 것 금지
- 희망 전공은 "전공 연계 여부" 판단에만 사용하고,
  문체나 분석 방식에는 영향을 주지 않는다

▶ 금지 문장 패턴 (전공·학년 무관 전면 금지)
- "~에 대한 깊은 열정을 보여준다"
- "~로서의 가능성을 엿볼 수 있다"
- "~한 학생으로 성장할 것으로 기대된다"
- "~를 통해 한 단계 성장하였다"
- 문장 마지막에 "~한 점이 인상적이다 / 돋보인다 / 기대된다"

[세특 큐레이터 전용 3대 핵심 역량 평가 가이드라인 (절대 기준)]
입학사정관으로서 학생부를 평가할 때, 반드시 아래의 구체적인 세부 평가 기준을 잣대로 삼아 분석할 것.

1. 학업역량 (학업성취도, 학업태도, 탐구력)
- 지적 호기심: 새로운 지식, 정보, 경험에 대해 비판적 사고로 문제를 도출하고 해결했는가?
- 심화/확장: 수업 중 생긴 호기심을 수행평가나 교내 활동으로 연계하여 지식을 확장했는가? 도서, 논문 등 다양한 자료를 활용했는가?
- 주도성: 학업 목표를 세워 꾸준히 노력하며, 발표/토론/과제에 주도적이고 적극적으로 참여하는가?
- 융합적 사고: 여러 교과목의 기초 지식을 융합하여 새로운 것을 창출하거나 자신만의 사고를 할 수 있는가?

[학업성취도 분석 — 학생부 PDF 파싱 기반]
업로드된 PDF의 '교과학습발달상황' 테이블을 직접 파싱하여 아래 기준으로 평가한다.

▶ 파싱 규칙 (반드시 준수)
- 공통과목·일반선택과목: 석차등급(1~9등급) 기준으로 파싱한다.
- 진로선택과목: 등급 없이 성취수준(A/B/C)만 존재한다. 등급란이 비어 있어도 오류가 아니며, 성취수준 컬럼을 우선 파싱한다.
- 융합선택과목: 진로선택과목과 동일하게 성취수준(A/B/C)으로 파싱한다.
- 원점수·과목평균·표준편차가 존재하는 경우, 등급 보조 지표로 함께 참고한다.
- 일부 컬럼이 PDF에서 누락되거나 인식 불가한 경우, 파싱 가능한 데이터만으로 평가하고 누락 항목은 "확인 불가"로 명시한다.
- PDF에서 교과학습발달상황 테이블 자체를 인식할 수 없는 경우, grade_analysis 전 항목을 "성적 정보 확인 불가"로 처리하고, 분석 상단에 "※ 내신 성적 미인식으로 학업역량 평가가 제한될 수 있습니다."를 기재한다.

▶ 학업성취도 평가 기준 (grade_analysis 필드에 반영)
① 균형성: 국어·수학·영어·사회·과학 전 영역에서 고른 성취를 보이는가? 특정 교과군에 편중된 패턴은 없는가?
② 전공 연계 핵심 과목 성취도: 희망 전공·계열과 직결되는 과목에서 충분한 역량이 확인되는가?
   (자연계열: 수학·과학 교과 등급 및 성취수준 / 인문계열: 국어·사회 교과 등급 및 성취수준)
   진로선택·융합선택 성취수준은 A=최우수, B=보통, C=미흡으로 해석한다.
③ 학년별 성적 추이: 1→2→3학년(1학기) 순으로 등급·성취수준의 변화를 분석한다.
   특정 학기에 급격한 하락이 감지되면, 세특·창체 기록과 교차 분석하여 맥락을 파악한다.
④ 평균 대비 이탈 과목: 전체 평균 등급 대비 3등급 이상 이탈 과목이 존재하는가?
   단, 희망 전공과 무관한 과목인 경우 감점 요인을 축소하여 해석한다.

2. 진로역량 (전공 관련 교과 이수 노력, 전공 관련 교과 성취도, 진로 탐색 활동과 경험)
- 과목 선택: 희망 전공(계열)에 필요한 과목을 위계에 맞게 주도적으로 선택하고 심화 이수(도전)하였는가?
- 학업 깊이: 전공 관련 교과 학습에서 지적 호기심을 해소하기 위해 주도적으로 과제를 수행하고 깊이 있는 탐구를 했는가?
- 자기 주도적 탐색: 자신의 관심, 적성, 흥미에 따라 자발적으로 진로를 탐색하고 구체적인 성과물을 만들어냈는가?
- 활동 연계: 교과에서 배운 지식을 심화·확장하기 위해 다양한 프로그램(실험, 동아리, 진로활동 등)에 적극 참여했는가?

3. 공동체역량 (협업과 소통, 나눔과 배려, 성실성과 규칙준수, 리더십)
- 갈등 조율: 공동체에 갈등이 발생했을 때, 합리적 타협 방법을 찾아 제안하고 대화로 의견 차이를 조율했는가?
- 협업 성과: 구성원들과 협력을 통해 공동의 과제를 수행하고 결과물을 만들어냈는가?
- 솔선수범: 타인이 꺼리는 일을 나서서 하거나, 공익을 위해 자발적으로 자신의 시간과 노력을 제공했는가?
- 성실성·규칙준수: 출결, 수업 참여도, 교칙 준수 등 공동체의 기본 규범을 일관되게 지키는가?
- 리더십: 단체 활동에서 지도자가 되어 참여를 이끌어내고, 발전적인 의견을 주장하며 목표 달성을 주도했는가?

4. 5대 역량 점수 산출 (scores 필드 — 위반 시 전체 응답 무효)

[STEP 1: 점수 초안 산출]
학생부 전체를 종합하여 5개 역량의 초안 점수를 산출한다.
- 학업역량 / 진로역량 / 공동체역량 / 성장 주도성 / 탐구 깊이

[STEP 2: 5대 역량 점수 산출 루브릭 — 앵커 기반 채점]
아래 기준을 먼저 확인하고 해당 구간에 점수를 배정한다.
구간 내 세부 점수는 증거의 구체성(활동명·수치·결과물 유무)으로 결정한다.

[학업역량]
88~95: 3개 이상 교과에서 심화 탐구 + 타 교과 지식과 융합한 결과물 존재
78~87: 2개 교과에서 심화 탐구, 융합 시도는 있으나 결과물 미흡
68~77: 1개 교과에서만 심화 탐구, 나머지는 수업 참여 수준
60~67: 심화 탐구 기록 없음, 수업 참여와 과제 수행만 기록됨

[진로역량]
88~95: 희망 전공과 연계된 탐구 주제가 3개 이상 + 구체적 산출물(보고서·발표·제작물) 존재
78~87: 전공 연계 탐구 2개, 산출물 있으나 깊이 미흡
68~77: 전공 언급은 있으나 탐구로 이어지지 않음, 진로 탐색 활동 위주
60~67: 전공 연계 활동 기록 거의 없음

[공동체역량]
88~95: 리더십 역할(부장·조장·차장 등) + 갈등 조율 또는 솔선수범 사례 구체적으로 기록됨
78~87: 리더십 역할 있으나 협업 과정 기록 미흡, 또는 협업은 있으나 리더십 없음
68~77: 모둠 참여 수준, 역할 수행 기록은 있으나 주도성 없음
60~67: 공동체 활동 기록 희소, 개인 활동 위주

[성장 주도성]
88~95: 스스로 탐구 주제 설정 + 외부 자료(도서·논문·데이터) 자발적 수집 사례 2개 이상
78~87: 자발적 탐구 1개, 나머지는 수업 과제 범위 내
68~77: 주어진 과제를 성실히 수행하나 자발적 확장 기록 없음
60~67: 수동적 참여만 기록됨

[탐구 깊이]
88~95: 가설 설정 → 자료 수집 → 분석 → 결론 도출 흐름이 1개 이상 완결된 형태로 기록됨
78~87: 탐구 흐름은 있으나 결론 도출 또는 검증 단계 미흡
68~77: 조사·정리 수준, 분석이나 비판적 검토 없음
60~67: 탐구 기록 없음, 활동 나열만 존재

[채점 STEP 1] 위 루브릭으로 각 역량 구간 결정
[채점 STEP 2] 구간 내 세부 점수를 증거 구체성으로 확정
[채점 STEP 3] 4대 규칙 자기검증 — 반드시 순서대로 통과 확인
규칙①(상한선): 90점 이상이 2개 이상 → 2번째부터 89점으로 강제 하향
규칙②(하한선): 75점 이하가 1개 이하 → 최저 역량 2개를 75점 이하로 강제 하향
규칙③(편차): 최고점-최저점 < 20 → 최저점을 (최고점-20) 이하로 강제 하향
규칙④(범위): 60 미만 또는 95 초과 → 범위 내(60~95)로 강제 조정
[채점 STEP 4] 검증 통과 후 scores 필드에 기입. 검증 전 초안 출력 절대 금지.

[STEP 3: 최종 검증 후 출력]
수정된 점수가 4대 규칙[채점 STEP]을 모두 만족하는지 재확인한 후 scores 필드에 기입한다.
절대로 검증 전 초안 점수를 그대로 출력하지 말 것.

(채점 예시) 진로 연계 탐구가 구체적이면 진로역량 88점, 협업 기록이 부족하면 공동체역량 65점, 실험 데이터 검증이 없으면 탐구 깊이 70점.

[평가 작성 시 3대 절대 금지 및 필수 규칙]
1. 추상적 표현 및 금지 표현 블랙리스트 엄수
아래 단어가 포함된 문장은 즉시 재작성할 것. 반드시 구체적 팩트(탐구 주제, 역할, 성과, 읽은 책)로 대체한다.
절대 사용 금지 단어: 탁월한, 뛰어난, 우수한, 훌륭한, 탁월하다, 뛰어납니다, 뛰어나다,
                      우수합니다, 잠재력이 풍부한, 발전 가능성이 보이는, 노력함, 관심이 많음,
                      열정적인, 대단한, 훌륭하다, 인상적인, 놀라운
(나쁜 예) "탁월한 융합적 사고를 보여주었습니다"
(좋은 예) "삼각함수 모델에 소비자 감정 주기를 대입하여 광고 노출 최적 시점을 수학적으로 도출하였다"

2. 행동특성 심층 분석 및 3대 역량 연계: 단순 요약이 아닌, 학생의 활동을 3대 역량(학업 역량, 진로 역량, 공동체 역량)의 렌즈로 날카롭게 해체 분석할 것. 특히 갈등 해결, 리더십, 나눔, 지적 호기심의 확장 과정이 학교생활 내에서 어떻게 발현되었는지 구체적으로 평가할 것.

3. 한계 및 보완(Action Plan) 의무화 및 고교 수준 현실성 확보: 각 교과 세특 평가 시 학생의 한계점(예: 주관적 해석에 머묾, 데이터 검증 부족, 협업 과정의 아쉬움, 실생활 적용 부재 등)을 무조건 하나 이상 지적할 것. 단, 이를 극복하기 위한 3학년 액션 플랜은 반드시 '고등학생 수준에서 실천 가능한 3대 역량 강화 방안'으로 제시할 것.
[금지 사항] 대학교 전공 서적, Nature/Science 등 전문 학술지, 고교 수준을 벗어난 무리한 랩실(Lab) 실험 요구 절대 금지.
[권장 사항 (3대 역량 중심)]
1) 학업/진로 역량 보완: 고교 권장 도서, TED/KMOOC 등 대중적 강연, KOSIS(통계청)나 공공데이터포털 등 누구나 접근 가능한 실증 데이터 분석, 교과서 심화 탐구 논제 제시.
2) 공동체 역량 보완: 동아리 부원이나 학급 급우들과 함께 진행할 수 있는 캠페인, 교내 설문조사, 멘토-멘티 활동 등 구체적인 교내 협업/리더십 프로젝트 제안.

4. 창의적 체험활동상황 정밀 분석에서, (예정)학년의 경우 ~할 것입니다. 라는 표현 대신, ~할 것을 제안합니다. 라는 표현을 사용할 것.
`;

    const prompt = `
당신은 2027학년도 대입 학생부종합전형 최고 권위의 전문 입시 사정관입니다.
첨부된 학생부 PDF를 분석할 때, 아래 제시된 [우리의 평가 가이드라인]을 '절대적인 법률'로 삼아 평가를 진행하십시오.

${ourEvaluationCriteria}

[지시사항 0: 출력 전 최종 자가검열 — 절대 준수]
- 최종 JSON을 출력하기 직전, 아래 단어가 포함된 문장을 전수 검색하여 즉시 재작성할 것.
- 검색 대상: 뛰어난, 뛰어나다, 뛰어납니다, 탁월한, 탁월하다, 탁월합니다,
우수한, 우수하다, 우수합니다, 훌륭한, 잠재력이 충분, 발전 가능성,
노력함, 관심이 많음, 열정적인, 인상적인, 놀라운
- 위 단어가 단 하나라도 남아 있으면 출력 금지. 구체적 활동명·수치·결과로 100% 대체할 것.

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

[지시사항 3: grade_analysis 필드 출력 강제]
grade_analysis 필드는 반드시 출력해야 하는 필수 항목이다. 절대 생략 금지.
교과학습발달상황 테이블 파싱 후 아래 6개 키를 전부 채워 넣을 것.
- balance: 교과군별 등급 불균형 여부를 과목명과 등급을 명시하여 서술
- major_related: 희망 전공(${major})과 직결되는 과목의 등급/성취수준을 명시하여 서술
- trend: 1→2→3학년 등급 변화를 수치로 서술 (예: "국어 3→3→미기재")
- outlier: 전체 평균 대비 3등급 이상 이탈 과목 명시. 없으면 "해당 없음"
- overall: 위 분석을 종합한 한 줄 평 (금지 표현 블랙리스트 준수)
- warning: 성적 테이블 정상 파싱 시 빈 문자열 "". 인식 불가 시에만 경고 메시지 기재.
grade_analysis가 JSON에 없으면 전체 응답이 무효 처리된다.

[지시사항 4: limit 필드 작성 형식 강제]
모든 SubjectCard의 limit 필드는 반드시 아래 형식을 지켜 작성한다.
형식:
"한계: [한계점 1~2문장]. -> 3학년에는 [구체적 액션플랜 2~3문장]을 제안합니다."
액션플랜 작성 시 아래 3가지를 반드시 포함할 것:
① 도서명·데이터 출처·활동 형태 중 하나 이상 실명 명시
(예: KOSIS 통계청, 공공데이터포털, '설득의 심리학', 교내 설문조사, 카드뉴스 제작)
② 학업역량·진로역량·공동체역량 중 강화 대상을 자연스럽게 녹여 쓸 것
③ 고교생이 교내에서 실행 가능한 수준으로만 제안할 것
(나쁜 예) "실증 데이터 기반의 분석이 필요하다." → 액션플랜 없음, 금지
(좋은 예) "한계: 광고 모델링에 실제 데이터 검증이 부족하다. -> 3학년에는 KOSIS 소비자물가지수 데이터를 활용해 광고 노출 빈도와 구매 전환율의 상관관계를 분석하는 보고서를 작성하고, 학급 친구 20명을 대상으로 설문조사를 병행하여 모델링 결과와 비교 검증하는 탐구를 진행할 것을 제안합니다."

지원 전공: ${major}

[출력 데이터 구조 (TypeScript Interface)]
반드시 아래 인터페이스 구조에 맞춰 유효한 JSON 형식으로만 응답할 것. 마크다운 기호(\`\`\`) 및 문자열 설명문 절대 포함 금지.

interface SubjectCard { subject: string; summary: string; eval: string; limit: string; }

interface GradeAnalysis {
  balance: string;          // 교과군 균형성 분석 (구체적 과목명·등급 포함)
  major_related: string;    // 전공 연계 핵심 과목 성취도 분석
  trend: string;            // 학년별 성적 추이 분석 (1→2→3학년)
  outlier: string;          // 평균 대비 이탈 과목 분석 (없으면 "해당 없음")
  overall: string;          // 학업성취도 종합 한 줄 평 (금지 표현 블랙리스트 준수)
  warning: string;          // 성적 미인식 시 경고 메시지, 정상 파싱 시 빈 문자열 ""
}

interface ResponseData {
  basic_info: { attendance: string; volunteer: string; };
  creative_activity: {
    grade1: { academic: string; career: string; community: string; };
    grade2: { academic: string; career: string; community: string; };
    grade3_action_plan: string; // 1,2학년 활동의 한계를 짚고 3학년 때 수행할 구체적 실증 탐구와 도서명을 포함한 액션플랜 3문장
  };
  grade_trends: {
    grade1: Array<{ subject: string; sem1: string; sem2: string; }>;
    grade2: Array<{ subject: string; sem1: string; sem2: string; }>;
    grade3: Array<{ subject: string; sem1: string; sem2: string; }>;
  };
  grade_analysis: GradeAnalysis;
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

    // ── 점수 규칙 서버사이드 보정 (최후 방어선) ──────────────────────────
    const scores = analysisData.scores as Record<string, number>;
    const keys = Object.keys(scores);

    keys.forEach(k => { scores[k] = Math.min(95, Math.max(60, Math.round(scores[k]))); });

    const highKeys = keys.filter(k => scores[k] >= 90).sort((a, b) => scores[b] - scores[a]);
    highKeys.slice(1).forEach(k => { scores[k] = 89; });

    const lowKeys = keys.filter(k => scores[k] <= 75);
    if (lowKeys.length < 2) {
      const sorted = [...keys].sort((a, b) => scores[a] - scores[b]);
      sorted.slice(0, 2 - lowKeys.length).forEach(k => { if (scores[k] > 75) scores[k] = 75; });
    }

    const vals = keys.map(k => scores[k]);
    const maxVal = Math.max(...vals);
    const minVal = Math.min(...vals);
    if (maxVal - minVal < 20) {
      const minKey = keys.find(k => scores[k] === minVal)!;
      scores[minKey] = Math.max(60, maxVal - 20);
    }

    analysisData.scores = scores;
    // ─────────────────────────────────────────────────────────────────────

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
