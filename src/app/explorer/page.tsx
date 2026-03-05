"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo, useRef } from "react";
import { getAllCurricula, getSubjectGroup } from "@/lib/db";
import type { Curriculum } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { forceSignOut } from "@/lib/authUtils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Check, Lock, Search } from "lucide-react";
import { scienceCurriculumDB } from "@/lib/data/curriculumDetails";

// ── Supabase premium_reports 타입 ─────────────────────────────────────────────
interface PremiumReport {
  id: string;
  title: string;
  subject: string;
  preview_content: string | null;
  main_content: string | null;
  target_majors: string[];
  access_tier: string;
  large_unit_name: string;
  small_unit_name: string | null;
}

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

// ── Course Groups — Mission 2 ─────────────────────────────────────────────────
type CourseGroup = { label: string; items: string[] };

const CATEGORY_CHIP: Record<string, string> = {
  일반선택: "bg-blue-50 text-blue-600 border border-blue-200",
  진로선택: "bg-violet-50 text-violet-600 border border-violet-200",
  융합선택: "bg-amber-50 text-amber-600 border border-amber-200",
};

const COURSE_GROUPS: Record<string, CourseGroup[]> = {
  과학: [
    { label: "일반선택", items: ["물리학", "화학", "생명과학", "지구과학"] },
    {
      label: "진로선택",
      items: [
        "역학과 에너지", "전자기와 양자", "물질과 에너지", "화학 반응의 세계",
        "세포와 물질대사", "생물의 유전", "지구시스템과학", "행성우주과학",
      ],
    },
    {
      label: "융합선택",
      items: ["과학의 역사와 문화", "기후변화와 환경생태", "융합과학 탐구"],
    },
  ],
  수학: [
    { label: "일반선택", items: ["공통수학1", "공통수학2", "대수", "미적분Ⅰ"] },
    { label: "진로선택", items: ["미적분Ⅱ", "기하", "확률과 통계"] },
    { label: "융합선택", items: ["경제 수학", "인공지능 수학", "직무 수학", "수학과제 탐구"] },
  ],
};

// ── Dummy Data — Mission 1 (DB에 데이터 없을 때 fallback) ────────────────────
const DUMMY_MAJOR_UNITS: Record<string, string[]> = {
  물리학:               ["1. 역학", "2. 전기와 자기", "3. 파동", "4. 빛과 물질의 이중성"],
  화학:                 ["1. 화학의 첫걸음", "2. 원자의 세계", "3. 화학 결합", "4. 산화와 환원"],
  생명과학:             ["1. 생명 현상의 특성", "2. 세포와 생명 활동", "3. 유전", "4. 진화와 다양성"],
  지구과학:             ["1. 지권의 변화", "2. 대기와 해양", "3. 우주의 이해"],
  "역학과 에너지":       ["1. 힘과 운동", "2. 에너지와 열", "3. 유체 역학"],
  "전자기와 양자":       ["1. 전기장과 자기장", "2. 전자기 유도", "3. 양자 역학의 이해"],
  "물질과 에너지":       ["1. 화학 결합과 에너지", "2. 전기 화학", "3. 빛과 물질"],
  "화학 반응의 세계":    ["1. 산·염기 반응", "2. 산화·환원 반응", "3. 전기 화학"],
  "화학반응의 세계":     ["1. 산·염기 반응", "2. 산화·환원 반응", "3. 전기 화학"],
  "세포와 물질대사":     ["1. 세포의 구조와 기능", "2. 세포 호흡", "3. 광합성"],
  "생물의 유전":         ["1. 유전 법칙", "2. DNA와 유전자", "3. 유전자 발현"],
  "지구시스템과학":      ["1. 지구 시스템", "2. 판구조론", "3. 기후 변화"],
  "행성우주과학":        ["1. 태양계 탐사", "2. 별의 진화", "3. 우주의 팽창"],
  "과학의 역사와 문화":  ["1. 과학 혁명", "2. 근·현대 과학의 발전", "3. 과학과 인류 문화"],
  "기후변화와 환경생태": ["1. 기후 변화의 원인", "2. 생태계와 생물 다양성", "3. 지속 가능한 발전"],
  "융합과학 탐구":       ["1. 물리·화학 융합 탐구", "2. 생명·지구 융합 탐구", "3. 과학·기술 융합 탐구"],
  공통수학1:             ["1. 다항식", "2. 방정식과 부등식", "3. 도형의 방정식"],
  공통수학2:             ["1. 집합과 명제", "2. 함수", "3. 수열", "4. 지수와 로그"],
  대수:                 ["1. 지수와 로그", "2. 수열", "3. 행렬"],
  "미적분Ⅰ":             ["1. 함수의 극한과 연속", "2. 미분법", "3. 적분법"],
  "미적분Ⅱ":             ["1. 수열의 극한", "2. 미분법의 응용", "3. 적분법의 응용"],
  기하:                 ["1. 이차곡선", "2. 평면벡터", "3. 공간도형과 공간좌표"],
  "확률과 통계":         ["1. 경우의 수", "2. 확률", "3. 통계"],
  "경제 수학":           ["1. 수열과 금융 수학", "2. 함수와 경제", "3. 통계와 경제적 판단"],
  "인공지능 수학":       ["1. 행렬과 딥러닝", "2. 함수와 최적화", "3. 확률과 통계적 추론"],
  "직무 수학":           ["1. 수와 연산의 활용", "2. 통계와 의사결정", "3. 수학과 기술"],
  "수학과제 탐구":       ["1. 탐구 주제 선정", "2. 탐구 수행", "3. 결과 발표"],
};

const DUMMY_MINOR_UNITS: Record<string, string[]> = {
  // 물리학
  "1. 역학":                    ["1-1. 힘의 합성과 분해", "1-2. 뉴턴의 운동 법칙", "1-3. 운동량과 충격량", "1-4. 에너지 보존"],
  "2. 전기와 자기":              ["2-1. 전기장과 전위", "2-2. 자기장과 자기력", "2-3. 전자기 유도"],
  "3. 파동":                    ["3-1. 파동의 성질", "3-2. 소리와 진동", "3-3. 빛의 굴절과 반사"],
  "4. 빛과 물질의 이중성":       ["4-1. 광전 효과", "4-2. 물질파와 불확정성 원리"],
  // 화학
  "1. 화학의 첫걸음":           ["1-1. 원소와 화합물", "1-2. 몰과 화학식량", "1-3. 화학 반응식"],
  "2. 원자의 세계":              ["2-1. 원자 모형의 변천", "2-2. 전자 배치와 주기율표"],
  "3. 화학 결합":               ["3-1. 이온 결합", "3-2. 공유 결합", "3-3. 금속 결합"],
  "4. 산화와 환원":              ["4-1. 산화·환원 반응", "4-2. 전기 화학"],
  // 생명과학
  "1. 생명 현상의 특성":         ["1-1. 생물의 특성", "1-2. 생명 과학의 탐구 방법"],
  "2. 세포와 생명 활동":         ["2-1. 세포의 구조", "2-2. 물질대사", "2-3. 세포 분열"],
  "3. 유전":                    ["3-1. 멘델의 유전 법칙", "3-2. 연관과 교차", "3-3. 사람의 유전"],
  "4. 진화와 다양성":           ["4-1. 진화의 원리", "4-2. 생물 다양성"],
  // 지구과학
  "1. 지권의 변화":              ["1-1. 지구 내부 구조", "1-2. 판 구조론", "1-3. 지진과 화산"],
  "2. 대기와 해양":              ["2-1. 대기 순환", "2-2. 해양 순환", "2-3. 기후 변화"],
  "3. 우주의 이해":              ["3-1. 태양계 탐사", "3-2. 별의 물리량"],
  // 역학과 에너지
  "1. 힘과 운동":               ["1-1. 등속 직선 운동", "1-2. 포물선 운동", "1-3. 원운동"],
  "2. 에너지와 열":              ["2-1. 열역학 법칙", "2-2. 열과 일의 관계"],
  "3. 유체 역학":               ["3-1. 유체의 압력", "3-2. 베르누이 원리"],
  // 전자기와 양자
  "1. 전기장과 자기장":         ["1-1. 쿨롱의 법칙", "1-2. 전기장", "1-3. 자기장"],
  "2. 전자기 유도":              ["2-1. 패러데이 법칙", "2-2. 렌츠의 법칙", "2-3. 변압기"],
  "3. 양자 역학의 이해":         ["3-1. 보어의 원자 모형", "3-2. 물질파", "3-3. 반도체"],
  // 화학 반응의 세계
  "1. 산·염기 반응":             ["1-1. 산과 염기 정의", "1-2. pH와 중화 반응"],
  "2. 산화·환원 반응":           ["2-1. 산화수", "2-2. 산화·환원 반응식 완성", "2-3. 산화환원반응"],
  "3. 전기 화학":               ["3-1. 화학 전지", "3-2. 전기분해"],
  // 세포와 물질대사
  "1. 세포의 구조와 기능":       ["1-1. 원핵세포와 진핵세포", "1-2. 세포 소기관"],
  "2. 세포 호흡":               ["2-1. 해당 과정", "2-2. 미토콘드리아와 ATP"],
  "3. 광합성":                  ["3-1. 명반응", "3-2. 캘빈 회로"],
  // 생물의 유전
  "1. 유전 법칙":               ["1-1. 멘델의 유전 법칙", "1-2. 연관과 교차"],
  "2. DNA와 유전자":             ["2-1. DNA 구조", "2-2. 복제와 전사"],
  "3. 유전자 발현":              ["3-1. 번역과 단백질 합성", "3-2. 유전자 발현 조절"],
  // 지구시스템과학
  "1. 지구 시스템":              ["1-1. 지구 시스템의 구성", "1-2. 지권과 맨틀"],
  "2. 판구조론":                ["2-1. 판 경계의 종류", "2-2. 지진과 화산 분포"],
  "3. 기후 변화":               ["3-1. 기후 변화의 원인", "3-2. 기후 변화의 영향"],
  // 수학 공통
  "1. 다항식":                  ["1-1. 다항식의 연산", "1-2. 나머지 정리", "1-3. 인수분해"],
  "2. 방정식과 부등식":          ["2-1. 이차방정식", "2-2. 부등식의 풀이"],
  "3. 도형의 방정식":           ["3-1. 직선의 방정식", "3-2. 원의 방정식"],
  "1. 집합과 명제":              ["1-1. 집합의 연산", "1-2. 명제와 증명"],
  "2. 함수":                    ["2-1. 함수의 종류", "2-2. 합성함수와 역함수"],
  "3. 수열":                    ["3-1. 등차수열", "3-2. 등비수열", "3-3. 수열의 합"],
  "4. 지수와 로그":              ["4-1. 지수 법칙", "4-2. 로그의 성질"],
  "1. 함수의 극한과 연속":       ["1-1. 수열의 극한", "1-2. 함수의 연속"],
  "2. 미분법":                  ["2-1. 미분계수와 도함수", "2-2. 여러 가지 미분법"],
  "3. 적분법":                  ["3-1. 부정적분", "3-2. 정적분", "3-3. 넓이와 부피"],
  "1. 경우의 수":               ["1-1. 순열", "1-2. 조합"],
  "2. 확률":                    ["2-1. 조건부 확률", "2-2. 확률 분포"],
  "3. 통계":                    ["3-1. 모집단과 표본", "3-2. 추정과 검정"],
  "1. 이차곡선":                 ["1-1. 포물선", "1-2. 타원과 쌍곡선"],
  "2. 평면벡터":                 ["2-1. 벡터의 연산", "2-2. 벡터의 내적"],
  "3. 공간도형과 공간좌표":      ["3-1. 공간도형", "3-2. 공간좌표"],
};

// ── Stepper Step Item ─────────────────────────────────────────────────────────
interface StepItemProps {
  stepNum: number;
  label: string;
  subtitle: string;
  selected: string | null;
  items: string[];
  groupedItems?: CourseGroup[];   // Mission 2: grouped chips for step 2
  onSelect: (item: string) => void;
  isLocked: boolean;
  isLast?: boolean;
  isComingSoon?: boolean;         // Mission 1: last step placeholder
}

function StepItem({
  stepNum,
  label,
  subtitle,
  selected,
  items,
  groupedItems,
  onSelect,
  isLocked,
  isLast,
  isComingSoon,
}: StepItemProps) {
  const isCompleted = !!selected;
  const isActive = !isLocked && !isCompleted;

  return (
    <div className="relative flex gap-3.5">
      {/* 세로 연결선 — 마지막 단계엔 생략 */}
      {!isLast && (
        <div
          className={`absolute bottom-0 left-[19px] top-10 w-0.5 transition-colors duration-300 ${
            isCompleted ? "bg-[#1e3a5f]" : "bg-gray-200"
          }`}
        />
      )}

      {/* 단계 번호 원형 배지 */}
      <div
        className={`relative z-10 mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
          isCompleted
            ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
            : isActive
            ? "border-[#1e3a5f] bg-white text-[#1e3a5f]"
            : "border-gray-200 bg-gray-50 text-gray-300"
        }`}
      >
        {isCompleted ? (
          <Check className="size-4" />
        ) : (
          <span className="text-[11px] font-bold">{stepNum}</span>
        )}
      </div>

      {/* 단계 콘텐츠 */}
      <div className={`flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
        {/* 헤더 */}
        <div className="flex min-h-10 items-start justify-between pt-1.5">
          <div>
            <p
              className={`text-sm font-bold transition-colors ${
                isLocked
                  ? "text-gray-300"
                  : isCompleted
                  ? "text-[#1e3a5f]"
                  : "text-gray-800"
              }`}
            >
              {label}
            </p>
            <p
              className={`text-[11px] ${
                isLocked ? "text-gray-200" : "text-gray-400"
              }`}
            >
              {subtitle}
            </p>
          </div>

          {/* 선택 해제 버튼 */}
          {isCompleted && (
            <button
              onClick={() => onSelect(selected!)}
              className="mt-0.5 rounded-full px-2 py-0.5 text-[10px] text-gray-400 transition-colors hover:bg-red-50 hover:text-red-400"
            >
              ✕ 해제
            </button>
          )}
        </div>

        {/* 바디 */}
        <div className="mt-2">
          {isCompleted ? (
            // 선택된 값 칩
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e3a5f] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm">
              {selected}
            </span>
          ) : isComingSoon && !isLocked ? (
            // 준비 중 플레이스홀더 (마지막 단계)
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50 px-3 py-2.5">
              <span className="text-base leading-none">✨</span>
              <div>
                <p className="text-xs font-semibold text-blue-600">핵심 개념 연동 준비 중</p>
                <p className="text-[10px] text-blue-400">다음 업데이트에서 제공됩니다</p>
              </div>
            </div>
          ) : isActive ? (
            // ── 과목명 단계: 그룹 칩 ──
            groupedItems && groupedItems.length > 0 ? (
              <div className="space-y-3">
                {groupedItems.map((group) => (
                  <div key={group.label}>
                    <span
                      className={`mb-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        CATEGORY_CHIP[group.label] ?? "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {group.label}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <button
                          key={item}
                          onClick={() => onSelect(item)}
                          className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5 hover:text-[#1e3a5f]"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length > 0 ? (
              // 일반 평면 칩 목록
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <button
                    key={item}
                    onClick={() => onSelect(item)}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5 hover:text-[#1e3a5f]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-gray-400">
                해당하는 항목이 없습니다
              </p>
            )
          ) : (
            // 잠금 상태
            <div className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2">
              <Lock className="size-3 text-gray-300" />
              <p className="text-xs text-gray-300">이전 단계를 먼저 선택하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ExplorerPage() {
  const [curricula, setCurricula]   = useState<Curriculum[]>([]);
  const [reports, setReports]       = useState<PremiumReport[]>([]);
  const [curriculaLoading, setCurriculaLoading] = useState(true);
  const [curriculaError, setCurriculaError]     = useState(false);
  const [reportsLoading, setReportsLoading]     = useState(true);
  const [reportsError, setReportsError]         = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ── 선택 상태 (최대 7단계: 교과군→과목명→출판사→대단원→중단원→소단원→핵심개념) ──
  const [selSubject, setSelSubject]     = useState<string | null>(null);     // ① 교과군
  const [selCourse, setSelCourse]       = useState<string | null>(null);     // ② 과목명
  const [selPublisher, setSelPublisher] = useState<string | null>(null);     // ③ 출판사
  const [selMajorUnit, setSelMajorUnit] = useState<string | null>(null);     // ④ 대단원
  const [selMiddleUnit, setSelMiddleUnit] = useState<string | null>(null);   // ⑤ 중단원
  const [selMinorUnit, setSelMinorUnit] = useState<string | null>(null);     // ⑤/⑥ 소단원

  // ── ① Firebase: 커리큘럼(스테퍼 필터용) ──────────────────────────────────
  useEffect(() => {
    let done = false;

    // 5초 내 응답 없으면 오류 UI 표시
    const loadTimer = setTimeout(() => {
      if (!done) {
        done = true;
        setCurriculaLoading(false);
        setCurriculaError(true);
      }
    }, 5_000);

    console.log('[Explorer] Firebase 커리큘럼 요청 시작');
    getAllCurricula()
      .then((c) => {
        if (done) return;
        clearTimeout(loadTimer);
        done = true;
        console.log('[Explorer] Firebase 커리큘럼 응답 성공:', c.length, '개');
        setCurricula(c);
        setCurriculaLoading(false);
      })
      .catch((e) => {
        if (done) return;
        clearTimeout(loadTimer);
        done = true;
        console.error('[Explorer] Firebase 커리큘럼 에러:', e);
        setCurriculaLoading(false);
        setCurriculaError(true);
      });

    return () => { done = true; clearTimeout(loadTimer); };
  }, []);

  // ── ② Supabase: premium_reports 쿼리 (필터·검색 변경 시 재실행) ──────────
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false; // 언마운트/재실행 시 이전 응답 무시

    const run = async () => {
      if (cancelled) return;
      setReportsLoading(true);
      setReportsError(false);   // 재시도 시 에러 초기화

      // 8초 내 응답 없으면 네트워크 오류로 처리
      const fetchTimer = setTimeout(() => {
        if (!cancelled) {
          console.warn('[Explorer] Supabase 쿼리 8초 초과 — 타임아웃 발동');
          setReportsLoading(false);
          setReportsError(true);
        }
      }, 8_000);

      try {
        // ── 쿼리 빌드 ────────────────────────────────────────────────────────
        let query = supabase
          .from("premium_reports")
          .select(
            "id, title, subject, preview_content, target_majors, access_tier, large_unit_name, small_unit_name"
          )
          .order("id", { ascending: false });

        // subject: selCourse가 있으면 해당 과목(정밀 매칭), 없으면 selSubject(교과군 전체)
        const activeSubject = selCourse ?? selSubject;
        if (activeSubject) {
          const subjectGroup = getSubjectGroup(activeSubject);
          const orQ = subjectGroup.map((s) => `subject.ilike.%${s}%`).join(",");
          query = query.or(orQ);
        }
        // 대단원: 부분 일치 (로마자 번호 접두어 제거 후 ilike)
        if (selMajorUnit) {
          const cleaned = selMajorUnit.replace(/^([A-Za-zIVX]+|\d+)\.\s*/, "").trim();
          query = query.ilike("large_unit_name", `%${cleaned}%`);
        }
        if (searchQuery.trim())
          query = query.ilike("title", `%${searchQuery.trim()}%`);

        console.log('[Explorer] Supabase premium_reports 쿼리 시작', {
          selSubject, selCourse, selMajorUnit, searchQuery: searchQuery.trim() || '(없음)',
        });

        const { data, error } = await query;

        console.log('[Explorer] Supabase 응답:', {
          rowCount: data?.length ?? 0,
          error: error?.message ?? null,
          // 빈 배열([])은 정상 — RLS로 데이터가 없거나 필터 결과가 없는 것
          isEmpty: (data?.length ?? 0) === 0,
        });

        if (error) {
          console.error("[Explorer] Supabase 에러 상세:", error);
          if (!cancelled) setReportsError(true);
          return;
        }

        if (!cancelled) {
          // data = [] 이면 에러가 아님 — 빈 결과로 정상 처리
          setReports((data ?? []) as PremiumReport[]);
        }
      } catch (e) {
        console.error("[Explorer] 예상치 못한 예외:", e);
        if (!cancelled) setReportsError(true);
      } finally {
        clearTimeout(fetchTimer);
        if (!cancelled) setReportsLoading(false);
      }
    };

    // 검색어는 300 ms debounce, 필터 변경은 즉시 실행
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(run, searchQuery ? 300 : 0);

    return () => {
      cancelled = true; // StrictMode 이중 실행 / 빠른 필터 변경 방어
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [selSubject, selCourse, selMajorUnit, searchQuery]);

  const loading = curriculaLoading;

  // ── 단계별 항목 도출 ────────────────────────────────────────────────────────

  // ① 교과군 목록 ('정보' 카테고리 제외)
  const subjects = useMemo(
    () => unique(curricula.map((c) => c.subject)).filter((s) => s !== "정보").sort(),
    [curricula]
  );

  // ② 과목명 — COURSE_GROUPS 없는 교과군은 DB에서 평면 리스트
  const courses = useMemo(() => {
    if (!selSubject) return [];
    if (COURSE_GROUPS[selSubject]) return []; // groupedItems로 처리
    return unique(
      curricula.filter((c) => c.subject === selSubject).map((c) => c.course)
    ).sort();
  }, [curricula, selSubject]);

  // ③ 출판사 목록 — scienceCurriculumDB 우선, 없으면 Firestore fallback
  const publishers = useMemo(() => {
    if (!selCourse) return [];
    // scienceCurriculumDB에 해당 과목이 있으면 publisher 목록 직접 추출
    const scienceData = scienceCurriculumDB[selCourse];
    if (scienceData?.length) {
      return unique(scienceData.map((e) => e.publisher)).sort();
    }
    // Firestore fallback
    return unique(
      curricula
        .filter((c) => c.subject === selSubject && c.course === selCourse)
        .flatMap(
          (c) =>
            c.textbook_analysis?.publisher_specifics?.map((ps) => ps.publisher) ?? []
        )
    ).sort();
  }, [curricula, selSubject, selCourse]);

  // ④ 대단원 — DB 우선, 없으면 더미 데이터
  const majorUnits = useMemo(() => {
    if (!selCourse) return [];
    // scienceCurriculumDB 우선 시도
    const scienceData = scienceCurriculumDB[selCourse];
    if (scienceData) {
      const entry = selPublisher
        ? scienceData.find((e) => e.publisher === selPublisher) ?? scienceData[0]
        : scienceData[0];
      if (entry) return entry.units.map((u) => u.title);
    }
    // Firestore DB 조회
    const dbUnits = unique(
      curricula
        .filter((c) => {
          if (c.subject !== selSubject || c.course !== selCourse) return false;
          if (
            selPublisher &&
            !c.textbook_analysis?.publisher_specifics?.some(
              (ps) => ps.publisher === selPublisher
            )
          )
            return false;
          return true;
        })
        .map((c) => c.major_unit)
    ).sort();
    if (dbUnits.length === 0 && DUMMY_MAJOR_UNITS[selCourse]) {
      return DUMMY_MAJOR_UNITS[selCourse];
    }
    return dbUnits;
  }, [curricula, selSubject, selCourse, selPublisher]);

  // ─── 현재 선택된 대단원 객체 (scienceCurriculumDB 기반) ─────────────────────
  // 이 객체로 middleUnits 유무와 smallUnits를 파악한다
  const currentLargeUnit = useMemo(() => {
    if (!selCourse || !selMajorUnit) return null;
    const scienceData = scienceCurriculumDB[selCourse];
    if (!scienceData) return null;
    const entry = selPublisher
      ? scienceData.find((e) => e.publisher === selPublisher) ?? scienceData[0]
      : scienceData[0];
    if (!entry) return null;
    return entry.units.find((u) => u.title === selMajorUnit) ?? null;
  }, [selCourse, selPublisher, selMajorUnit]);

  // 중단원 존재 여부 및 목록
  const hasMidUnits = Boolean(currentLargeUnit?.middleUnits?.length);

  const middleUnits = useMemo(() => {
    return currentLargeUnit?.middleUnits?.map((m) => m.title) ?? [];
  }, [currentLargeUnit]);

  // ⑤/⑥ 소단원
  // - hasMidUnits && selMiddleUnit → 해당 중단원의 smallUnits
  // - !hasMidUnits → 대단원의 직접 smallUnits (scienceCurriculumDB) or Firestore/더미
  const minorUnits = useMemo(() => {
    if (!selMajorUnit) return [];

    // Case 1: 중단원이 있는 경우 → 중단원을 선택해야 소단원 도출
    if (currentLargeUnit?.middleUnits?.length) {
      if (!selMiddleUnit) return [];
      const mid = currentLargeUnit.middleUnits.find((m) => m.title === selMiddleUnit);
      return mid?.smallUnits ?? [];
    }

    // Case 2: 중단원 없이 대단원에 직접 smallUnits가 있는 경우
    if (currentLargeUnit?.smallUnits?.length) {
      return currentLargeUnit.smallUnits;
    }

    // Case 3: scienceCurriculumDB에 없는 과목 → Firestore 조회 후 더미 fallback
    const dbUnits = unique(
      curricula
        .filter((c) => {
          if (c.subject !== selSubject || c.course !== selCourse) return false;
          if (c.major_unit !== selMajorUnit) return false;
          if (
            selPublisher &&
            !c.textbook_analysis?.publisher_specifics?.some(
              (ps) => ps.publisher === selPublisher
            )
          )
            return false;
          return true;
        })
        .flatMap((c) => c.minor_units ?? [])
    );
    if (dbUnits.length === 0 && DUMMY_MINOR_UNITS[selMajorUnit]) {
      return DUMMY_MINOR_UNITS[selMajorUnit];
    }
    return dbUnits;
  }, [curricula, selSubject, selCourse, selPublisher, selMajorUnit, selMiddleUnit, currentLargeUnit]);

  // ── 선택 핸들러 (상위 단계 변경 시 하위 단계 자동 초기화) ─────────────────
  function selectSubject(s: string) {
    setSelSubject((prev) => (prev === s ? null : s));
    setSelCourse(null);
    setSelPublisher(null);
    setSelMajorUnit(null);
    setSelMiddleUnit(null);
    setSelMinorUnit(null);
  }
  function selectCourse(c: string) {
    setSelCourse((prev) => (prev === c ? null : c));
    setSelPublisher(null);
    setSelMajorUnit(null);
    setSelMiddleUnit(null);
    setSelMinorUnit(null);
  }
  function selectPublisher(p: string) {
    setSelPublisher((prev) => (prev === p ? null : p));
    setSelMajorUnit(null);
    setSelMiddleUnit(null);
    setSelMinorUnit(null);
  }
  function selectMajorUnit(m: string) {
    setSelMajorUnit((prev) => (prev === m ? null : m));
    setSelMiddleUnit(null);
    setSelMinorUnit(null);
  }
  function selectMiddleUnit(m: string) {
    setSelMiddleUnit((prev) => (prev === m ? null : m));
    setSelMinorUnit(null);
  }
  function selectMinorUnit(m: string) {
    setSelMinorUnit((prev) => (prev === m ? null : m));
  }
  function resetAll() {
    setSelSubject(null);
    setSelCourse(null);
    setSelPublisher(null);
    setSelMajorUnit(null);
    setSelMiddleUnit(null);
    setSelMinorUnit(null);
    setSearchQuery("");
    setReportsError(false);
  }

  const hasFilter = !!(
    selSubject || selCourse || selPublisher || selMajorUnit || selMiddleUnit || selMinorUnit || searchQuery
  );

  // ── 단계별 잠금 조건 ─────────────────────────────────────────────────────
  const step2Locked = !selSubject;
  const step3Locked = !selCourse;
  const step4Locked = !selCourse || (publishers.length > 0 && !selPublisher);
  // 중단원 단계: 대단원을 선택해야 활성화
  const stepMidLocked = !selMajorUnit;
  // 소단원 단계: 중단원이 있으면 중단원까지, 없으면 대단원까지 선택해야 활성화
  const stepMinorLocked = hasMidUnits ? !selMiddleUnit : !selMajorUnit;
  // 핵심개념 단계: 소단원 선택 후 활성화
  const stepFinalLocked = !selMinorUnit;

  // step 2 그룹 데이터
  const step2GroupedItems = selSubject ? (COURSE_GROUPS[selSubject] ?? undefined) : undefined;

  // 동적 단계 번호: 중단원이 있으면 소단원=6, 핵심개념=7 / 없으면 소단원=5, 핵심개념=6
  const stepNumMinor = hasMidUnits ? 6 : 5;
  const stepNumFinal = hasMidUnits ? 7 : 6;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── 헤더 ── */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-4 py-14 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4 border-blue-400/30 bg-blue-500/20 text-blue-200">
            🔍 세특 탐구소
          </Badge>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            22개정 세특 탐구 주제 탐색
          </h1>
          <p className="mt-3 text-blue-100">
            교과군부터 소단원까지 단계별로 드릴다운해 딱 맞는 탐구 주제를 찾아보세요.
          </p>

          {/* ── 메인 검색창 ── */}
          <div className="mx-auto mt-7 max-w-xl">
            <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm focus-within:border-white/50 focus-within:bg-white/15 transition-all">
              <Search className="size-4 shrink-0 text-blue-200" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="탐구 주제 제목으로 검색..."
                className="flex-1 bg-transparent text-sm text-white placeholder-blue-300 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="shrink-0 text-blue-300 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* ── 상단 탐색 경로 브레드크럼 ── */}
        {hasFilter && (
          <div className="mb-5 flex flex-wrap items-center gap-1.5 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              탐색 경로
            </span>
            {selSubject && (
              <span className="font-semibold text-[#1e3a5f]">→ {selSubject}</span>
            )}
            {selCourse && (
              <span className="font-semibold text-[#1e3a5f]">→ {selCourse}</span>
            )}
            {selPublisher && (
              <span className="font-semibold text-[#1e3a5f]">→ {selPublisher}</span>
            )}
            {selMajorUnit && (
              <span className="font-semibold text-[#1e3a5f]">→ {selMajorUnit}</span>
            )}
            {selMiddleUnit && (
              <span className="font-semibold text-[#1e3a5f]">→ {selMiddleUnit}</span>
            )}
            {selMinorUnit && (
              <span className="font-semibold text-blue-500">→ {selMinorUnit}</span>
            )}
            {searchQuery && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600">
                🔍 &quot;{searchQuery}&quot;
              </span>
            )}
            <button
              onClick={resetAll}
              className="ml-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
            >
              ✕ 초기화
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* ────────────────────────────────────────────────
              좌측: 단계별 Stepper 필터 패널
          ──────────────────────────────────────────────── */}
          <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              {/* 패널 헤더 */}
              <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
                <p className="text-sm font-bold text-gray-700">
                  탐색 경로 (1~{stepNumFinal}단계)
                </p>
                {hasFilter && (
                  <button
                    onClick={resetAll}
                    className="text-xs text-gray-400 transition-colors hover:text-red-500"
                  >
                    전체 초기화
                  </button>
                )}
              </div>

              {loading ? (
                /* 로딩 스켈레톤 */
                <div className="space-y-1 py-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex gap-3.5 pb-6">
                      <div className="size-10 shrink-0 animate-pulse rounded-full bg-gray-100" />
                      <div className="flex-1 space-y-2 pt-2">
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                        <div className="h-3 w-28 animate-pulse rounded bg-gray-100" />
                        <div className="flex gap-1.5 pt-1">
                          <div className="h-6 w-14 animate-pulse rounded-full bg-gray-100" />
                          <div className="h-6 w-14 animate-pulse rounded-full bg-gray-100" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : curriculaError ? (
                /* 커리큘럼 로딩 오류 */
                <div className="py-10 text-center">
                  <p className="mb-2 text-3xl">⚠️</p>
                  <p className="text-sm font-medium text-red-500">필터 데이터를 불러올 수 없습니다.</p>
                  <p className="mt-1 text-xs text-gray-400">
                    네트워크 상태가 원활하지 않습니다.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    다시 시도
                  </button>
                  <div className="mt-2">
                    <a href="/" className="text-xs text-gray-400 underline hover:text-gray-600">
                      홈으로 이동
                    </a>
                    <span className="mx-2 text-gray-300">|</span>
                    <button
                      onClick={forceSignOut}
                      className="text-xs text-gray-400 underline hover:text-red-500"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* ① 교과군 */}
                  <StepItem
                    stepNum={1}
                    label="교과군"
                    subtitle="최상위 교과 카테고리 선택"
                    selected={selSubject}
                    items={subjects}
                    onSelect={selectSubject}
                    isLocked={false}
                  />

                  {/* ② 과목명 */}
                  <StepItem
                    stepNum={2}
                    label="과목명"
                    subtitle="22개정 교육과정 세부 과목"
                    selected={selCourse}
                    items={courses}
                    groupedItems={step2GroupedItems}
                    onSelect={selectCourse}
                    isLocked={step2Locked}
                  />

                  {/* ③ 출판사 */}
                  <StepItem
                    stepNum={3}
                    label="출판사"
                    subtitle="교과서 출판사 선택"
                    selected={selPublisher}
                    items={publishers}
                    onSelect={selectPublisher}
                    isLocked={step3Locked}
                  />

                  {/* ④ 대단원 */}
                  <StepItem
                    stepNum={4}
                    label="대단원"
                    subtitle="해당 교과서의 대단원명"
                    selected={selMajorUnit}
                    items={majorUnits}
                    onSelect={selectMajorUnit}
                    isLocked={step4Locked}
                  />

                  {/* ⑤ 중단원 — 해당 데이터에 middleUnits가 있을 때만 동적 렌더 */}
                  {hasMidUnits && (
                    <StepItem
                      stepNum={5}
                      label="중단원"
                      subtitle="대단원 내 중간 분류 단원"
                      selected={selMiddleUnit}
                      items={middleUnits}
                      onSelect={selectMiddleUnit}
                      isLocked={stepMidLocked}
                    />
                  )}

                  {/* ⑤ or ⑥ 소단원 */}
                  <StepItem
                    stepNum={stepNumMinor}
                    label="소단원"
                    subtitle="세부 학습 단원 선택"
                    selected={selMinorUnit}
                    items={minorUnits}
                    onSelect={selectMinorUnit}
                    isLocked={stepMinorLocked}
                  />

                  {/* ⑥ or ⑦ 핵심 개념 — 준비 중 */}
                  <StepItem
                    stepNum={stepNumFinal}
                    label="핵심 개념"
                    subtitle="소단원의 핵심 학습 요소"
                    selected={null}
                    items={[]}
                    onSelect={() => {}}
                    isLocked={stepFinalLocked}
                    isLast
                    isComingSoon
                  />
                </div>
              )}
            </div>

            <p className="mt-3 text-center text-xs text-gray-400">
              단계 선택 시 우측 결과가 실시간으로 필터링됩니다
            </p>
          </div>

          {/* ────────────────────────────────────────────────
              우측: 탐구 주제 결과 카드
          ──────────────────────────────────────────────── */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {reportsLoading ? (
                  <span className="text-gray-400">불러오는 중...</span>
                ) : (
                  <>
                    <span className="font-bold text-gray-900">
                      {reports.length}개
                    </span>
                    의 탐구 주제
                    {hasFilter && (
                      <span className="ml-1 text-gray-400">검색됨</span>
                    )}
                  </>
                )}
              </p>
              {!hasFilter && (
                <p className="text-xs text-gray-400">
                  ← 좌측 필터 또는 검색창을 이용해보세요
                </p>
              )}
            </div>

            {reportsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-44 animate-pulse rounded-xl bg-gray-100"
                  />
                ))}
              </div>
            ) : reportsError ? (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-16 text-center text-red-400">
                  <p className="mb-3 text-4xl">⚠️</p>
                  <p className="text-sm font-medium text-red-600">
                    데이터를 불러올 수 없습니다.
                  </p>
                  <p className="mt-1 text-xs text-red-400">
                    네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.
                  </p>
                  <button
                    onClick={resetAll}
                    className="mt-4 rounded-full bg-red-100 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-200"
                  >
                    다시 시도
                  </button>
                </CardContent>
              </Card>
            ) : reports.length === 0 ? (
              <Card className="border-dashed border-gray-300">
                <CardContent className="py-16 text-center text-gray-400">
                  <p className="mb-3 text-4xl">🔍</p>
                  <p className="text-sm">
                    선택한 조건에 맞는 탐구 주제가 없어요.
                  </p>
                  <button
                    onClick={resetAll}
                    className="mt-4 text-xs text-blue-500 underline"
                  >
                    필터 초기화
                  </button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {reports.map((report) => {
                  const isFree = report.access_tier === "free";

                  return (
                    <Link
                      key={report.id}
                      href={`/reports/${report.id}`}
                    >
                      <Card className="group h-full cursor-pointer border-gray-200 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                        <CardHeader className="pb-2">
                          <div className="mb-2 flex flex-wrap gap-1.5">
                            {isFree ? (
                              <span className="rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-700">
                                무료
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#1e3a5f] px-2.5 py-0.5 text-[10px] font-bold text-white">
                                <Lock className="size-2.5" />
                                프리미엄
                              </span>
                            )}
                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] text-gray-600">
                              {report.subject}
                            </span>
                          </div>
                          <CardTitle className="text-sm font-semibold leading-snug text-gray-800 group-hover:text-[#1e3a5f]">
                            {report.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-0">
                          {report.preview_content && (
                            <p className="line-clamp-2 text-xs text-gray-500">
                              {report.preview_content}
                            </p>
                          )}
                          <p className="text-xs font-medium text-blue-600">
                            {report.large_unit_name}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {report.target_majors.slice(0, 2).map((m) => (
                              <span
                                key={m}
                                className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700"
                              >
                                {m}
                              </span>
                            ))}
                            {report.target_majors.length > 2 && (
                              <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-400">
                                +{report.target_majors.length - 2}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
