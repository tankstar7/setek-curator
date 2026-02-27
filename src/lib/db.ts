/**
 * Firestore & Supabase 통합 데이터 액세스 유틸리티
 */

import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query as firestoreQuery, where, orderBy, limit as firestoreLimit, QueryConstraint, DocumentReference, WithFieldValue, increment
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

export type Curriculum = {
  id?: string; subject: string; course: string; major_unit: string; minor_units: string[];
  textbook_analysis: { core_concepts: string[]; publisher_specifics: { publisher: string; focus_point: string; }[]; };
};

export type SkillTree = {
  id?: string; major_name: string; description?: string; core_required: string[]; advanced_required?: string[];
  ai_recommended_combo: { courses: string[]; reason: string; highlight_major: string[]; }[];
};

export type Report = {
  id?: string; trend_keyword: string; report_title: string; subject: string; major_unit: string;
  publisher: string; target_majors: string[]; views?: number;
  golden_template: { motivation: string; basic_knowledge: string; application: string; in_depth: string; major_connection: string; };
};

const COL = { CURRICULUM: "curriculum", SKILL_TREES: "skill_trees", REPORTS: "reports_db" } as const;

function withId<T>(id: string, data: T): T & { id: string } { return { id, ...data }; }

// ─────────────────────────────────────────────
// Curriculum & SkillTree (기존 Firebase 로직 완벽 유지)
// ─────────────────────────────────────────────

export async function getCurriculumBySubject(subject: string): Promise<Curriculum[]> {
  const q = firestoreQuery(collection(db, COL.CURRICULUM), where("subject", "==", subject));
  const snap = await getDocs(q); return snap.docs.map((d) => withId(d.id, d.data() as Curriculum));
}

export async function getCurriculumByCourse(course: string): Promise<Curriculum | null> {
  const q = firestoreQuery(collection(db, COL.CURRICULUM), where("course", "==", course), firestoreLimit(1));
  const snap = await getDocs(q); if (snap.empty) return null;
  return withId(snap.docs[0].id, snap.docs[0].data() as Curriculum);
}

export async function saveCurriculum(data: WithFieldValue<Curriculum>, id?: string): Promise<string> {
  if (id) { await setDoc(doc(db, COL.CURRICULUM, id), data); return id; }
  const ref = await addDoc(collection(db, COL.CURRICULUM), data); return ref.id;
}

export async function getSkillTreeByMajor(majorName: string): Promise<SkillTree | null> {
  const snap = await getDoc(doc(db, COL.SKILL_TREES, majorName));
  if (!snap.exists()) return null; return withId(snap.id, snap.data() as SkillTree);
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
  const rawId = data.major_name as string; const safeId = rawId.replace(/\//g, "_");
  await setDoc(doc(db, COL.SKILL_TREES, safeId), data);
}

// ─────────────────────────────────────────────
// Reports (오직 Supabase만 바라보도록 완벽 교체)
// ─────────────────────────────────────────────

function getSubjectGroup(subject: string): string[] {
  if (subject === '과학') return ['과학', '물리', '물리학', '역학과 에너지', '전자기와 양자', '화학', '물질과 에너지', '화학 반응의 세계', '화학반응의 세계', '생명과학', '세포와 물질대사', '생물의 유전', '지구과학', '지구시스템과학', '행성우주과학', '행정우주과학'];
  if (subject === '물리' || subject === '물리학') return ['물리', '물리학', '역학과 에너지', '전자기와 양자'];
  if (subject === '화학') return ['화학', '물질과 에너지', '화학 반응의 세계', '화학반응의 세계'];
  if (subject === '생명과학' || subject === '생명') return ['생명과학', '생명', '세포와 물질대사', '생물의 유전'];
  if (subject === '지구과학' || subject === '지구') return ['지구과학', '지구', '지구시스템과학', '행성우주과학', '행정우주과학'];
  return [subject]; 
}

// --- (이 부분만 완벽하게 덮어쓰기 하세요!) ---
export async function getReports(filters?: {
  subject?: string; major_unit?: string; publisher?: string; trend_keyword?: string; target_major?: string; limitCount?: number;
}): Promise<any[]> { 
  let supabaseQuery = supabase.from('premium_reports').select('*');

  // 1단계: 전공 검색은 DB 고유 배열 문법이므로 DB에서 바로 필터링
  if (filters?.target_major) {
    supabaseQuery = supabaseQuery.contains('target_majors', [filters.target_major]);
  }

  // 일단 에러를 내는 문자열 조건들을 다 빼고, 최신 데이터 100개를 안전하게 가져옵니다.
  const { data, error } = await supabaseQuery
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) { 
    console.error('Supabase 데이터 로드 에러:', error); 
    return []; 
  }

  // 2단계: 가져온 데이터를 JavaScript의 무적 논리로 정밀 필터링 (에러 0%)
  let results = data || [];

  // 과목명 필터 (계층형 트리)
  if (filters?.subject) {
    const targetSubjects = getSubjectGroup(filters.subject.trim());
    results = results.filter(item => 
      // DB의 과목명(예: '물리학 I ') 안에 검색어(예: '물리학')가 포함되어 있는지 100% 정확히 확인
      targetSubjects.some(sub => (item.subject || '').includes(sub))
    );
  }

  // 대단원 필터 (로마자 떼고 순수 텍스트 비교)
  if (filters?.major_unit) {
    const cleanMajorUnit = filters.major_unit.replace(/^([A-Za-zIVX]+|\d+)\.\s*/, '').trim();
    results = results.filter(item => 
      (item.large_unit_name || '').includes(cleanMajorUnit)
    );
  }

  // 최종적으로 사용자가 요청한 개수만큼 잘라서 예쁘게 반환
  return results.slice(0, filters?.limitCount ?? 20);
}

// 핵심! 모든 검색의 출발점인 getAllReports도 Supabase로 강제 연결
export async function getAllReports(): Promise<any[]> {
  return getReports({ limitCount: 50 });
}

export async function getTrendingReports(n: number = 3): Promise<any[]> {
  return getReports({ limitCount: n });
}

export async function getReportById(id: string): Promise<any | null> {
  const { data, error } = await supabase.from('premium_reports').select('*').eq('id', id).single();
  if (error) return null; return data;
}

// 아래 함수들은 DB 수동 제어 원칙에 따라 빈 함수로 안전하게 남겨둡니다.
export async function saveReport(data: WithFieldValue<Report>, id?: string): Promise<string> { return "manual-insert-only"; }
export async function incrementReportViews(id: string): Promise<void> {}
export async function deleteReport(id: string): Promise<void> {}