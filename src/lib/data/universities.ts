// ─────────────────────────────────────────────────────────────────────────────
// 대학·전공별 맞춤 선택 과목 추천 데이터
// 나중에 수천 개 학과 데이터를 추가할 때 이 파일에 universityData 배열을 확장하세요.
// ─────────────────────────────────────────────────────────────────────────────

export interface MajorData {
  /** 학과(전공) 전체 명칭 */
  name: string;
  /** 데이터 출처 (학교 공식 가이드명) */
  source: string;
  /** 해당 대학의 평가 스타일 유형 라벨 */
  evaluationStyle: string;
  /** 평가 방식 구체 안내 문구 (사용자에게 Alert로 노출) */
  evaluationNotice: string;
  /** 핵심 권장 과목 — 반드시 이수해야 할 과목 */
  coreSubjects: string[];
  /** 권장 과목 — 이수 시 가산점 또는 우대되는 과목 */
  recommendedSubjects: string[];
  /** 핵심 키워드 — 세특큐레이터 독자 분석 (옵셔널) */
  keywords?: string[];
  /** 추천 도서 (옵셔널) */
  books?: string[];
  /** 심화 탐구 주제 (옵셔널) */
  deepTopics?: string[];
}

export interface UniversityData {
  /** 대학명 */
  university: string;
  /** 해당 대학에 속한 학과 목록 */
  majors: MajorData[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Seed 데이터 — 3가지 대표 평가 스타일을 커버하는 초기 데이터셋
// ─────────────────────────────────────────────────────────────────────────────

export const universityData: UniversityData[] = [
  // ── 서울대학교 ─────────────────────────────────────────────────────────────
  {
    university: "서울대학교",
majors: [
      // --- 자연과학대학 (7개 전공) ---
      {
        name: "자연과학대학 수리과학부 수리과학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "핵심 수학 과목 이수와 더불어, 과학 진로선택 과목 중 3과목 이상 이수를 필수 조건으로 확인합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "자연과학대학 통계학과 통계학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "핵심 과목 이수와 더불어, 과학 진로선택 과목 중 3과목 이상 이수를 필수 조건으로 확인합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["확률과 통계", "실용 통계", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "자연과학대학 물리·천문학부 물리학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "물리학 심화 역량이 필수적이며, 과학 진로선택 3과목 이상 이수 조건을 충족해야 합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["역학과 에너지", "전자기와 양자", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "자연과학대학 물리·천문학부 천문학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "우주 물리 현상 이해를 위해 물리 및 지구과학 심화 과목 이수를 권장합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["역학과 에너지", "행성우주과학", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "자연과학대학 화학부 화학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "화학 반응에 대한 심화 이해가 필수적이며, 진로선택 3과목 이상 이수 조건을 확인합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["물질과 에너지", "화학 반응의 세계", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "자연과학대학 생명과학부 생명과학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "생명 현상에 대한 심화 탐구 역량과 더불어 과학 진로선택 3과목 이상 이수를 요구합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["세포와 물질대사", "생물의 유전", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "자연과학대학 지구환경과학부 지구환경과학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "지구 시스템 전반에 대한 이해를 위해 관련 진로선택 과목 이수를 권장합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["지구시스템과학", "행성우주과학", "과학 진로선택 3과목 이상 필수"]
      },

      // --- 공과대학 (10개 전공) ---
      {
        name: "공과대학 건설환경공학부 건설환경공학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "역학적 기초와 환경적 소양을 동시에 평가하며, 과학 진로선택 3과목 이상이 필수입니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["역학과 에너지", "기후변화와 환경생태", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "공과대학 기계공학부 기계공학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "고전 역학 및 동역학의 기초가 되는 물리 심화 과목의 이수를 매우 중요하게 평가합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["역학과 에너지", "전자기와 양자", "물리학 관련 과목 포함 과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "공과대학 재료공학부 재료공학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "물리와 화학의 융합적 이해가 필수적이므로 두 분야의 진로선택 과목 이수를 권장합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["물질과 에너지", "전자기와 양자", "화학 반응의 세계", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "공과대학 전기·정보공학부 전기·정보공학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "전자기학 및 회로 이론의 기초가 되는 과목과 데이터 분석을 위한 통계 역량을 높게 평가합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["전자기와 양자", "역학과 에너지", "확률과 통계", "물리학 관련 과목 포함 과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "공과대학 컴퓨터공학부 컴퓨터공학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "컴퓨터 과학의 근간이 되는 수학적 사고력(특히 이산수학 및 통계)을 강하게 요구합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "공과대학 화학생물공학부 화학생물공학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "공정 설계와 바이오 기술의 융합을 다루므로 화학 및 생명과학 심화 이수가 유리합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["물질과 에너지", "화학 반응의 세계", "세포와 물질대사", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "공과대학 건축학과 건축학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "구조 역학의 기초가 되는 물리 과목 이수와 과학 진로선택 3과목 조건을 충족해야 합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["역학과 에너지", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "공과대학 산업공학과 산업공학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "시스템 최적화와 데이터 분석이 핵심이므로 수학적 통계 역량을 강력히 요구합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["확률과 통계", "실용 통계", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "공과대학 원자핵공학과 원자핵공학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "양자 및 방사선 공학의 기초를 위해 물리 진로선택 과목의 심도 있는 이수를 요구합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["전자기와 양자", "역학과 에너지", "물리학 관련 과목 포함 과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "공과대학 항공우주공학과 항공우주공학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "유체 및 비행 역학과 우주 환경 이해를 위해 물리 및 지구과학 심화 과목을 권장합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["역학과 에너지", "행성우주과학", "물리학 관련 과목 포함 과학 진로선택 3과목 이상 필수"]
      },

      // --- 농업생명과학대학 (5개 전공) ---
      {
        name: "농업생명과학대학 식물생산과학부 작물생명과학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "식물 유전 및 육종학 이해를 위해 생명과학 및 환경 관련 과목 이수가 유리합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["세포와 물질대사", "생물의 유전", "기후변화와 환경생태", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "농업생명과학대학 산림과학부 산림환경학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "산림 생태계 및 환경 보존을 다루므로 생명과학 및 융합선택 환경 과목을 권장합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["생물의 유전", "지구시스템과학", "기후변화와 환경생태", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "농업생명과학대학 응용생물화학부 응용생물학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "바이오 소재 및 생명 공학적 탐구를 위해 생명과학 진로선택 과목 이수가 필수적입니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["세포와 물질대사", "생물의 유전", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "농업생명과학대학 응용생물화학부 응용화학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "천연물 화학 및 환경 화학 기초를 위해 화학 진로선택 과목의 심화 학습을 권장합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["물질과 에너지", "화학 반응의 세계", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "농업생명과학대학 바이오시스템·소재학부 바이오시스템공학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "생물학과 기계/전자공학의 융합이므로 물리 및 생명과학 과목의 고른 이수가 유리합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["역학과 에너지", "세포와 물질대사", "과학 진로선택 3과목 이상 필수"]
      },

      // --- 첨단융합대학 (4개 전공) ---
      {
        name: "첨단융합대학 첨단융합학부 차세대지능형반도체전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "신설 첨단학과로, 반도체 물리 및 재료 화학에 대한 최상위권의 학업 역량을 요구합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["전자기와 양자", "물질과 에너지", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "첨단융합대학 첨단융합학부 지속가능기술전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "ESG 및 친환경 에너지 기술을 다루므로 융합적 관점의 과학 과목 이수가 유리합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["기후변화와 환경생태", "물질과 에너지", "지구시스템과학", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "첨단융합대학 첨단융합학부 혁신신약전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "신약 개발의 기초가 되는 유기화학 및 분자생물학적 기초 역량을 강하게 평가합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["화학 반응의 세계", "세포와 물질대사", "생물의 유전", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "첨단융합대학 첨단융합학부 디지털헬스케어전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "의료 데이터 분석 및 IT 융합 기술을 다루므로 통계와 생명과학의 결합을 중시합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학", "세포와 물질대사", "과학 진로선택 3과목 이상 필수"]
      },

      // --- 의과/약학/수의/간호 대학 (4개 전공) ---
      {
        name: "의과대학 의예과 의예전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 필수 포함 로직",
        evaluationNotice: "과학 진로선택 3과목 이상을 이수하되, '세포와 물질대사', '생물의 유전' 2과목을 무조건 포함해야 합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["생명과학(일반선택) 우선 이수 권장", "화학(일반선택)", "과학 진로선택 총 3과목 이상 필수"]
      },
      {
        name: "약학대학 약학계열 약학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 일반선택 우선 권장",
        evaluationNotice: "진로선택 3과목 이상 이수 조건 외에, 일반선택에서 화학 또는 생명과학을 우선 이수할 것을 명시합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["화학(일반) 및 생명과학(일반) 우선 이수", "물질과 에너지", "세포와 물질대사", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "수의과대학 수의예과 수의예전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "특정 과목 지정 + 조건부 개수형",
        evaluationNotice: "동물 질병 및 생명 현상 탐구를 위해 생명과학 진로선택 과목의 심화 이수가 필수적입니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["세포와 물질대사", "생물의 유전", "과학 진로선택 3과목 이상 필수"]
      },
      {
        name: "간호대학 간호학과 간호학전공",
        source: "서울대학교 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "수학 택1 지정형 + 조건부 개수형",
        evaluationNotice: "수학에서 기하 또는 미적분Ⅱ 중 1과목 이상을 필수 선택해야 하며, 과학 진로선택 3과목을 요구합니다.",
        coreSubjects: ["기하 또는 미적분Ⅱ 중 택1"],
        recommendedSubjects: ["세포와 물질대사", "생물의 유전", "확률과 통계", "과학 진로선택 3과목 이상 필수"]
      }
    ]
  },

// --- 연세대학교 ---
  {
    university: "연세대학교",
    majors: [
      // --- 이과대학 (6개 전공) ---
      {
        name: "이과대학 수학과 수학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "연세대는 수학 심화 과목의 이수와 더불어 해당 과목의 학업 성취도(원점수)를 매우 중요하게 평가합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학"]
      },
      {
        name: "이과대학 물리학과 물리학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "물리학 심화 탐구를 위해 수학적 도구(기하/미적분)와 물리 진로선택 과목 이수가 필수입니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "확률과 통계"]
      },
      {
        name: "이과대학 화학과 화학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "화학 반응에 대한 깊이 있는 탐구(세특) 역량과 성취도를 강하게 요구합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "물질과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "역학과 에너지"]
      },
      {
        name: "이과대학 지구시스템과학과 지구시스템과학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "지구와 환경 변화를 다루므로 지구과학 심화 과목과 역학적 기초 과목 이수가 유리합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "지구시스템과학", "행성우주과학"],
        recommendedSubjects: ["역학과 에너지", "기후변화와 환경생태(융합)"]
      },
      {
        name: "이과대학 천문우주학과 천문우주학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "천체 물리학 이해를 위해 물리 및 지구과학 진로선택 과목을 강력히 권장합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "행성우주과학"],
        recommendedSubjects: ["역학과 에너지", "지구시스템과학", "전자기와 양자"]
      },
      {
        name: "이과대학 대기과학과 대기과학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "유체 역학과 기상 데이터 분석을 위해 물리와 지구과학, 통계적 역량이 필요합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "지구시스템과학"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계", "기후변화와 환경생태(융합)"]
      },

      // --- 공과대학 (7개 전공) ---
      {
        name: "공과대학 화공생명공학부 화공생명공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "화학과 생명과학의 융합 공정이므로 물질의 구조와 반응 메커니즘에 대한 심도 있는 이해가 필수입니다.",
        coreSubjects: ["미적분Ⅱ", "물질과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "세포와 물질대사", "기하"]
      },
      {
        name: "공과대학 전기전자공학부 전기전자공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "전자기학에 대한 높은 이해도를 입증하기 위해 관련 진로선택 과목 이수와 실험 탐구 경험을 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계"]
      },
      {
        name: "공과대학 건축공학과 건축공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "구조 역학 계산을 위한 물리 진로선택 과목과 친환경 건축 트렌드를 보여줄 수 있는 과목을 권장합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "역학과 에너지"],
        recommendedSubjects: ["기후변화와 환경생태(융합)", "확률과 통계"]
      },
      {
        name: "공과대학 도시공학과 도시공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "도시 계획 및 인프라 데이터를 다루기 위한 통계적 역량과 공간/환경 이해도가 필요합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["지구시스템과학", "기후변화와 환경생태(융합)", "역학과 에너지"]
      },
      {
        name: "공과대학 기계공학부 기계공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "기계공학의 근간이 되는 역학과 에너지 관련 과목의 최상위권 성취도를 강하게 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "물질과 에너지"]
      },
      {
        name: "공과대학 신소재공학부 신소재공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "소재 물리와 화학에 대한 융합적 사고력이 당락을 좌우하므로 물리/화학 진로선택 과목이 핵심입니다.",
        coreSubjects: ["미적분Ⅱ", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["기하", "역학과 에너지", "화학 반응의 세계"]
      },
      {
        name: "공과대학 산업공학과 산업공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "시스템 최적화와 빅데이터 분석이 중심이 되므로 확률과 통계의 이수 여부가 매우 중요합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "실용 통계(융합)", "인공지능 수학(융합)"]
      },

      // --- 생명시스템대학 (3개 전공) ---
      {
        name: "생명시스템대학 시스템생물학과 시스템생물학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "빅데이터 기반 생명 현상 분석을 다루므로 생명과학 심화와 함께 수학적 논리력을 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["확률과 통계", "화학 반응의 세계"]
      },
      {
        name: "생명시스템대학 생화학과 생화학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "생체 물질의 화학적 반응을 다루므로 화학과 생명과학 진로선택 과목의 융합 이수가 필수입니다.",
        coreSubjects: ["미적분Ⅱ", "물질과 에너지", "세포와 물질대사"],
        recommendedSubjects: ["화학 반응의 세계", "생물의 유전", "기하"]
      },
      {
        name: "생명시스템대학 생명공학과 생명공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "생명과학 지식의 공학적 응용이므로 물리/화학/생명을 아우르는 탄탄한 과학 기초체력을 봅니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물질과 에너지", "역학과 에너지", "기하"]
      },

      // --- 인공지능융합대학 (2개 전공) ---
      {
        name: "인공지능융합대학 인공지능학과 인공지능전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "AI 알고리즘 설계의 뼈대가 되는 이산수학, 행렬, 통계적 역량을 입증할 과목 선택을 강력히 권장합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "기하"],
        recommendedSubjects: ["인공지능 수학(융합)", "정보 과학 관련 융합선택"]
      },
      {
        name: "인공지능융합대학 컴퓨터과학과 컴퓨터과학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "컴퓨터 구조와 소프트웨어적 사고력을 증명하기 위해 수학 교과 전반의 우수성을 꼼꼼히 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "인공지능 수학(융합)"]
      },

      // --- 독립학부 / 계약학과 (3개 전공) ---
      {
        name: "독립학부 시스템반도체공학과 시스템반도체공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (삼성전자 계약)",
        evaluationNotice: "최상위권 계약학과로, 물리학(전자기학)과 화학(물질)에 대한 최상위권의 성취도와 세특 일관성이 당락을 가릅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["물질과 에너지", "역학과 에너지", "확률과 통계"]
      },
      {
        name: "독립학부 디스플레이융합공학과 디스플레이융합공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (LG디스플레이 계약)",
        evaluationNotice: "빛과 물질의 성질을 다루는 디스플레이 특성상 전자기와 물질화학 이수 여부를 매우 중요하게 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "역학과 에너지"]
      },
      {
        name: "독립학부 지능형반도체전공 지능형반도체전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (신설 첨단)",
        evaluationNotice: "반도체 회로 및 AI 최적화를 위한 물리적/수학적 모델링 역량을 입증할 심화 과목 이수가 유리합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학(융합)", "물질과 에너지"]
      },

      // --- 의과/치과/약학/간호 대학 (4개 전공) ---
      {
        name: "의과대학 의예과 의예전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "단순 성적뿐만 아니라 의학 통계(확률과 통계) 및 생명/화학 현상의 깊이 있는 융합 탐구 역량을 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학 반응의 세계", "확률과 통계", "생명과학(일반) 우선 이수"]
      },
      {
        name: "치과대학 치의예과 치의예전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "수학 택1 지정형 (활동우수형 중시)",
        evaluationNotice: "치과 재료 및 생명 현상에 대한 이해를 위해 화학과 생명과학 진로선택 과목의 이수를 권장합니다. 수학은 기하 또는 미적분Ⅱ 중 1과목 이상 이수가 필요합니다.",
        coreSubjects: ["미적분Ⅱ 또는 기하 中 1과목", "세포와 물질대사"],
        recommendedSubjects: ["생물의 유전", "물질과 에너지", "화학 반응의 세계"]
      },
      {
        name: "약학대학 약학과 약학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (활동우수형 중시)",
        evaluationNotice: "약물의 화학적 메커니즘과 인체 작용(생명)의 융합적 이해가 절대적으로 필요합니다.",
        coreSubjects: ["미적분Ⅱ", "물질과 에너지", "세포와 물질대사"],
        recommendedSubjects: ["화학 반응의 세계", "생물의 유전", "확률과 통계"]
      },
      {
        name: "간호대학 간호학과 간호학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형",
        evaluationNotice: "인체 생명 현상에 대한 이해와 더불어, 보건 데이터 분석을 위한 통계적 기본기를 높게 평가합니다.",
        coreSubjects: ["미적분Ⅱ 또는 기하 택1"],
        recommendedSubjects: ["세포와 물질대사", "확률과 통계", "생명과학(일반)"]
      }
    ]
  },

  // --- 고려대학교 ---
  {
    university: "고려대학교",
    majors: [
      // --- 이과대학 (4개 전공) ---
      {
        name: "이과대학 수학과 수학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "고려대학교는 과목 선택의 도전성을 중시합니다. 수학 전문 교과나 고급 수학 등 심화 과목 이수 노력이 돋보이면 유리합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학(융합)"]
      },
      {
        name: "이과대학 물리학과 물리학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "물리학 심화 과목에 대한 과감한 도전과 수학적 도구(기하/미적분) 활용 능력을 중요하게 평가합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "확률과 통계"]
      },
      {
        name: "이과대학 화학과 화학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "물질의 구조와 반응에 대한 깊이 있는 탐구를 위해 화학 진로선택 과목을 필수적으로 이수해야 합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "물질과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "역학과 에너지"]
      },
      {
        name: "이과대학 지구환경과학과 지구환경과학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "기후 위기 및 환경 시스템 이해를 위해 지구과학 심화 과목과 융합선택 과목 이수를 권장합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "지구시스템과학", "행성우주과학"],
        recommendedSubjects: ["역학과 에너지", "기후변화와 환경생태(융합)"]
      },

      // --- 공과대학 (7개 전공) ---
      {
        name: "공과대학 화공생명공학과 화공생명공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "화학 반응 공정과 바이오 기술의 융합을 다루므로 화학, 생명과학 심화 과목의 고른 이수가 필요합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물질과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "세포와 물질대사", "위 과학 과목 中 2개 이상 이수 권장"]
      },
      {
        name: "공과대학 신소재공학부 신소재공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "첨단 소재 개발의 기초가 되는 물리(전자기학)와 화학(물질)에 대한 도전적 이수를 매우 높게 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계", "위 과학 과목 中 2개 이상 이수 권장"]
      },
      {
        name: "공과대학 건축사회환경공학부 건축사회환경공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "인프라 구축과 환경 시스템을 다루므로 역학 기초(물리)와 환경 생태(융합) 과목 이수를 권장합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "역학과 에너지"],
        recommendedSubjects: ["확률과 통계", "기후변화와 환경생태(융합)"]
      },
      {
        name: "공과대학 건축학과 건축학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "공간적 사고를 위한 기하와 구조 역학의 기초가 되는 물리 진로선택 과목을 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "역학과 에너지"],
        recommendedSubjects: ["기후변화와 환경생태(융합)"]
      },
      {
        name: "공과대학 기계공학부 기계공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "기계공학의 뼈대인 역학과 에너지 관련 심화 과목 이수를 필수적으로 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "물질과 에너지"]
      },
      {
        name: "공과대학 산업경영공학부 산업경영공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "데이터 분석과 시스템 최적화를 다루므로 확률과 통계, AI 수학 등 논리적 도구 과목 이수가 당락을 가릅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["실용 통계(융합)", "인공지능 수학(융합)"]
      },
      {
        name: "공과대학 전기전자공학부 전기전자공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "회로 설계 및 전자기학적 기초를 입증하기 위해 물리 심화 과목에 대한 적극적인 도전이 필요합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계"]
      },

      // --- 생명과학대학 (4개 전공) ---
      {
        name: "생명과학대학 생명과학부 생명과학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "순수 생명 현상 탐구를 위해 유전 및 물질대사 등 생명과학 진로선택 과목 이수가 필수입니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학 반응의 세계", "확률과 통계"]
      },
      {
        name: "생명과학대학 생명공학부 생명공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "생명과학의 공학적 응용이므로 물리, 화학, 생명을 아우르는 탄탄한 기초 과학 역량을 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물질과 에너지", "역학과 에너지", "기하"]
      },
      {
        name: "생명과학대학 식품공학과 식품공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "식품 소재의 화학적 가공 및 생물학적 안전성을 다루므로 화학, 생명 진로선택 과목을 권장합니다.",
        coreSubjects: ["미적분Ⅱ", "물질과 에너지", "세포와 물질대사"],
        recommendedSubjects: ["화학 반응의 세계", "확률과 통계"]
      },
      {
        name: "생명과학대학 환경생태공학과 환경생태공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "지속가능한 생태계 보전을 다루므로 생명과학 심화 및 환경 융합 과목의 이수가 매우 유리합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사"],
        recommendedSubjects: ["생물의 유전", "지구시스템과학", "기후변화와 환경생태(융합)", "위 과학 과목 中 2개 이상 이수 권장"]
      },

      // --- 정보대학 & 스마트보안학부 (3개 전공) ---
      {
        name: "정보대학 컴퓨터학과 컴퓨터학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "소프트웨어 구조 및 알고리즘 이해를 위해 수학 교과 전반(특히 기하, 미적분, 통계)의 우수성을 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)"]
      },
      {
        name: "정보대학 데이터과학과 데이터과학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "대규모 데이터 분석 능력이 핵심이므로 기하·확률과 통계 및 수학적 모델링 관련 과목 이수가 필수입니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)"]
      },
      {
        name: "스마트보안학부 스마트보안학부 사이버보안전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "암호학 및 네트워크 보안의 기초인 이산수학적 사고력을 기를 수 있는 수학 심화 과목을 권장합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "기하"],
        recommendedSubjects: ["인공지능 수학(융합)"]
      },

      // --- 독립학부 (계약학과 4개 전공) ---
      {
        name: "독립학부 반도체공학과 반도체공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (SK하이닉스 계약)",
        evaluationNotice: "최상위권 계약학과로, 반도체 물리 및 재료 화학에 대한 도전적이고 심도 있는 과목 이수가 필수입니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["물질과 에너지", "역학과 에너지"]
      },
      {
        name: "독립학부 차세대통신학과 차세대통신학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (삼성전자 계약)",
        evaluationNotice: "6G 등 통신 네트워크 기초를 다루므로 전자기학 및 확률 모델링 수학 역량을 강력히 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)"]
      },
      {
        name: "독립학부 스마트모빌리티학부 스마트모빌리티전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (현대자동차 계약)",
        evaluationNotice: "자율주행 및 미래차 기술을 위해 동역학과 제어 시스템 기초(물리/수학)의 완벽한 이수를 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학(융합)"]
      },
      {
        name: "독립학부 사이버국방학과 사이버국방전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (국방부 계약)",
        evaluationNotice: "국가 보안을 다루는 특수 학과로, 최상위권의 수학적 논리력과 데이터 보안 관련 탐구 역량을 봅니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "기하"],
        recommendedSubjects: ["인공지능 수학(융합)"]
      },

      // --- 의과/약학/간호/보건과학 대학 (6개 전공) ---
      {
        name: "의과대학 의예과 의예전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "고려대 의대는 의학 연구자 자질을 중시하므로, 과학 심화 과목에 대한 자기주도적 도전과 세특이 당락을 가릅니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학 반응의 세계", "확률과 통계", "생명과학(일반) 우선 이수"]
      },
      {
        name: "약학대학 약학과 약학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "신약 개발 역량을 평가하기 위해 화학과 생명과학 진로선택 과목의 융합적 이수와 성취도를 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "물질과 에너지", "세포와 물질대사"],
        recommendedSubjects: ["화학 반응의 세계", "생물의 유전", "확률과 통계"]
      },
      {
        name: "간호대학 간호학과 간호학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형",
        evaluationNotice: "인체에 대한 기본 지식과 보건 통계 활용 역량을 확인하므로 확률과 통계 이수가 중요합니다.",
        coreSubjects: ["미적분Ⅱ 또는 기하 택1"],
        recommendedSubjects: ["세포와 물질대사", "확률과 통계", "생명과학(일반)"]
      },
      {
        name: "보건과학대학 바이오의공학부 바이오의공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "의료 기기 및 인공지능 헬스케어를 다루므로 물리, 생명과학, 통계학적 지식의 융합을 매우 중시합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["세포와 물질대사", "확률과 통계"]
      },
      {
        name: "보건과학대학 바이오시스템의과학부 바이오시스템의과학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "생명 현상의 시스템적 분석을 위해 생명과학 및 화학 진로선택 과목의 심화 이수를 권장합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물질과 에너지", "확률과 통계"]
      },
      {
        name: "보건과학대학 보건환경융합과학부 보건환경융합과학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (과목 선택의 도전성 중시)",
        evaluationNotice: "공중 보건 및 역학 조사를 다루므로 환경 생태 분야에 대한 관심과 데이터 분석(통계) 역량이 필수입니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["세포와 물질대사", "기후변화와 환경생태(융합)", "화학 반응의 세계"]
      }
    ]
  },
  
// --- 서강대학교 ---
  {
    university: "서강대학교",
    majors: [
      // --- 자연과학대학 (4개 전공) ---
      {
        name: "자연과학대학 수학과 수학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (융합적 사고 중시)",
        evaluationNotice: "서강대는 다전공(복수전공)이 활성화되어 있어, 수학적 기초와 더불어 데이터/AI 등 타 학문과의 융합적 탐구 역량을 보여주면 유리합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학(융합)"]
      },
      {
        name: "자연과학대학 물리학과 물리학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (기초 역량 중시)",
        evaluationNotice: "물리학의 뼈대인 역학 및 전자기학에 대한 높은 성취도와 기하/미적분 활용 능력을 매우 중요하게 평가합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "확률과 통계"]
      },
      {
        name: "자연과학대학 화학과 화학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (기초 역량 중시)",
        evaluationNotice: "물질의 성질과 반응 메커니즘을 탐구하기 위해 화학 진로선택 과목의 심화 이수가 필수적입니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "물질과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "역학과 에너지"]
      },
      {
        name: "자연과학대학 생명과학과 생명과학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (기초 역량 중시)",
        evaluationNotice: "생명 현상의 분자생물학적 이해를 위해 유전학과 세포 대사 관련 진로선택 과목을 강력히 권장합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학 반응의 세계", "확률과 통계"]
      },

      // --- 공과대학 (4개 전공) ---
      {
        name: "공과대학 전자공학과 전자공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (기초 역량 중시)",
        evaluationNotice: "회로 및 시스템 설계의 바탕이 되는 전자기학(물리)과 수학(기하/미적분) 과목의 최상위권 성취도를 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계"]
      },
      {
        name: "공과대학 화공생명공학과 화공생명공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (기초 역량 중시)",
        evaluationNotice: "화학 공정과 바이오 기술을 포괄하므로 물질과 에너지, 화학 반응의 세계 등 화학 심화 과목 이수가 핵심입니다.",
        coreSubjects: ["미적분Ⅱ", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["세포와 물질대사", "기하", "역학과 에너지"]
      },
      {
        name: "공과대학 컴퓨터공학과 컴퓨터공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (융합적 사고 중시)",
        evaluationNotice: "알고리즘적 사고를 검증하기 위해 미적분뿐만 아니라 확률과 통계, AI 수학 등 논리 구조 관련 과목을 꼼꼼히 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "인공지능 수학(융합)"]
      },
      {
        name: "공과대학 기계공학과 기계공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (기초 역량 중시)",
        evaluationNotice: "모든 공학의 기초인 기계 역학을 다루므로 역학과 에너지(물리) 과목의 심화 이수를 필수적으로 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "물질과 에너지"]
      },

      // --- 독립학부 (계약학과 및 신설 첨단학과 2개 전공) ---
      {
        name: "독립학부 시스템반도체공학과 시스템반도체공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (SK하이닉스 계약)",
        evaluationNotice: "SK하이닉스 채용조건형 계약학과로, 반도체 소자 및 설계의 뼈대인 물리(전자기학)와 재료화학 심화 과목의 도전적 이수를 매우 높게 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계"]
      },
      {
        name: "독립학부 인공지능학과 인공지능전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (신설 첨단)",
        evaluationNotice: "서강대의 융합 학풍을 대표하는 신설 학과로, 수학적 데이터 모델링(통계)과 인공지능 관련 융합선택 과목 이수가 당락에 큰 영향을 미칩니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "기하"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)"]
      }
    ]
  },

// --- 성균관대학교 ---
  {
    university: "성균관대학교",
    majors: [
      // --- 자연과학대학 (4개 전공) ---
      {
        name: "자연과학대학 생명과학과 생명과학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (기초 과학 역량 중시)",
        evaluationNotice: "성균관대는 기초 과학 역량을 매우 중시합니다. 생명 현상의 분자적 이해를 위해 화학 및 생명과학 진로선택 과목의 심화 이수가 필수입니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학 반응의 세계", "물질과 에너지", "확률과 통계"]
      },
      {
        name: "자연과학대학 수학과 수학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (기초 과학 역량 중시)",
        evaluationNotice: "해석학과 대수학의 기초가 되는 수학 교과 전반의 압도적인 학업 성취도와 기하/미적분 이수 여부를 확인합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학(융합)"]
      },
      {
        name: "자연과학대학 물리학과 물리학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (기초 과학 역량 중시)",
        evaluationNotice: "양자역학과 고체물리의 기초가 되는 수학적 도구(기하/미적분)와 물리 진로선택 과목 이수가 1순위 평가 요소입니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "확률과 통계"]
      },
      {
        name: "자연과학대학 화학과 화학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (기초 과학 역량 중시)",
        evaluationNotice: "물질의 구조와 반응 메커니즘을 다루므로 화학 진로선택 과목의 이수와 관련 세특 탐구의 깊이가 매우 중요합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "물질과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "역학과 에너지"]
      },

      // --- 정보통신/소프트웨어융합 대학 (3개 전공) ---
      {
        name: "정보통신대학 전자전기공학부 전자전기공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (전공 적합성 중시)",
        evaluationNotice: "반도체 및 통신 시스템의 근간인 전자기학과 회로 이론의 이해를 위해 물리 진로선택 과목의 도전적 이수를 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계"]
      },
      {
        name: "소프트웨어융합대학 소프트웨어학과 소프트웨어학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (논리적 사고력 중시)",
        evaluationNotice: "프로그래밍 알고리즘 최적화에 필요한 수학적 논리력을 어필하기 위해 확률과 통계, AI 수학 이수를 강하게 권장합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "인공지능 수학(융합)"]
      },
      {
        name: "소프트웨어융합대학 지능형소프트웨어학과 지능형소프트웨어전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (삼성전자 계약)",
        evaluationNotice: "삼성전자 채용조건형 계약학과로, AI 및 차세대 SW 개발 역량을 증명할 최상위권의 수학/통계 이수 및 융합 탐구가 필수입니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "기하"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)"]
      },

      // --- 공과대학 (6개 전공) ---
      {
        name: "공과대학 화학공학/고분자공학부 화학공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (전공 적합성 중시)",
        evaluationNotice: "석유화학 및 첨단 신소재 공정을 다루므로 화학 진로선택 과목은 물론 물리(역학/에너지)의 탄탄한 기초를 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "물질과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "역학과 에너지", "기하"]
      },
      {
        name: "공과대학 신소재공학부 신소재공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (융합적 사고 중시)",
        evaluationNotice: "금속, 세라믹, 반도체 재료의 물성을 다루기 위해 물리(전자기)와 화학(물질) 두 분야의 고른 심화 이수가 필요합니다.",
        coreSubjects: ["미적분Ⅱ", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["기하", "역학과 에너지", "화학 반응의 세계"]
      },
      {
        name: "공과대학 기계공학부 기계공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (전공 적합성 중시)",
        evaluationNotice: "4대 역학(고체, 유체, 열, 동역학)의 기초가 되는 물리(역학과 에너지) 과목의 최상위권 성취도를 강하게 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "물질과 에너지"]
      },
      {
        name: "공과대학 건설환경공학부 건설환경공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (전공 적합성 중시)",
        evaluationNotice: "스마트 시티 및 친환경 인프라 설계를 위해 구조 역학(물리)과 기후 환경(융합) 관련 과목의 융합적 이수가 유리합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "역학과 에너지"],
        recommendedSubjects: ["확률과 통계", "기후변화와 환경생태(융합)"]
      },
      {
        name: "공과대학 시스템경영공학과 시스템경영공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (논리적 사고력 중시)",
        evaluationNotice: "산업 최적화 및 빅데이터 분석을 주력으로 하므로 수학 교과 전반, 특히 확률과 통계의 이수와 활용 능력이 절대적입니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "실용 통계(융합)", "인공지능 수학(융합)"]
      },
      {
        name: "공과대학 나노공학과 나노공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (융합적 사고 중시)",
        evaluationNotice: "원자 단위의 나노 기술을 탐구하기 위해 양자역학과 물리화학적 기초를 다지는 물리/화학 진로선택 이수를 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "기하", "역학과 에너지"]
      },

      // --- 독립학부 (계약학과 및 신설 첨단학과 3개 전공) ---
      {
        name: "독립학부 반도체시스템공학과 반도체시스템공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (삼성전자 계약)",
        evaluationNotice: "국내 최고 수준의 삼성전자 계약학과로, 반도체 회로 및 소자 설계의 근간이 되는 물리(전자기학)의 완벽한 이수가 당락을 결정합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["물질과 에너지", "역학과 에너지", "확률과 통계"]
      },
      {
        name: "독립학부 반도체융합공학과 반도체융합공학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (신설 첨단)",
        evaluationNotice: "차세대 반도체 공정 및 융합 기술을 다루므로 물리, 화학, 통계를 아우르는 폭넓은 과학적 역량을 어필해야 합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["물질과 에너지", "확률과 통계", "인공지능 수학(융합)"]
      },
      {
        name: "독립학부 에너지학과 에너지학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (신설 첨단)",
        evaluationNotice: "친환경 신재생 에너지 및 배터리 기술을 선도하는 첨단 학과로, 화학과 물리의 융합적 탐구 세특이 매우 유리하게 작용합니다.",
        coreSubjects: ["미적분Ⅱ", "물질과 에너지", "역학과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "전자기와 양자", "기후변화와 환경생태(융합)"]
      },

      // --- 약학/의과 대학 (2개 전공) ---
      {
        name: "약학대학 약학과 약학전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (전공 적합성 중시)",
        evaluationNotice: "신약 개발 및 약동학적 분석을 위해 화학과 생명과학 진로선택 과목 이수와 의료 통계 활용 능력을 깐깐하게 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "물질과 에너지", "세포와 물질대사"],
        recommendedSubjects: ["화학 반응의 세계", "생물의 유전", "확률과 통계"]
      },
      {
        name: "의과대학 의예과 의예전공",
        source: "5개 대학 공동연구 가이드",
        evaluationStyle: "특정 과목 지정형 (최상위권 역량 중시)",
        evaluationNotice: "의학적 임상 및 연구 역량을 위해 생명 현상에 대한 심도 있는 탐구와 보건 통계를 위한 수학적 능력을 완벽히 갖춰야 합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학 반응의 세계", "확률과 통계", "생명과학(일반)"]
      }
    ]
  },

// --- 한양대학교 ---
  {
    university: "한양대학교",
    majors: [
      // --- 공과대학 (12개 전공) ---
      {
        name: "공과대학 융합전자공학부 융합전자공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (실용 공학 역량 중시)",
        evaluationNotice: "한양대 다이아몬드 학과로, 반도체 및 디스플레이, 통신의 근간인 전자기학과 회로에 대한 최상위권 물리 역량을 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계"]
      },
      {
        name: "공과대학 컴퓨터소프트웨어학부 컴퓨터소프트웨어전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (실용 공학 역량 중시)",
        evaluationNotice: "다이아몬드 학과로, 실무 프로그래밍 역량과 직결되는 알고리즘적 논리력을 위해 수학 교과(기하/미적분/통계) 전반의 완벽한 이수가 필요합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "정보 과학 관련 진로/융합선택"]
      },
      {
        name: "공과대학 미래자동차공학과 미래자동차공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (실용 공학 역량 중시)",
        evaluationNotice: "다이아몬드 학과로, 기계공학(동역학)과 전자공학(제어)이 결합된 형태이므로 물리 역학과 전자기학 모두 심도 있게 이수해야 합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학(융합)"]
      },
      {
        name: "공과대학 에너지공학과 에너지공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (실용 공학 역량 중시)",
        evaluationNotice: "다이아몬드 학과로, 차세대 에너지 소재 및 배터리 개발을 주도하므로 물질 화학과 열역학(물리)의 융합적 탐구가 당락을 가릅니다.",
        coreSubjects: ["미적분Ⅱ", "물질과 에너지", "역학과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "전자기와 양자", "기후변화와 환경생태(융합)", "과학 진로선택 2과목 이상 이수 권장"]
      },
      {
        name: "공과대학 기계공학부 기계공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (전통 공학 역량 중시)",
        evaluationNotice: "전통의 공학 명가 한양대의 간판 학부로, 4대 역학의 기초가 되는 물리(역학과 에너지) 과목의 압도적인 성취도를 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "물질과 에너지", "과학 진로선택 2과목 이상 이수 권장"]
      },
      {
        name: "공과대학 신소재공학부 신소재공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (전통 공학 역량 중시)",
        evaluationNotice: "금속, 세라믹, 고분자 등 모든 재료의 물성을 다루므로 물리(전자기학)와 화학(물질화학) 진로선택 과목 이수가 필수입니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계", "과학 진로선택 2과목 이상 이수 권장"]
      },
      {
        name: "공과대학 화학공학과 화학공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (전통 공학 역량 중시)",
        evaluationNotice: "화학 물질의 대량 생산 공정을 설계하므로 화학적 기초뿐만 아니라 유체/열역학 이수를 위한 물리 진로선택 이수도 중요합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물질과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "역학과 에너지", "과학 진로선택 2과목 이상 이수 권장"]
      },
      {
        name: "공과대학 전기·생체공학부 전기공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (전통 공학 역량 중시)",
        evaluationNotice: "전력 및 에너지 시스템의 근간인 전자기학과 회로 이론의 이해를 위해 물리 진로선택 과목의 탄탄한 이수를 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계"]
      },
      {
        name: "공과대학 전기·생체공학부 바이오메디컬공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (융합적 사고 중시)",
        evaluationNotice: "첨단 의료 기기 및 인공 장기를 개발하므로 물리(전자/기계), 화학(생체재료), 생명과학 등 다방면의 심화 과목 이수가 매우 유리합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["물질과 에너지", "세포와 물질대사", "확률과 통계", "과학 진로선택 2과목 이상 이수 권장"]
      },
      {
        name: "공과대학 생명공학과 생명공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (실용 공학 역량 중시)",
        evaluationNotice: "바이오 의약 및 생체 재료 공정을 다루므로 세포 대사와 유전학 등 생명과학 진로선택 과목과 기초 화학 역량을 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물질과 에너지", "화학 반응의 세계", "과학 진로선택 2과목 이상 이수 권장"]
      },
      {
        name: "공과대학 산업공학과 산업공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (데이터/논리 역량 중시)",
        evaluationNotice: "생산 시스템 최적화와 빅데이터 분석이 중심이 되므로 수학적 통계 모델링(기하, 확률과 통계, AI 수학) 이수 여부가 핵심입니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["실용 통계(융합)", "인공지능 수학(융합)"]
      },
      {
        name: "공과대학 원자력공학과 원자력공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (전통 공학 역량 중시)",
        evaluationNotice: "방사선 및 양자 역학의 기초가 되는 물리 심화 과목(특히 전자기와 양자)의 확실한 성취도와 도전적 이수가 필요합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "물질과 에너지", "과학 진로선택 2과목 이상 이수 권장"]
      },

      // --- 자연과학대학 (4개 전공) ---
      {
        name: "자연과학대학 수학과 수학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (기초 과학 역량 중시)",
        evaluationNotice: "순수 수학적 원리 탐구 능력과 수리적 추론 능력을 극대화하여 보여줄 수 있는 수학 전문/심화 교과 이수를 권장합니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학(융합)"]
      },
      {
        name: "자연과학대학 물리학과 물리학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (기초 과학 역량 중시)",
        evaluationNotice: "물리 법칙의 근원적 이해를 위해 역학, 전자기학 등 물리 진로선택 전반의 압도적 성취와 수학적 기하 활용이 필수적입니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "확률과 통계"]
      },
      {
        name: "자연과학대학 화학과 화학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (기초 과학 역량 중시)",
        evaluationNotice: "화학 반응 메커니즘과 물질 합성 능력을 어필하기 위해 화학 진로선택 과목의 심화 탐구(실험 세특 등)가 매우 중요합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "물질과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "역학과 에너지", "과학 진로선택 2과목 이상 이수 권장"]
      },
      {
        name: "자연과학대학 생명과학과 생명과학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (기초 과학 역량 중시)",
        evaluationNotice: "생명 현상을 분자 단위에서 융합적으로 이해하기 위해 생명과학 심화는 물론 기초 화학적 소양을 필수로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학 반응의 세계", "물질과 에너지", "확률과 통계", "과학 진로선택 2과목 이상 이수 권장"]
      },

      // --- 독립학부 / 의약학 / 간호 (3개 전공) ---
      {
        name: "독립학부 반도체공학과 반도체공학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (SK하이닉스 계약)",
        evaluationNotice: "SK하이닉스 채용조건형 계약학과로, 반도체 물리적 특성 및 공정 이해를 위한 물리/화학 진로선택 과목의 최상위권 이수가 당락을 가릅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["물질과 에너지", "역학과 에너지", "화학 반응의 세계", "과학 진로선택 2과목 이상 이수 권장"]
      },
      {
        name: "의과대학 의예과 의예전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형 (최상위권 역량 중시)",
        evaluationNotice: "인체 생명 현상에 대한 임상적/연구적 탐구 역량과 의학 데이터 분석을 위한 통계/수학적 역량을 완벽히 갖춰야 합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학 반응의 세계", "확률과 통계", "생명과학(일반) 우선 이수"]
      },
      {
        name: "간호대학 간호학부 간호학전공",
        source: "주요 대학 전공 연계 교과이수 가이드라인",
        evaluationStyle: "특정 과목 지정형",
        evaluationNotice: "임상 간호와 보건의료 데이터 활용 역량을 중시하므로, 생명 현상 이해와 확률과 통계 이수를 꼼꼼히 확인합니다.",
        coreSubjects: ["미적분Ⅱ 또는 기하 택1"],
        recommendedSubjects: ["세포와 물질대사", "확률과 통계", "생명과학(일반)"]
      }
    ]
  },

  // --- KAIST (한국과학기술원) ---
  {
    university: "KAIST",
    majors: [
      // --- 자연과학대학 (3개 전공) ---
      {
        name: "자연과학대학 수리과학과 수리과학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "기초 과학 심화 역량 및 위계 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영하므로, 특정 전공에 얽매이기보다 수학 전문 교과(고급 수학 등)나 심화 탐구를 통해 압도적인 수리 논리력을 증명하는 것이 최우선입니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학(융합)", "수학 전문 교과(심화)"]
      },
      {
        name: "자연과학대학 물리학과 물리학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "기초 과학 심화 역량 및 위계 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영하므로, 얕은 전공 지식보다 물리학의 근본 역량을 봅니다. 일반선택부터 진로선택(역학/전자기)까지 과목의 위계를 탄탄하게 밟았는지를 깐깐하게 평가합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["물질과 에너지", "과학 전문 교과(심화)"]
      },
      {
        name: "자연과학대학 화학과 화학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "기초 과학 심화 역량 및 위계 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영합니다. 따라서 입학 후 어떤 융합 연구든 소화할 수 있도록 물질과 에너지 등 기초 화학 역량의 깊이를 입증해야 합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["역학과 에너지", "과학 전문 교과(심화)"]
      },

      // --- 생명과학기술대학 (2개 전공) ---
      {
        name: "생명과학기술대학 생명과학과 생명과학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "기초 과학 심화 역량 및 위계 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영하므로 폭넓은 기초 과학이 중요합니다. 생명과학 진로선택 과목 이수는 필수이며, 화학적 기저에 대한 이해도를 함께 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학 반응의 세계", "물질과 에너지", "확률과 통계"]
      },
      {
        name: "생명과학기술대학 뇌인지과학과 뇌인지과학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "기초 과학 심화 역량 및 융합 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영합니다. 뇌 신경망과 인공지능의 융합 탐구를 위해 생명과학 심화와 더불어 확률과 통계, AI 관련 융합 과목 이수가 매우 유리합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "확률과 통계"],
        recommendedSubjects: ["생물의 유전", "인공지능 수학(융합)", "기하"]
      },

      // --- 공과대학 (10개 전공) ---
      {
        name: "공과대학 기계항공공학부 기계공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "기초 과학 심화 역량 및 위계 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영하므로 공학의 뼈대인 수학/물리 역량이 절대적입니다. 역학과 에너지 과목의 수학적 해석 능력을 극도로 중시합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "물질과 에너지"]
      },
      {
        name: "공과대학 기계항공공학부 항공우주공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "기초 과학 심화 역량 및 위계 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영합니다. 우주 시스템 탐구를 위해 물리(역학/전자기) 심화 이수와 더불어 지구/우주 관련 융합적 기초 소양을 권장합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["행성우주과학", "물질과 에너지"]
      },
      {
        name: "공과대학 전기및전자공학부 전기및전자공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "기초 과학 심화 역량 및 위계 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영하므로, 특정 기술보다 전자기학(물리)과 기하/미적분의 완벽한 이해 및 물리 실험 탐구 능력을 최우선으로 봅니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계"]
      },
      {
        name: "공과대학 전산학부 전산학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "수리/논리적 추론 역량 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영합니다. 코딩 스킬 자체보다 컴퓨터 알고리즘의 뼈대인 수학 교과 전반의 압도적 성취와 통계적 논리력을 강력히 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "인공지능 수학(융합)", "정보 과학 관련 진로선택"]
      },
      {
        name: "공과대학 건설및환경공학과 건설및환경공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "기초 과학 심화 역량 및 융합 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영하므로, 스마트 인프라와 기후 위기 융합 연구를 수행할 수 있는 역학(물리)과 환경 생태 과목의 탄탄한 기초를 봅니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지"],
        recommendedSubjects: ["기후변화와 환경생태(융합)", "확률과 통계"]
      },
      {
        name: "공과대학 바이오및뇌공학과 바이오및뇌공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "기초 과학 심화 역량 및 융합 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영합니다. 의공학 데이터를 다루기 위해 생명과학 기초는 물론 확률과 통계, IT 융합 과목의 고른 이수가 매우 중요합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "확률과 통계"],
        recommendedSubjects: ["전자기와 양자", "인공지능 수학(융합)", "생물의 유전"]
      },
      {
        name: "공과대학 산업디자인학과 산업디자인전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "다학제적 융합 및 수리 역량 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영하므로, 단순 디자인이 아닌 공학 기반의 UX/UI 역량을 증명할 수학적 분석력(미적분/통계)이 필수입니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "역학과 에너지", "융합과학 탐구(융합)"]
      },
      {
        name: "공과대학 산업및시스템공학과 산업및시스템공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "수리/논리적 데이터 역량 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영합니다. 산업 빅데이터 분석 및 최적화를 위해 확률과 통계, 실용 통계 등 데이터 수학 과목의 이수가 당락을 결정짓습니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "실용 통계(융합)", "인공지능 수학(융합)"]
      },
      {
        name: "공과대학 생명화학공학과 생명화학공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "기초 과학 심화 역량 및 위계 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영하므로, 첨단 소재 공정의 뼈대가 되는 물질 화학과 물리(역학)에 대한 깊이 있는 통찰이 최우선 평가 요소입니다.",
        coreSubjects: ["미적분Ⅱ", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["역학과 에너지", "세포와 물질대사", "기하"]
      },
      {
        name: "공과대학 신소재공학과 신소재공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "기초 과학 심화 역량 및 융합 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영합니다. 반도체, 배터리 등 물성 이해를 위해 전자기학(물리)과 물질화학(화학) 진로선택 과목의 융합적 기초가 절대적입니다.",
        coreSubjects: ["미적분Ⅱ", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["기하", "역학과 에너지", "화학 반응의 세계"]
      },
      {
        name: "공과대학 원자력및양자공학과 원자력및양자공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "기초 과학 심화 역량 및 위계 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영하므로, 양자 컴퓨터 등 거대 과학의 기초인 양자역학 및 전자기학적 이해를 입증할 물리 진로선택 완벽 이수가 필요합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "전자기와 양자", "역학과 에너지"],
        recommendedSubjects: ["물질과 에너지"]
      },

      // --- 융합인재학부 및 계약학과 (2개 전공) ---
      {
        name: "융합인재학부 융합인재학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "다학제적 융합 및 자기주도성 중시형",
        evaluationNotice: "KAIST는 1학년 무학과 입학 제도를 운영합니다. 정해진 틀이 없는 융합 학문을 지향하므로, 수학/과학 기본기를 바탕으로 자신만의 독창적인 탐구 경로를 보여주어야 합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "기하"],
        recommendedSubjects: ["융합과학 탐구(융합)", "기후변화와 환경생태(융합)", "인공지능 수학(융합)"]
      },
      {
        name: "공과대학 반도체시스템공학과 반도체시스템공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "특정 과목 지정형 (삼성전자 계약 / 학과 지정 입학)",
        evaluationNotice: "KAIST는 기본적으로 무학과 입학이지만, 본 학과는 예외적으로 전공을 지정하여 입학하는 최상위권 삼성전자 계약학과입니다. 반도체 물리 및 재료 화학 전반에 대한 최고 수준의 성취도를 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계", "확률과 통계"]
      }
    ]
  },

  // --- POSTECH (포항공과대학교) ---
  {
    university: "POSTECH",
    majors: [
      // --- 이학계열 (4개 전공) ---
      {
        name: "독립학과 수학과 수학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 연구 잠재력 중시형",
        evaluationNotice: "POSTECH은 단일계열(무학과) 입학 제도를 운영하므로 얕은 전공 지식보다 학문의 뼈대를 봅니다. 수학 심화 과목(고급 수학 등)의 이수와 자기주도적 증명 역량이 최우선 평가 요소입니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학(융합)", "수학 전문 교과(심화)"]
      },
      {
        name: "독립학과 물리학과 물리학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 위계 중시형",
        evaluationNotice: "POSTECH은 단일계열(무학과) 입학 제도를 운영합니다. 물리 법칙의 근원적 이해를 위해 역학, 전자기학 등 진로선택 전반의 압도적 성취와 수학적(기하/미적분) 활용이 필수적입니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["물질과 에너지", "과학 전문 교과(심화)"]
      },
      {
        name: "독립학과 화학과 화학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 연구 잠재력 중시형",
        evaluationNotice: "POSTECH은 단일계열(무학과) 입학 제도를 운영하므로 어떤 연구든 소화할 수 있는 기초가 중요합니다. 화학 진로선택 과목의 이수와 실험 세특의 깊이를 매우 깐깐하게 확인합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["역학과 에너지", "과학 전문 교과(심화)"]
      },
      {
        name: "독립학과 생명과학과 생명과학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 융합 중시형",
        evaluationNotice: "POSTECH은 단일계열(무학과) 입학 제도를 운영합니다. 바이오 의약 및 생명 현상을 분자 단위에서 융합적으로 이해하기 위해 생명과학 심화는 물론 기초 화학적 소양을 필수로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학 반응의 세계", "물질과 에너지", "확률과 통계"]
      },

      // --- 공학계열 (7개 전공) ---
      {
        name: "독립학과 기계공학과 기계공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 위계 중시형",
        evaluationNotice: "POSTECH은 단일계열(무학과) 입학 제도를 운영하므로 공학의 뼈대인 수학/물리 역량이 절대적입니다. 4대 역학의 기초인 물리(역학과 에너지) 과목의 수학적 해석 능력을 극도로 중시합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "물질과 에너지"]
      },
      {
        name: "독립학과 신소재공학과 신소재공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 융합 중시형",
        evaluationNotice: "POSTECH은 단일계열(무학과) 입학 제도를 운영합니다. 첨단 나노/배터리 소재의 물성을 다루기 위해 물리(전자기학)와 화학(물질화학) 진로선택 과목의 융합적 이수가 핵심입니다.",
        coreSubjects: ["미적분Ⅱ", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["기하", "역학과 에너지", "화학 반응의 세계"]
      },
      {
        name: "독립학과 전자전기공학과 전자전기공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 위계 중시형",
        evaluationNotice: "POSTECH은 단일계열(무학과) 입학 제도를 운영하므로, 반도체 및 통신의 근간인 전자기학과 회로 이론의 이해를 위해 물리 진로선택의 최상위권 이수를 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계"]
      },
      {
        name: "독립학과 컴퓨터공학과 컴퓨터공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "수리/논리적 데이터 역량 중시형",
        evaluationNotice: "POSTECH은 단일계열(무학과) 입학 제도를 운영합니다. 실무 코딩 경험보다 알고리즘 최적화에 필요한 수학적 논리력(확률과 통계, AI 수학 등)을 증명하는 것이 당락을 좌우합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "인공지능 수학(융합)", "정보 과학 관련 진로선택"]
      },
      {
        name: "독립학과 화학공학과 화학공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 융합 중시형",
        evaluationNotice: "POSTECH은 단일계열(무학과) 입학 제도를 운영합니다. 차세대 에너지 및 공정 설계를 다루므로 물질 화학과 열역학(물리)의 융합적 탐구가 매우 유리합니다.",
        coreSubjects: ["미적분Ⅱ", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["세포와 물질대사", "역학과 에너지", "기하"]
      },
      {
        name: "독립학과 산업경영공학과 산업경영공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "수리/논리적 데이터 역량 중시형",
        evaluationNotice: "POSTECH은 단일계열(무학과) 입학 제도를 운영하므로, 시스템 최적화와 빅데이터 분석을 이끌어갈 확률과 통계, 실용 통계 등 수학/통계 과목의 완벽한 이수가 필수입니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "실용 통계(융합)", "인공지능 수학(융합)"]
      },
      {
        name: "독립학과 IT융합공학과 IT융합공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "다학제적 융합 및 창의성 중시형",
        evaluationNotice: "POSTECH은 단일계열(무학과) 입학 제도를 운영합니다. 미래 IT 융합 기술을 주도할 인재를 찾으므로 수학적 뼈대(미적분/기하/통계) 위에 IT 융합 과목의 창의적 탐구를 얹어야 합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "기하"],
        recommendedSubjects: ["인공지능 수학(융합)", "전자기와 양자", "융합과학 탐구(융합)"]
      },

      // --- 계약학과 및 융합 특화 (2개 전공) ---
      {
        name: "독립학과 반도체공학과 반도체공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "특정 과목 지정형 (삼성전자 계약 / 학과 지정 입학)",
        evaluationNotice: "단일계열 입학 원칙의 예외로, 1학년부터 전공이 확정되는 삼성전자 최상위 계약학과입니다. 반도체 소자 설계의 뼈대인 물리(전자기학)와 재료화학 심화 과목의 압도적 성취를 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계", "확률과 통계"]
      },
      {
        name: "융합학부 융합학부 의공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 융합 중시형",
        evaluationNotice: "POSTECH은 단일계열(무학과) 입학 제도를 운영합니다. 미래형 의사과학자 및 헬스케어 인재 육성을 위한 전공으로, 생명과학 기초와 물리/수학의 융합적 이수가 절대적으로 필요합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "세포와 물질대사", "전자기와 양자"],
        recommendedSubjects: ["생물의 유전", "확률과 통계", "인공지능 수학(융합)"]
      }
    ]
  },

  // --- UNIST (울산과학기술원) ---
  {
    university: "UNIST",
    majors: [
      // --- 공과대학 (5개 전공) ---
      {
        name: "공과대학 기계공학과 기계공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "계열별 기초 역량 및 위계 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영하므로 공학의 뼈대인 수학/물리 역량이 절대적입니다. 4대 역학의 기초인 물리(역학과 에너지) 과목의 최상위권 성취도를 확인합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "물질과 에너지"]
      },
      {
        name: "공과대학 도시환경공학과 도시환경공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "계열별 기초 역량 및 융합 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영합니다. 스마트 인프라와 기후 위기 극복을 다루므로 구조 역학(물리) 이수와 환경 생태(융합) 과목의 탐구를 적극 권장합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지"],
        recommendedSubjects: ["기후변화와 환경생태(융합)", "확률과 통계", "지구시스템과학"]
      },
      {
        name: "공과대학 신소재공학과 신소재공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "계열별 기초 역량 및 융합 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영하므로, 이차전지 등 첨단 소재 연구의 뼈대가 되는 전자기학(물리)과 물질화학(화학) 진로선택 과목의 융합 이수가 핵심입니다.",
        coreSubjects: ["미적분Ⅱ", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["기하", "역학과 에너지", "화학 반응의 세계"]
      },
      {
        name: "공과대학 에너지화학공학과 에너지화학공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "계열별 기초 역량 및 위계 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영합니다. 친환경 에너지와 탄소중립 기술을 선도하는 학과 특성상 화학 반응 및 물질화학의 압도적인 성취를 봅니다.",
        coreSubjects: ["미적분Ⅱ", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["역학과 에너지", "기후변화와 환경생태(융합)", "기하"]
      },
      {
        name: "공과대학 원자력공학과 원자력공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "계열별 기초 역량 및 위계 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영하므로, 차세대 소형 원전(SMR) 등의 연구를 위한 양자역학 및 전자기학적 이해를 입증할 물리 진로선택 완벽 이수가 필요합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "전자기와 양자", "역학과 에너지"],
        recommendedSubjects: ["물질과 에너지"]
      },

      // --- 정보바이오융합대학 (6개 전공) ---
      {
        name: "정보바이오융합대학 디자인학과 디자인학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "다학제적 융합 및 수리 역량 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영합니다. 순수 미술이 아닌 공학 기반의 산업/UX 디자인이므로 수학적 분석력(미적분/통계)과 공학 융합 탐구가 필수입니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "융합과학 탐구(융합)", "역학과 에너지"]
      },
      {
        name: "정보바이오융합대학 바이오메디컬공학과 바이오메디컬공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "계열별 기초 역량 및 융합 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영하므로, 첨단 의료공학 데이터 분석을 위해 생명과학 기초는 물론 확률과 통계, IT/물리 과목의 고른 이수가 매우 중요합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "확률과 통계"],
        recommendedSubjects: ["생물의 유전", "전자기와 양자", "인공지능 수학(융합)"]
      },
      {
        name: "정보바이오융합대학 산업공학과 산업공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "수리/논리적 데이터 역량 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영합니다. 데이터 사이언스와 최적화 시스템 설계를 주도할 확률과 통계, 실용 통계 등 데이터 수학 과목의 완벽한 이수가 필수입니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "실용 통계(융합)", "인공지능 수학(융합)"]
      },
      {
        name: "정보바이오융합대학 생명과학과 생명과학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "계열별 기초 역량 및 위계 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영하므로 폭넓은 기초 과학 역량을 봅니다. 유전/세포 등 생명과학 심화는 물론 기초 화학적 소양을 필수적으로 갖추어야 합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학 반응의 세계", "물질과 에너지", "확률과 통계"]
      },
      {
        name: "정보바이오융합대학 전기전자공학과 전기전자공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "계열별 기초 역량 및 위계 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영합니다. 통신과 반도체의 근간인 전자기학(물리)과 기하/미적분의 완벽한 이해 및 탐구 능력을 최우선으로 평가합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계"]
      },
      {
        name: "정보바이오융합대학 컴퓨터공학과 컴퓨터공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "수리/논리적 추론 역량 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영하므로, 실무 코딩 경험보다 알고리즘의 뼈대인 수학 교과 전반의 압도적 성취와 통계적 논리력을 강력히 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "인공지능 수학(융합)", "정보 과학 관련 진로선택"]
      },

      // --- 자연과학대학 (3개 전공) ---
      {
        name: "자연과학대학 물리학과 물리학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "계열별 기초 역량 및 위계 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영합니다. 얕은 전공 지식보다 역학, 전자기학 등 진로선택 전반의 압도적 성취와 수학적 도구 활용 능력을 봅니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["물질과 에너지", "과학 전문 교과(심화)"]
      },
      {
        name: "자연과학대학 수리과학과 수리과학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "계열별 기초 역량 및 연구 잠재력 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영하므로, 고급 수학 등 수학 전문 교과나 심화 탐구를 통해 자기주도적인 수리 증명 역량을 입증하는 것이 최우선입니다.",
        coreSubjects: ["기하", "미적분Ⅱ"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학(융합)", "수학 전문 교과(심화)"]
      },
      {
        name: "자연과학대학 화학과 화학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "계열별 기초 역량 및 위계 중시형",
        evaluationNotice: "UNIST는 1학년 무학과(이공계열) 입학 제도를 운영합니다. 입학 후 어떤 융합 연구든 소화할 수 있도록 물질과 에너지 등 화학 진로선택 과목의 탄탄한 기본기를 요구합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["역학과 에너지", "과학 전문 교과(심화)"]
      },

      // --- 계약학과 (1개 전공) ---
      {
        name: "공과대학 반도체공학과 반도체공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "특정 과목 지정형 (삼성전자 계약 / 학과 지정 입학)",
        evaluationNotice: "단일계열 입학 원칙의 예외로, 전공을 지정하여 입학하는 삼성전자 최상위 계약학과입니다. 반도체 소자 설계의 뼈대인 물리(전자기학)와 화학(물질) 심화 과목의 최고 수준 성취를 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계", "확률과 통계"]
      }
    ]
  },

  // --- GIST (광주과학기술원) ---
  {
    university: "GIST",
    majors: [
      // --- 기초교육학부 (무학과 입학 후 전공 선택 - 7개 전공) ---
      {
        name: "기초교육학부 물리전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 위계 중시형",
        evaluationNotice: "GIST는 1학년 무학과 입학 제도를 운영합니다. 기초 과학의 근간인 물리학을 위해 역학, 전자기학 등 물리 진로선택 전반의 압도적 성취와 수학적(기하/미적분) 활용이 필수적입니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["물질과 에너지", "과학 전문 교과(심화)"]
      },
      {
        name: "기초교육학부 화학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 위계 중시형",
        evaluationNotice: "GIST는 1학년 무학과 입학 제도를 운영하므로 어떤 융합 연구든 소화할 수 있는 기초가 중요합니다. 화학 진로선택 과목의 이수와 화학 반응 메커니즘에 대한 탐구 깊이를 깐깐하게 확인합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["역학과 에너지", "과학 전문 교과(심화)"]
      },
      {
        name: "기초교육학부 생명과학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 융합 중시형",
        evaluationNotice: "GIST는 1학년 무학과 입학 제도를 운영합니다. 생명 현상을 분자 단위에서 융합적으로 이해하기 위해 생명과학 심화는 물론, 그 기저가 되는 화학적 소양을 필수로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학 반응의 세계", "물질과 에너지", "확률과 통계"]
      },
      {
        name: "기초교육학부 전기전자컴퓨터전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 논리력 중시형",
        evaluationNotice: "GIST는 1학년 무학과 입학 제도를 운영하므로, 코딩 스킬 자체보다 반도체/통신/SW의 뼈대인 전자기학(물리)과 통계적 논리력(수학)의 완벽한 이수를 최우선으로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자", "확률과 통계"],
        recommendedSubjects: ["역학과 에너지", "인공지능 수학(융합)", "정보 과학 관련 진로선택"]
      },
      {
        name: "기초교육학부 기계공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 위계 중시형",
        evaluationNotice: "GIST는 1학년 무학과 입학 제도를 운영하므로 공학의 뼈대인 수학/물리 역량이 절대적입니다. 역학과 에너지 등 물리 과목의 수학적 해석 능력을 극도로 중시합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "물질과 에너지"]
      },
      {
        name: "기초교육학부 신소재공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 융합 중시형",
        evaluationNotice: "GIST는 1학년 무학과 입학 제도를 운영합니다. 차세대 에너지 및 나노 소재의 물성을 다루기 위해 전자기학(물리)과 물질화학(화학) 진로선택 과목의 융합적 이수가 핵심입니다.",
        coreSubjects: ["미적분Ⅱ", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["기하", "역학과 에너지", "화학 반응의 세계"]
      },
      {
        name: "기초교육학부 지구·환경공학전공",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "단일계열 기초 역량 및 융합 중시형",
        evaluationNotice: "GIST는 1학년 무학과 입학 제도를 운영합니다. 기후 변화 및 친환경 에너지 인프라를 다루므로 역학(물리) 이수와 더불어 지구/환경 생태(융합) 과목의 탐구를 적극 권장합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지"],
        recommendedSubjects: ["지구시스템과학", "기후변화와 환경생태(융합)", "확률과 통계"]
      },

      // --- 계약학과 (1개 전공) ---
      {
        name: "독립학과 반도체공학과",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "특정 과목 지정형 (삼성전자 계약 / 학과 지정 입학)",
        evaluationNotice: "무학과 입학 원칙의 예외로, 전공을 지정하여 입학하는 삼성전자 최상위 계약학과입니다. 차세대 반도체 공정 및 설계의 뼈대인 물리(전자기학)와 화학(물질) 심화 과목의 최고 수준 성취를 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계", "확률과 통계"]
      }
    ]
  },

  // --- DGIST (대구경북과학기술원) ---
  {
    university: "DGIST",
    majors: [
      // --- 융합전공 (기초학부 무학과 입학 후 트랙 선택 - 6개 주력 트랙) ---
      {
        name: "기초학부 물리학 트랙",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "초융합 단일학부 기초 역량 및 위계 중시형",
        evaluationNotice: "DGIST는 1학년 무학과(단일 융합전공) 입학 제도를 운영합니다. 기초 과학의 뼈대인 물리학 심화를 위해 역학, 전자기학 등 진로선택 전반의 성취도와 수학적(기하/미적분) 분석력을 강력히 요구합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["물질과 에너지", "과학 전문 교과(심화)"]
      },
      {
        name: "기초학부 화학 트랙",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "초융합 단일학부 기초 역량 및 위계 중시형",
        evaluationNotice: "DGIST는 1학년 무학과(단일 융합전공) 입학 제도를 운영하므로, 어떤 융합 연구든 소화할 수 있는 물질화학 및 화학 반응 메커니즘에 대한 탄탄한 기본기와 실험 세특을 봅니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["역학과 에너지", "과학 전문 교과(심화)"]
      },
      {
        name: "기초학부 생명과학 트랙",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "초융합 단일학부 기초 역량 및 융합 중시형",
        evaluationNotice: "DGIST는 1학년 무학과(단일 융합전공) 입학 제도를 운영합니다. 첨단 뇌과학 및 바이오 융합 연구를 선도하므로, 생명과학 심화는 물론 기초 화학 및 통계적 소양을 필수로 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학 반응의 세계", "물질과 에너지", "확률과 통계"]
      },
      {
        name: "기초학부 기계공학 트랙",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "초융합 단일학부 기초 역량 및 위계 중시형",
        evaluationNotice: "DGIST는 1학년 무학과(단일 융합전공) 입학 제도를 운영하므로 공학의 뼈대인 수학/물리 역량이 절대적입니다. 지능형 로봇 및 기계 시스템을 다루기 위한 역학(물리)과 수학의 융합을 극도로 중시합니다.",
        coreSubjects: ["기하", "미적분Ⅱ", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "물질과 에너지"]
      },
      {
        name: "기초학부 신소재공학 트랙",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "초융합 단일학부 기초 역량 및 융합 중시형",
        evaluationNotice: "DGIST는 1학년 무학과(단일 융합전공) 입학 제도를 운영합니다. 차세대 에너지 및 나노 소재의 물성을 이해하기 위해 전자기학(물리)과 물질화학(화학) 진로선택 과목의 융합적 이수가 핵심입니다.",
        coreSubjects: ["미적분Ⅱ", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["기하", "역학과 에너지", "화학 반응의 세계"]
      },
      {
        name: "기초학부 전자정보공학 트랙",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "초융합 단일학부 수리/논리 역량 중시형",
        evaluationNotice: "DGIST는 1학년 무학과(단일 융합전공) 입학 제도를 운영합니다. AI, 통신, 반도체 시스템의 뼈대인 전자기학(물리)과 통계적/알고리즘적 논리력(수학 교과 전반)의 완벽한 이수를 최우선으로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자", "확률과 통계"],
        recommendedSubjects: ["역학과 에너지", "인공지능 수학(융합)", "정보 과학 관련 진로선택"]
      },

      // --- 계약학과 (1개 전공) ---
      {
        name: "독립학과 반도체공학과",
        source: "이공계 특성화대 2028학년도 전공 연계 가이드라인",
        evaluationStyle: "특정 과목 지정형 (삼성전자 계약 / 학과 지정 입학)",
        evaluationNotice: "무학과 단일학부 입학 원칙의 예외로, 전공을 지정하여 입학하는 삼성전자 최상위 계약학과입니다. 차세대 반도체 공정 및 소자 설계의 뼈대인 물리(전자기학)와 화학(물질) 심화 과목의 최고 수준 성취를 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계", "확률과 통계"]
      }
    ]
  },

  // ── 건국대학교 ─────────────────────────────────────────────────────────────
  {

    university: "건국대학교",
    majors: [
      {
        name: "상허생명과학대학 생명과학특성학과 생명과학특성학전공",
        source: "건국대학교 KU:PICK 이수추천과목 가이드",
        evaluationStyle: "선수 위계 기반 지정형",
        evaluationNotice:
          "단순 이수가 아닌 '과목 간 위계(일반선택 ➔ 진로/융합선택)'를 순차적으로 밟았는지를 매우 엄격하게 평가합니다.",
        coreSubjects: [
          "생명과학(일반)",
          "화학(일반)",
          "세포와 물질대사",
        ],
        recommendedSubjects: [
          "생물의 유전",
          "물질과 에너지",
          "기후변화와 환경생태(융합)",
        ],
      },
      {
        name: "이과대학 물리학과",
        source: "건국대학교 KU:PICK 이수추천과목 가이드",
        evaluationStyle: "선수 위계 기반 지정형",
        evaluationNotice:
          "물리학(일반) 이수 후 역학과 에너지, 전자기와 양자의 순차적 이수 흐름을 중점 평가합니다. 수학 위계(미적분Ⅱ)도 함께 확인합니다.",
        coreSubjects: ["물리학(일반)", "역학과 에너지", "미적분Ⅱ"],
        recommendedSubjects: ["전자기와 양자", "기하"],
      },
    ],
  },

  // ── 동국대학교 ─────────────────────────────────────────────────────────────
  {
    university: "동국대학교",
    majors: [
      {
        name: "AI융합대학 AI소프트웨어융합학부 인공지능전공",
        source: "동국대학교 2028학년도 전공 연계 교과 영역 가이드",
        evaluationStyle: "교과 영역 포괄적 제시형",
        evaluationNotice:
          "특정 과목(예: 미적분Ⅱ)을 강제하기보다, 수학 및 자연과학/공학 영역 전반에서 자신의 진로에 맞는 과목을 자기주도적으로 선택했는지 포괄적으로 평가합니다.",
        coreSubjects: ["수학 교과 영역 전반", "과학 교과 영역 전반"],
        recommendedSubjects: [
          "확률과 통계",
          "인공지능 수학",
          "정보 과학 관련 진로선택 과목",
        ],
      },
      {
        name: "공과대학 전기전자공학부",
        source: "동국대학교 2028학년도 전공 연계 교과 영역 가이드",
        evaluationStyle: "교과 영역 포괄적 제시형",
        evaluationNotice:
          "전기·전자 관련 과목 이수 이력보다, 수학과 물리 영역에서 자기주도적으로 심화 과목을 선택한 논리적 흐름을 종합적으로 평가합니다.",
        coreSubjects: ["수학 교과 영역 전반", "물리학(일반)"],
        recommendedSubjects: [
          "역학과 에너지",
          "전자기와 양자",
          "미적분Ⅱ 또는 기하 중 선택",
        ],
      },
    ],
  },
];
