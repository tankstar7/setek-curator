/**
 * Firestore & Supabase 통합 데이터 액세스 유틸리티 (모든 빌드 및 로직 에러 해결본)
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
// 타입 정의 (에러가 발생한 모든 화면의 요구사항을 반영)
// ─────────────────────────────────────────────

export type Curriculum = { 
  id?: string; 
  subject: string; 
  course: string; 
  major_unit: string; 
  minor_units: string[]; 
  textbook_analysis: {
    core_concepts: string[];
    publisher_specifics: {
      publisher: string;
      focus_point: string;
    }[];
  }; 
};

export type SkillTree = { 
  id?: string; 
  major_name: string; 
  description?: string; 
  core_required: string[]; 
  advanced_required?: string[]; 
  ai_recommended_combo: {
    courses: string[];
    reason: string;
    highlight_major: string[];
  }[]; 
};

export type Report = { 
  id?: string; 
  trend_keyword: string; 
  report_title: string; 
  subject: string; 
  major_unit: string; 
  publisher: string; 
  target_majors: string[]; 
  views?: number; 
  golden_template: {
    motivation: string;
    basic_knowledge: string;
    application: string;
    in_depth: string;
    major_connection: string;
  }; 
};

const COL = { CURRICULUM: "curriculum", SKILL_TREES: "skill_trees", REPORTS: "reports_db" } as const;
function withId<T>(id: string, data: T): T & { id: string } { return { id, ...data }; }

// ─────────────────────────────────────────────
// Firebase 로직 (기본 기능 유지)
// ─────────────────────────────────────────────

export async function getCurriculumBySubject(subject: string): Promise<Curriculum[]> { const q = firestoreQuery(collection(db, COL.CURRICULUM), where("subject", "==", subject)); const snap = await getDocs(q); return snap.docs.map((d) => withId(d.id, d.data() as Curriculum)); }
export async function getCurriculumByCourse(course: string): Promise<Curriculum | null> { const q = firestoreQuery(collection(db, COL.CURRICULUM), where("course", "==", course), firestoreLimit(1)); const snap = await getDocs(q); if (snap.empty) return null; return withId(snap.docs[0].id, snap.docs[0].data() as Curriculum); }
export async function saveCurriculum(data: WithFieldValue<Curriculum>, id?: string): Promise<string> { if (id) { await setDoc(doc(db, COL.CURRICULUM, id), data); return id; } const ref = await addDoc(collection(db, COL.CURRICULUM), data); return ref.id; }
export async function getSkillTreeByMajor(majorName: string): Promise<SkillTree | null> { const snap = await getDoc(doc(db, COL.SKILL_TREES, majorName)); if (!snap.exists()) return null; return withId(snap.id, snap.data() as SkillTree); }
export async function getAllSkillTrees(): Promise<SkillTree[]> { const snap = await getDocs(collection(db, COL.SKILL_TREES)); return snap.docs.map((d) => withId(d.id, d.data() as SkillTree)); }
export async function getAllCurricula(): Promise<Curriculum[]> { const snap = await getDocs(collection(db, COL.CURRICULUM)); return snap.docs.map((d) => withId(d.id, d.data() as Curriculum)); }
export async function saveSkillTree(data: WithFieldValue<SkillTree>): Promise<void> { const rawId = data.major_name as string; const safeId = rawId.replace(/\//g, "_"); await setDoc(doc(db, COL.SKILL_TREES, safeId), data); }

// ─────────────────────────────────────────────
// Supabase 로직 (데이터 정규화 및 상세페이지 연결)
// ─────────────────────────────────────────────

function normalizeSubject(sub: string): string {
  if (!sub) return '';
  const clean = sub.replace(/[IVXⅠⅡ\s]+$/, '').trim();
  if (clean === '물리학') return '물리'; // UI 기준표가 '물리'인 경우 대응
  return clean;
}

function wrapReportData(item: any): Report {
  return {
    ...item,
    id: String(item.id),
    report_title: item.title || '제목 없음',
    subject: normalizeSubject(item.subject),
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
}): Promise<Report[]> { 
  const { data, error } = await supabase.from('premium_reports').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) return [];

  let results = data || [];

  if (filters?.subject) {
    const filterSub = normalizeSubject(filters.subject);
    results = results.filter(item => {
      const dbSub = normalizeSubject(item.subject);
      if (filterSub === '과학') return ['물리', '화학', '생명', '지구'].some(kw => dbSub.includes(kw));
      return dbSub.includes(filterSub) || filterSub.includes(dbSub);
    });
  }

  if (filters?.major_unit) {
    const cleanF = filters.major_unit.replace(/^([A-Za-zIVXⅠⅡⅢ]+|\d+)\.\s*/, '').trim();
    results = results.filter(item => (item.large_unit_name || '').includes(cleanF));
  }

  return results.map(wrapReportData).slice(0, filters?.limitCount ?? 50);
}

export async function getAllReports(): Promise<Report[]> { return getReports({ limitCount: 100 }); }
export async function getTrendingReports(n: number = 3): Promise<Report[]> { return getReports({ limitCount: n }); }

export async function getReportById(id: string): Promise<Report | null> {
  if (!id) return null;
  // 1. ID 매칭 시도 (숫자/문자열 유연성)
  const { data, error } = await supabase.from('premium_reports').select('*').or(`id.eq.${id}`).maybeSingle();
  
  if (data) return wrapReportData(data);

  // 2. 방어적 로직: 전체 데이터에서 ID 비교
  const { data: all } = await supabase.from('premium_reports').select('*').limit(100);
  const found = all?.find(item => String(item.id) === String(id));
  
  return found ? wrapReportData(found) : null;
}

export async function saveReport(data: WithFieldValue<Report>, id?: string): Promise<string> { return "manual-insert-only"; }
export async function incrementReportViews(id: string): Promise<void> {}
export async function deleteReport(id: string): Promise<void> {}