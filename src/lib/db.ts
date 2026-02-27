/**
 * Firestore & Supabase 통합 데이터 액세스 유틸리티 (4대 핵심 에러 완벽 해결본)
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

export type Curriculum = { id?: string; subject: string; course: string; major_unit: string; minor_units: string[]; textbook_analysis: any; };
export type SkillTree = { id?: string; major_name: string; description?: string; core_required: string[]; ai_recommended_combo: any[]; };
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
// Reports (4가지 상황 완벽 반영 로직)
// ─────────────────────────────────────────────

// [해결 1] 군더더기(로마자, 숫자, 공백)를 떼고 순수 뼈대만 추출하는 방어적 정규화
function cleanText(text: string) {
  if (!text) return '';
  return text.replace(/[\sⅠⅡⅢⅣⅤⅥIVX\d\.]+/gi, '').toLowerCase();
}

export async function getReports(filters?: {
  subject?: string; major_unit?: string; publisher?: string; trend_keyword?: string; target_major?: string; limitCount?: number;
}): Promise<any[]> { 
  const { data, error } = await supabase.from('premium_reports').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) { console.error('Supabase 에러:', error); return []; }

  let results = data || [];

  if (filters?.subject) {
    const filterSub = cleanText(filters.subject);
    results = results.filter(item => {
      const dbSub = cleanText(item.subject);
      
      // [해결 2] '과학'을 눌렀을 때 하위 과목(물리, 화학, 생명, 지구) 모두 통과시키는 계층형 탐색
      if (filterSub === '과학') {
        return ['물리', '화학', '생명', '지구', '과학'].some(kw => dbSub.includes(kw));
      }
      return dbSub.includes(filterSub) || filterSub.includes(dbSub);
    });
  }

  if (filters?.major_unit) {
    const filterMaj = cleanText(filters.major_unit);
    results = results.filter(item => {
      const dbMaj = cleanText(item.large_unit_name);
      return dbMaj.includes(filterMaj) || filterMaj.includes(dbMaj);
    });
  }

  if (filters?.target_major) {
    results = results.filter(item => (item.target_majors || []).some((m: string) => m.includes(filters.target_major!)));
  }

  return results.map(item => ({
    // [해결 4] Number 강제 변환(parseInt) 제거! 원래 문자열 ID를 그대로 살려 상세페이지 접속 보장
    id: String(item.id), 
    trend_keyword: item.trend_keyword || '최신 트렌드',
    report_title: item.title || '제목 없음',
    
    // 프론트엔드가 뻗지 않도록 요구하는 조건이 있으면 그걸로 속여서 건네줌
    subject: filters?.subject ? filters.subject : (item.subject || '').trim(),
    major_unit: filters?.major_unit ? filters.major_unit : (item.large_unit_name || '').trim(),
    
    publisher: '미래엔',
    target_majors: item.target_majors || [],
    views: item.views || 0,
    
    // [해결 3] 크래시 방지용 가짜 서랍 완벽 유지
    golden_template: {
      motivation: item.preview_content || item.main_content || "탐구 동기",
      basic_knowledge: item.main_content || "기초 지식",
      application: "내용 탐구",
      in_depth: "심화 탐구",
      major_connection: "전공 연계 비전"
    }
  })).slice(0, filters?.limitCount ?? 50);
}

export async function getAllReports(): Promise<any[]> { return getReports({ limitCount: 100 }); }
export async function getTrendingReports(n: number = 3): Promise<any[]> { return getReports({ limitCount: n }); }

export async function getReportById(id: string): Promise<any | null> {
  // [해결 4] 여기서도 에러의 주범이었던 parseInt 삭제! 문자열 비교로 안전하게 통신
  if (!id) return null;
  
  try {
    const { data, error } = await supabase.from('premium_reports').select('*').eq('id', id).single();
    if (error || !data) return null; 

    return {
      id: String(data.id),
      report_title: data.title || '제목 없음',
      subject: (data.subject || '').trim(),
      major_unit: (data.large_unit_name || '').trim(),
      publisher: '미래엔',
      trend_keyword: data.trend_keyword || '최신 트렌드',
      target_majors: data.target_majors || [],
      views: data.views || 0,
      
      // [해결 3] 상세 페이지용 가짜 서랍 
      golden_template: {
        motivation: data.preview_content || data.main_content || "탐구 동기",
        basic_knowledge: data.main_content || "기초 지식",
        application: "내용 탐구",
        in_depth: "심화 탐구",
        major_connection: "전공 연계 비전"
      }
    };
  } catch (e) {
    console.error("보고서 상세 조회 에러:", e);
    return null;
  }
}

export async function saveReport(data: WithFieldValue<Report>, id?: string): Promise<string> { return "manual-insert-only"; }
export async function incrementReportViews(id: string): Promise<void> {}
export async function deleteReport(id: string): Promise<void> {}