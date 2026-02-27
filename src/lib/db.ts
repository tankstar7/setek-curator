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
export async function getReports(filters?: {
  subject?: string;
  major_unit?: string;
  publisher?: string;
  trend_keyword?: string;
  target_major?: string;   // array-contains 쿼리 (target_majors 필드)
  limitCount?: number;
}): Promise<Report[]> {
  const constraints: QueryConstraint[] = [];

  const hasFilters = !!(
    filters?.subject ||
    filters?.major_unit ||
    filters?.publisher ||
    filters?.trend_keyword ||
    filters?.target_major
  );

  if (filters?.subject) {
    constraints.push(where("subject", "==", filters.subject));
  }
  if (filters?.major_unit) {
    constraints.push(where("major_unit", "==", filters.major_unit));
  }
  if (filters?.publisher) {
    constraints.push(where("publisher", "==", filters.publisher));
  }
  if (filters?.trend_keyword) {
    constraints.push(where("trend_keyword", "==", filters.trend_keyword));
  }
  // array-contains 는 다른 array-contains와 동시에 사용할 수 없다.
  if (filters?.target_major) {
    constraints.push(where("target_majors", "array-contains", filters.target_major));
  }

  // 필터가 없을 때만 orderBy 사용 — where + orderBy 조합은 복합 인덱스가 필요하기 때문
  if (!hasFilters) {
    constraints.push(orderBy("views", "desc"));
  }
  constraints.push(limit(filters?.limitCount ?? 20));

  const q = query(collection(db, COL.REPORTS), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId(d.id, d.data() as Report));
}

/** 인기 보고서 Top N 조회 (홈 Trending 섹션용) */
export async function getTrendingReports(n: number = 3): Promise<Report[]> {
  // 필터 없이 views 정렬만 사용 → 단일 필드 인덱스로 동작 (인덱스 자동 생성됨)
  return getReports({ limitCount: n });
}

/** 보고서 단건 조회 (문서 ID 기반) */
export async function getReportById(id: string): Promise<Report | null> {
  const snap = await getDoc(doc(db, COL.REPORTS, id));
  if (!snap.exists()) return null;
  return withId(snap.id, snap.data() as Report);
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
