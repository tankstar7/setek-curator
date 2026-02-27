/**
 * Firestore 데이터 액세스 유틸리티
 *
 * 기획서(master_plan.md) 3.1 ~ 3.3 스키마를 그대로 반영한다.
 * 컬렉션: curriculum | skill_trees | reports_db
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentReference,
  WithFieldValue,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─────────────────────────────────────────────
// 타입 정의 (기획서 3.1 ~ 3.3)
// ─────────────────────────────────────────────

/** 3.1 curriculum — 교육과정 트리 (6 Depth) */
export type Curriculum = {
  id?: string;
  subject: string;          // 과목군 (예: 과학)
  course: string;           // 세부 과목 (예: 화학)
  major_unit: string;       // 대주제
  minor_units: string[];    // 소주제 배열
  textbook_analysis: {
    core_concepts: string[];
    publisher_specifics: {
      publisher: string;    // 출판사명 (예: 천재교육)
      focus_point: string;  // 해당 출판사의 강조 포인트
    }[];
  };
};

/**
 * 3.2 skill_trees — 대학 전공별 필수 수강 과목 매핑
 *
 * ai_recommended_combo 는 "3과목 꿀조합" 단위로 묶인 배열이다.
 * 기획서의 { course, reason } 구조를 UI에 맞게 확장하여
 * courses(배열) + reason + highlight_major 로 구성한다.
 */
export type SkillTree = {
  id?: string;
  major_name: string;         // 목표 전공 (예: 기계공학과)
  description?: string;       // 전공 한 줄 설명
  core_required: string[];    // 공통 필수 수강 과목명 배열
  advanced_required?: string[]; // 심화·선택 권장 과목
  ai_recommended_combo: {
    courses: string[];          // 추천 과목 3개
    reason: string;             // 이 조합을 추천하는 이유
    highlight_major: string[];  // 연계 진로/세부 전공
  }[];
};

/** 3.3 reports_db — 세특 보고서 특정 주제 데이터 */
export type Report = {
  id?: string;
  trend_keyword: string;      // 관련 산업 트렌드 (예: 전고체 배터리)
  report_title: string;       // 보고서 특정 주제 제목
  subject: string;            // 과목
  major_unit: string;         // 대단원
  publisher: string;          // 교과서 출판사
  target_majors: string[];    // 추천 전공 배열
  views?: number;             // 조회수 (Trending 정렬용)
  golden_template: {
    motivation: string;       // 탐구 동기 (Free)
    basic_knowledge: string;  // 교과서 연계 기초 지식 (Free)
    application: string;      // 내용 탐구 (Free)
    in_depth: string;         // 석학 시선의 심화 탐구 (Premium)
    major_connection: string; // 전공 연계 비전 (Premium)
  };
};

// ─────────────────────────────────────────────
// 컬렉션 이름 상수
// ─────────────────────────────────────────────

const COL = {
  CURRICULUM: "curriculum",
  SKILL_TREES: "skill_trees",
  REPORTS: "reports_db",
} as const;

// ─────────────────────────────────────────────
// 공통 헬퍼
// ─────────────────────────────────────────────

/** Firestore 문서 데이터에 id 필드를 병합해서 반환 */
function withId<T>(id: string, data: T): T & { id: string } {
  return { id, ...data };
}

// ─────────────────────────────────────────────
// curriculum 컬렉션
// ─────────────────────────────────────────────

/** 특정 과목군(subject)의 모든 curriculum 항목 조회 */
export async function getCurriculumBySubject(subject: string): Promise<Curriculum[]> {
  const q = query(
    collection(db, COL.CURRICULUM),
    where("subject", "==", subject)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId(d.id, d.data() as Curriculum));
}

/** 특정 세부 과목(course)의 curriculum 단건 조회 */
export async function getCurriculumByCourse(course: string): Promise<Curriculum | null> {
  const q = query(
    collection(db, COL.CURRICULUM),
    where("course", "==", course),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return withId(d.id, d.data() as Curriculum);
}

/**
 * curriculum 문서 저장
 * - id 지정 시: upsert (덮어쓰기)
 * - id 미지정 시: 자동 ID 생성
 */
export async function saveCurriculum(
  data: WithFieldValue<Curriculum>,
  id?: string
): Promise<string> {
  if (id) {
    await setDoc(doc(db, COL.CURRICULUM, id), data);
    return id;
  }
  const ref = await addDoc(collection(db, COL.CURRICULUM), data);
  return ref.id;
}

// ─────────────────────────────────────────────
// skill_trees 컬렉션
// ─────────────────────────────────────────────

/** 전공명으로 스킬 트리 단건 조회 */
export async function getSkillTreeByMajor(majorName: string): Promise<SkillTree | null> {
  // 전공명을 문서 ID로 저장하므로 getDoc으로 바로 조회한다 (인덱스 불필요).
  const snap = await getDoc(doc(db, COL.SKILL_TREES, majorName));
  if (!snap.exists()) return null;
  return withId(snap.id, snap.data() as SkillTree);
}

/** 모든 스킬 트리 목록 조회 (홈 전공 선택 드롭다운용) */
export async function getAllSkillTrees(): Promise<SkillTree[]> {
  const snap = await getDocs(collection(db, COL.SKILL_TREES));
  return snap.docs.map((d) => withId(d.id, d.data() as SkillTree));
}

/** 모든 curriculum 문서 조회 (Explorer 클라이언트 필터용) */
export async function getAllCurricula(): Promise<Curriculum[]> {
  const snap = await getDocs(collection(db, COL.CURRICULUM));
  return snap.docs.map((d) => withId(d.id, d.data() as Curriculum));
}

/** 모든 보고서 조회 — views 내림차순, 최대 50건 (클라이언트 필터용) */
export async function getAllReports(): Promise<Report[]> {
  const q = query(collection(db, COL.REPORTS), orderBy("views", "desc"), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId(d.id, d.data() as Report));
}

/**
 * 스킬 트리 저장 — 전공명을 문서 ID로 사용하여 upsert
 * Firestore 문서 ID에 슬래시(/)가 들어가면 안 되므로 치환한다.
 */
export async function saveSkillTree(data: WithFieldValue<SkillTree>): Promise<void> {
  const rawId = data.major_name as string;
  const safeId = rawId.replace(/\//g, "_");
  await setDoc(doc(db, COL.SKILL_TREES, safeId), data);
}

// ─────────────────────────────────────────────
// reports_db 컬렉션
// ─────────────────────────────────────────────

/**
 * 필터 조건으로 보고서 목록 조회
 *
 * ⚠️ Firestore 복합 인덱스 주의
 * 두 개 이상의 필드를 where로 동시에 필터링하면서 orderBy를 사용하면
 * Firebase Console에서 복합 인덱스를 생성해야 한다.
 * 인덱스 미생성 시 Firestore가 콘솔에 인덱스 생성 URL을 출력하므로
 * 해당 URL을 클릭해 인덱스를 추가하면 된다.
 */
// --- 1. 계층형 과목 매핑 도우미 함수 ---
export function getSubjectGroup(subject: string): string[] {
  // 연구원님이 설계하신 22개정 과학/진로선택 트리
  if (subject === '과학') {
    return [
      '과학', '물리', '물리학', '역학과 에너지', '전자기와 양자',
      '화학', '물질과 에너지', '화학 반응의 세계', '화학반응의 세계',
      '생명과학', '세포와 물질대사', '생물의 유전',
      '지구과학', '지구시스템과학', '행성우주과학', '행정우주과학'
    ];
  }
  if (subject === '물리' || subject === '물리학') {
    return ['물리', '물리학', '역학과 에너지', '전자기와 양자'];
  }
  if (subject === '화학') {
    return ['화학', '물질과 에너지', '화학 반응의 세계', '화학반응의 세계'];
  }
  if (subject === '생명과학' || subject === '생명') {
    return ['생명과학', '생명', '세포와 물질대사', '생물의 유전'];
  }
  if (subject === '지구과학' || subject === '지구') {
    return ['지구과학', '지구', '지구시스템과학', '행성우주과학', '행정우주과학'];
  }
  
  return [subject]; 
}

// --- 2. 새로 교체되는 getReports 함수 (Supabase + 계층형 검색) ---
// --- (이 부분만 덮어쓰기 하세요!) ---
// --- (이 부분만 다시 덮어쓰기 하세요!) ---
export async function getReports(filters?: {
  subject?: string;
  major_unit?: string;
  publisher?: string;
  trend_keyword?: string;
  target_major?: string;
  limitCount?: number;
}): Promise<any[]> { 
  let query = supabase.from('premium_reports').select('*');

  // 1. 계층형 과목 필터 (Supabase or 쿼리에서는 와일드카드로 % 대신 * 를 써야 합니다!)
  if (filters?.subject) {
    const targetSubjects = getSubjectGroup(filters.subject.trim());
    // 수정됨: % 기호를 * 기호로 변경
    const orQuery = targetSubjects.map(sub => `subject.ilike.%${sub}%`).join(',');
    query = query.or(orQuery);
  }

  // 2. 대단원 필터 ("II. 전기와 자기" -> "전기와 자기")
  if (filters?.major_unit) {
    const cleanMajorUnit = filters.major_unit.replace(/^([A-Za-zIVX]+|\d+)\.\s*/, '').trim();
    // 단일 메서드에서는 %가 작동하지만, 안전하게 *로 통일
    query = query.ilike('large_unit_name', `%${cleanMajorUnit}%`);
  }

  // 3. 출판사 필터는 의도적으로 무시!

  // 4. 전공 필터 (배열 포함 여부 검사)
  if (filters?.target_major) {
    query = query.contains('target_majors', [filters.target_major]);
  }

  // 최신순 정렬
  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(filters?.limitCount ?? 20);

  if (error) {
    console.error('Supabase 데이터 로드 에러:', error);
    return [];
  }
  return data;
}

/** 인기 보고서 Top N 조회 (홈 Trending 섹션용) */
// --- (기존 getTrendingReports, getReportById 교체) ---
export async function getTrendingReports(n: number = 3): Promise<any[]> {
  return getReports({ limitCount: n });
}

/** 보고서 단건 조회 (문서 ID 기반) */
export async function getReportById(id: string): Promise<any | null> {
  // bigint PK는 숫자로 변환, UUID/문자열은 그대로 사용
  const queryId: string | number = /^\d+$/.test(id) ? Number(id) : id;
  const { data, error } = await supabase
    .from('premium_reports')
    .select('*')
    .eq('id', queryId)
    .single();

  if (error) return null;
  return data;
}

/**
 * 보고서 저장
 * - id 지정 시: upsert
 * - id 미지정 시: 자동 ID 생성
 */
export async function saveReport(
  data: WithFieldValue<Report>,
  id?: string
): Promise<string> {
  if (id) {
    await setDoc(doc(db, COL.REPORTS, id), data);
    return id;
  }
  const ref = await addDoc(collection(db, COL.REPORTS), data);
  return ref.id;
}

/**
 * 보고서 조회수 원자적 증가
 * increment()를 사용해 동시 요청 시 race condition 없이 정확히 +1 한다.
 */
export async function incrementReportViews(id: string): Promise<void> {
  const ref = doc(db, COL.REPORTS, id) as DocumentReference;
  await updateDoc(ref, { views: increment(1) });
}

/** 보고서 삭제 */
export async function deleteReport(id: string): Promise<void> {
  await deleteDoc(doc(db, COL.REPORTS, id));
}
