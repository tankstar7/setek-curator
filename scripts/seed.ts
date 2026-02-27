/**
 * Firestore 시딩 스크립트
 *
 * 실행 방법:
 *   npm run seed
 *
 * Node.js v24의 --experimental-strip-types 로 TypeScript를 직접 실행하며,
 * --env-file=.env.local 로 Firebase 환경변수를 주입한다.
 * 추가 패키지 설치 불필요.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import type { Curriculum, SkillTree, Report } from "../src/lib/db.ts";

// ─── Firebase 초기화 ────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// ─── 헬퍼 ───────────────────────────────────────────────────────────────────

async function isCollectionEmpty(colName: string): Promise<boolean> {
  const snap = await getDocs(collection(db, colName));
  return snap.empty;
}

function log(emoji: string, msg: string) {
  console.log(`${emoji}  ${msg}`);
}

// ─── 시딩 데이터 ────────────────────────────────────────────────────────────

// 3.1 curriculum
const curriculumData: (Curriculum & { id: string })[] = [
  {
    id: "chemistry-reaction-energy",
    subject: "과학",
    course: "화학",
    major_unit: "화학 반응과 에너지",
    minor_units: ["반응 엔탈피와 헤스 법칙", "전기화학과 전지", "산화 환원 반응의 응용"],
    textbook_analysis: {
      core_concepts: ["산화수", "산화 환원", "전지 전위", "엔탈피 변화", "헤스 법칙"],
      publisher_specifics: [
        { publisher: "천재교육", focus_point: "반응 엔탈피 계산과 결합 에너지를 통한 이해에 비중을 둠" },
        { publisher: "미래엔", focus_point: "전기화학 파트에서 납축전지·리튬이온 전지 비교 심화" },
        { publisher: "비상교육", focus_point: "산화 환원 반응과 일상생활 응용 사례를 중심으로 서술" },
      ],
    },
  },
  {
    id: "chemistry-bonding-properties",
    subject: "과학",
    course: "화학",
    major_unit: "화학 결합과 물질의 성질",
    minor_units: ["이온 결합과 공유 결합", "분자 간 힘과 물질의 성질", "고분자와 신소재"],
    textbook_analysis: {
      core_concepts: ["결합 극성", "분자 구조", "런던 분산력", "수소 결합", "폴리머 구조"],
      publisher_specifics: [
        { publisher: "천재교육", focus_point: "VSEPR 이론과 분자 구조 예측을 자세히 다룸" },
        { publisher: "금성출판사", focus_point: "신소재(그래핀, 탄소나노튜브) 응용 사례 강조" },
      ],
    },
  },
  {
    id: "physics-mechanics-energy",
    subject: "과학",
    course: "물리학",
    major_unit: "역학과 에너지",
    minor_units: ["뉴턴의 운동 법칙", "운동량과 충격량", "열역학 법칙과 엔트로피", "유체 역학"],
    textbook_analysis: {
      core_concepts: ["뉴턴 3법칙", "운동량 보존", "카르노 효율", "엔트로피", "베르누이 방정식"],
      publisher_specifics: [
        { publisher: "천재교육", focus_point: "열역학 파트에서 카르노 기관의 효율 유도 과정을 단계별로 설명" },
        { publisher: "지학사", focus_point: "유체 역학에서 실생활 예시(비행기 양력, 혈액 흐름)를 적극 활용" },
      ],
    },
  },
  {
    id: "physics-electromagnetism",
    subject: "과학",
    course: "물리학",
    major_unit: "전기와 자기",
    minor_units: ["전기장과 자기장", "전자기 유도", "교류 회로와 변압기", "전자기파의 스펙트럼"],
    textbook_analysis: {
      core_concepts: ["쿨롱 법칙", "패러데이 법칙", "렌츠의 법칙", "RLC 회로", "맥스웰 방정식(개요)"],
      publisher_specifics: [
        { publisher: "비상교육", focus_point: "전자기 유도의 발전기·변압기 응용에 집중" },
        { publisher: "미래엔", focus_point: "전자기파 스펙트럼과 통신 기술 연결 강조" },
      ],
    },
  },
  {
    id: "biology-cell-metabolism",
    subject: "과학",
    course: "생명과학",
    major_unit: "세포와 물질대사",
    minor_units: ["세포 호흡과 ATP", "광합성 명반응과 캘빈 회로", "효소의 작용 원리"],
    textbook_analysis: {
      core_concepts: ["ATP 합성효소", "전자 전달계", "화학삼투", "RuBisCO", "효소 활성화 에너지"],
      publisher_specifics: [
        { publisher: "천재교육", focus_point: "미토콘드리아와 엽록체의 내막 구조와 ATP 합성 기전을 그림과 함께 상세 서술" },
        { publisher: "교학사", focus_point: "광합성 산물의 이동과 저장 과정까지 연계하여 설명" },
      ],
    },
  },
  {
    id: "biology-genetics-evolution",
    subject: "과학",
    course: "생명과학",
    major_unit: "유전과 진화",
    minor_units: ["DNA 복제와 전사", "번역과 단백질 합성", "돌연변이와 유전자 편집", "자연선택과 진화"],
    textbook_analysis: {
      core_concepts: ["반보존적 복제", "코돈", "tRNA", "CRISPR-Cas9 원리", "하디-바인베르크 법칙"],
      publisher_specifics: [
        { publisher: "미래엔", focus_point: "CRISPR 유전자 편집 기술을 별도 심화 코너로 소개" },
        { publisher: "비상교육", focus_point: "하디-바인베르크 평형 계산 문제를 집중적으로 다룸" },
      ],
    },
  },
  {
    id: "math-calculus",
    subject: "수학",
    course: "미적분",
    major_unit: "수열의 극한과 미분·적분",
    minor_units: ["수열의 극한과 급수", "미분법", "적분법", "급수와 미적분의 응용"],
    textbook_analysis: {
      core_concepts: ["엡실론-델타 정의(개요)", "연쇄 법칙", "로피탈 정리", "부분적분", "치환적분"],
      publisher_specifics: [
        { publisher: "천재교육", focus_point: "물리·공학 응용(넓이·속도·가속도) 문제를 다수 수록" },
        { publisher: "금성출판사", focus_point: "극한의 엄밀한 정의를 직관적 그림으로 보완" },
      ],
    },
  },
  {
    id: "info-ai-basics",
    subject: "정보",
    course: "인공지능 기초",
    major_unit: "머신러닝과 딥러닝의 이해",
    minor_units: ["지도·비지도·강화 학습", "신경망과 역전파", "CNN과 이미지 인식", "자연어 처리 기초"],
    textbook_analysis: {
      core_concepts: ["경사하강법", "활성화 함수", "손실 함수", "합성곱 연산", "트랜스포머 어텐션"],
      publisher_specifics: [
        { publisher: "천재교육", focus_point: "파이썬 코드 실습 예제로 신경망 구현 과정을 단계별로 제시" },
        { publisher: "미래엔", focus_point: "AI 윤리와 사회적 영향 섹션을 별도로 구성" },
      ],
    },
  },
];

// 3.2 skill_trees
const skillTreeData: (SkillTree & { id: string })[] = [
  {
    id: "기계공학과",
    major_name: "기계공학과",
    description: "기계 설계·제어·열유체·재료를 다루는 공학의 근간",
    core_required: ["수학Ⅰ", "수학Ⅱ", "미적분", "물리학Ⅰ", "물리학Ⅱ"],
    advanced_required: ["기하", "확률과 통계", "화학Ⅰ"],
    ai_recommended_combo: [
      {
        courses: ["역학과 에너지", "물질과 에너지", "로봇과 공학설계"],
        reason:
          "열역학·유체역학의 물리적 기초(역학과 에너지)와 신소재 이해(물질과 에너지), AI 기반 로봇 제어(로봇과 공학설계)의 시너지 조합. 자동차·항공·로봇 분야 진로에 최적.",
        highlight_major: ["자동차공학", "항공우주공학", "로봇공학"],
      },
    ],
  },
  {
    id: "의예과",
    major_name: "의예과",
    description: "생명과학·화학·물리의 통합적 이해 위에 세워지는 임상의학",
    core_required: ["수학Ⅰ", "수학Ⅱ", "생명과학Ⅰ", "생명과학Ⅱ", "화학Ⅰ", "화학Ⅱ"],
    advanced_required: ["물리학Ⅰ", "확률과 통계"],
    ai_recommended_combo: [
      {
        courses: ["세포와 물질대사", "화학반응의 세계", "보건"],
        reason:
          "세포 수준의 생리학(세포와 물질대사)과 약물 작용의 화학적 기반(화학반응의 세계), 실제 의료 현장 이해(보건)를 아우르는 의대 입시 최강 조합.",
        highlight_major: ["내과", "약학", "바이오메디컬"],
      },
    ],
  },
  {
    id: "컴퓨터공학과",
    major_name: "컴퓨터공학과",
    description: "소프트웨어·알고리즘·시스템·AI를 설계하는 디지털 시대의 핵심",
    core_required: ["수학Ⅰ", "수학Ⅱ", "미적분", "확률과 통계", "정보"],
    advanced_required: ["기하", "물리학Ⅰ"],
    ai_recommended_combo: [
      {
        courses: ["인공지능 수학", "데이터 과학", "소프트웨어와 생활"],
        reason:
          "AI 알고리즘의 수학적 토대(인공지능 수학)와 빅데이터 분석(데이터 과학), 실생활 SW 문제 해결(소프트웨어와 생활)로 이어지는 SW 개발자 최적 경로.",
        highlight_major: ["AI개발", "데이터엔지니어링", "시스템프로그래밍"],
      },
    ],
  },
  {
    id: "화학공학과",
    major_name: "화학공학과",
    description: "화학 반응을 산업 규모로 설계·최적화하는 공정 엔지니어링",
    core_required: ["수학Ⅰ", "수학Ⅱ", "미적분", "화학Ⅰ", "화학Ⅱ"],
    advanced_required: ["물리학Ⅰ", "확률과 통계", "기하"],
    ai_recommended_combo: [
      {
        courses: ["화학반응의 세계", "물질과 에너지", "환경과 에너지"],
        reason:
          "화학 반응 공정 설계(화학반응의 세계)와 신소재 합성(물질과 에너지), 친환경 공정 이슈(환경과 에너지)를 연결한 배터리·정유·제약 산업 직결 조합.",
        highlight_major: ["배터리공정", "석유화학", "제약공정"],
      },
    ],
  },
  {
    id: "전기전자공학과",
    major_name: "전기전자공학과",
    description: "반도체·회로·통신·에너지 변환을 다루는 현대 산업의 기반",
    core_required: ["수학Ⅰ", "수학Ⅱ", "미적분", "물리학Ⅰ", "물리학Ⅱ"],
    advanced_required: ["기하", "확률과 통계", "정보"],
    ai_recommended_combo: [
      {
        courses: ["전기와 자기", "반도체와 신소재", "정보통신과 미래사회"],
        reason:
          "전자기 이론(전기와 자기)을 반도체 소자 원리(반도체와 신소재)로 연결하고, 5G·IoT 통신 시스템(정보통신과 미래사회)까지 아우르는 삼성·SK하이닉스 직결 조합.",
        highlight_major: ["반도체설계", "통신시스템", "전력전자"],
      },
    ],
  },
];

// 3.3 reports_db
const reportData: (Report & { id: string })[] = [
  {
    id: "report-solid-state-battery",
    trend_keyword: "전고체 배터리",
    report_title: "리튬이온 배터리의 한계와 전고체 배터리의 전기화학적 원리 탐구",
    subject: "화학",
    major_unit: "화학 반응과 에너지",
    publisher: "천재교육",
    target_majors: ["화학공학과", "신소재공학과", "에너지공학과"],
    views: 1842,
    golden_template: {
      motivation:
        "스마트폰 배터리 폭발 뉴스를 접하며 현재 리튬이온 배터리의 안전성 문제에 관심을 가지게 되었다. 교과서의 '산화 환원 반응' 단원에서 전지의 작동 원리를 학습한 후, 차세대 배터리로 주목받는 전고체 배터리의 전기화학적 원리를 탐구하고자 하였다.",
      basic_knowledge:
        "천재교육 화학 교과서 4단원에 따르면, 전지는 산화 반응이 일어나는 음극(anode)과 환원 반응이 일어나는 양극(cathode)으로 구성된다. 리튬이온 배터리에서는 충전 시 양극의 리튬이온(Li⁺)이 음극(흑연)으로 이동하고, 방전 시 역방향으로 이동하며 전류를 생성한다. 전해질은 이온 전도체 역할을 하며, 현재 상용 배터리는 유기용매 기반 액체 전해질을 사용한다.",
      application:
        "액체 전해질의 핵심 문제는 세 가지다. ① 과충전·과열 시 열폭주(thermal runaway) 위험성, ② 리튬 덴드라이트(dendrite) 성장으로 인한 단락 위험, ③ 전압 범위 제한(약 4.2V). 전고체 배터리는 이를 고체 전해질(황화물계, 산화물계, 폴리머계)로 대체한다. 황화물계(Li₆PS₅Cl)는 이온 전도도가 액체와 유사하나 공기 중 H₂S 발생 문제가 있고, 산화물계(LLZO)는 안정적이나 계면 저항이 높다.",
      in_depth:
        "고체 전해질의 핵심 지표는 이온 전도도(σ)와 전자 전도도의 비율이다. 우수한 고체 전해질은 σ_Li⁺ > 10⁻³ S/cm를 목표로 하며, 이는 결정 구조 내 리튬 이온의 공공(vacancy) 농도와 이동도의 곱으로 결정된다(네른스트-아인슈타인 방정식). 최근 주목받는 아지로다이트(argyrodite) 구조 Li₆PS₅Cl은 면심입방(FCC) S²⁻ 격자 내 리튬 이온이 4d→2a 위치로 협력 점프하는 메커니즘으로 고이온 전도도를 달성한다. 계면 저항 문제는 코팅 기술(LiNbO₃, Li₃PO₄)과 소결 공정 최적화로 해결 중이며, 도요타는 2027년 양산을 목표로 황화물계 전고체 배터리 개발을 진행 중이다.",
      major_connection:
        "화학공학과에서는 전고체 배터리 양산을 위한 슬러리 코팅·롤-투-롤 공정 최적화와 고체 전해질 소결 공정(스파크 플라즈마 소결, SPS)을 연구한다. 신소재공학과에서는 Li₇La₃Zr₂O₁₂(LLZO) 등 산화물 전해질의 결정 구조 제어와 도핑 원소(Al, Ta) 최적화를 다룬다. 본 탐구에서 분석한 이온 전도 메커니즘과 계면 저항 문제는 대학원 배터리 연구의 핵심 과제로 직결된다.",
    },
  },
  {
    id: "report-crispr-cas9",
    trend_keyword: "CRISPR-Cas9",
    report_title: "크리스퍼 유전자 가위의 분자생물학적 작동 원리와 유전 질환 치료 가능성 탐구",
    subject: "생명과학",
    major_unit: "유전과 진화",
    publisher: "미래엔",
    target_majors: ["의예과", "생명공학과", "약학과"],
    views: 2105,
    golden_template: {
      motivation:
        "미래엔 생명과학 교과서에서 DNA 복제와 전사 단원을 학습하면서, 유전자를 원하는 위치에서 정밀하게 절단하고 편집하는 CRISPR-Cas9 기술에 관심을 갖게 되었다. 최근 겸상적혈구 빈혈증 최초 CRISPR 치료제 승인 뉴스가 계기가 되어 그 분자생물학적 원리를 심층 탐구하였다.",
      basic_knowledge:
        "DNA는 아데닌(A)-티민(T), 구아닌(G)-시토신(C) 염기쌍 규칙으로 이중나선을 형성한다(교과서 II단원). CRISPR(Clustered Regularly Interspaced Short Palindromic Repeats)는 원래 세균의 면역 기억 시스템으로, 과거 침입한 바이러스의 DNA 조각을 자신의 유전체에 저장한다. Cas9은 RNA 안내를 받아 특정 DNA 서열을 인식·절단하는 단백질(뉴클레아제)이다.",
      application:
        "CRISPR-Cas9의 작동은 3단계로 요약된다. ① sgRNA 설계: 표적 DNA에 상보적인 20nt 가이드 RNA를 제작한다. PAM 서열(NGG)이 표적 부위 바로 뒤에 있어야 Cas9이 결합 가능하다. ② DNA 탐색 및 절단: Cas9-sgRNA 복합체가 게놈을 훑으며 PAM 서열을 인식한 후, sgRNA와 표적 DNA 간 20bp 상보 결합 시 Cas9의 HNH 도메인과 RuvC 도메인이 각각 한 가닥씩 절단해 DSB(이중나선 절단)를 일으킨다. ③ DNA 수선: 세포는 NHEJ(비상동말단결합, 삽입/결실 유도)나 HDR(상동재조합, 정밀 교정)으로 손상을 복구한다.",
      in_depth:
        "최신 연구는 1세대 CRISPR의 오프타겟(off-target) 절단 문제를 해결하기 위해 고정밀 변형체를 개발 중이다. eSpCas9와 HiFi Cas9는 RuvC 도메인의 비특이적 DNA 접촉을 줄여 오프타겟률을 100배 이상 감소시켰다. 더 나아가 Base Editor(CBE, ABE)는 DSB 없이 단일 염기(C→T, A→G)를 직접 변환하고, Prime Editor는 pegRNA를 이용해 12가지 점변이와 소규모 삽입/결실을 모두 구현한다. 2023년 FDA 승인을 받은 Casgevy(CTX001)는 BCL11A 인핸서를 편집해 태아 헤모글로빈 발현을 재활성화함으로써 겸상적혈구 빈혈증을 기능적으로 완치한 최초의 CRISPR 치료제다.",
      major_connection:
        "의예과·의과대학원에서는 CRISPR를 활용한 체세포 유전자 치료의 임상 프로토콜(전달 방법: 렌티바이러스, AAV, LNP)과 면역원성 문제를 연구한다. 생명공학과에서는 Cas9 단백질 엔지니어링(소형화: SaCas9, CjCas9)과 delivery 시스템 최적화를 다룬다. 본 탐구에서 이해한 PAM 인식 메커니즘과 DNA 수선 경로는 대학 유전공학 실험의 핵심 이론적 배경이 된다.",
    },
  },
  {
    id: "report-transformer-ai",
    trend_keyword: "생성형 AI & 트랜스포머",
    report_title: "트랜스포머 Self-Attention의 행렬 연산 원리와 GPT 언어 생성 메커니즘 탐구",
    subject: "정보",
    major_unit: "머신러닝과 딥러닝의 이해",
    publisher: "천재교육",
    target_majors: ["컴퓨터공학과", "인공지능학과", "데이터사이언스학과"],
    views: 2761,
    golden_template: {
      motivation:
        "ChatGPT와 같은 대형 언어 모델의 등장에 흥미를 느끼고, 천재교육 정보 교과서의 '신경망과 역전파' 단원에서 기초를 학습한 후 그 이면의 수학적 구조인 트랜스포머 아키텍처를 직접 분석하고자 탐구를 시작하였다.",
      basic_knowledge:
        "교과서에서 학습한 신경망은 입력층→은닉층→출력층으로 구성되며, 각 층은 가중치 행렬 W와 편향 b로 y = W·x + b 선형 변환을 수행한 후 활성화 함수를 적용한다. 경사하강법으로 손실 함수를 최소화하며 W를 갱신한다. RNN(순환 신경망)은 순차 데이터를 처리하지만 장거리 의존성 문제(기울기 소실)가 있었는데, 트랜스포머는 이를 Self-Attention으로 해결한다.",
      application:
        "Self-Attention의 핵심은 Q(Query)·K(Key)·V(Value) 행렬이다. 입력 토큰 행렬 X에 세 가지 학습 가능한 가중치 행렬 Wᴼ, Wᴷ, Wᵛ를 곱해 Q, K, V를 만든다. Attention 점수는 A = softmax(QKᵀ / √dₖ)V 로 계산되며, √dₖ로 나누는 이유는 내적값이 커질수록 softmax 기울기가 소실되는 문제를 방지하기 위해서다. Multi-Head Attention은 이 과정을 h개의 head로 병렬 수행하여 다양한 의미 관계를 동시에 포착한다.",
      in_depth:
        "GPT 시리즈는 Decoder-only 트랜스포머로, Causal Masking(미래 토큰을 -∞로 마스킹)을 적용해 자기회귀적(autoregressive) 텍스트 생성을 구현한다. GPT-3(175B 파라미터)에서 GPT-4(추정 1T+)로의 도약은 스케일링 법칙(Chinchilla law: 파라미터 수 N과 훈련 토큰 수 D는 최적으로 N∝D 비율을 맞춰야 함)에 의해 뒷받침된다. 최근 Mixture of Experts(MoE) 아키텍처는 활성화되는 파라미터만 선택적으로 연산해 효율을 극대화한다. Positional Encoding은 sin/cos 함수 기반 절대 위치 인코딩에서 RoPE(Rotary Position Embedding)로 발전해 더 긴 컨텍스트를 처리한다.",
      major_connection:
        "컴퓨터공학과 대학원의 자연어처리(NLP) 연구에서는 Attention 메커니즘의 효율화(Sparse Attention, Flash Attention)와 파인튜닝 기법(LoRA, RLHF)을 다룬다. 본 탐구에서 분석한 행렬 연산 구조와 softmax 기울기 문제는 'CS231n'·'딥러닝 이론' 강의의 핵심 선수 지식이다. AI 스타트업 취업 및 대학원 진학 모두에 직결되는 가장 중요한 현대 아키텍처 중 하나다.",
    },
  },
  {
    id: "report-nuclear-fusion",
    trend_keyword: "핵융합 에너지",
    report_title: "토카막 플라즈마의 자기 가둠 원리와 핵융합 에너지 실현 조건 탐구",
    subject: "물리학",
    major_unit: "전기와 자기",
    publisher: "비상교육",
    target_majors: ["물리학과", "핵공학과", "에너지공학과"],
    views: 987,
    golden_template: {
      motivation:
        "비상교육 물리학 교과서에서 전자기 유도와 플라즈마 상태를 학습하며, ITER 프로젝트 뉴스를 접한 것을 계기로 핵융합 발전소의 핵심 장치인 토카막의 원리를 탐구하게 되었다.",
      basic_knowledge:
        "교과서에서 학습한 자기력(F = qv × B)에 의해 대전 입자는 자기장 방향을 축으로 나선 운동(사이클로트론 운동)을 한다. 핵융합 반응의 가장 유력한 연료는 중수소(D)와 삼중수소(T)이며, D + T → He-4 + n + 17.6 MeV 반응이다. 핵융합이 일어나려면 플라즈마 온도가 1억 °C 이상이어야 하며, 이는 어떤 용기도 직접 담을 수 없는 온도다.",
      application:
        "토카막은 도넛 모양(토로이달) 자기장 + 폴로이달 자기장의 합성으로 플라즈마를 자기병 속에 가둔다. 토로이달 코일이 만드는 자기장만으로는 플라즈마가 바깥으로 밀려나는 문제가 있어, 플라즈마 내부에 유도 전류를 흘려 폴로이달 자기장을 추가 생성한다. 로손 기준(Lawson Criterion)은 핵융합 점화 조건을 n·τ·T ≥ 약 10²¹ keV·s/m³으로 정의한다(n: 플라즈마 밀도, τ: 에너지 가둠 시간, T: 온도).",
      in_depth:
        "현재 ITER(국제 핵융합 실험로)는 Q≥10(투입 에너지의 10배 이상 출력)을 목표로 프랑스 카다라슈에서 건설 중이다. 가장 큰 기술적 도전은 ① 플라즈마 불안정성(kink instability, tearing mode) 제어와 ② 고에너지 중성자에 의한 텅스텐·베릴륨 제1벽 재료 열화 문제다. 최근 MIT의 SPARC 프로젝트는 고온 초전도체(REBCO) 코일로 20T 이상의 강한 자기장을 구현해 토카막 크기를 1/8로 줄이는 혁신을 시도 중이다. 2022년 NIF(미국 레이저 핵융합)에서 최초로 Q>1 달성이 레이저 핵융합의 가능성을 열었다.",
      major_connection:
        "핵공학과에서는 핵융합로 내 중성자 플럭스 시뮬레이션과 제1벽 재료의 방사화·손상을 연구한다. 전기전자공학과에서는 20T급 초전도 자석의 냉각 시스템과 퀀치 방지 회로를 다룬다. 물리학과에서는 플라즈마 불안정성의 MHD(자기유체역학) 해석을 전공한다. 본 탐구의 토카막 자기 가둠 원리는 세 전공 모두의 핵심 입문 지식이다.",
    },
  },
  {
    id: "report-mrna-vaccine",
    trend_keyword: "mRNA 백신",
    report_title: "mRNA 백신의 지질나노입자 전달 시스템과 면역 반응 유도 메커니즘 탐구",
    subject: "생명과학",
    major_unit: "세포와 물질대사",
    publisher: "천재교육",
    target_majors: ["의예과", "약학과", "생명공학과"],
    views: 1654,
    golden_template: {
      motivation:
        "코로나19 팬데믹을 겪으며 mRNA 백신이 전통 단백질 백신과 어떻게 다른지 의문이 생겼다. 천재교육 생명과학 교과서의 '세포 내 단백질 합성' 단원을 바탕으로, mRNA 백신의 전달 기술과 면역 반응 유도 원리를 분자생물학 수준에서 탐구하였다.",
      basic_knowledge:
        "교과서에서 배운 중심원리(Central Dogma)에 의하면 DNA → mRNA(전사) → 단백질(번역)의 순서로 유전 정보가 흐른다. 리보솜은 mRNA의 코돈을 읽어 아미노산을 연결하여 단백질을 합성한다. 세포 내로 외부 mRNA가 들어오면 세포 리보솜이 이를 번역해 단백질을 만들 수 있다.",
      application:
        "mRNA 백신의 핵심 과제는 mRNA를 세포 내부까지 안전하게 전달하는 것이다. 맬벌 mRNA는 세포 밖에서 분해되기 쉽고, 면역계를 자극해 즉시 파괴될 수 있다. 이를 해결하는 지질나노입자(LNP)는 이온화 가능 지질·헬퍼 지질·콜레스테롤·PEG화 지질의 4성분으로 구성되며 직경 약 80-100nm다. LNP는 세포막과 융합하거나 엔도사이토시스로 내부화된 후 엔도솜 탈출을 통해 mRNA를 세포질로 방출한다. 세포 리보솜이 mRNA를 번역해 스파이크 단백질(항원)을 만들면, 면역계가 이를 외래 단백질로 인식하고 항체와 T세포 면역을 형성한다.",
      in_depth:
        "Moderna와 BioNTech의 mRNA는 천연 우리딘(uridine) 대신 N1-메틸슈도우리딘(m1Ψ)을 사용해 innate immune sensor(TLR7/8, RIG-I)에 의한 선천 면역 회피와 번역 효율 향상을 동시에 달성했다. 이 발견이 카탈린 카리코와 드루 와이스만의 2023년 노벨 생리의학상 수상 핵심이다. 최신 연구 방향은 ① 자가 증폭 mRNA(saRNA): 알파바이러스 복제효소 서열을 포함해 적은 양으로 더 많은 항원 생산, ② 원형 RNA(circRNA): 분해 저항성 증가, ③ LNP 장기 조직 특이적 전달(간·림프절·폐 표적화)이다.",
      major_connection:
        "약학과에서는 LNP의 제형 최적화(지질 조성비, 크기 분포, 인캡슐레이션 효율)와 규제 과학(CMC 허가 전략)을 연구한다. 의대에서는 mRNA 백신의 임상 면역 반응(IgG 역가, 중화 항체, CD8 T세포 반응)과 부스터 전략을 다룬다. 생명공학과에서는 mRNA 합성(IVT 공정)과 대규모 LNP 제조 공정(마이크로플루이딕스) 기술을 전공한다.",
    },
  },
  {
    id: "report-quantum-computing",
    trend_keyword: "양자컴퓨팅",
    report_title: "양자 중첩과 얽힘 원리를 이용한 양자 게이트 연산과 쇼어 알고리즘 탐구",
    subject: "물리학",
    major_unit: "현대 물리",
    publisher: "지학사",
    target_majors: ["물리학과", "컴퓨터공학과", "수학과"],
    views: 1203,
    golden_template: {
      motivation:
        "지학사 물리학 교과서의 '현대 물리' 단원에서 양자역학의 파동-입자 이중성과 불확정성 원리를 학습한 후, IBM과 구글이 발표한 양자 컴퓨터의 '양자 우월성' 주장에 관심을 가지고 그 수학적 원리를 탐구하였다.",
      basic_knowledge:
        "교과서에서 학습한 양자역학의 핵심: 전자는 측정 전까지 여러 상태의 중첩(superposition)으로 존재하며, 관측 시 하나의 고유값으로 붕괴된다(파동함수 붕괴). 고전 비트가 0 또는 1인 것과 달리, 큐비트(qubit)는 |ψ⟩ = α|0⟩ + β|1⟩ (|α|²+|β|²=1)로 두 상태를 동시에 취할 수 있다.",
      application:
        "양자 게이트는 큐비트 상태에 가해지는 유니터리 변환으로, 고전 논리 게이트에 대응한다. 하다마르(H) 게이트는 |0⟩ → (|0⟩+|1⟩)/√2로 균등 중첩을 만들고, CNOT 게이트는 두 큐비트를 얽힘(entanglement) 상태로 만든다. 얽힘은 두 큐비트가 아무리 멀리 떨어져도 한쪽 측정이 다른 쪽에 즉시 영향을 주는 비국소적 상관관계다(EPR 역설). 양자 병렬성: n개의 큐비트는 동시에 2ⁿ개의 상태를 표현하므로, 일부 문제에서 지수적 속도 향상이 가능하다.",
      in_depth:
        "쇼어 알고리즘(1994)은 RSA 암호의 기반인 대수 소인수분해를 O((log N)³)에 해결한다(고전 컴퓨터: 지수 시간). 핵심은 양자 푸리에 변환(QFT)을 이용해 f(x) = aˣ mod N의 주기를 찾는 것이다. 현재 IBM Heron(133 큐비트)과 Google Willow(105 큐비트) 프로세서는 오류율이 0.1~0.5% 수준으로, 쇼어 알고리즘을 실용적으로 실행하려면 수백만 개의 물리적 큐비트와 오류 정정 코드(Surface Code)가 필요해 아직 10-20년이 필요하다. 위상 큐비트(토폴로지컬 큐비트)를 연구하는 MS는 근본적으로 오류에 면역인 큐비트를 목표로 한다.",
      major_connection:
        "물리학과에서는 초전도 큐비트(조지프슨 접합 기반)와 트랩이온 큐비트의 디코히런스 시간 연장 연구를 진행한다. 컴퓨터공학과에서는 양자 오류 정정 코드(Shor code, Steane code, Surface code)와 양자 알고리즘 설계를 다룬다. 수학과에서는 양자 푸리에 변환의 군론적 기반과 격자 기반 양자 내성 암호(NIST PQC 표준)를 연구한다.",
    },
  },
  {
    id: "report-hydrogen-economy",
    trend_keyword: "탄소중립 & 수소에너지",
    report_title: "물 전기분해(수전해)의 전기화학적 원리와 그린수소 생산 효율 탐구",
    subject: "화학",
    major_unit: "화학 반응과 에너지",
    publisher: "미래엔",
    target_majors: ["화학공학과", "에너지공학과", "환경공학과"],
    views: 876,
    golden_template: {
      motivation:
        "미래엔 화학 교과서에서 전기분해 단원을 학습하며, 탄소중립 달성을 위한 그린수소 생산 기술의 핵심인 수전해 원리를 더 깊이 이해하고자 탐구를 시작하였다.",
      basic_knowledge:
        "전기분해는 전기 에너지를 이용해 자발적이지 않은 산화 환원 반응을 일으키는 과정이다. 물의 전기분해에서 음극(-): 2H₂O + 2e⁻ → H₂ + 2OH⁻, 양극(+): 2H₂O → O₂ + 4H⁺ + 4e⁻ 반응이 일어나며, 표준 분해 전압은 1.23V다. 교과서에서 배운 패러데이 법칙에 따르면 석출 물질의 양은 통과한 전하량에 비례한다.",
      application:
        "그린수소는 재생에너지(태양광·풍력)로 생산한 전기로 물을 전기분해하여 얻는다. 주요 수전해 기술은 세 가지: ① 알칼리 수전해(AEL): KOH 전해질, 저가 Ni 전극, 성숙 기술이나 동적 부하 응답 느림. ② PEM 수전해: 고분자 전해질막(Nafion), 귀금속 촉매(Ir, Pt) 필요, 고효율·고전류밀도 가능. ③ SOEC(고온 수증기 전기분해): 700-900°C 운전, 전기효율 최고(>90%) 하지만 내구성 문제. 현재 상용 PEM 수전해의 실제 효율은 약 65-70%(에너지 기준)다.",
      in_depth:
        "PEM 수전해 성능의 핵심 병목은 양극 산소 발생 반응(OER)의 과전압이다. Ir 기반 촉매(IrO₂)는 산성 환경에서 유일하게 안정하지만 매장량이 희소하고 고가다. 최근 싱글아톰 촉매(SAC: 개별 Ir 원자를 TiO₂ 지지체에 분산)는 Ir 사용량을 90% 줄이면서도 동등한 활성을 달성했다(Nature Catalysis, 2023). OER 메커니즘은 전통적 AEM(Adsorbate Evolution Mechanism) 외에 LOM(Lattice Oxygen Mechanism)도 작동하며, 격자 산소의 직접 참여는 금속-산소 결합 에너지를 낮춰 과전압을 감소시킨다.",
      major_connection:
        "화학공학과에서는 수전해 스택 설계(셀 면적, 전류 분포)와 수전해-연료전지 통합 시스템(Power-to-X)의 공정 최적화를 연구한다. 에너지공학과에서는 재생에너지와 수전해 설비의 통합 운영(LCOH 최소화)과 수소 저장·운반(액화, 암모니아 컨버전) 기술을 다룬다. 환경공학과에서는 탄소배출 전 주기(LCA) 분석으로 그린수소의 진정한 환경편익을 평가한다.",
    },
  },
  {
    id: "report-semiconductor-nano",
    trend_keyword: "반도체 나노공정",
    report_title: "EUV 리소그래피와 FinFET 구조의 물리적 원리로 이해하는 반도체 미세화 한계",
    subject: "물리학",
    major_unit: "전기와 자기",
    publisher: "천재교육",
    target_majors: ["전기전자공학과", "물리학과", "재료공학과"],
    views: 1432,
    golden_template: {
      motivation:
        "삼성전자와 SK하이닉스의 HBM·파운드리 뉴스를 접하며 반도체 공정의 핵심인 리소그래피 기술에 관심을 가졌다. 천재교육 물리학 교과서의 '전자기파의 스펙트럼' 단원을 기반으로, EUV 광원의 물리적 원리와 트랜지스터 미세화 한계를 탐구하였다.",
      basic_knowledge:
        "빛의 회절 한계에 의해 리소그래피(빛으로 회로를 새기는 기술)의 최소 해상도는 레일리 기준 R = k₁·λ/NA로 결정된다(λ: 파장, NA: 개구수). 교과서에서 배운 전자기파 스펙트럼에서 파장이 짧을수록 더 미세한 패턴을 구현 가능하다. 기존 ArF 레이저(193nm)에서 EUV(극자외선, 13.5nm)로 전환함으로써 파장이 약 14배 짧아졌다.",
      application:
        "EUV(Extreme Ultraviolet) 광원은 주석(Sn) 플라즈마를 CO₂ 레이저로 가열해 13.5nm 광자를 발생시킨다. EUV는 공기에 강하게 흡수되므로 전체 광학계가 초고진공(10⁻⁶ Pa) 챔버 안에 있어야 한다. 반사경(Mo/Si 다층막 거울, 반사율 약 67%)을 사용하며, 마스크도 반사형이다. ASML의 EUV 장비 1대 가격은 약 3,500억 원이며 전 세계 유일 공급사다. 게이트 길이 3nm 이하에서는 FinFET 대신 GAA(Gate-All-Around) 구조(삼성 SF3)를 채택해 단채널 효과와 누설 전류를 억제한다.",
      in_depth:
        "물리적 한계: 실리콘 원자 간격(0.235nm) 수준에 접근하면서 ① 터널링 전류 증가(게이트 산화막 두께 < 1nm), ② 불순물 요동(도핑 원자 수가 수십 개 이하로 감소), ③ 열발산 한계(전력 밀도 > 100W/cm²)가 발생한다. 차세대 해법으로 ① 2D 반도체(MoS₂, WSe₂): 원자 1~2층 두께로 누설 전류 근본 차단, ② Buried Power Rail: 전원선을 기판 아래에 매립해 소자 면적 축소, ③ 3D 이종 집적(CoWoS, HBM): 메모리-로직 수직 적층으로 대역폭 획기적 증가가 연구 중이다.",
      major_connection:
        "전기전자공학과에서는 소자 물리(MOSFET I-V 특성, 단채널 효과)와 회로 설계(SPICE 시뮬레이션)를 연구한다. 물리학과에서는 박막 반도체의 양자 전도와 2D 물질의 전자 구조(DFT 계산)를 다룬다. 재료공학과에서는 ALD(원자층 증착)로 게이트 유전체(HfO₂)를 제어하고 저항 메모리(RRAM)용 신소재를 개발한다.",
    },
  },
  {
    id: "report-organoid",
    trend_keyword: "오가노이드",
    report_title: "줄기세포 유래 뇌 오가노이드의 자기조직화 원리와 뇌 질환 모델링 탐구",
    subject: "생명과학",
    major_unit: "세포와 물질대사",
    publisher: "비상교육",
    target_majors: ["의예과", "생명공학과", "뇌과학과"],
    views: 743,
    golden_template: {
      motivation:
        "비상교육 생명과학 교과서에서 줄기세포와 세포 분화 단원을 학습하던 중, 실험실에서 뇌 세포를 3D로 배양하는 오가노이드 기술이 알츠하이머·자폐증 연구에 혁신을 일으키고 있다는 논문을 접하고 탐구를 시작하였다.",
      basic_knowledge:
        "줄기세포는 분화 전능성(totipotency)·만능성(pluripotency)에 따라 분류된다. iPSC(유도만능줄기세포)는 체세포에 Yamanaka 인자(Oct4, Sox2, Klf4, c-Myc)를 도입해 배아줄기세포와 유사한 상태로 역분화시킨 것으로, 2006년 야마나카 신야의 노벨상 수상 연구다. 세포 분화는 전사인자 네트워크와 epigenetic 변형(히스톤 변형, DNA 메틸화)에 의해 제어된다.",
      application:
        "뇌 오가노이드는 iPSC를 3D 매트리겔 기질 위에서 배양하며, Wnt 신호 억제(SB-431542)와 FGF 신호 차단(Dorsomorphin)으로 신경외배엽으로 분화를 유도한다. 자기조직화(self-organization)에 의해 세포들이 스스로 피질 조직(ventricular zone, cortical plate)을 형성한다. 약 2개월 배양 후 직경 2-4mm의 세뇌(cerebral organoid)가 형성되며, 층판구조(cortical layering)와 신경 회로망이 나타난다.",
      in_depth:
        "뇌 오가노이드의 최대 한계는 혈관 네트워크의 부재로 인한 내부 산소·영양 공급 제한이다(직경 > 1mm에서 괴사 발생). 이를 해결하기 위해 ① 마이크로플루이딕 칩 상의 오가노이드(Organ-on-a-Chip): 지속적 관류로 대사 노폐물 제거, ② 안지오이드(angioid): 내피세포와 공배양해 혈관 네트워크 형성, ③ 두개내 이식: 마우스 뇌에 이식해 숙주 혈관과 연결이 연구 중이다. SARS-CoV-2의 신경계 감염 메커니즘 연구에 뇌 오가노이드가 결정적 역할을 했다.",
      major_connection:
        "의예과에서는 오가노이드를 이용한 환자 맞춤형 약물 스크리닝(precision medicine)과 임상 전 독성 평가를 연구한다. 생명공학과에서는 바이오리액터 기반 오가노이드 대량 생산 공정과 CRISPR를 이용한 질환 오가노이드 모델 구축을 다룬다. 뇌과학과에서는 오가노이드 전기생리학(MEA 측정)을 통해 시냅스 형성과 신경 회로 발달을 연구한다.",
    },
  },
  {
    id: "report-carnot-engine",
    trend_keyword: "열효율 & 엔트로피",
    report_title: "열역학 제2법칙과 카르노 기관의 효율 한계를 통해 본 에너지 전환의 근본 원리",
    subject: "물리학",
    major_unit: "역학과 에너지",
    publisher: "지학사",
    target_majors: ["기계공학과", "화학공학과", "에너지공학과"],
    views: 654,
    golden_template: {
      motivation:
        "지학사 물리학 교과서에서 열기관과 열효율을 학습하면서, 왜 에너지는 항상 완전히 일로 변환될 수 없는지 의문이 생겼다. 엔트로피 개념과 카르노 기관의 이론적 효율 한계를 통해 에너지 전환의 근본적 한계를 탐구하였다.",
      basic_knowledge:
        "열역학 제1법칙(에너지 보존)에 의해 열기관이 흡수한 열(Q_H)은 한 일(W)과 방출한 열(Q_C)의 합이다. 열효율 e = W/Q_H = 1 - Q_C/Q_H. 열역학 제2법칙은 '열은 저절로 저온에서 고온으로 이동하지 않는다'(클라우지우스 표현) 또는 '열을 100% 일로 변환하는 제2종 영구기관은 불가능하다'(켈빈-플랑크 표현).",
      application:
        "카르노 기관은 등온 팽창→단열 팽창→등온 압축→단열 압축의 4단계 가역 사이클로 구성된다. 카르노 효율 e_Carnot = 1 - T_C/T_H (온도는 절대온도 K). 이것이 두 열원 온도 사이에서 작동하는 열기관의 이론적 최대 효율이다. 실제 내연기관(가솔린): 35-40%, 증기 터빈: 40-45%로 카르노 효율보다 훨씬 낮다. 그 차이는 마찰, 열 손실, 불완전 연소 등 비가역 과정에서 비롯된다.",
      in_depth:
        "엔트로피(S)는 계의 무질서도를 나타내는 상태 함수로, 가역 과정에서 dS = δQ_rev/T. 우주의 엔트로피는 항상 증가하거나 유지된다(제2법칙의 수학적 표현). 볼츠만의 통계역학적 해석: S = k_B·ln(W), W는 미시 상태의 수. 에너지의 질(exergy): 최대 유효 일로 변환될 수 있는 에너지의 양. 엑서지 해석은 에너지 시스템의 비가역 손실을 정량화하는 공학 도구다. 최근 열전(thermoelectric) 소자는 ΔT를 직접 전기로 변환하며, ZT(성능지수) > 2.5 달성을 목표로 나노구조 재료 연구가 진행 중이다.",
      major_connection:
        "기계공학과에서는 가스 터빈·랭킨 사이클·냉동 사이클의 열역학 해석과 엑서지 최소화 설계를 다룬다. 화학공학과에서는 반응기 열 통합(pinch 분석)으로 공정 에너지 효율을 최대화한다. 에너지공학과에서는 열전 발전, ORC(유기 랭킨 사이클), 에너지 저장 시스템의 열역학 최적화를 연구한다.",
    },
  },
  {
    id: "report-deep-reinforcement-learning",
    trend_keyword: "강화학습 & 자율주행",
    report_title: "마르코프 결정 과정(MDP)과 Q-러닝 원리로 이해하는 강화학습 기반 자율주행 의사결정",
    subject: "수학",
    major_unit: "수열의 극한과 미분·적분",
    publisher: "금성출판사",
    target_majors: ["컴퓨터공학과", "수학과", "전기전자공학과"],
    views: 1089,
    golden_template: {
      motivation:
        "테슬라 FSD(완전 자율주행)와 알파고 제로의 원리에 관심을 가지던 중, 금성출판사 수학 교과서의 '수열과 극한' 단원에서 배운 수렴 개념이 강화학습의 Q-값 수렴과 직결됨을 발견하고 강화학습의 수학적 원리를 탐구하였다.",
      basic_knowledge:
        "교과서의 수열 극한: a_n의 n→∞ 수렴 조건과 기하급수의 합(|r|<1일 때 수렴)은 Q-러닝에서 할인된 미래 보상의 합이 수렴하는 근거가 된다. 확률에서 배운 조건부 확률 P(A|B)는 환경의 상태 전이 확률 P(s'|s,a)의 기반이다.",
      application:
        "강화학습의 수학적 뼈대는 마르코프 결정 과정(MDP): (S, A, P, R, γ)으로 정의된다. 에이전트는 상태 s에서 행동 a를 선택하면 보상 r을 받고 새 상태 s'로 전이된다. 가치 함수 V(s) = E[Σ γᵗrₜ | s₀=s]는 상태 s에서 최적 정책을 따를 때 얻을 기대 누적 보상이다. Q-러닝은 상태-행동 쌍의 가치 Q(s,a)를 Q(s,a) ← Q(s,a) + α[r + γ·max_a' Q(s',a') - Q(s,a)] 업데이트 식으로 학습한다.",
      in_depth:
        "DQN(Deep Q-Network, DeepMind 2015)은 Q 테이블 대신 딥러닝 신경망으로 Q(s,a)를 근사하며, Experience Replay(과거 경험 재활용)와 Target Network(학습 안정화) 기법으로 발산 문제를 해결했다. AlphaGo Zero는 가치망과 정책망을 결합한 Actor-Critic 구조와 MCTS(몬테카를로 트리 탐색)를 사용해 인간 지식 없이 자기대국만으로 바둑 세계 1위를 달성했다. 자율주행에서는 보상 설계(reward shaping)가 핵심 과제로, 안전 제약을 위반하지 않도록 constrained MDP와 inverse RL(역강화학습)이 연구된다.",
      major_connection:
        "컴퓨터공학과에서는 DRL(심층 강화학습) 알고리즘 구현과 시뮬레이터(CARLA, Isaac Gym) 기반 자율주행 에이전트 훈련을 연구한다. 수학과에서는 MDP의 수렴 증명(contraction mapping theorem)과 부분 관측 MDP(POMDP)의 확률 이론적 분석을 다룬다. 전기전자공학과에서는 온칩 AI 가속기(NPU) 설계로 강화학습 추론을 실시간으로 수행하는 하드웨어를 연구한다.",
    },
  },
  {
    id: "report-carbon-nanotube",
    trend_keyword: "탄소 나노 신소재",
    report_title: "탄소나노튜브의 카이랄성에 따른 전기적 특성 변화와 나노전자소자 응용 탐구",
    subject: "화학",
    major_unit: "화학 결합과 물질의 성질",
    publisher: "금성출판사",
    target_majors: ["신소재공학과", "화학과", "전기전자공학과"],
    views: 521,
    golden_template: {
      motivation:
        "금성출판사 화학 교과서에서 탄소의 동소체(다이아몬드, 흑연, 풀러렌)를 학습하면서 sp² 혼성 탄소 원자의 결합 방식에 따라 물질 특성이 극적으로 달라지는 데 흥미를 느꼈다. 탄소나노튜브의 구조와 전기적 특성을 양자역학적으로 탐구하였다.",
      basic_knowledge:
        "교과서에서 학습한 탄소의 sp² 혼성: 평면 삼각형 구조로 120° 결합각, σ결합 3개와 비혼성화 p오비탈 1개 형성. 흑연은 sp² 탄소의 층상 구조로 층 내 비편재화 π전자가 전기 전도성을 부여한다. 탄소나노튜브(CNT)는 흑연 시트(그래핀)를 원통형으로 말아 붙인 구조로 직경 0.5-2nm, 길이 수십 μm에 이른다.",
      application:
        "CNT의 전기적 특성은 카이랄 벡터 (n,m)에 의해 결정된다. 카이랄 벡터는 그래핀 격자를 말아 붙이는 방향을 지정한다. n=m이면 armchair CNT(금속성), n-m = 3의 배수이면 반금속, 그 외는 반도체성 CNT다. 반도체성 CNT의 밴드갭 Eg ≈ 0.9eV/d_nm(직경에 반비례)이다. 금속성 CNT는 구리보다 1000배 높은 전류 밀도(10⁹ A/cm²)를 견딘다.",
      in_depth:
        "CNT 기반 전계효과 트랜지스터(CNFET)는 실리콘 MOSFET과 비교해 ① 원자 수준의 채널 두께로 단채널 효과 억제, ② 탄도 전송(ballistic transport)으로 산란 없는 전자 흐름, ③ 높은 전자/정공 이동도(약 10,000 cm²/V·s)를 가진다. MIT가 2019년 Science에 발표한 16비트 CNT 프로세서 'RV16X-NANO'는 반도체성 CNT만 선택 증착하는 RINSE 공정과 오염성 금속성 CNT를 소각하는 MIXED 공정을 개발해 최초의 실용적 CNT 칩을 구현했다. 하지만 균일한 반도체성 CNT 대량 분리(순도 >99.9999%)가 여전히 상용화의 최대 장벽이다.",
      major_connection:
        "신소재공학과에서는 CNT 합성(CVD, arc-discharge)과 표면 기능화를 통한 복합재료(탄소섬유+CNT) 강도 향상을 연구한다. 화학과에서는 CNT의 π-π 스태킹 상호작용을 이용한 약물 전달체와 바이오센서 설계를 다룬다. 전기전자공학과에서는 CNT 잉크 기반 플렉서블 전자소자와 CNT 인터커넥트 기술을 연구한다.",
    },
  },
];

// ─── 시딩 실행 ───────────────────────────────────────────────────────────────

async function seedCollection<T extends { id: string }>(
  colName: string,
  data: T[],
  label: string
) {
  const isEmpty = await isCollectionEmpty(colName);
  if (!isEmpty) {
    log("⏭", `${label} 컬렉션에 데이터가 이미 존재합니다. 건너뜁니다.`);
    return;
  }

  // Firestore writeBatch는 최대 500개 까지 허용
  const BATCH_SIZE = 400;
  let written = 0;

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const chunk = data.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    for (const item of chunk) {
      const { id, ...fields } = item;
      batch.set(doc(collection(db, colName), id), fields);
    }
    await batch.commit();
    written += chunk.length;
  }

  log("✅", `${label}: ${written}개 문서 저장 완료`);
}

async function main() {
  console.log("\n🚀  Firestore 시딩 시작...\n");

  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error("❌  .env.local 환경변수가 로드되지 않았습니다. --env-file 옵션을 확인하세요.");
    process.exit(1);
  }

  log("🔗", `프로젝트: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
  console.log();

  await seedCollection("curriculum", curriculumData, "curriculum (교육과정 트리)");
  await seedCollection("skill_trees", skillTreeData, "skill_trees (전공 스킬트리)");
  await seedCollection("reports_db", reportData, "reports_db (세특 보고서)");

  console.log("\n🎉  시딩 완료!\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌  시딩 실패:", err);
  process.exit(1);
});
