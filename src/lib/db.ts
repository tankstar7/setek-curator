/**
 * Firestore & Supabase 통합 데이터 액세스 유틸리티 (궁극의 정규화 및 에러 픽스)
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
// Curriculum & SkillTree (기존 로직 유지)
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
// Reports (데이터 정규화 및 ID 에러 완벽 픽스)
// ─────────────────────────────────────────────

// ✨ 핵심 1: 화면의 'Curriculum 기준표'와 100% 동일하게 이름을 맞춰주는 정규화 함수
function normalizeSubjectForUI(raw: string): string {
  if (!raw) return '기타';
  let clean = raw.replace(/[IVXⅠⅡ\s]+$/, '').trim(); // '물리학 I ' -> '물리학'
  if (clean === '물리학') return '물리'; // '물리'로 변경하여 프론트엔드 검열 통과!
  if (clean === '생명') return '생명과학';
  if (clean === '지구') return '지구과학';
  if (clean === '화학반응의 세계') return '화학 반응의 세계';
  return clean;
}

function getSubjectGroup(subject: string): string[] {
  if (!subject) return [];
  const s = subject.trim();
  if (s === '과학') return ['과학', '물리', '물리학', '역학과 에너지', '전자기와 양자', '화학', '물질과 에너지', '화학 반응의 세계', '화학반응의 세계', '생명과학', '생명', '세포와 물질대사', '생물의 유전', '지구과학', '지구', '지구시스템과학', '행성우주과학', '행정우주과학'];
  if (s === '물리' || s === '물리학') return ['물리', '물리학', '역학과 에너지', '전자기와 양자'];
  if (s === '화학') return ['화학', '물질과 에너지', '화학 반응의 세계', '화학반응의 세계'];
  if (s === '생명과학' || s === '생명') return ['생명과학', '생명', '세포와 물질대사', '생물의 유전'];
  if (s === '지구과학' || s === '지구') return ['지구과학', '지구', '지구시스템과학', '행성우주과학', '행정우주과학'];
  return [s]; 
}

export async function getReports(filters?: {
  subject?: string; major_unit?: string; publisher?: string; trend_keyword?: string; target_major?: string; limitCount?: number;
}): Promise<any[]> { 
  const { data, error } = await supabase.from('premium_reports').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) { console.error('Supabase 에러:', error); return []; }

  let results = data || [];

  if (filters?.subject) {
    const targetSubjects = getSubjectGroup(filters.subject);
    results = results.filter(item => {
      const dbSub = normalizeSubjectForUI(item.subject);
      return targetSubjects.some(t => dbSub.includes(t) || t.includes(dbSub));
    });
  }

  if (filters?.major_unit) {
    const cleanMajorFilter = filters.major_unit.replace(/^([A-Za-zIVX]+|\d+)\.\s*/, '').trim();
    results = results.filter(item => {
      const dbMajor = (item.large_unit_name || '').replace(/^([A-Za-zIVX]+|\d+)\.\s*/, '').trim();
      return dbMajor.includes(cleanMajorFilter) || cleanMajorFilter.includes(dbMajor);
    });
  }

  if (filters?.target_major) {
    results = results.filter(item => (item.target_majors || []).some((m: string) => m.includes(filters.target_major!)));
  }

  return results.map(item => {
    return {
      id: item.id?.toString(),
      trend_keyword: item.trend_keyword || '최신 트렌드',
      report_title: item.title || '제목 없음',
      
      // 화면이 뻗지 않도록 무조건 Curriculum과 일치하는 '물리' 등으로 넘겨줌!
      subject: normalizeSubjectForUI(item.subject),
      major_unit: (item.large_unit_name || '').replace(/^([A-Za-zIVX]+|\d+)\.\s*/, '').trim(),
      
      publisher: '미래엔',
      target_majors: item.target_majors || [],
      views: item.views || 0,
      
      golden_template: {
        motivation: item.preview_content || item.main_content || "탐구 동기",
        basic_knowledge: item.main_content || "기초 지식",
        application: "내용 탐구",
        in_depth: "심화 탐구",
        major_connection: "전공 연계 비전"
      }
    };
  }).slice(0, filters?.limitCount ?? 50);
}

export async function getAllReports(): Promise<any[]> {
  return getReports({ limitCount: 100 });
}

export async function getTrendingReports(n: number = 3): Promise<any[]> {
  return getReports({ limitCount: n });
}

export async function getReportById(id: string): Promise<any | null> {
  // ✨ 핵심 2: parseInt를 완벽히 제거하여 상세페이지 크래시(UUID 파싱 에러) 원천 차단
  const { data, error } = await supabase.from('premium_reports').select('*').eq('id', id).single();
  if (error || !data) return null; 

  return {
    ...data,
    id: data.id?.toString(),
    report_title: data.title || '제목 없음',
    subject: normalizeSubjectForUI(data.subject),
    major_unit: (data.large_unit_name || '').replace(/^([A-Za-zIVX]+|\d+)\.\s*/, '').trim(),
    publisher: '미래엔',
    golden_template: {
      motivation: data.preview_content || data.main_content || "탐구 동기",
      basic_knowledge: data.main_content || "기초 지식",
      application: "내용 탐구",
      in_depth: "심화 탐구",
      major_connection: "전공 연계 비전"
    }
  };
}

export async function saveReport(data: WithFieldValue<Report>, id?: string): Promise<string> { return "manual-insert-only"; }
export async function incrementReportViews(id: string): Promise<void> {}
export async function deleteReport(id: string): Promise<void> {}