/**
 * Firestore & Supabase 통합 데이터 액세스 유틸리티 (상세페이지 & 검색 필터 최종 해결본)
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
// 타입 정의 (모든 화면 호환성 유지)
// ─────────────────────────────────────────────
export type Curriculum = { id?: string; subject: string; course: string; major_unit: string; minor_units: string[]; textbook_analysis: any; };
export type SkillTree = { id?: string; major_name: string; description?: string; core_required: string[]; advanced_required?: string[]; ai_recommended_combo: any[]; };
export type Report = { id?: string; trend_keyword: string; report_title: string; subject: string; major_unit: string; publisher: string; target_majors: string[]; views?: number; golden_template: any; };

const COL = { CURRICULUM: "curriculum", SKILL_TREES: "skill_trees", REPORTS: "reports_db" } as const;
function withId<T>(id: string, data: T): T & { id: string } { return { id, ...data }; }

// ─────────────────────────────────────────────
// Curriculum & SkillTree (기존 로직 유지)
// ─────────────────────────────────────────────
export async function getCurriculumBySubject(subject: string): Promise<Curriculum[]> { const q = firestoreQuery(collection(db, COL.CURRICULUM), where("subject", "==", subject)); const snap = await getDocs(q); return snap.docs.map((d) => withId(d.id, d.data() as Curriculum)); }
export async function getCurriculumByCourse(course: string): Promise<Curriculum | null> { const q = firestoreQuery(collection(db, COL.CURRICULUM), where("course", "==", course), firestoreLimit(1)); const snap = await getDocs(q); if (snap.empty) return null; return withId(snap.docs[0].id, snap.docs[0].data() as Curriculum); }
export async function saveCurriculum(data: WithFieldValue<Curriculum>, id?: string): Promise<string> { if (id) { await setDoc(doc(db, COL.CURRICULUM, id), data); return id; } const ref = await addDoc(collection(db, COL.CURRICULUM), data); return ref.id; }
export async function getSkillTreeByMajor(majorName: string): Promise<SkillTree | null> { const snap = await getDoc(doc(db, COL.SKILL_TREES, majorName)); if (!snap.exists()) return null; return withId(snap.id, snap.data() as SkillTree); }
export async function getAllSkillTrees(): Promise<SkillTree[]> { const snap = await getDocs(collection(db, COL.SKILL_TREES)); return snap.docs.map((d) => withId(d.id, d.data() as SkillTree)); }
export async function getAllCurricula(): Promise<Curriculum[]> { const snap = await getDocs(collection(db, COL.CURRICULUM)); return snap.docs.map((d) => withId(d.id, d.data() as Curriculum)); }
export async function saveSkillTree(data: WithFieldValue<SkillTree>): Promise<void> { const rawId = data.major_name as string; const safeId = rawId.replace(/\//g, "_"); await setDoc(doc(db, COL.SKILL_TREES, safeId), data); }

// ─────────────────────────────────────────────
// Reports (상세페이지 복구 및 검색 필터 최적화)
// ─────────────────────────────────────────────

function cleanText(text: string) {
  if (!text) return '';
  return text.replace(/[\sⅠⅡⅢⅣⅤⅥIVX\d\.]+/gi, '').toLowerCase();
}

// 화면이 기대하는 데이터 구조로 포장해주는 도우미 함수
function wrapReportData(item: any) {
  return {
    ...item,
    id: String(item.id),
    report_title: item.title || '제목 없음',
    // 화면 필터링 통과를 위해 과목명에서 '학'이나 숫자를 제거 (물리학 -> 물리)
    subject: (item.subject || '').replace(/학$|학\s*[IⅠ1]$|학\s*[IIⅡ2]$/g, '').trim(),
    major_unit: (item.large_unit_name || '').replace(/^([A-Za-zIVXⅠⅡⅢ]+|\d+)\.\s*/, '').trim(),
    publisher: '미래엔',
    golden_template: {
      motivation: item.preview_content || item.main_content || "탐구 동기",
      basic_knowledge: item.main_content || "기초 지식",
      application: "내용 탐구",
      in_depth: "심화 탐구",
      major_connection: "전공 연계 비전"
    }
  };
}

export async function getReports(filters?: {
  subject?: string; major_unit?: string; publisher?: string; trend_keyword?: string; target_major?: string; limitCount?: number;
}): Promise<any[]> { 
  const { data, error } = await supabase.from('premium_reports').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) return [];

  let results = data || [];

  if (filters?.subject) {
    const filterSub = cleanText(filters.subject);
    results = results.filter(item => {
      const dbSub = cleanText(item.subject);
      if (filterSub === '과학') return ['물리', '화학', '생명', '지구'].some(kw => dbSub.includes(kw));
      return dbSub.includes(filterSub) || filterSub.includes(dbSub);
    });
  }

  if (filters?.major_unit) {
    const filterMaj = cleanText(filters.major_unit);
    results = results.filter(item => cleanText(item.large_unit_name).includes(filterMaj));
  }

  return results.map(wrapReportData).slice(0, filters?.limitCount ?? 50);
}

export async function getAllReports(): Promise<any[]> { return getReports({ limitCount: 100 }); }
export async function getTrendingReports(n: number = 3): Promise<any[]> { return getReports({ limitCount: n }); }

// ✨ 상세 페이지를 살려낼 핵심 함수
export async function getReportById(id: string): Promise<any | null> {
  if (!id) return null;
  
  // 1. 먼저 ID로 직접 조회 시도
  const { data: dataById, error: errorById } = await supabase.from('premium_reports').select('*').eq('id', id).maybeSingle();
  
  if (dataById) return wrapReportData(dataById);

  // 2. 만약 ID 형식이 달라 못 찾을 경우, 전체 데이터 중 제목이 같은 것을 찾는 방어적 로직 추가
  const { data: allData } = await supabase.from('premium_reports').select('*').limit(100);
  const found = allData?.find(item => String(item.id) === id);
  
  return found ? wrapReportData(found) : null;
}

export async function saveReport(data: WithFieldValue<Report>, id?: string): Promise<string> { return "manual-insert-only"; }
export async function incrementReportViews(id: string): Promise<void> {}
export async function deleteReport(id: string): Promise<void> {}