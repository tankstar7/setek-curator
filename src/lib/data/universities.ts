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
// ── 경희대학교 ─────────────────────────────────────────────────────────────
  {
    university: "경희대학교",
    majors: [
      // --- 이과대학 (순수과학) ---
      {
        name: "이과대학 수학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (이수 학점 정량+정성 평가)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n수학과는 수학 전반의 심화 역량과 더불어 기하, 미적분Ⅱ의 핵심 이수를 강하게 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["물리학", "인공지능 수학", "실용 통계"]
      },
      {
        name: "이과대학 물리학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (물리/수학 역량 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n수학적 뼈대(미적분Ⅱ)와 함께 물리 일반 및 진로선택(역학, 전자기) 과목을 모두 핵심과목으로 지정하고 있습니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "역학과 에너지", "전자기와 양자", "확률과 통계"],
        recommendedSubjects: ["기하"]
      },
      {
        name: "이과대학 화학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (화학 심화 역량 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n화학 반응에 대한 깊이 있는 탐구가 필요하며, 물리(일반)와 화학 진로선택 과목을 가차 없이 '핵심과목'으로 지정하고 있습니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["기하", "역학과 에너지"]
      },
      {
        name: "이과대학 생물학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (화학/생명 융합 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n생명과학뿐만 아니라 화학 진로선택 과목까지 '핵심'으로 묶어 융합적 이해를 요구하며, 5개 대학 표준안에 따라 미적분Ⅱ, 확률과 통계 이수 역시 중요하게 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "세포와 물질대사", "생물의 유전", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["물리학"]
      },
      {
        name: "이과대학 지리학과 (자연)",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (다학제적 소양 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n지리학과지만 자연계열 선발의 경우, 지리 과목보다 오히려 화학 및 생명과학 진로선택 과목을 핵심과목으로 요구하는 독특한 기준을 가지고 있습니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물리학", "물질과 에너지", "화학 반응의 세계"]
      },
      {
        name: "이과대학 미래정보디스플레이학부",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (물리/전자 역량 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n디스플레이 소자 개발을 위해 물리학, 화학(일반)과 함께 역학과 에너지(물리) 이수 여부를 매우 중요하게 평가하는 특성화 학부입니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "역학과 에너지", "확률과 통계"],
        recommendedSubjects: ["기하", "전자기와 양자"]
      },
      
      // --- 의학계열 (의/치/한) ---
      {
        name: "의과대학 의예과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (선택형 3과목 룰 적용)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n최상위권 경쟁을 위해 수학/과학 이수 기준을 꽉 채워야 합니다. 미적분Ⅱ, 확률과 통계 기본 이수와 함께 화학·생명 진로선택 4과목 중 [3과목 이상]을 필수로 이수해야 합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "[물질/화학반응/세포/유전] 中 3과목 이상 필수"],
        recommendedSubjects: ["물리학"]
      },
      {
        name: "치과대학 치의예과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (생명/화학 융합 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n치과 재료 및 생명 현상 이해를 위해 생명과학 진로선택(세포, 유전)을 핵심과목으로 지정하고, 미적분Ⅱ와 확률과 통계 이수도 꼼꼼히 봅니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물리학", "물질과 에너지", "화학 반응의 세계"]
      },
      {
        name: "한의과대학 한의예과 (자연)",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (자연계열 기초 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n자연계열 한의예과 지원자는 미적분Ⅱ 수학적 기초와 함께 화학, 생명과학(일반) 및 생명과학 진로선택(세포, 유전) 과목 이수가 필수(핵심)입니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물리학", "물질과 에너지", "화학 반응의 세계"]
      },

      // --- 약학계열 ---
      {
        name: "약학대학 약학과 / 한약학과 / 약과학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (선택형 3과목 룰 적용)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n신약 개발 역량을 위해 미적분Ⅱ, 확률과 통계 이수와 함께 화학·생명 진로선택 4개 과목 중 [3개 이상] 이수를 강제(핵심과목)하고 있습니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "[물질/화학반응/세포/유전] 中 3과목 이상 필수"],
        recommendedSubjects: ["물리학"]
      },

      // --- 간호/생활과학 (이공 유관) ---
      {
        name: "간호과학대학 간호학과 (자연)",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "기초 과학 및 보건 통계 역량 중시형",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n인체 생명 현상의 이해와 보건의료 데이터 분석을 위해 생명과학과 확률과 통계 이수를 깐깐하게 확인합니다.",
        coreSubjects: ["확률과 통계", "미적분Ⅱ", "생명과학", "세포와 물질대사"],
        recommendedSubjects: ["화학", "생물의 유전", "실용 통계"]
      },
      {
        name: "생활과학대학 식품영양학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "화학/생명 기초 역량 중시형",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n식품 소재의 화학적 가공과 인체 대사 작용을 다루므로 미적분Ⅱ, 확률과 통계와 함께 화학, 생명과학 이수가 매우 유리합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "세포와 물질대사"],
        recommendedSubjects: ["물질과 에너지", "화학 반응의 세계"]
      },
      // --- (국제캠퍼스 데이터는 이 아래에 이어서 추가 예정) ---
      // --- 공과대학 (국제캠퍼스) ---
      {
        name: "공과대학 기계공학과 / 산업경영공학과 / 건축공학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (물리/수학 역량 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n4대 역학의 뼈대인 물리학(일반)과 역학과 에너지, 그리고 미적분Ⅱ, 기하 이수를 최우선 핵심으로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "확률과 통계"]
      },
      {
        name: "공과대학 화학공학과 / 신소재공학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (물리/화학 융합 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n화학 반응 및 소재 물성을 다루기 때문에 미적분Ⅱ 수학적 기초 위에 물리학(일반)과 화학(일반), 물질과 에너지를 핵심과목으로 묶어 융합적 이해를 봅니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계", "기하"]
      },
      {
        name: "공과대학 원자력공학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (물리/수학 역량 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n방사선 및 양자 역학 기초를 위해 미적분Ⅱ와 함께 물리학, 화학 기초, 그리고 전자기와 양자 이수 여부를 매우 중요하게 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["기하"]
      },
      {
        name: "공과대학 환경학및환경공학과 / 사회기반시스템공학과 / 건축학과(5년제)",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (융합 및 다학제적 소양)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n환경 및 인프라 구축을 위해 미적분Ⅱ 기초 위에 물리, 화학 등 다양한 과학 과목의 고른 이수를 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "역학과 에너지"],
        recommendedSubjects: ["기후변화와 환경생태(융합)", "생명과학", "확률과 통계"]
      },

      // --- 전자정보대학 & 소프트웨어융합대학 (국제캠퍼스) ---
      {
        name: "전자정보대학 전자공학과 / 반도체공학과 / 생체의공학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (물리/전자 역량 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n반도체 및 전자기기의 근간인 전자기학과 회로 이론의 이해를 위해 미적분Ⅱ, 기하, 그리고 물리 진로선택(역학, 전자기) 과목의 완벽한 이수를 핵심으로 박아두었습니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["확률과 통계", "화학"]
      },
      {
        name: "소프트웨어융합대학 컴퓨터공학과 / 인공지능학과 / 소프트웨어융합학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (수리/논리 역량 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\nSW/AI 알고리즘 설계의 뼈대가 되는 수학적 논리력을 검증하기 위해 미적분Ⅱ는 물론 확률과 통계, 기하 등 수학 교과 전반의 이수를 1순위 핵심으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)", "물리학"]
      },

      // --- 응용과학대학 (국제캠퍼스) ---
      {
        name: "응용과학대학 응용수학과 / 응용물리학과 / 우주과학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (물리/수학 심화 역량 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n순수 수리·물리를 바탕으로 한 응용/우주 탐구를 다루므로, 물리학 진로선택 전반의 압도적 성취와 수학적 기하 활용이 필수적입니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["확률과 통계", "행성우주과학"]
      },
      {
        name: "응용과학대학 응용화학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (화학 심화 역량 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n물질의 성질과 응용을 탐구하기 위해 물리(일반)를 기초로 화학 진로선택 과목의 심화 이수가 1순위 평가 요소입니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["기하", "역학과 에너지"]
      },

      // --- 생명과학대학 (국제캠퍼스) ---
      {
        name: "생명과학대학 유전생명공학과 / 식품생명공학과 / 융합바이오·신소재공학과 / 스마트팜과학과",
        source: "5개 대학 공동연구 및 경희대 2028학년도 전공 연계 교과이수 가이드 (최신 수정안)",
        evaluationStyle: "핵심/권장과목 지정형 (화학/생명 융합 중시)",
        evaluationNotice: "🚨 [경희대 2028 자연계열 공통 요건] '수학 18학점, 과학 20학점 이상' 이수가 필수이며, 지정된 핵심과목 미이수 시 서류평가에서 감점됩니다.\n\n농생명 및 바이오 융합 공정을 다루므로 미적분Ⅱ와 확률과 통계 등 수학적 기초 위에, 유전학과 세포 대사 관련 진로선택 과목을 강력히 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물질과 에너지", "화학 반응의 세계"]
      }
    ]
  },
  // ── 중앙대학교 ─────────────────────────────────────────────────────────────
  {
    university: "중앙대학교",
    majors: [
      // --- 자연과학대학 (수리·물리 계열) ---
      {
        name: "자연과학대학 수학과 / 물리학과",
        source: "5개 대학 공동연구 및 CAU 전공가이드북",
        evaluationStyle: "표준 핵심과목 지정형 (수리/물리 기초 역량 중시)",
        evaluationNotice: "중앙대학교는 5개 대학 공동연구 표준안을 엄격하게 준수합니다. 수학 및 물리학의 근본 원리 탐구를 위해 미적분Ⅱ, 기하를 필수로 요구하며, 물리 진로선택 과목의 심화 이수를 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "확률과 통계"]
      },

      // --- 자연과학대학 & 생명공학대학 (화학·생명·바이오 계열) ---
      {
        name: "자연과학대학 화학과 / 생명과학과 & 생명공학대학 시스템생명공학과",
        source: "5개 대학 공동연구 및 CAU 전공가이드북",
        evaluationStyle: "표준 핵심과목 지정형 (화학/생명 융합 중시)",
        evaluationNotice: "중앙대학교는 5개 대학 공동연구 표준안을 엄격하게 준수합니다. 물질의 구조와 생명 현상의 융합적 이해를 위해 미적분Ⅱ와 함께 화학, 생명과학 진로선택 과목의 이수를 핵심으로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "화학", "생명과학", "세포와 물질대사", "물질과 에너지"],
        recommendedSubjects: ["생물의 유전", "화학 반응의 세계", "확률과 통계"]
      },

      // --- 공과대학 (기계·모빌리티·에너지 계열) ---
      {
        name: "공과대학 기계공학부 / 에너지시스템공학부",
        source: "5개 대학 공동연구 및 CAU 전공가이드북",
        evaluationStyle: "표준 핵심과목 지정형 (역학/에너지 기초 중시)",
        evaluationNotice: "중앙대학교는 5개 대학 공동연구 표준안을 엄격하게 준수합니다. 4대 역학 및 에너지 공학의 뼈대인 물리학(일반)과 역학과 에너지, 그리고 미적분Ⅱ, 기하 이수를 최우선으로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "물질과 에너지"]
      },

      // --- 공과대학 (화학·신소재 계열) ---
      {
        name: "공과대학 화학신소재공학부",
        source: "5개 대학 공동연구 및 CAU 전공가이드북",
        evaluationStyle: "표준 핵심과목 지정형 (화학/물리 융합 중시)",
        evaluationNotice: "중앙대학교는 5개 대학 공동연구 표준안을 엄격하게 준수합니다. 화학 공정 및 신소재 물성을 다루기 때문에 미적분Ⅱ 수학적 기초 위에 물리학과 화학(물질과 에너지)을 핵심과목으로 묶어 융합적 이해를 봅니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계", "기하"]
      },

      // --- 공과대학 (건축·토목·도시·환경 계열) ---
      {
        name: "공과대학 사회기반시스템공학부 / 건축학부",
        source: "5개 대학 공동연구 및 CAU 전공가이드북",
        evaluationStyle: "표준 핵심과목 지정형 (다학제적 융합 소양 중시)",
        evaluationNotice: "중앙대학교는 5개 대학 공동연구 표준안을 엄격하게 준수합니다. 스마트 인프라와 도시/건축을 위해 미적분Ⅱ 기초 위에 물리학, 역학과 에너지를 요구하며, 통계적 분석력을 권장합니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "역학과 에너지"],
        recommendedSubjects: ["기하", "확률과 통계", "기후변화와 환경생태(융합)"]
      },

      // --- 창의ICT공과대학 (전기·전자·반도체 / 첨단 융합공학 계열) ---
      {
        name: "창의ICT공과대학 전자전기공학부 / 차세대반도체학과 / 융합공학부",
        source: "5개 대학 공동연구 및 CAU 전공가이드북",
        evaluationStyle: "표준 핵심과목 지정형 (첨단 하드웨어 역량 중시)",
        evaluationNotice: "중앙대학교는 5개 대학 공동연구 표준안을 엄격하게 준수합니다. 첨단 반도체 및 의료/나노 융합 시스템의 근간인 전자기학과 회로 이론의 이해를 위해 미적분Ⅱ, 기하, 물리 진로선택 과목의 완벽한 이수를 핵심으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["확률과 통계", "화학"]
      },

      // --- 소프트웨어대학 (컴퓨터·AI·데이터 계열) ---
      {
        name: "소프트웨어대학 소프트웨어학부 / AI학과",
        source: "5개 대학 공동연구 및 CAU 전공가이드북",
        evaluationStyle: "표준 핵심과목 지정형 (수리/논리 역량 중시)",
        evaluationNotice: "중앙대학교는 5개 대학 공동연구 표준안을 엄격하게 준수합니다. SW/AI 알고리즘 설계의 뼈대가 되는 수학적 논리력을 검증하기 위해 미적분Ⅱ와 확률과 통계 등 수학 교과 전반의 이수를 1순위 핵심으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)", "물리학"]
      },

      // --- 의과/약학 대학 (의약학 계열) ---
      {
        name: "의과대학 의학부 / 약학대학 약학부",
        source: "5개 대학 공동연구 및 CAU 전공가이드북",
        evaluationStyle: "표준 핵심과목 지정형 (최상위 생명/화학 역량 중시)",
        evaluationNotice: "중앙대학교는 5개 대학 공동연구 표준안을 엄격하게 준수합니다. 인체와 신약에 대한 깊이 있는 융합 탐구 역량을 확인하기 위해 미적분Ⅱ와 생명과학, 화학 진로선택 과목의 이수를 깐깐하게 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "세포와 물질대사"],
        recommendedSubjects: ["생물의 유전", "물질과 에너지", "화학 반응의 세계"]
      },

      // --- 간호대학 (보건·간호 계열) ---
      {
        name: "간호대학 간호학과 (자연)",
        source: "5개 대학 공동연구 및 CAU 전공가이드북",
        evaluationStyle: "표준 핵심과목 지정형 (생명 기초 및 통계 중시)",
        evaluationNotice: "중앙대학교는 5개 대학 공동연구 표준안을 엄격하게 준수합니다. 인체 생명 현상의 이해와 보건 통계 데이터 활용 역량을 중시하므로, 생명과학과 확률과 통계 이수를 꼼꼼히 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "생명과학"],
        recommendedSubjects: ["세포와 물질대사", "화학", "실용 통계(융합)"]
      },

      // --- 사범대학 (수리·과학 교육 계열) ---
      {
        name: "사범대학 수학교육과",
        source: "5개 대학 공동연구 및 CAU 전공가이드북",
        evaluationStyle: "표준 핵심과목 지정형 (수리 역량 중시)",
        evaluationNotice: "중앙대학교는 5개 대학 공동연구 표준안을 엄격하게 준수합니다. 수학교육과는 전공 특성상 미적분Ⅱ, 기하, 확률과 통계 등 수학 교과 전반의 압도적인 학업 성취도를 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "물리학"]
      },

      // --- 생명공학대학 (농생명·동물자원 / 식품·영양 계열 - 다빈치캠퍼스) ---
      {
        name: "생명공학대학 생명자원공학부 / 식품공학부",
        source: "5개 대학 공동연구 및 CAU 전공가이드북",
        evaluationStyle: "표준 핵심과목 지정형 (화학/생명 기초 역량 중시)",
        evaluationNotice: "중앙대학교는 5개 대학 공동연구 표준안을 엄격하게 준수합니다. 다빈치캠퍼스의 농생명 및 식품 융합 공정을 다루므로 미적분Ⅱ 수학적 기초 위에, 화학 및 생명과학 진로선택 과목을 강하게 권장합니다.",
        coreSubjects: ["미적분Ⅱ", "화학", "생명과학", "세포와 물질대사"],
        recommendedSubjects: ["물질과 에너지", "생물의 유전", "확률과 통계"]
      }
    ]
  },
  // ── 한국외국어대학교 ─────────────────────────────────────────────────────────────
  {
    university: "한국외국어대학교",
    majors: [
      // --- 자연과학대학 (수리·통계 계열) ---
      {
        name: "자연과학대학 수학과 / 통계학과",
        source: "5개 대학 공동연구 및 한국외대 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "표준 핵심과목 지정형 (수리/통계 기초 역량 중시)",
        evaluationNotice: "한국외대는 5개 대학 공동연구 표준안을 준수합니다. 글로벌 데이터 분석 및 금융/IT 융합의 기초가 되는 수학적 논리력을 검증하기 위해 미적분Ⅱ, 기하, 확률과 통계 이수와 성취도를 강력히 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)", "물리학"]
      },

      // --- 자연과학대학 & 공과대학 (물리·전자·통신 하드웨어 계열) ---
      {
        name: "자연과학대학 전자물리학과 & 공과대학 전자공학과 / 정보통신공학과",
        source: "5개 대학 공동연구 및 한국외대 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "표준 핵심과목 지정형 (물리/전자 기초 역량 중시)",
        evaluationNotice: "한국외대는 5개 대학 공동연구 표준안을 준수합니다. 반도체 및 차세대 통신망의 뼈대가 되는 전자기학과 회로 이론의 이해를 위해 미적분Ⅱ, 기하, 그리고 물리 진로선택(역학, 전자기) 과목의 완벽한 이수를 핵심으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["확률과 통계", "화학"]
      },

      // --- 자연과학대학 & 공과대학 (화학·생명·환경 및 바이오메디컬 계열) ---
      {
        name: "자연과학대학 화학과 / 생명과학과 / 환경학과 & 바이오메디컬공학부",
        source: "5개 대학 공동연구 및 한국외대 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "표준 핵심과목 지정형 (화학/생명 융합 중시)",
        evaluationNotice: "한국외대는 5개 대학 공동연구 표준안을 준수합니다. 글로벌 기후 위기 극복 및 첨단 바이오 헬스케어 융합을 다루기 위해 미적분Ⅱ 수학적 기초 위에 화학, 생명과학 진로선택 과목을 강력히 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "화학", "생명과학", "물질과 에너지", "세포와 물질대사"],
        recommendedSubjects: ["생물의 유전", "화학 반응의 세계", "기후변화와 환경생태(융합)"]
      },

      // --- 공과대학 & AI융합대학 (컴퓨터·AI·산업경영 계열) ---
      {
        name: "공과대학 컴퓨터공학부 / 산업경영공학과 & AI융합대학 (AI데이터융합학부 등)",
        source: "5개 대학 공동연구 및 한국외대 2028학년도 전공 연계 교과이수 가이드",
        evaluationStyle: "표준 핵심과목 지정형 (글로벌 SW/데이터 역량 중시)",
        evaluationNotice: "한국외대는 5개 대학 공동연구 표준안을 준수합니다. 어문학과 AI 기술을 융합하는 외대만의 특성을 살리기 위해, 알고리즘과 데이터 분석의 뼈대인 수학 교과 전반(미적분Ⅱ, 기하, 확률과 통계)의 압도적 성취를 1순위로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)", "정보 과학 관련 진로선택"]
      }
    ]
  },
  // ── 아주대학교 ─────────────────────────────────────────────────────────────
  {
    university: "아주대학교",
    majors: [
      // --- 공과대학 (기계·건설 등 역학 기반 계열) ---
      {
        name: "공과대학 기계공학과 / 건설시스템공학과 / 교통시스템공학과 / 건축학과",
        source: "아주대학교 핵심 이수 권장 과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (전통 역학/수리 역량 중시)",
        evaluationNotice: "아주대 공과대학은 전통적으로 기초 학업 역량을 매우 중시합니다. 4대 역학 및 구조 해석의 뼈대인 물리학(일반)과 역학과 에너지, 그리고 미적분Ⅱ, 기하 이수를 최우선 핵심으로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "확률과 통계"]
      },

      // --- 공과대학 (화학·신소재 계열) ---
      {
        name: "공과대학 화학공학과 / 첨단신소재공학과",
        source: "아주대학교 핵심 이수 권장 과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (화학/물리 융합 중시)",
        evaluationNotice: "첨단 소재 및 화학 공정을 다루기 때문에 미적분Ⅱ 기초 위에, 물성을 이해하기 위한 물리학과 화학(물질과 에너지)을 핵심과목으로 지정하여 융합적 이해도를 깐깐하게 봅니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계", "전자기와 양자"]
      },

      // --- 공과대학 (화학·생명 융합 계열) ---
      {
        name: "공과대학 응용화학생명공학과 / 환경안전공학과",
        source: "아주대학교 핵심 이수 권장 과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (화학/생명 융합 중시)",
        evaluationNotice: "바이오 공정 및 환경 안전을 다루므로, 수학적 역량(미적분Ⅱ)을 바탕으로 화학과 생명과학 진로선택 과목의 융합적 이수와 실험 탐구 역량을 강하게 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "화학", "생명과학", "물질과 에너지", "세포와 물질대사"],
        recommendedSubjects: ["생물의 유전", "기후변화와 환경생태(융합)"]
      },

      // --- 공과대학 (산업공학 계열) ---
      {
        name: "공과대학 산업공학과",
        source: "아주대학교 핵심 이수 권장 과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (수리/데이터 통계 역량 중시)",
        evaluationNotice: "시스템 최적화와 데이터 분석이 핵심이므로, 미적분Ⅱ뿐만 아니라 확률과 통계의 완벽한 이수와 수학적 모델링 역량이 당락을 좌우합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["실용 통계(융합)", "인공지능 수학(융합)"]
      },

      // --- 정보통신/첨단 계열 (전자·반도체·모빌리티) ---
      {
        name: "정보통신대학 전자공학과 & 지능형반도체공학과 / 미래모빌리티공학과",
        source: "아주대학교 핵심 이수 권장 과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (첨단 전자/물리 역량 중시)",
        evaluationNotice: "아주대의 간판 첨단 학과들로, 차세대 전자기기 및 모빌리티의 근간인 전자기학과 회로 이론의 이해를 위해 물리 진로선택(역학, 전자기) 과목의 최상위권 성취도를 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학(융합)"]
      },

      // --- 소프트웨어융합대학 ---
      {
        name: "소프트웨어융합대학 소프트웨어학과 / 사이버보안학과 / 국방디지털융합학과 / 인공지능융합학과",
        source: "아주대학교 핵심 이수 권장 과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (수리/논리 알고리즘 중시)",
        evaluationNotice: "아주대가 집중 육성하는 SW/AI 학과들입니다. 실무 코딩 경험보다 알고리즘 설계의 뼈대가 되는 수학 교과 전반(미적분Ⅱ, 기하, 확률과 통계)의 압도적 성취를 1순위 핵심으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)", "물리학"]
      },

      // --- 자연과학대학 ---
      {
        name: "자연과학대학 수학과 / 물리학과 / 화학과 / 생명과학과",
        source: "아주대학교 핵심 이수 권장 과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (순수 기초 과학 역량 중시)",
        evaluationNotice: "순수 학문의 근본 원리 탐구를 위해 미적분Ⅱ를 필수로 요구하며, 지원 전공에 맞는 물리/화학/생명과학 일반 및 진로선택 과목의 심도 깊은 이수를 철저히 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "지원 전공 관련 과학 일반선택", "지원 전공 관련 과학 진로선택"],
        recommendedSubjects: ["기하", "확률과 통계"]
      },

      // --- 의과/약학/간호 대학 ---
      {
        name: "의과대학 의학과 / 약학대학 약학과",
        source: "아주대학교 핵심 이수 권장 과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (최상위 생명/화학 역량 중시)",
        evaluationNotice: "최상위권 경쟁을 위해 수학/과학 이수 기준을 꽉 채워야 합니다. 미적분Ⅱ, 확률과 통계 기본 이수와 함께 화학·생명 진로선택 과목의 깊이 있는 융합 탐구를 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "세포와 물질대사", "물질과 에너지"],
        recommendedSubjects: ["생물의 유전", "화학 반응의 세계"]
      },
      {
        name: "간호대학 간호학과",
        source: "아주대학교 핵심 이수 권장 과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (생명 기초 및 통계 중시)",
        evaluationNotice: "임상 간호와 보건 통계 데이터 활용 역량을 중시하므로, 생명과학(일반/진로) 이수와 확률과 통계 이수를 꼼꼼히 확인합니다.",
        coreSubjects: ["확률과 통계", "생명과학", "세포와 물질대사"],
        recommendedSubjects: ["미적분Ⅱ 또는 기하 택1", "화학"]
      }
    ]
  },
  // ── 인하대학교 ─────────────────────────────────────────────────────────────
  {
    university: "인하대학교",
    majors: [
      // --- 공과대학 (전통 역학 중심 - 100% 일치 그룹) ---
      {
        name: "공과대학 기계공학과 / 항공우주공학과 / 조선해양공학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (절대적 물리 역량 중시)",
        evaluationNotice: "인하대 전통의 간판 학과들입니다. 중후장대 산업의 뼈대가 되는 4대 역학의 완벽한 이해를 위해 미적분Ⅱ, 기하와 함께 물리학 및 역학과 에너지 이수를 절대적인 핵심 기준으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "확률과 통계"]
      },
      
      // --- 공과대학 (전기·전자 - 통합학부) ---
      {
        name: "공과대학 전기전자공학부",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (첨단 전자/물리 역량 중시)",
        evaluationNotice: "통합된 전기전자공학부로, 반도체 및 통신망 설계의 근간인 전자기학과 회로 이론의 이해를 위해 수학적 역량(미적분Ⅱ, 기하)과 물리 진로선택(역학, 전자기) 과목의 최상위권 성취도를 강하게 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["확률과 통계", "인공지능 수학(융합)"]
      },

      // --- 공과대학 (화학·소재 중심 - 100% 일치 그룹) ---
      {
        name: "공과대학 화학공학과 / 고분자공학과 / 신소재공학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (화학/물리 융합 중시)",
        evaluationNotice: "첨단 신소재 및 화학 공정을 다루기 위해 미적분Ⅱ 기초 위에 물리학과 화학(물질과 에너지) 과목을 핵심으로 지정하여 융합적 성취도를 깐깐하게 봅니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계"]
      },

      // --- 공과대학 (지구과학 융합 특화 - 100% 일치 그룹) ---
      {
        name: "공과대학 사회인프라공학과 / 공간정보공학과 / 에너지자원공학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (물리/지구과학 융합 특화)",
        evaluationNotice: "인프라 구축과 공간, 자원 탐구를 다루는 인하대만의 특화 학과입니다. 타 대학과 달리 물리 역량뿐만 아니라 지구과학(지구시스템과학) 이수를 핵심으로 매우 긍정적으로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "역학과 에너지", "지구시스템과학"],
        recommendedSubjects: ["기하", "기후변화와 환경생태(융합)"]
      },

      // --- 공과대학 (단독 특성 학과들) ---
      {
        name: "공과대학 환경공학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (화학/지구과학 융합 중시)",
        evaluationNotice: "환경 오염 분석 및 생태계 보전을 위해 물리학보다는 화학과 생명과학, 그리고 지구시스템과학의 융합적 이수와 탐구 역량을 중점적으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "화학", "생명과학", "지구시스템과학"],
        recommendedSubjects: ["물질과 에너지", "기후변화와 환경생태(융합)"]
      },
      {
        name: "공과대학 건축학부 (건축공학/건축학)",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (물리/공간 지각력 중시)",
        evaluationNotice: "구조 해석과 공간 설계를 위해 기하학적 감각과 물리(역학과 에너지) 과목 이수가 필수적입니다. 지구과학보다는 물리/수학의 비중이 더 높습니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지"],
        recommendedSubjects: ["확률과 통계", "기후변화와 환경생태(융합)"]
      },
      {
        name: "공과대학 산업경영공학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (수리/통계 데이터 역량 중시)",
        evaluationNotice: "생산 시스템 최적화를 다루므로 물리보다는 수학 교과 전반, 특히 확률과 통계의 완벽한 이수와 수학적 모델링 역량이 당락을 좌우합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["실용 통계(융합)", "인공지능 수학(융합)"]
      },

      // --- 공과대학 (신설 첨단학과) ---
      {
        name: "공과대학 반도체시스템공학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (첨단 반도체 역량 중시)",
        evaluationNotice: "반도체 소자 설계의 뼈대인 물리(전자기학)와 화학(물질) 심화 과목의 최고 수준 성취를 요구하는 신설 첨단학과입니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "전자기와 양자", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계"]
      },
      {
        name: "공과대학 이차전지융합학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (첨단 배터리/화학 역량 중시)",
        evaluationNotice: "배터리 소재 및 공정을 선도하는 신설 학과로, 물리학 기초 위에 화학 반응 및 물질화학의 압도적인 융합 성취를 봅니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["전자기와 양자", "역학과 에너지"]
      },

      // --- 바이오시스템융합학부 (세부 특성별 분리) ---
      {
        name: "바이오시스템융합학부 생명공학과 / 바이오제약공학과 / 첨단바이오의약학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (생명/화학 공학 역량 중시)",
        evaluationNotice: "바이오 의약품의 대량 생산 및 공정을 다루므로, 생명과학 심화(세포와 물질대사)와 함께 수학(미적분Ⅱ) 및 화학의 탄탄한 공학적 기초를 강하게 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "화학", "생명과학", "세포와 물질대사"],
        recommendedSubjects: ["물질과 에너지", "화학 반응의 세계", "생물의 유전"]
      },
      {
        name: "바이오시스템융합학부 생명과학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (순수 생명 탐구 역량 중시)",
        evaluationNotice: "생명 현상의 근본적 탐구를 위해 미적분Ⅱ보다는 생명과학 진로선택(세포, 유전) 과목의 전면적인 이수와 심도 있는 기초 실험 세특을 최우선으로 봅니다.",
        coreSubjects: ["확률과 통계", "화학", "생명과학", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["미적분Ⅱ", "물질과 에너지"]
      },
      {
        name: "바이오시스템융합학부 바이오식품공학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (식품/화학 융합 역량 중시)",
        evaluationNotice: "식품 소재의 화학적 가공 및 인체 대사를 다루므로 화학 진로선택(물질과 에너지)과 생명과학 기초의 융합적 이수가 핵심입니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "물질과 에너지"],
        recommendedSubjects: ["세포와 물질대사", "화학 반응의 세계"]
      },

      // --- 소프트웨어융합대학 (SW 특성별 분리) ---
      {
        name: "소프트웨어융합대학 컴퓨터공학과 / 인공지능공학과 / 데이터사이언스학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (수리/논리 및 데이터 역량 중시)",
        evaluationNotice: "물리/화학적 지식보다는 알고리즘과 AI 데이터 처리의 뼈대인 수학 교과 전반(미적분Ⅱ, 기하, 확률과 통계)의 압도적 성취를 1순위 핵심으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)"]
      },
      {
        name: "소프트웨어융합대학 스마트모빌리티공학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (SW/물리 융합 역량 중시)",
        evaluationNotice: "자율주행 및 미래차 제어를 다루므로 순수 SW 학과들과 달리, 수학적 논리력과 함께 동역학의 기초인 물리(역학과 에너지) 이수를 핵심으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계", "물리학", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "인공지능 수학(융합)"]
      },
      {
        name: "소프트웨어융합대학 디자인테크놀로지학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (다학제적 융합 및 수리 역량 중시)",
        evaluationNotice: "단순 디자인이 아닌 UX/UI 데이터 분석과 공학 기반 설계를 위해 확률과 통계, 미적분Ⅱ 등 수학적 분석 역량을 필수로 확인합니다.",
        coreSubjects: ["확률과 통계", "미적분Ⅱ"],
        recommendedSubjects: ["기하", "융합과학 탐구(융합)"]
      },

      // --- 자연과학대학 (전공별 완전 분리) ---
      {
        name: "자연과학대학 수학과 / 통계학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (순수 수리/통계 역량 중시)",
        evaluationNotice: "해석학과 대수학, 데이터 통계의 기초가 되는 수학 교과 전반의 압도적인 학업 성취도와 기하/미적분/확률과 통계 이수 여부를 깐깐하게 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)"]
      },
      {
        name: "자연과학대학 물리학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (순수 물리 역량 중시)",
        evaluationNotice: "물리 법칙의 근원적 이해를 위해 역학, 전자기학 등 물리 진로선택 전반의 압도적 성취와 수학적(기하/미적분) 기호 활용이 필수적입니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["확률과 통계", "물질과 에너지"]
      },
      {
        name: "자연과학대학 화학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (순수 화학 역량 중시)",
        evaluationNotice: "물질의 구조와 반응 메커니즘을 다루므로 화학 진로선택 과목의 심도 있는 전면 이수와 실험 세특 탐구의 깊이가 매우 중요합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "화학", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["역학과 에너지", "세포와 물질대사"]
      },
      {
        name: "자연과학대학 해양과학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (해양 물리/지구과학 융합 특화)",
        evaluationNotice: "해양 생태 및 물리 탐구를 위해 타 대학과 달리 물리학(일반)과 지구과학(지구시스템과학)의 융합 이수 경험을 매우 중요하게 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "지구시스템과학"],
        recommendedSubjects: ["역학과 에너지", "화학", "기후변화와 환경생태(융합)"]
      },
      {
        name: "자연과학대학 식품영양학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (생명/화학 기초 역량 중시)",
        evaluationNotice: "인체 대사 작용과 영양학적 분석을 위해 확률과 통계를 기본으로 화학, 생명과학 일반 선택 과목 이수를 필수로 확인합니다.",
        coreSubjects: ["확률과 통계", "화학", "생명과학"],
        recommendedSubjects: ["세포와 물질대사", "물질과 에너지"]
      },

      // --- 의과대학 / 간호대학 ---
      {
        name: "의과대학 의예과 (의학과)",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (최상위 생명/화학 역량 중시)",
        evaluationNotice: "임상 연구 역량을 평가하기 위해 미적분Ⅱ, 확률과 통계 수학적 기본기와 함께 화학·생명 진로선택 전반의 탄탄한 이수와 심도 있는 세특 탐구를 깐깐하게 봅니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물질과 에너지", "화학 반응의 세계", "물리학"]
      },
      {
        name: "간호대학 간호학과",
        source: "인하대학교 전공 연계 교과이수 권장 과목 안내",
        evaluationStyle: "자체 핵심과목 지정형 (생명 기초 및 보건 통계 중시)",
        evaluationNotice: "인체 생명 현상의 이해와 보건 통계 데이터 활용 역량을 중시하므로, 확률과 통계와 생명과학 진로선택 과목 이수를 가장 꼼꼼히 확인합니다.",
        coreSubjects: ["확률과 통계", "생명과학", "세포와 물질대사"],
        recommendedSubjects: ["미적분Ⅱ", "생물의 유전", "화학"]
      }
    ]
  },
  // ── 서울시립대학교 ─────────────────────────────────────────────────────────────
  {
    university: "서울시립대학교",
    majors: [
      // --- 도시과학대학 (도시 인프라/공간 - 실용 통계 & 지구과학 우대 그룹) ---
      {
        name: "도시과학대학 도시공학과 / 교통공학과 / 공간정보공학과",
        source: "서울시립대 학생부종합전형 가이드 및 모집단위별 인재상",
        evaluationStyle: "자체 핵심과목 지정형 (공공성 및 실용 통계 중시)",
        evaluationNotice: "시립대의 핵심 철학인 '도시/교통 문제 해결'을 위해 미적분Ⅱ는 물론 확률과 통계 등 실용적인 데이터 분석 역량을 필수로 봅니다. 물리 역량과 함께 지구시스템과학 이수 등 공공성 기반의 융합 탐구를 강력히 우대합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "물리학", "지구시스템과학"],
        recommendedSubjects: ["기하", "역학과 에너지", "실용 통계(융합)"]
      },

      // --- 도시과학대학 (환경/건축/조경 - 기후/생태 융합 그룹) ---
      {
        name: "도시과학대학 환경공학부 / 건축학부(건축공학, 건축학) / 조경학과",
        source: "서울시립대 학생부종합전형 가이드 및 모집단위별 인재상",
        evaluationStyle: "자체 핵심과목 지정형 (다학제적 융합 및 환경/공간 중시)",
        evaluationNotice: "공공성을 띤 도시 환경 개선과 공간 설계를 다루므로, 역학(물리)적 기초뿐만 아니라 기후/생태 분야에 대한 다학제적 접근을 중시합니다. 환경 데이터 해석을 위한 통계적 역량도 꼼꼼히 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "물리학", "화학", "역학과 에너지"],
        recommendedSubjects: ["기후변화와 환경생태(융합)", "생명과학", "지구시스템과학"]
      },

      // --- 공과대학 (전자/컴퓨터 - 데이터 알고리즘 우대 그룹) ---
      {
        name: "공과대학 전자전기컴퓨터공학부 / 컴퓨터과학부",
        source: "서울시립대 학생부종합전형 가이드 및 모집단위별 인재상",
        evaluationStyle: "자체 핵심과목 지정형 (데이터 분석 및 논리력 중시)",
        evaluationNotice: "시스템 최적화와 실용적 데이터 처리를 선호하는 시립대 학풍에 따라, 코딩 경험보다 알고리즘과 회로의 뼈대가 되는 수학 교과 전반(미적분Ⅱ, 기하, 확률과 통계)의 압도적 성취를 1순위로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계", "물리학", "전자기와 양자"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)"]
      },

      // --- 공과대학 (전통 공학/소재/화학 그룹) ---
      {
        name: "공과대학 기계정보공학과 / 신소재공학과 / 화학공학과 / 토목공학과",
        source: "서울시립대 학생부종합전형 가이드 및 모집단위별 인재상",
        evaluationStyle: "자체 핵심과목 지정형 (실용 공학 기초 역량 중시)",
        evaluationNotice: "실생활에 적용 가능한 공학 기술을 중시하며, 4대 역학과 물질 화학의 근간이 되는 물리학 및 역학과 에너지, 화학 진로선택 과목의 탄탄한 이수를 깐깐하게 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지", "화학", "물질과 에너지"],
        recommendedSubjects: ["확률과 통계", "화학 반응의 세계"]
      },

      // --- 자연과학대학 (수리/통계 데이터 중심) ---
      {
        name: "자연과학대학 수학과 / 통계학과",
        source: "서울시립대 학생부종합전형 가이드 및 모집단위별 인재상",
        evaluationStyle: "자체 핵심과목 지정형 (실용 데이터 분석력 중시)",
        evaluationNotice: "빅데이터를 다루는 실용 통계 역량을 매우 높게 평가합니다. 수학적 추론 능력을 보여주는 미적분Ⅱ, 기하와 더불어 확률과 통계, 실용 통계 이수 여부가 당락을 크게 좌우합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["실용 통계(융합)", "인공지능 수학(융합)", "물리학"]
      },

      // --- 자연과학대학 (기초 과학 및 융합 응용 중심) ---
      {
        name: "자연과학대학 물리학과 / 생명과학과 / 융합응용화학과 / 환경원예학과",
        source: "서울시립대 학생부종합전형 가이드 및 모집단위별 인재상",
        evaluationStyle: "자체 핵심과목 지정형 (기초 과학 기반 융합 중시)",
        evaluationNotice: "기초 과학 원리를 바탕으로 한 융합/응용을 지향합니다. 지원 전공과 관련된 과학 일반 및 진로선택 과목의 심화 이수와 더불어, 환경/생태 등 현실 문제에 적용해보는 탐구 세특을 긍정적으로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "지원 전공 관련 과학 일반선택", "지원 전공 관련 과학 진로선택"],
        recommendedSubjects: ["확률과 통계", "기후변화와 환경생태(융합)"]
      },

      // --- 인공지능융합대학 & 첨단융합학부 (AI/데이터 중심) ---
      {
        name: "인공지능융합대학 인공지능학과 & 첨단융합학부 첨단인공지능전공",
        source: "서울시립대 학생부종합전형 가이드 및 모집단위별 인재상",
        evaluationStyle: "자체 핵심과목 지정형 (AI 융합 및 실용 통계 중시)",
        evaluationNotice: "신설 첨단 학부로 '융합'과 '실용 데이터 분석'이 핵심입니다. AI 알고리즘의 기초가 되는 확률과 통계, 인공지능 수학 등 논리적 수학 교과의 완벽한 이수와 다학제적 탐구를 최우선으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)", "물리학"]
      },

      // --- 첨단융합학부 (반도체/바이오헬스 융합) ---
      {
        name: "첨단융합학부 지능형반도체전공 / 융합바이오헬스전공",
        source: "서울시립대 학생부종합전형 가이드 및 모집단위별 인재상",
        evaluationStyle: "자체 핵심과목 지정형 (첨단 기술의 산업/의료 융합 중시)",
        evaluationNotice: "특정 한 과목만 깊게 파기보다 물리/화학/생명과학 중 지원 분야에 맞는 2개 이상의 진로선택을 폭넓게 이수해야 합니다. 기술을 의료 및 산업에 적용하는 융합적 시각과 통계적 분석력을 강하게 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "지원 전공 관련 과학 진로선택 2개 이상 필수"],
        recommendedSubjects: ["기하", "생물의 유전(바이오 권장)", "전자기와 양자(반도체 권장)"]
      }
    ]
  },
  // ── 부산대학교 ─────────────────────────────────────────────────────────────
  {
    university: "부산대학교",
    majors: [
      // --- 공과대학 (전통 역학 중심 - 물리 강제 그룹) ---
      {
        name: "공과대학 기계공학부 / 항공우주공학과 / 조선해양공학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (절대적 물리/수리 역량 중시)",
        evaluationNotice: "동남권 중공업 및 항공/조선 산업의 핵심 인재를 양성하는 부산대의 간판입니다. 부산대 입학처는 이 계열에 대해 미적분Ⅱ와 물리학을 '필수 핵심과목'으로 못 박고 있으며, 기하와 물리 진로선택(역학과 에너지) 이수를 강력하게 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "확률과 통계"]
      },

      // --- 공과대학 (전기·전자·반도체 최신 통합학부) ---
      {
        name: "공과대학 전기전자공학부 (전자공학전공 / 전기공학전공 / 반도체공학전공)",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (수리 논리 및 전자기학 기초 중시)",
        evaluationNotice: "최근 전기전자와 반도체가 통합된 거대 학부입니다. 회로 설계와 반도체 소자의 뼈대인 물리학(전자기와 양자)과 수학적 논리력 검증을 위한 미적분Ⅱ, 기하의 압도적 성취를 1순위 핵심으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계"]
      },

      // --- 공과대학 (화학·소재 융합 - 물리/화학 동시 강제 그룹) ---
      {
        name: "공과대학 화공생명공학과 / 재료공학부 / 고분자공학과 / 유기소재시스템공학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (물리/화학 융합 역량 강제)",
        evaluationNotice: "부산대 화학/소재 계열의 가장 큰 특징은 타 대학과 달리 '미적분Ⅱ, 물리학, 화학' 세 과목 모두를 핵심 권장과목으로 강제한다는 점입니다. 물리와 화학 중 어느 하나라도 편식하면 합격에 매우 불리합니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계", "세포와 물질대사"]
      },

      // --- 공과대학 (인프라/공간 - 구조 역학 중심) ---
      {
        name: "공과대학 사회기반시스템공학과 / 건축공학과 / 건축학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (공간/구조 역학 중시)",
        evaluationNotice: "인프라와 건축물의 구조 해석을 위해 미적분Ⅱ, 기하 수학적 감각과 물리학(역학과 에너지) 이수를 핵심으로 봅니다. 지구과학보다 물리/수학의 비중이 더 높습니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지"],
        recommendedSubjects: ["확률과 통계", "기후변화와 환경생태(융합)"]
      },

      // --- 공과대학 (도시/산업 - 데이터 통계 중심) ---
      {
        name: "공과대학 도시공학과 / 산업공학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (수리/통계 데이터 역량 중시)",
        evaluationNotice: "도시 시스템과 산업 공정의 최적화를 다루므로 물리보다는 수학 교과 전반, 특히 확률과 통계의 완벽한 이수와 실용적인 데이터 분석 역량이 당락을 좌우합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계"],
        recommendedSubjects: ["기하", "실용 통계(융합)", "물리학"]
      },

      // --- 공과대학 (환경공학 단독) ---
      {
        name: "공과대학 환경공학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 권장과목 지정형 (화학/지구과학/생명 융합 중시)",
        evaluationNotice: "환경 오염 분석 및 수질/대기 관리를 위해 공대 소속임에도 물리보다는 화학, 생명과학, 그리고 지구시스템과학의 융합적 이수와 탐구 역량을 중점적으로 봅니다.",
        coreSubjects: ["화학", "생명과학", "지구시스템과학"],
        recommendedSubjects: ["미적분Ⅱ", "물질과 에너지", "기후변화와 환경생태(융합)"]
      },

      // --- 정보의생명공학대학 & 생명자원과학대학 (IT/컴퓨터 알고리즘 그룹) ---
      {
        name: "정보의생명공학대학 정보컴퓨터공학부 & 생명자원과학대학 IT응용공학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (수리/논리 알고리즘 중시)",
        evaluationNotice: "소프트웨어와 IT 융합 알고리즘 설계의 뼈대가 되는 수학 교과 전반(미적분Ⅱ, 기하, 확률과 통계)의 압도적 성취를 1순위 핵심으로 보며, 논리적 문제 해결 과정을 깐깐하게 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)", "물리학"]
      },

      // --- 정보의생명공학 & 자연과학 & 생명자원과학 (순수/응용 바이오 그룹) ---
      {
        name: "정보의생명공학대학 의생명융합공학부 & 자연과학대학 생명과학과 / 미생물학과 / 분자생물학과 & 생명자원과학대학 바이오소재과학과 / 생명환경화학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (화학/생명 심화 탐구 중시)",
        evaluationNotice: "생명 현상의 근본적 탐구부터 바이오 신소재 개발까지 다루는 그룹입니다. 부산대 공식 가이드상 화학과 생명과학 전면 이수 및 진로선택(세포, 유전, 물질)의 심도 깊은 탐구를 최우선으로 봅니다.",
        coreSubjects: ["화학", "생명과학", "세포와 물질대사", "물질과 에너지"],
        recommendedSubjects: ["생물의 유전", "미적분Ⅱ", "확률과 통계"]
      },

      // --- 자연과학대학 (수학/통계) ---
      {
        name: "자연과학대학 수학과 / 통계학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (순수 수리/통계 역량 중시)",
        evaluationNotice: "해석학, 대수학 및 빅데이터 통계의 기초가 되는 수학 교과 전반의 압도적인 학업 성취도를 요구하며, 기하와 확률과 통계 이수 여부를 깐깐하게 확인합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)"]
      },

      // --- 자연과학대학 (물리/화학 완전 분리) ---
      {
        name: "자연과학대학 물리학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (순수 물리 역량 중시)",
        evaluationNotice: "물리 법칙의 근원적 이해를 위해 역학, 전자기학 등 물리 진로선택 전반의 압도적 성취와 수학적 기호(미적분Ⅱ, 기하) 활용이 필수적입니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["확률과 통계", "화학"]
      },
      {
        name: "자연과학대학 화학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (순수 화학 역량 중시)",
        evaluationNotice: "화학 반응 메커니즘을 다루므로 화학 진로선택(물질과 에너지, 화학 반응의 세계) 과목의 전면 이수와 정교한 실험 세특 탐구가 매우 중요합니다.",
        coreSubjects: ["미적분Ⅱ", "화학", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["기하", "물리학", "역학과 에너지"]
      },

      // --- 자연과학대학 (해양/지구 특화 그룹) ---
      {
        name: "자연과학대학 지질환경과학과 / 대기환경과학과 / 해양학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 권장과목 지정형 (지구과학/물리 융합 특화)",
        evaluationNotice: "해양수도 부산의 지리적 특성을 강력하게 살린 특화 학과입니다. 미적분Ⅱ를 바탕으로 타 대학에서 흔치 않은 지구과학(지구시스템과학) 및 물리학의 융합 이수 경험을 입학처에서 강력히 권장합니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "지구시스템과학"],
        recommendedSubjects: ["역학과 에너지", "기후변화와 환경생태(융합)", "화학"]
      },

      // --- 나노과학기술대학 (물리/나노 융합 그룹) ---
      {
        name: "나노과학기술대학 나노에너지공학과 / 나노메카트로닉스공학과 / 광메카트로닉스공학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (나노/물리 융합 역량 중시)",
        evaluationNotice: "밀양캠퍼스의 핵심 특화 단과대학입니다. 미세 나노 소자 및 광학 기기를 다루기 때문에 미적분Ⅱ, 기하와 함께 물리학(특히 전자기와 양자, 역학과 에너지)의 압도적인 성취를 강하게 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "전자기와 양자", "역학과 에너지"],
        recommendedSubjects: ["화학", "물질과 에너지"]
      },

      // --- 생명자원과학대학 (농생명/식물/동물 융합 그룹) ---
      {
        name: "생명자원과학대학 식물생명과학과 / 원예생명과학과 / 동물생명자원과학과 / 바이오환경에너지학과 / 조경학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (생명/지구/환경 융합 중시)",
        evaluationNotice: "스마트팜 및 동식물 자원을 다루는 특화 학과입니다. 생명과학 기초 이수와 함께 기후 변화, 토양/환경 분석을 위한 화학 및 지구과학(지구시스템과학) 관련 융합 탐구 역량을 매우 긍정적으로 평가합니다.",
        coreSubjects: ["생명과학", "화학", "지구시스템과학"],
        recommendedSubjects: ["확률과 통계", "생물의 유전", "기후변화와 환경생태(융합)"]
      },
      
      // --- 생명자원과학대학 (기계 공학 기반 농생명) ---
      {
        name: "생명자원과학대학 바이오산업기계공학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (물리/기계 공학 역량 중시)",
        evaluationNotice: "농생명 분야에 접목될 자율주행 및 로봇 기계 설계를 다룹니다. 따라서 바이오 계열임에도 불구하고 미적분Ⅱ와 물리학(역학과 에너지) 이수를 최우선 핵심으로 요구하는 독특한 학과입니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "역학과 에너지"],
        recommendedSubjects: ["기하", "생명과학", "확률과 통계"]
      },

      // --- 생활과학대학 & 생명자원과학대학 (식품/영양 융합 그룹) ---
      {
        name: "생활과학대학 식품영양학과 & 생명자원과학대학 식품공학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (식품/화학 및 통계 중시)",
        evaluationNotice: "식품 소재의 화학적 가공과 영양학적/대사적 분석을 위해 확률과 통계를 기본으로 화학, 생명과학 일반 및 진로선택 과목 이수를 필수로 확인합니다.",
        coreSubjects: ["확률과 통계", "화학", "생명과학"],
        recommendedSubjects: ["세포와 물질대사", "물질과 에너지"]
      },

      // --- 사범대학 (과학교육/수학교육 완전 분리 및 전공 일치도 최우선) ---
      {
        name: "사범대학 수학교육과 / 물리교육과 / 화학교육과 / 생물교육과 / 지구과학교육과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (전공 과목 절대 이수 원칙)",
        evaluationNotice: "교원 양성 목적상 타협이 없습니다. 수학교육은 수학 전 교과, 과학교육은 지원하는 전공의 기초(일반)부터 심화(진로선택) 과목까지 학교에 개설된 해당 과목을 100% 이수하는 것을 대전제로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "해당 전공 관련 기초(일반선택) 과목 전면 이수", "해당 전공 관련 심화(진로선택) 과목 전면 이수"],
        recommendedSubjects: ["기하(수학교육 필수)", "확률과 통계"]
      },

      // --- 의과/치과/한의학/약학/간호 (최상위 의약학 계열) ---
      {
        name: "의과대학 의예과 / 치의학전문대학원 / 한의학전문대학원 / 약학대학 약학부",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (최상위 생명/화학 및 수학 역량 중시)",
        evaluationNotice: "부울경 지역 최상위권의 치열한 각축장입니다. 입학사정관들은 미적분Ⅱ, 확률과 통계의 완벽한 성취는 물론, 화학과 생명과학 진로선택 과목 전반(세포, 유전, 물질 등)의 깊이 있는 이수와 융합 탐구 역량을 매우 깐깐하게 검증합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물질과 에너지", "물리학", "화학 반응의 세계"]
      },
      {
        name: "간호대학 간호학과",
        source: "부산대학교 전공 연계 교과 이수 핵심/권장과목 가이드",
        evaluationStyle: "자체 권장과목 지정형 (생명 기초 및 보건 통계 중시)",
        evaluationNotice: "인체 생명 현상의 이해와 보건 통계 데이터 활용 역량을 중시하므로, 확률과 통계 이수와 함께 생명과학(일반/진로선택) 과목 이수를 가장 꼼꼼히 확인합니다.",
        coreSubjects: ["확률과 통계", "생명과학", "세포와 물질대사"],
        recommendedSubjects: ["미적분Ⅱ", "생물의 유전", "화학"]
      }
    ]
  },
  // ── 경북대학교 ─────────────────────────────────────────────────────────────
  {
    university: "경북대학교",
    majors: [
      // --- IT대학 (경북대 최강 간판 - 전자/전기/모바일 하드웨어 중심) ---
      {
        name: "IT대학 전자공학부(인공지능, 모바일공학 포함) / 전기공학과",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (절대적 전자기학 및 수리 역량 중시)",
        evaluationNotice: "경북대의 절대적 간판이자 대기업 취업의 산실입니다. 반도체 및 회로 설계의 뼈대가 되는 수학(미적분Ⅱ, 기하)의 완벽한 성취와 물리학(특히 전자기와 양자)의 압도적인 심화 이수를 1순위 핵심으로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계"]
      },

      // --- 소프트웨어 및 컴퓨터 중심 (데이터/알고리즘 역량) ---
      {
        name: "IT대학 컴퓨터학부 & 사범대학 정보·컴퓨터교육과 & 과학기술대학 소프트웨어학과",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (수리 논리력 및 알고리즘 중시)",
        evaluationNotice: "하드웨어보다는 소프트웨어 알고리즘 설계와 데이터 구조에 집중합니다. 물리적 지식보다는 수학 교과 전반(미적분Ⅱ, 기하, 확률과 통계)의 탄탄한 기본기와 논리적 사고력을 깐깐하게 검증합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)", "물리학"]
      },

      // --- 첨단기술 및 전통 기계/역학 중심 (우주/로봇/모빌리티/기계) ---
      {
        name: "첨단기술융합대학 우주공학부 / 스마트모빌리티공학과 / 로봇공학과 & 공과대학 기계공학부 & 과학기술대학 정밀기계공학과 / 자동차공학과",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (동역학 및 물리 심화 중시)",
        evaluationNotice: "최신 첨단 모빌리티와 우주항공, 전통 기계공학을 아우르는 그룹입니다. 움직이는 시스템의 4대 역학적 해석을 위해 미적분Ⅱ, 기하와 함께 물리학 및 물리 진로선택(역학과 에너지) 이수를 핵심으로 강제합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "지구시스템과학(우주공학 권장)"]
      },

      // --- 첨단 바이오 및 신약 중심 (화학/생명 극심화) ---
      {
        name: "첨단기술융합대학 혁신신약학과 / 의생명융합공학과",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (신약/바이오 화학 융합 중시)",
        evaluationNotice: "국가 첨단 전략산업 육성을 위해 신설된 특화 학과입니다. 신약 개발 및 바이오센서 연구를 위해 미적분Ⅱ 기초 위에 화학(화학 반응의 세계)과 생명과학(세포와 물질대사)의 극심화 이수를 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "화학", "생명과학", "화학 반응의 세계", "세포와 물질대사"],
        recommendedSubjects: ["물질과 에너지", "생물의 유전"]
      },

      // --- 화학 및 신소재 공학 중심 (화학/물리 동시 이수 강제) ---
      {
        name: "공과대학 응용화학공학부 / 금속재료공학과 / 신소재공학과 / 고분자공학과 / 섬유시스템공학과 & 과학기술대학 에너지화학공학과 / 나노신소재공학과",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (물질 물성 및 화학공정 중시)",
        evaluationNotice: "경북대의 탄탄한 화학공학/소재 라인업입니다. 화학 공정과 신소재 물성 분석을 다루기 때문에 화학 진로선택(물질과 에너지) 과목과 함께 물리학 이수를 동시에 깐깐하게 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "화학", "물리학", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계", "기하"]
      },

      // --- 건설/인프라/에너지 중심 (구조 역학 및 지구환경) ---
      {
        name: "공과대학 건축학부 / 토목공학과 / 환경공학과 / 에너지공학부 & 과학기술대학 건설방재공학과 / 환경안전공학과 / 스마트플랜트공학과",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (인프라 구조 및 다학제적 융합 중시)",
        evaluationNotice: "건축, 인프라, 에너지 시스템을 설계하는 그룹입니다. 미적분Ⅱ와 물리학(역학과 에너지)을 기본으로 요구하며, 환경/에너지 분야의 경우 지구과학이나 기후/생태 융합 과목 이수를 매우 긍정적으로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "역학과 에너지"],
        recommendedSubjects: ["기하", "화학", "지구시스템과학", "기후변화와 환경생태(융합)"]
      },

      // --- 농업생명 및 식물/식품 바이오 중심 (생명/화학 기초) ---
      {
        name: "농업생명과학대학 응용생명과학부 / 식품공학부 / 식물의학과 / 원예과학과 / 바이오섬유소재학과 & 생태환경대학 식물자원학과 / 곤충생명과학과",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (농생명 및 식품 화학/생명 중시)",
        evaluationNotice: "지거국 최고 수준의 농생명 연구 인프라를 자랑합니다. 식물, 곤충, 식품 바이오 기술을 다루므로 수학적 뼈대(미적분Ⅱ, 확통) 위에 화학과 생명과학 전반의 탄탄한 이수를 입학처에서 집중 확인합니다.",
        coreSubjects: ["화학", "생명과학", "세포와 물질대사", "물질과 에너지"],
        recommendedSubjects: ["미적분Ⅱ", "확률과 통계", "생물의 유전"]
      },

      // --- 농업 공학 및 산림/토목 인프라 중심 (지구/물리 융합) ---
      {
        name: "농업생명과학대학 산림과학·조경학부 / 농업토목공학과 / 스마트생물산업기계공학과",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (자연 인프라 및 기계공학 기초 중시)",
        evaluationNotice: "농생명 대학 소속이지만 공학적/인프라적 성격이 강합니다. 생명과학보다는 물리학(역학과 에너지) 또는 지구시스템과학(산림/조경) 이수를 핵심으로 보며, 실용적인 수학 통계 역량을 우대합니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "지구시스템과학"],
        recommendedSubjects: ["역학과 에너지", "생명과학", "확률과 통계"]
      },

      // --- 동물 생명 특화 중심 (상주캠퍼스 생태환경대학) ---
      {
        name: "생태환경대학 동물생명공학과 / 축산학과 / 말·특수동물학과",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 권장과목 지정형 (동물 생리 및 유전 탐구 중시)",
        evaluationNotice: "동물 자원 및 생태계 관리에 특화된 학과들입니다. 화학보다는 생명과학 및 생물의 유전, 세포 대사 관련 진로선택 과목의 집중적인 이수와 생태 탐구 경험을 가장 중요하게 평가합니다.",
        coreSubjects: ["생명과학", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["화학", "확률과 통계", "기후변화와 환경생태(융합)"]
      },

      // --- 자연과학 및 사범대학 (순수 전공 1:1 매칭 - 5개 그룹 병합 표기) ---
      {
        name: "자연과학대학 수학과/통계학과 & 사범대학 수학교육과",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (수리 및 통계 극심화 역량)",
        evaluationNotice: "기초 학문의 뼈대와 교원 양성을 목적으로 하므로 미적분Ⅱ, 기하, 확률과 통계 등 모든 수학 교과목의 완벽한 1순위 이수 및 최상위 성취도를 강제합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)"]
      },
      {
        name: "자연과학대학 (물리학과 / 화학과 / 생물학과 / 생명공학부 / 지구시스템과학부) & 사범대학 (물리/화학/생물/지구과학교육과)",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (순수 과학 전공 일치도 최우선)",
        evaluationNotice: "자연과학 및 과학교육 계열은 타협이 없습니다. 본인이 지원하는 세부 전공(물리, 화학, 생명, 지구과학)에 해당하는 일반선택 및 진로선택 과목을 학교 개설 기준 100% 이수해야만 불이익이 없습니다.",
        coreSubjects: ["미적분Ⅱ", "지원 전공 관련 과학 일반선택", "지원 전공 관련 과학 진로선택"],
        recommendedSubjects: ["기하", "확률과 통계"]
      },

      // --- 식품 및 생활과학 중심 ---
      {
        name: "생활과학대학 식품영양학과 / 의류학과 & 과학기술대학 식품외식산업학과 & 농업생명과학대학 식품자원경제학과 / 농산업학과",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 권장과목 지정형 (생활과학 및 실용 통계 중시)",
        evaluationNotice: "인체 대사 및 의류 소재, 농산업 경제를 다루는 실용 학문입니다. 확률과 통계 기반의 데이터 해석력을 최우선으로 보며 화학, 생명과학 일반 과목 이수를 필수로 확인합니다.",
        coreSubjects: ["확률과 통계", "화학", "생명과학"],
        recommendedSubjects: ["물질과 에너지", "실용 통계(융합)"]
      },

      // --- 의과/치과/약학/수의과 (최상위 메디컬 및 수의학 라인업) ---
      {
        name: "의과대학 의예과 / 치과대학 치의예과 / 약학대학 약학과 / 수의과대학 수의예과",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (최상위 생명/화학 및 수학 역량 중시)",
        evaluationNotice: "전국 최상위권의 각축장이며 특히 경북대 수의대는 지거국 최고 수준을 자랑합니다. 미적분Ⅱ, 확률과 통계의 완벽한 이수는 물론, 화학과 생명과학 진로선택(세포, 유전, 물질 등)의 심도 깊은 탐구 역량을 가장 깐깐하게 검증합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물질과 에너지", "물리학", "화학 반응의 세계"]
      },

      // --- 간호 및 보건 특화 ---
      {
        name: "간호대학 간호학과 & 과학기술대학 치위생학과",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 권장과목 지정형 (생명 기초 및 보건 데이터 중시)",
        evaluationNotice: "임상 보건 및 통계 데이터 활용 역량을 중시하므로, 확률과 통계 이수와 함께 인체 이해를 위한 생명과학(일반/진로선택) 과목 이수를 가장 꼼꼼히 확인합니다.",
        coreSubjects: ["확률과 통계", "생명과학", "세포와 물질대사"],
        recommendedSubjects: ["미적분Ⅱ", "화학", "생물의 유전"]
      },

      // --- 각 단과대학별 자율학부 (계열 탐색용) ---
      {
        name: "단과대학별 자율학부 (IT대학, 첨단기술융합대학, 공과대학, 자연과학대학, 농업생명과학대학 소속)",
        source: "경북대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "계열별 공통 핵심과목 이수형 (폭넓은 과학 탐구 중시)",
        evaluationNotice: "입학 후 전공을 선택하는 자율학부 특성상 특정 과목에 얽매이기보다는 미적분Ⅱ 기본기와 함께 물/화/생/지 중 2과목 이상의 진로선택 과목을 폭넓게 이수하여 융합적 탐구 역량을 어필하는 것이 좋습니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "과학 일반선택 3과목 이상"],
        recommendedSubjects: ["과학 진로선택 2과목 이상 이수", "기하"]
      }
    ]
  },
  // ── 충남대학교 ─────────────────────────────────────────────────────────────
  {
    university: "충남대학교",
    majors: [
      // --- 공과대학 (기계·항공·모빌리티 중심 - 동역학 강제 그룹) ---
      {
        name: "공과대학 기계공학부 / 메카트로닉스공학과 / 선박해양공학과 / 항공우주공학과 / 자율운항시스템공학과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (대덕연구단지 연계 물리/수리 역량 중시)",
        evaluationNotice: "충남대 공대의 근간이자 첨단 모빌리티 신설 라인업입니다. 대덕연구단지 연계 연구 역량을 위해 움직이는 시스템의 뼈대인 수학(미적분Ⅱ, 기하)과 물리학(역학과 에너지)의 압도적인 성취 및 심화 탐구 경험을 1순위로 강제합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지"],
        recommendedSubjects: ["전자기와 양자", "확률과 통계"]
      },

      // --- 공과대학 & 자연과학대학 (전기·전자·반도체 중심 - 전자기학 극심화) ---
      {
        name: "공과대학 전기공학과 / 전자공학과 / 전파정보통신공학과 & 자연과학대학 반도체융합학과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (전자기학 및 회로 기초 중시)",
        evaluationNotice: "회로 설계와 통신, 첨단 반도체를 다루는 그룹입니다. 자연대 소속 첨단학과를 포함하여, 수학적 논리력(미적분Ⅱ, 기하)과 함께 물리학 진로선택 중 '전자기와 양자' 과목의 완벽한 이수를 가장 깐깐하게 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "확률과 통계"]
      },

      // --- 공과대학 (소프트웨어 및 AI 중심 - 알고리즘/통계 그룹) ---
      {
        name: "공과대학 컴퓨터융합학부 / 인공지능학과 / 정보통신융합학부",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (수리 논리력 및 데이터 역량 중시)",
        evaluationNotice: "최신 AI 및 소프트웨어 융합 학과들입니다. 물리적 지식보다는 알고리즘과 데이터 구조의 뼈대가 되는 수학 교과 전반(미적분Ⅱ, 기하, 확률과 통계)의 탄탄한 기본기와 실용 수학 활용 능력을 집중적으로 검증합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)", "물리학"]
      },

      // --- 공과대학 (화학·소재·에너지 중심 - 화학/물리 융합 그룹) ---
      {
        name: "공과대학 신소재공학과 / 응용화학공학과 / 유기재료공학과 / 에너지공학과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (물질/화학 공정 역량 중시)",
        evaluationNotice: "대덕 화학/소재 연구소 연계 취업이 활발한 학과들입니다. 미적분Ⅱ 기초 위에 화학(물질과 에너지) 과목을 핵심으로 하며, 공정 시스템 해석을 위해 물리학 이수를 동시에 요구하여 과목 편식을 엄격히 거릅니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "물질과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "역학과 에너지", "기하"]
      },

      // --- 공과대학 & 농업생명과학대학 (인프라·건축·토목 중심 - 역학/공간 그룹) ---
      {
        name: "공과대학 건축학과(5) / 건축공학과 / 토목공학과 & 농업생명과학대학 지역환경토목학과 / 스마트농업시스템기계공학과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (공간 구조 및 자연 인프라 융합 중시)",
        evaluationNotice: "건축물과 자연 인프라 구조를 다루는 학과들입니다. 미적분Ⅱ와 물리학(역학과 에너지) 이수가 필수적이며, 지역 토목 및 농업 기계 등 융합 특성상 지구과학이나 통계적 소양을 긍정적으로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "역학과 에너지"],
        recommendedSubjects: ["기하", "확률과 통계", "지구시스템과학"]
      },

      // --- 공과대학 & 자연과학대학 (환경 및 지구과학 중심 - 다학제 융합 그룹) ---
      {
        name: "공과대학 환경공학과 & 자연과학대학 지질환경과학과 / 해양환경과학과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (지구환경 및 화학 융합 중시)",
        evaluationNotice: "환경 오염 분석 및 지구/해양 생태 보존을 다룹니다. 물리 역량보다는 화학, 생명과학, 그리고 지구시스템과학의 다학제적 융합 이수와 환경 문제 탐구 세특을 매우 높게 평가합니다.",
        coreSubjects: ["화학", "생명과학", "지구시스템과학"],
        recommendedSubjects: ["미적분Ⅱ", "기후변화와 환경생태(융합)", "물리학"]
      },

      // --- 생명시스템과학대학 (생명과학 극심화 - 충남대 특화 1) ---
      {
        name: "생명시스템과학대학 생물과학과 / 미생물·분자생명과학과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (순수 생명/화학 탐구 극대화)",
        evaluationNotice: "자연대에서 완전히 독립한 충남대만의 특화 단과대학입니다. 기초 생명과학의 심연을 탐구하므로 화학과 생명과학 진로선택(세포, 유전)의 전면 이수와 대덕연구단지 수준의 심도 깊은 실험/탐구 세특이 필수입니다.",
        coreSubjects: ["화학", "생명과학", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물질과 에너지", "확률과 통계"]
      },
      {
        name: "생명시스템과학대학 생명정보융합학과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (바이오 데이터 분석 역량 중시)",
        evaluationNotice: "바이오 빅데이터를 다루는 융합 학과로, 생명과학적 지식뿐만 아니라 알고리즘과 통계 분석을 위한 확률과 통계, 미적분Ⅱ 수학 교과의 이수를 매우 깐깐하게 확인합니다.",
        coreSubjects: ["확률과 통계", "미적분Ⅱ", "생명과학"],
        recommendedSubjects: ["화학", "세포와 물질대사", "인공지능 수학(융합)"]
      },

      // --- 자연과학대학 (기초과학 완전 분리 그룹) ---
      {
        name: "자연과학대학 수학과 / 정보통계학과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (순수 수리/통계 역량 중시)",
        evaluationNotice: "순수 학문 탐구를 위해 미적분Ⅱ, 기하, 확률과 통계 등 개설된 수학 교과목 전체의 완벽한 1순위 이수 및 최상위권 성취도를 강제합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)"]
      },
      {
        name: "자연과학대학 물리학과 / 천문우주과학과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (우주/물리 역학 중시)",
        evaluationNotice: "대덕연구단지의 항공우주 및 물리 연구 기반이 됩니다. 역학, 전자기학 등 물리 진로선택 전반의 압도적 성취와 천체/물리 법칙 해석을 위한 미적분Ⅱ, 기하 이수를 절대적 핵심으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["지구시스템과학", "확률과 통계"]
      },
      {
        name: "자연과학대학 화학과 / 생화학과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (화학 반응 및 물질 탐구 중시)",
        evaluationNotice: "물질의 근원적 구조와 생체 화학 반응을 다루므로, 화학 진로선택(물질, 반응)의 전면 이수와 정교한 화학 실험 경험을 입학처에서 집중적으로 살핍니다.",
        coreSubjects: ["미적분Ⅱ", "화학", "물질과 에너지", "화학 반응의 세계"],
        recommendedSubjects: ["생명과학", "물리학", "세포와 물질대사"]
      },

      // --- 농업생명과학대학 (농생명/바이오 소재 특화 그룹) ---
      {
        name: "농업생명과학대학 식물자원학과 / 원예학과 / 산림환경자원학과 / 환경소재공학과 / 동물자원생명과학과 / 동물바이오시스템과학과 / 응용생물학과 / 생물환경화학과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (동식물 바이오 및 환경 화학 중시)",
        evaluationNotice: "식량, 동식물 자원, 환경 소재 등 지거국 특화 연구를 수행합니다. 수학적 기본기 위에 화학과 생명과학 전반의 탄탄한 이수와 토양/기후 환경 관련 다학제적 탐구를 매우 긍정적으로 평가합니다.",
        coreSubjects: ["화학", "생명과학", "세포와 물질대사"],
        recommendedSubjects: ["지구시스템과학", "기후변화와 환경생태(융합)", "물질과 에너지"]
      },

      // --- 사범대학 (전국 최대 규모 공학교육 특화 - 충남대 특화 2) ---
      {
        name: "사범대학 수학교육과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (수학교원 양성 절대 기준)",
        evaluationNotice: "수학 교원 양성 목적상 타협이 없습니다. 미적분Ⅱ, 기하, 확률과 통계를 포함하여 고등학교에 개설된 모든 수학 교과를 100% 이수하고 최상위권 성적을 유지해야 합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)"]
      },
      {
        name: "사범대학 기계공학교육과 / 건설공학교육과 / 기술교육과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (공학/기술 교원 양성 - 물리 강제)",
        evaluationNotice: "전국에서 찾아보기 힘든 공학/기술 교원 양성 학과들입니다. 사범대 소속이지만 공과대학 수준의 구조 역학 이해를 요구하므로 물리학 및 역학과 에너지 이수를 필수 핵심으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "역학과 에너지"],
        recommendedSubjects: ["기하", "확률과 통계"]
      },
      {
        name: "사범대학 전기·전자·통신공학교육과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (전자/통신 교원 양성 - 전자기 강제)",
        evaluationNotice: "사범대 소속이지만 전자/통신 기초를 완벽히 숙지해야 하므로 물리학(특히 전자기와 양자)과 미적분Ⅱ 수학적 소양을 필수로 요구합니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "전자기와 양자"],
        recommendedSubjects: ["기하", "확률과 통계"]
      },
      {
        name: "사범대학 화학공학교육과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (화공 교원 양성 - 화학/물리 융합)",
        evaluationNotice: "화학 공학 교원 양성을 위해 화학 진로선택 과목뿐만 아니라 공정의 기초가 되는 물리학 이수를 동시에 요구하여 공학적 이해도를 깐깐하게 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "화학", "물리학", "물질과 에너지"],
        recommendedSubjects: ["화학 반응의 세계", "역학과 에너지"]
      },

      // --- 식품·영양 및 생활과학 (농생명 & 생활대 묶음) ---
      {
        name: "농업생명과학대학 식품공학과 & 생활과학대학 식품영양학과 / 의류학과 / 농업경제학과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 권장과목 지정형 (생활 바이오 및 데이터 통계 중시)",
        evaluationNotice: "인체 대사 및 식품/의류 소재, 농산업 경제 데이터를 다루는 실용 학문입니다. 확률과 통계 기반의 데이터 해석력을 최우선으로 보며 화학, 생명과학 기초 이수를 필수로 확인합니다.",
        coreSubjects: ["확률과 통계", "화학", "생명과학"],
        recommendedSubjects: ["물질과 에너지", "실용 통계(융합)"]
      },

      // --- 의과/약학/수의과 (최상위 메디컬 메카) ---
      {
        name: "의과대학 의예과 / 약학대학 약학과 / 수의과대학 수의예과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (최상위 생명/화학 및 수학 역량 중시)",
        evaluationNotice: "충남대병원 연계 전국 최상위권 메디컬 라인업입니다. 미적분Ⅱ, 확률과 통계의 완벽한 성취는 물론, 화학과 생명과학 진로선택(세포, 유전, 물질 등)의 심도 깊은 기초 의학/약학 융합 탐구를 가장 깐깐하게 검증합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물질과 에너지", "화학 반응의 세계", "물리학"]
      },

      // --- 간호대학 ---
      {
        name: "간호대학 간호학과",
        source: "충남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 권장과목 지정형 (생명 기초 및 보건 데이터 중시)",
        evaluationNotice: "임상 간호 및 보건 통계 데이터 활용 역량을 중시하므로, 확률과 통계 이수와 함께 인체 이해를 위한 생명과학(일반/진로선택) 과목 이수를 가장 꼼꼼히 확인합니다.",
        coreSubjects: ["확률과 통계", "생명과학", "세포와 물질대사"],
        recommendedSubjects: ["미적분Ⅱ", "화학", "생물의 유전"]
      }
    ]
  },
  // ── 전남대학교 ─────────────────────────────────────────────────────────────
  {
    university: "전남대학교",
    majors: [
      // =====================================================================
      // [광주캠퍼스] AI융합대학 및 IT/소프트웨어 그룹
      // =====================================================================
      {
        name: "[광주캠퍼스] AI융합대학 전 학과 (인공지능학부, 빅데이터융합, 미래모빌리티 등) & 공과대학 전자컴퓨터공학부 / 소프트웨어공학과 / 컴퓨터정보통신공학과",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (광주 AI 특화 수학/데이터 역량 중시)",
        evaluationNotice: "광주 AI 융복합 단지와 연계된 전남대의 최우선 투자 학과들입니다. 물리학적 지식보다는 알고리즘과 데이터 분석의 뼈대가 되는 수학 교과 전반(미적분Ⅱ, 기하, 확률과 통계)의 압도적 성취와 논리적 문제 해결 과정을 1순위 핵심으로 검증합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)", "물리학"]
      },

      // =====================================================================
      // [광주캠퍼스] 공과대학 (전통/에너지/화학/인프라)
      // =====================================================================
      {
        name: "[광주캠퍼스] 공과대학 기계공학부 / 산업공학과 / 건축학부 / 토목공학과",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (구조 역학 및 수리 역량 중시)",
        evaluationNotice: "전통적인 중후장대 및 인프라 설계 학과입니다. 움직이는 시스템과 구조물의 역학적 해석을 위해 미적분Ⅱ, 기하를 바탕으로 물리학 및 역학과 에너지 이수를 필수 핵심으로 강제합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지"],
        recommendedSubjects: ["확률과 통계", "지구시스템과학(토목 권장)"]
      },
      {
        name: "[광주캠퍼스] 공과대학 전기공학과 / 전자공학과 / 에너지자원공학과",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (한전 연계 전자기학/에너지 중시)",
        evaluationNotice: "나주 혁신도시(한국전력 등) 연계 취업이 강력한 에너지/전기 라인업입니다. 회로와 전력망 설계의 근간인 전자기학과 양자 이수를 매우 중시하며 수학적 뼈대(미적분Ⅱ, 기하)를 깐깐하게 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "전자기와 양자"],
        recommendedSubjects: ["역학과 에너지", "지구시스템과학(에너지자원 권장)"]
      },
      {
        name: "[광주캠퍼스] 공과대학 화학공학부 / 신소재공학부 / 고분자융합소재공학부",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (물질 물성 및 화학공정 중시)",
        evaluationNotice: "광주/전남 지역의 탄탄한 첨단 소재 및 화학 산업과 연계됩니다. 미적분Ⅱ 기초 위에 화학(물질과 에너지) 과목을 핵심으로 하며, 공정 해석을 위해 물리학 이수를 동시에 요구하여 과목 편식을 엄격히 거릅니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "물질과 에너지"],
        recommendedSubjects: ["역학과 에너지", "화학 반응의 세계", "기하"]
      },
      {
        name: "[광주캠퍼스] 공과대학 생물공학과 / 환경에너지공학과",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (환경/바이오 다학제 융합 중시)",
        evaluationNotice: "공과대학 소속이지만 물리 역량 못지않게 화학, 생명과학, 그리고 지구시스템과학의 다학제적 융합 이수와 환경/바이오 공정 탐구 세특을 매우 높게 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "화학", "생명과학", "지구시스템과학"],
        recommendedSubjects: ["물리학", "기후변화와 환경생태(융합)", "물질과 에너지"]
      },

      // =====================================================================
      // [광주캠퍼스] 자연과학대학 & 사범대학 (기초과학/교육)
      // =====================================================================
      {
        name: "[광주캠퍼스] 자연과학대학 수학과 / 통계학과 & 사범대학 수학교육과",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (순수 수리/통계 역량 극심화)",
        evaluationNotice: "기초 학문의 뼈대와 수학교원 양성을 목적으로 하므로 미적분Ⅱ, 기하, 확률과 통계 등 고등학교에 개설된 모든 수학 교과목의 완벽한 1순위 이수 및 최상위 성취도를 강제합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "확률과 통계"],
        recommendedSubjects: ["인공지능 수학(융합)", "실용 통계(융합)"]
      },
      {
        name: "[광주캠퍼스] 자연과학대학 (물리학과 / 화학과 / 생물학과 / 생명과학기술학부 / 지구환경과학부) & 사범대학 (물리/화학/생물/지구과학교육과)",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (순수 과학 전공 일치도 최우선)",
        evaluationNotice: "자연과학 및 과학교육 계열은 타협이 없습니다. 본인이 지원하는 세부 전공(물리, 화학, 생명, 지구/해양)에 해당하는 일반선택 및 진로선택 과목을 학교 개설 기준 100% 이수해야만 불이익이 없습니다.",
        coreSubjects: ["미적분Ⅱ", "지원 전공 관련 과학 일반선택", "지원 전공 관련 과학 진로선택"],
        recommendedSubjects: ["기하", "확률과 통계"]
      },

      // =====================================================================
      // [광주캠퍼스] 농업생명과학대학 & 생활과학대학
      // =====================================================================
      {
        name: "[광주캠퍼스] 농업생명과학대학 바이오/소재 중심 (응용식물, 응용생물, 원예생명, 분자생명, 농생명화학, 산림자원, 임산공학, 동물자원, 바이오에너지)",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (농생명 바이오 및 환경 화학 중시)",
        evaluationNotice: "호남권 최고 수준의 농생명 연구 인프라를 자랑합니다. 수학적 기본기(확률과 통계) 위에 화학과 생명과학 전반의 탄탄한 이수와 식량/동식물 바이오 관련 다학제적 탐구를 매우 긍정적으로 평가합니다.",
        coreSubjects: ["화학", "생명과학", "세포와 물질대사", "물질과 에너지"],
        recommendedSubjects: ["지구시스템과학", "확률과 통계", "생물의 유전"]
      },
      {
        name: "[광주캠퍼스] 농업생명과학대학 공학/인프라 중심 (지역·바이오시스템공학과 / 융합바이오시스템기계공학과 / 조경학과)",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (농업 기계 및 인프라 역학 중시)",
        evaluationNotice: "농생명 대학 소속이지만 공학적/토목적 성격이 매우 강합니다. 생명과학보다는 물리학(역학과 에너지) 또는 공간 이해를 위한 기하, 지구시스템과학 이수를 핵심으로 보며 실용적인 수리 역량을 우대합니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "지구시스템과학"],
        recommendedSubjects: ["기하", "역학과 에너지", "생명과학"]
      },
      {
        name: "[광주캠퍼스] 생활과학대학 식품영양과학부 / 의류학과 & 농업생명과학대학 식품공학과 / 농업경제학과 & 사범대학 가정교육과",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 권장과목 지정형 (생활 바이오 및 통계 데이터 중시)",
        evaluationNotice: "인체 대사 및 식품/의류 소재, 경제/보건 데이터를 다루는 실용 학문입니다. 확률과 통계 기반의 데이터 해석력을 최우선으로 보며 화학, 생명과학 기초 이수를 필수로 확인합니다.",
        coreSubjects: ["확률과 통계", "화학", "생명과학"],
        recommendedSubjects: ["물질과 에너지", "실용 통계(융합)"]
      },

      // =====================================================================
      // [광주캠퍼스] 의약학 및 메디컬 라인업
      // =====================================================================
      {
        name: "[광주캠퍼스] 의과대학 의예과 / 치의학전문대학원 / 약학대학 약학부 / 수의과대학 수의예과",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (최상위 생명/화학 및 수학 역량 중시)",
        evaluationNotice: "전남대병원 연계 호남권 최상위권 메디컬 라인업입니다. 미적분Ⅱ, 확률과 통계의 완벽한 성취는 물론, 화학과 생명과학 진로선택(세포, 유전, 물질 등)의 심도 깊은 기초 의학 융합 탐구를 가장 깐깐하게 검증합니다.",
        coreSubjects: ["미적분Ⅱ", "확률과 통계", "화학", "생명과학", "세포와 물질대사", "생물의 유전"],
        recommendedSubjects: ["물질과 에너지", "화학 반응의 세계", "물리학"]
      },
      {
        name: "[광주캠퍼스] 간호대학 간호학과",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 권장과목 지정형 (생명 기초 및 보건 데이터 중시)",
        evaluationNotice: "임상 간호 및 보건 통계 데이터 활용 역량을 중시하므로, 확률과 통계 이수와 함께 인체 이해를 위한 생명과학(일반/진로선택) 과목 이수를 가장 꼼꼼히 확인합니다.",
        coreSubjects: ["확률과 통계", "생명과학", "세포와 물질대사"],
        recommendedSubjects: ["미적분Ⅱ", "화학", "생물의 유전"]
      },

      // =====================================================================
      // [여수캠퍼스] 공학대학 (여수 국가산단 특화)
      // =====================================================================
      {
        name: "[여수캠퍼스] 공학대학 전기/전자/기계 중심 (전자통신, 전기컴퓨터, 기계시스템, 기계설계, 메카트로닉스, 냉동공조)",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (여수산단 특화 동역학 및 회로 중시)",
        evaluationNotice: "여수 국가산업단지의 설비 및 제어를 담당하는 핵심 공학 라인업입니다. 기계와 전기의 뼈대인 물리학(역학 및 전자기)과 미적분Ⅱ, 기하 이수를 절대적인 핵심 기준으로 봅니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지", "전자기와 양자"],
        recommendedSubjects: ["확률과 통계", "화학"]
      },
      {
        name: "[여수캠퍼스] 공학대학 인프라 중심 (해양토목공학과, 환경시스템공학과, 건축디자인학과)",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (해양 인프라 및 공간 역학 중시)",
        evaluationNotice: "해안가에 위치한 여수 특성을 살려 해양 인프라 구축과 공간 설계를 다룹니다. 물리학(역학과 에너지)을 기본으로 요구하며, 해양/환경 분야의 경우 지구과학 이수를 매우 긍정적으로 평가합니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "역학과 에너지"],
        recommendedSubjects: ["기하", "지구시스템과학", "기후변화와 환경생태(융합)"]
      },
      {
        name: "[여수캠퍼스] 공학대학 화학/생명 중심 (석유화학소재공학과, 화공생명공학과, 융합생명공학과, 의공학부)",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (여수 화학산단 및 바이오 융합 중시)",
        evaluationNotice: "전국 최대 석유화학단지인 여수산단과 직접 연계된 학과들입니다. 수학적 기초 위에 화학(특히 물질과 에너지)과 생명과학의 심도 깊은 융합 이수를 요구하며 공정 설계를 위한 물리 기초도 꼼꼼히 봅니다.",
        coreSubjects: ["미적분Ⅱ", "물리학", "화학", "생명과학", "물질과 에너지"],
        recommendedSubjects: ["세포와 물질대사", "화학 반응의 세계"]
      },

      // =====================================================================
      // [여수캠퍼스] 수산해양대학 (호남권 유일 해양 특화)
      // =====================================================================
      {
        name: "[여수캠퍼스] 수산해양대학 선박/기관 중심 (기관시스템공학과, 조선해양공학과)",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (대형 선박 구조 및 역학 중시)",
        evaluationNotice: "대형 선박의 건조 및 기관 시스템을 설계합니다. 해양 대학 소속이지만 본질은 중공업/기계공학이므로 미적분Ⅱ, 기하와 물리학(역학과 에너지)의 압도적인 성취를 강제합니다.",
        coreSubjects: ["미적분Ⅱ", "기하", "물리학", "역학과 에너지"],
        recommendedSubjects: ["지구시스템과학", "전자기와 양자"]
      },
      {
        name: "[여수캠퍼스] 수산해양대학 수산/바이오 중심 (수산생명의학과, 양식생물학과, 해양바이오식품학과)",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 핵심과목 지정형 (해양 생명 및 수산 질병 탐구 중시)",
        evaluationNotice: "해양 생물 자원과 어류 질병을 다루는 특화 그룹입니다. 수의대/바이오 학과와 성격이 유사하여 화학과 생명과학 전면 이수 및 진로선택(세포, 유전, 물질)의 깊이 있는 탐구를 최우선으로 봅니다.",
        coreSubjects: ["화학", "생명과학", "세포와 물질대사", "물질과 에너지"],
        recommendedSubjects: ["미적분Ⅱ", "확률과 통계", "지구시스템과학"]
      },
      {
        name: "[여수캠퍼스] 수산해양대학 관리/환경 중심 (해양경찰학과, 해양생산관리학과, 해양융합과학과, 스마트수산자원관리학과)",
        source: "전남대학교 전공 연계 교과이수 권장과목 가이드",
        evaluationStyle: "자체 권장과목 지정형 (해양 환경 통계 및 융합 중시)",
        evaluationNotice: "해양 주권 수호 및 수산 자원 데이터 관리를 다룹니다. 물리 역량보다는 확률과 통계 기반의 데이터 분석력과 해양 환경 이해를 위한 지구과학(지구시스템과학) 이수를 가장 높게 평가합니다.",
        coreSubjects: ["확률과 통계", "지구시스템과학", "물리학"],
        recommendedSubjects: ["실용 통계(융합)", "생명과학", "기후변화와 환경생태(융합)"]
      }
    ]
  }
]; // 전체 데이터를 닫는 마지막 줄!