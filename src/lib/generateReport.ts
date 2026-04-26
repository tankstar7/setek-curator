import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

export interface ReportParams {
  curriculumType: string;
  subject: string;
  units: string[];
  majors: string[];
}

/**
 * Agent 1: Claude 3.5 Haiku + web_search
 *   - 참고문헌 검증 및 성취기준 코드 수집
 *   - Gemini 대비 hallucination 대폭 감소 + 지시 추종력 우수
 *   - skill 파일 전달 불필요 (짧은 집중 프롬프트만 사용)
 *
 * Agent 2: Gemini Pro
 *   - 검증된 참고문헌 수신 후 본문 작성 (무료)
 *   - skill 파일 + example 파일 수신
 */
export async function generateSetekReport(params: ReportParams): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!geminiKey) throw new Error('GEMINI_API_KEY가 설정되어 있지 않습니다.');
  if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY가 설정되어 있지 않습니다.');

  // =====================================================================
  // Agent 1: Claude 3.5 Haiku — 웹 검색으로 참고문헌 검증
  // =====================================================================
  const anthropic = new Anthropic({ apiKey: anthropicKey });

  const researchPrompt = `당신은 대한민국 학술 논문 검증 전문가입니다. 아래 고등학생 탐구 주제에 맞는 실존 논문 5건을 찾아야 합니다.

[탐구 정보]
- 교과목: ${params.subject} (${params.curriculumType})  
- 단원: ${params.units.join(' > ')}
- 희망 전공: ${params.majors.join(', ')}

[임무 순서]
1. site:ncic.re.kr 또는 교육부 고시로 해당 과목의 2022 개정 교육과정 성취기준 코드 확인
2. 탐구 주제에 가장 적합한 심화 탐구 주제 1개 확정
3. 탐구 주제와 관련된 실존 논문을 RISS(riss.kr) 또는 DBpia(dbpia.co.kr)에서 검색
4. **각 논문마다 반드시 상세페이지에 직접 접속하여 UCI(국가고유식별자) 또는 DOI를 확인**
5. UCI/DOI가 확인되지 않는 논문은 즉시 제외하고 다른 논문으로 교체
6. 최소 5건의 UCI/DOI 확인 완료된 논문만 수집

[절대 규칙]
- 논문 목록 화면만 보고 논문을 선택하는 것 금지
- 상세페이지 접속 → UCI 필드 직접 확인이 필수
- UCI/DOI 없이 추측하거나 생성하는 것 절대 금지
- 한국어 논문 우선, 부족하면 영어 논문 포함 가능

[출력 형식 — 순수 JSON만 출력, 마크다운 불필요]
{
  "curriculum_code": "성취기준 코드 (예: [12물리02-03])",
  "corrected_large_unit_name": "번호 없는 공식 대단원명 (예: 전기와 자기)",
  "corrected_small_unit_name": "번호 없는 공식 소단원명 (예: 전자기 유도)",
  "topic": "확정된 심화 탐구 주제 제목",
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "verified_references": [
    {
      "index": 1,
      "text": "[1] 저자 (연도). 제목. 학술지명, 권(호), 페이지.",
      "uci": "실제 확인된 UCI 또는 DOI",
      "verification_note": "상세페이지에서 UCI 확인 완료 근거"
    }
  ]
}`;

  console.log('[Agent 1] Claude 3.5 Haiku — 웹 검색으로 참고문헌 검증 시작...');
  
  let researchData: any;
  try {
    const claudeResponse = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4096,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 10 } as any],
      messages: [{ role: 'user', content: researchPrompt }],
    });

    // 마지막 text 블록 추출
    const textBlock = claudeResponse.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('');

    const rawJson = textBlock.replace(/```json|```/gi, '').trim();
    researchData = JSON.parse(rawJson);
    console.log('[Agent 1] 완료 — 주제:', researchData.topic);
    console.log('[Agent 1] 성취기준:', researchData.curriculum_code);
    console.log('[Agent 1] 검증 논문 수:', researchData.verified_references?.length ?? 0);
  } catch (err) {
    console.error('[Agent 1] Claude 응답 파싱 실패:', err);
    throw new Error('Agent 1 (Claude Haiku) 실패 — 파이프라인 중단');
  }

  // =====================================================================
  // Agent 2: Gemini Pro — 검증된 참고문헌 기반 보고서 본문 작성
  // =====================================================================
  const promptPath = path.join(process.cwd(), 'docs', 'setek-reports-writing-skill.md');
  const skillPrompt = fs.readFileSync(promptPath, 'utf8');

  const examplePath = path.join(process.cwd(), 'example', 'example_report.md');
  let examplePrompt = '';
  try {
    examplePrompt = fs.readFileSync(examplePath, 'utf8');
  } catch {
    console.warn('[System] example_report.md 없음 — 생략');
  }

  const referencesText = (researchData.verified_references ?? [])
    .map((r: any) => r.text)
    .join('\n');

  const userRequest = `
[탐구 기본 정보]
- 교육과정    : 2022 개정 교육과정 (성취기준: ${researchData.curriculum_code})
- 과목 유형   : ${params.curriculumType}
- 교과목명    : ${params.subject}
- 관련 단원   : [대단원] ${researchData.corrected_large_unit_name} / [소단원] ${researchData.corrected_small_unit_name}
- 희망 전공   : ${params.majors.join(' / ')}
- 핵심 탐구 키워드 : ${(researchData.keywords ?? []).join(', ')}
- 핵심 탐구 주제   : ${researchData.topic}

[검증 완료된 실존 참고문헌 5건 — 이 문헌들만 사용할 것]
${referencesText}

앞서 전달받은 전체 규칙(세특 심화 탐구 보고서 — 황금 양식 v4)을 완벽히 엄수하여
위의 [탐구 기본 정보]와 [참고문헌]을 바탕으로 프리미엄 심화 탐구 보고서를 작성해.

[자동화 파이프라인 전용 — 절대 준수]
1. Step 1·2 사용자 확인 절차는 백엔드에서 완료됨. 즉시 Step 3 보고서 본문 작성 시작.
2. SQL 출력 대신 아래 JSON 규격으로 결과물 단 1개만 출력.
3. 제목 역할 문구("황금 양식 v4" 등)는 절대 출력 금지.
4. 참고문헌 각 항목 사이 빈 줄 필수.
5. 대제목 ## / 소제목 ### 엄수.
6. 표(|---|) 사용 금지, 줄글+불렛 사용.
7. large_unit_name / small_unit_name에 번호(I., 1. 등) 절대 포함 금지.
\`\`\`json
{
  "curriculum_year": "2022",
  "subject_type": "${params.curriculumType}",
  "subject": "${params.subject}",
  "large_unit_name": "${researchData.corrected_large_unit_name}",
  "large_unit_order": ${romanToInt(researchData.corrected_large_unit_name) ?? 1},
  "small_unit_name": "${researchData.corrected_small_unit_name}",
  "small_unit_order": 1,
  "target_majors": ${JSON.stringify(params.majors)},
  "title": "${researchData.topic}",
  "preview_content": "(반드시 150~200자 독립 요약문)",
  "main_content": "(마크다운+수식 포함 1~5번 본문 전체 및 6. 참고문헌)",
  "keywords": "${(researchData.keywords ?? []).join(', ')}",
  "access_tier": "premium"
}
\`\`\`
`;

  const genAI = new GoogleGenerativeAI(geminiKey);
  const draftModel = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-preview-05-06' });

  console.log('[Agent 2] Gemini Pro — 보고서 본문 렌더링 중...');
  const result = await draftModel.generateContent([
    { text: skillPrompt },
    { text: `[작성 벤치마크 예시]\n${examplePrompt}` },
    { text: userRequest },
  ]);

  const output = result.response.text();
  console.log('[Agent 2] 보고서 렌더링 완료');
  return output;
}

/** 로마자 접두사 또는 아라비아 숫자에서 순서 번호 추출 */
function romanToInt(str: string): number | null {
  const romanMap: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 };
  const match = str.match(/^([IVX]+)\./);
  if (match) return romanMap[match[1]] ?? null;
  const numMatch = str.match(/^(\d+)\./);
  if (numMatch) return parseInt(numMatch[1]);
  return null;
}
