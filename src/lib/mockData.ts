// 더미 데이터 - Firebase 연결 전 UI 개발용

export const trendingReports = [
  {
    id: "1",
    trend_keyword: "전고체 배터리",
    report_title: "리튬이온 배터리의 한계와 전고체 배터리의 전기화학적 원리 탐구",
    subject: "화학",
    target_majors: ["화학공학과", "신소재공학과", "에너지공학과"],
    views: 1842,
    emoji: "🔋",
  },
  {
    id: "2",
    trend_keyword: "CRISPR-Cas9",
    report_title: "크리스퍼 유전자 가위의 작동 원리와 희귀 유전 질환 치료 가능성 탐구",
    subject: "생명과학",
    target_majors: ["의예과", "생명공학과", "약학과"],
    views: 2105,
    emoji: "🧬",
  },
  {
    id: "3",
    trend_keyword: "생성형 AI & 트랜스포머",
    report_title: "트랜스포머 어텐션 메커니즘의 수학적 원리와 GPT 구조 분석",
    subject: "수학 / 정보",
    target_majors: ["컴퓨터공학과", "인공지능학과", "데이터사이언스학과"],
    views: 2761,
    emoji: "🤖",
  },
];

export const majorSkillTrees: Record<string, MajorSkillTree> = {
  기계공학과: {
    major_name: "기계공학과",
    description: "기계 설계·제어·열유체·재료를 다루는 공학의 근간",
    core_required: ["수학Ⅰ", "수학Ⅱ", "물리학Ⅰ", "물리학Ⅱ", "미적분"],
    advanced_required: ["기하", "확률과 통계"],
    ai_recommended_combo: [
      {
        courses: ["역학과 에너지", "물질과 에너지", "로봇과 공학설계"],
        reason:
          "열역학·유체역학의 물리적 기초(역학과 에너지)와 신소재 이해(물질과 에너지), AI 기반 로봇 제어(로봇과 공학설계)의 시너지 조합. 자동차·항공·로봇 분야 진로에 최적.",
        highlight_major: ["자동차공학", "항공우주공학", "로봇공학"],
      },
    ],
    sample_reports: [
      {
        id: "r1",
        title: "열역학 제2법칙과 카르노 엔진 효율의 현실적 한계 탐구",
        subject: "역학과 에너지",
        keyword: "열효율 / 엔트로피",
      },
      {
        id: "r2",
        title: "탄소섬유 복합재료(CFRP)의 인장강도와 항공기 경량화 전략",
        subject: "물질과 에너지",
        keyword: "신소재 / 항공",
      },
    ],
  },
  의예과: {
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
    sample_reports: [
      {
        id: "r3",
        title: "ATP 합성효소의 화학삼투 원리와 미토콘드리아 질환의 연관성",
        subject: "세포와 물질대사",
        keyword: "세포호흡 / 미토콘드리아",
      },
      {
        id: "r4",
        title: "아스피린의 COX 억제 메커니즘과 항염증 효과의 분자생물학적 분석",
        subject: "화학반응의 세계",
        keyword: "약물 / 효소 억제",
      },
    ],
  },
  컴퓨터공학과: {
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
    sample_reports: [
      {
        id: "r5",
        title: "트랜스포머 Self-Attention의 행렬 연산 원리와 GPT 언어 생성 메커니즘",
        subject: "인공지능 수학",
        keyword: "딥러닝 / 어텐션",
      },
    ],
  },
};

export type MajorSkillTree = {
  major_name: string;
  description: string;
  core_required: string[];
  advanced_required: string[];
  ai_recommended_combo: {
    courses: string[];
    reason: string;
    highlight_major: string[];
  }[];
  sample_reports: {
    id: string;
    title: string;
    subject: string;
    keyword: string;
  }[];
};

export const generatePageFilters = {
  subjects: ["화학", "물리학", "생명과학", "지구과학", "수학", "정보"],
  units: {
    화학: ["화학 반응과 에너지", "화학 결합과 물질의 성질", "산화 환원 반응", "산과 염기"],
    물리학: ["역학과 에너지", "전기와 자기", "파동과 빛", "현대 물리"],
    생명과학: ["세포와 물질대사", "유전과 진화", "항상성과 몸의 조절", "생태계와 환경"],
    지구과학: ["지구 내부와 판 구조론", "대기와 해양", "우주의 기원과 별의 진화"],
    수학: ["수열과 극한", "미적분", "확률과 통계", "행렬과 벡터"],
    정보: ["알고리즘과 자료구조", "인공지능과 머신러닝", "데이터베이스"],
  } as Record<string, string[]>,
  publishers: ["천재교육", "미래엔", "비상교육", "금성출판사", "교학사", "지학사"],
  trendKeywords: [
    "전고체 배터리",
    "CRISPR 유전자 편집",
    "양자컴퓨팅",
    "탄소중립 & 수소에너지",
    "mRNA 백신",
    "반도체 나노공정",
    "생성형 AI",
    "핵융합 에너지",
  ],
};

export const sampleReport = {
  report_title: "리튬이온 배터리의 한계와 전고체 배터리의 전기화학적 원리 탐구",
  subject: "화학",
  unit: "화학 반응과 에너지",
  publisher: "천재교육",
  trend_keyword: "전고체 배터리",
  target_majors: ["화학공학과", "신소재공학과", "에너지공학과"],
  golden_template: {
    motivation:
      "스마트폰 배터리 폭발 뉴스를 접하며 현재 리튬이온 배터리의 안전성 문제에 관심을 가지게 되었다. 교과서의 '산화 환원 반응' 단원에서 전지의 작동 원리를 학습한 후, 차세대 배터리로 주목받는 전고체 배터리의 전기화학적 원리를 탐구하고자 하였다.",
    basic_knowledge:
      "천재교육 화학 교과서 4단원 '산화 환원 반응'에 따르면, 전지는 산화 반응이 일어나는 음극(anode)과 환원 반응이 일어나는 양극(cathode)으로 구성된다. 리튬이온 배터리에서는 충전 시 양극의 리튬이온이 음극(흑연)으로 이동하고, 방전 시 역방향으로 이동하며 전류를 생성한다. 전해질은 이온 전도체 역할을 하며, 현재 상용 배터리는 유기용매 기반 액체 전해질을 사용한다.",
    application:
      "액체 전해질의 핵심 문제는 세 가지다. ① 과충전·과열 시 열폭주(thermal runaway) 위험성, ② 리튬 덴드라이트(dendrite) 성장으로 인한 단락 위험, ③ 전압 범위 제한(약 4.2V). 전고체 배터리는 이를 고체 전해질(황화물계, 산화물계, 폴리머계)로 대체한다. 황화물계(Li₆PS₅Cl)는 이온 전도도가 액체와 유사하나 공기 중 H₂S 발생 문제가 있고, 산화물계(LLZO)는 안정적이나 계면 저항이 높다.",
    in_depth: "LOCKED",
    major_connection: "LOCKED",
  },
};
