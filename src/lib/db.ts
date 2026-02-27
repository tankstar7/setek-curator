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
 */
export type SkillTree = {
  id?: string;
  major_name: string;         // 목표 전공 (예: 기계공학과)
  description?: string;       // 전공 한 줄 설명
  core_required: string[];    // 공통 필수 수강 과목명 배열
  advanced_required?: string[]; // [수정 1] Vercel 에러 방지용 타입 복구
  ai_recommended_combo: {
    courses: string[];          // [수정 1] Vercel 에러 방지용 타입 복구
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

function withId<T>(id: string, data: T): T & { id: string } {
  return { id, ...data };
}

// ─────────────────────────────────────────────
// curriculum 컬렉션
// ─────────────────────────────────────────────

export async function getCurriculumBySubject(subject: string): Promise<Curriculum[]> {
  const q = query(collection(db, COL.CURRICULUM), where("subject", "==", subject));
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId(d.id, d.data() as Curriculum));
}

export async function getCurriculumByCourse(course: string): Promise<Curriculum | null> {
  const q = query(collection(db, COL.CURRICULUM), where("course", "==", course), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return withId(snap.docs[0].id, snap.docs[0].data() as Curriculum);
}

export async function saveCurriculum(data: WithFieldValue<Curriculum>, id?: string): Promise<string> {
  if (id) { await setDoc(doc(db, COL.CURRICULUM, id), data); return id; }
  const ref = await addDoc(collection(db, COL.CURRICULUM), data); return ref.id;
}

// ─────────────────────────────────────────────
// skill_trees 컬렉션
// ─────────────────────────────────────────────

export async function getSkillTreeByMajor(majorName: string): Promise<SkillTree | null> {
  const snap = await getDoc(doc(db, COL.SKILL_TREES, majorName));
  if (!snap.exists()) return null;
  return withId(snap.id, snap.data() as SkillTree);
}

export async function getAllSkillTrees(): Promise<SkillTree[]> {
  const snap = await getDocs(collection(db, COL.SKILL_TREES));
  return snap.docs.map((d) => withId(d.id, d.data() as SkillTree));
}

export async function getAllCurricula(): Promise<Curriculum[]> {
  const snap = await getDocs(collection(db, COL.CURRICULUM));
  return snap.docs.map((d) => withId(d.id, d.data() as Curriculum));
}

export async function saveSkillTree(data: WithFieldValue<SkillTree>): Promise<void> {
  const rawId = data.major_name as string;
  const safeId = rawId.replace(/\//g, "_");
  await setDoc(doc(db, COL.SKILL_TREES, safeId), data);
}

// ─────────────────────────────────────────────
// reports_db 컬렉션
// ─────────────────────────────────────────────

// --- 1. 계층형 과목 매핑 도우미 함수 ---
function getSubjectGroup(subject: string): string[] {
  if (subject === '과학') {
    return [
      '과학', '물리', '물리학', '역학과 에너지', '전자기와 양자',
      '화학', '물질과 에너지', '화학 반응의 세계', '화학반응의 세계',
      '생명과학', '세포와 물질대사', '생물의 유전',
      '지구과학', '지구시스템과학', '행성우주과학', '행정우주과학'
    ];
  }
  if (subject === '물리' || subject === '물리학') return ['물리', '물리학', '역학과 에너지', '전자기와 양자'];
  if (subject === '화학') return ['화학', '물질과 에너지', '화학 반응의 세계', '화학반응의 세계'];
  if (subject === '생명과학' || subject === '생명') return ['생명과학', '생명', '세포와 물질대사', '생물의 유전'];
  if (subject === '지구과학' || subject === '지구') return ['지구과학', '지구', '지구시스템과학', '행성우주과학', '행정우주과학'];
  
  return [subject]; 
}

// --- 2. 새로 교체되는 getReports 함수 (Supabase + 계층형 검색) ---
export async function getReports(filters?: {
  subject?: string;
  major_unit?: string;
  publisher?: string;
  trend_keyword?: string;
  target_major?: string;
  limitCount?: number;
}): Promise<any[]> { 
  let query = supabase.from('premium_reports').select('*');

  if (filters?.subject) {
    const targetSubjects = getSubjectGroup(filters.subject.trim());
    // [수정 2] Supabase 와일드카드는 *가 아니라 %여야 합니다. 이 부분만 수정했습니다.
    const orQuery = targetSubjects.map(sub => `subject.ilike.%${sub}%`).join(',');
    query = query.or(orQuery);
  }

  if (filters?.major_unit) {
    const cleanMajorUnit = filters.major_unit.replace(/^([A-Za-zIVX]+|\d+)\.\s*/, '').trim();
    // [수정 2] * 대신 % 사용
    query = query.ilike('large_unit_name', `%${cleanMajorUnit}%`);
  }

  if (filters?.target_major) {
    query = query.contains('target_majors', [filters.target_major]);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(filters?.limitCount ?? 20);

  if (error) {
    console.error('Supabase 데이터 로드 에러:', error);
    return [];
  }
  return data;
}

// [수정 3] 초기 로딩 시 텅 비는 현상을 막기 위해 Firebase가 아닌 위 getReports(Supabase)를 바라보게 수정
export async function getAllReports(): Promise<any[]> {
  return getReports({ limitCount: 50 });
}

export async function getTrendingReports(n: number = 3): Promise<any[]> {
  return getReports({ limitCount: n });
}

export async function getReportById(id: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('premium_reports')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !data) return null;

  // [수정 4] 화면이 뻗지 않도록 기존 데이터에 golden_template 껍데기만 씌워서 반환
  return {
    ...data,
    id: String(data.id),
    golden_template: {
      motivation: data.preview_content || data.main_content || "탐구 동기",
      basic_knowledge: data.main_content || "기초 지식",
      application: "내용 탐구",
      in_depth: "심화 탐구",
      major_connection: "전공 연계 비전"
    }
  };
}

export async function saveReport(data: WithFieldValue<Report>, id?: string): Promise<string> {
  if (id) { await setDoc(doc(db, COL.REPORTS, id), data); return id; }
  const ref = await addDoc(collection(db, COL.REPORTS), data); return ref.id;
}
export async function incrementReportViews(id: string): Promise<void> {
  const ref = doc(db, COL.REPORTS, id) as DocumentReference;
  await updateDoc(ref, { views: increment(1) });
}
export async function deleteReport(id: string): Promise<void> {
  await deleteDoc(doc(db, COL.REPORTS, id));
}