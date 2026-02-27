"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { universityData, type MajorData } from "@/lib/data/universities";
import { ChevronDown, BookOpen, Star, Info, Lightbulb } from "lucide-react";

// ── 평가 스타일 키워드 기반 서술형 설명 생성 ──────────────────────────────────
// 독립적인 if 문으로 다중 키워드 매칭을 지원합니다.
function getStyleDescription(style: string): string[] {
  const descriptions: string[] = [];

  if (style.includes("지정") || style.includes("핵심")) {
    descriptions.push("🎯 전공 이수에 필수적인 핵심 과목을 수강했는지 깐깐하게 확인해요.");
  }

  if (style.includes("개수") || style.includes("조건")) {
    descriptions.push("✅ 대학이 요구하는 특정 교과군의 최소 이수 과목(개수) 기준을 채워야 해요.");
  }

  if (style.includes("위계") || style.includes("심화")) {
    descriptions.push("🪜 기초에서 심화(Ⅰ→Ⅱ)로 이어지는 단계적 이수와 깊이 있는 탐구를 중시해요.");
  }

  if (style.includes("융합") || style.includes("다학제")) {
    descriptions.push("🧩 과목의 경계를 넘나드는 폭넓은 선택과 융합적 사고력을 높게 평가해요.");
  }

  if (style.includes("기초") || style.includes("계열")) {
    descriptions.push("🌱 특정 전공에 얽매이기보다, 해당 계열 진학을 위한 튼튼한 기초 체력을 선호해요.");
  }

  if (style.includes("도전")) {
    descriptions.push("🔥 이수하기 어려운 과목이라도 회피하지 않고 과감하게 도전하는 학업 태도를 봅니다.");
  }

  // 위 키워드 중 하나도 매칭되지 않은 경우 — 원본 문자열을 부드러운 어투로 출력
  if (descriptions.length === 0) {
    descriptions.push(`📋 이 대학은 "${style}" 방식으로 교과 이수 현황을 살펴봐요.`);
  }

  return descriptions;
}

// ── 커스텀 Select 래퍼 ────────────────────────────────────────────────────────
interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder: string;
  options: string[];
}

function StyledSelect({ value, onChange, disabled, placeholder, options }: SelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-10 text-sm font-medium text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
    </div>
  );
}

// ── 과목명 / 가이드라인 조건 분리 유틸리티 ─────────────────────────────────────
const CONDITION_KEYWORDS = [
  "필수", "이상", "이수", "권장", "우선",
  "또는", "전반", "영역", "관련", "조합", "택1",
];
const MAX_SUBJECT_LENGTH = 14;

function parseSubjectList(items: string[]): { subjects: string[]; conditions: string[] } {
  const subjects: string[] = [];
  const conditions: string[] = [];
  for (const item of items) {
    const isCondition =
      CONDITION_KEYWORDS.some((kw) => item.includes(kw)) ||
      item.length > MAX_SUBJECT_LENGTH;
    if (isCondition) conditions.push(item);
    else subjects.push(item);
  }
  return { subjects, conditions };
}

// ── 2022 개정 과목 카테고리 분류 유틸리티 ────────────────────────────────────
type SubjectCategory = "일반선택" | "진로선택" | "융합선택";

// 진로선택을 먼저 검사 — '화학', '생명과학' 등 일반선택 키워드가 과목명 일부에도
// 포함되어 있어 순서 역전 시 오분류 발생 방지 (예: '화학 반응의 세계' → 진로선택)
const CAREER_KW: string[] = [
  "기하", "미적분Ⅱ",
  "역학과 에너지", "전자기와 양자",
  "물질과 에너지", "화학 반응의 세계",
  "세포와 물질대사", "생물의 유전",
  "지구시스템과학", "행성우주과학",
];

const GENERAL_KW: string[] = [
  "확률과 통계", "대수", "미적분Ⅰ",
  "물리학", "화학", "생명과학", "지구과학",
];

const CONVERGENCE_KW: string[] = [
  "기후변화", "환경생태", "융합",
  "인공지능 수학", "실용 통계", "수학과 문화",
];

function classifySubject(subject: string): SubjectCategory {
  if (CAREER_KW.some((kw) => subject.includes(kw))) return "진로선택";
  if (subject.includes("(일반)") || GENERAL_KW.some((kw) => subject.includes(kw)))
    return "일반선택";
  if (subject.includes("(융합)") || CONVERGENCE_KW.some((kw) => subject.includes(kw)))
    return "융합선택";
  return "진로선택"; // 기본값: 위 두 그룹에 속하지 않는 순수 과목
}

interface GroupedSubjects {
  일반선택: string[];
  진로선택: string[];
  융합선택: string[];
}

function groupSubjects(subjects: string[]): GroupedSubjects {
  const groups: GroupedSubjects = { 일반선택: [], 진로선택: [], 융합선택: [] };
  for (const s of subjects) groups[classifySubject(s)].push(s);
  return groups;
}

// ── 카테고리별 칩 렌더링 컴포넌트 ────────────────────────────────────────────
const CATEGORY_META: Record<SubjectCategory, { label: string; abbr: string }> = {
  일반선택: { label: "일반선택", abbr: "[일반]" },
  진로선택: { label: "진로선택", abbr: "[선택]" },
  융합선택: { label: "융합선택", abbr: "[융합]" },
};

// 표시 순서: 일반선택 → 진로선택 → 융합선택 (이수 위계 흐름과 일치)
const CATEGORY_ORDER: SubjectCategory[] = ["일반선택", "진로선택", "융합선택"];

function GroupedChips({
  subjects,
  variant,
}: {
  subjects: string[];
  variant: "core" | "rec";
}) {
  if (subjects.length === 0) return null;
  const groups = groupSubjects(subjects);

  return (
    <div className="space-y-3.5">
      {CATEGORY_ORDER.map((cat) => {
        const list = groups[cat];
        if (list.length === 0) return null; // 해당 카테고리 항목 없으면 렌더링 생략

        return (
          <div key={cat}>
            {/* 카테고리 소제목 */}
            <p className="mb-1.5 text-xs font-semibold tracking-wider text-gray-400">
              {CATEGORY_META[cat].abbr}
            </p>
            {/* 과목 칩 — "(일반)", "(융합)" 등 분류 태그는 화면에서 제거 */}
            <div className="flex flex-wrap gap-2">
              {list.map((subject) => {
                const label = subject.replace(/\(일반\)|\(융합\)/g, "").trim();
                return variant === "core" ? (
                  <span
                    key={subject}
                    className="rounded-full bg-[#1e3a5f] px-4 py-1.5 text-sm font-semibold text-white shadow-sm"
                  >
                    {label}
                  </span>
                ) : (
                  <span
                    key={subject}
                    className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 조건 안내 텍스트 컴포넌트 ─────────────────────────────────────────────────
function ConditionNotes({
  conditions,
  variant,
}: {
  conditions: string[];
  variant: "core" | "rec";
}) {
  if (conditions.length === 0) return null;
  const isCore = variant === "core";
  return (
    <div className="mt-3 space-y-1.5">
      {conditions.map((cond) => (
        <div
          key={cond}
          className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
            isCore ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"
          }`}
        >
          <span className="mt-px shrink-0 text-base leading-none">📌</span>
          <span className="font-medium leading-snug">{cond}</span>
        </div>
      ))}
    </div>
  );
}

// ── 결과 카드 ─────────────────────────────────────────────────────────────────
function ResultCard({ major }: { major: MajorData }) {
  const styleDescriptions = getStyleDescription(major.evaluationStyle);
  const coreData = parseSubjectList(major.coreSubjects);
  const recData = parseSubjectList(major.recommendedSubjects);

  return (
    <Card className="overflow-hidden border-gray-200 shadow-md">
      {/* 헤더 */}
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
        <div className="mb-3 flex items-start gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
          <Info className="mt-px size-3 shrink-0 text-gray-400" />
          <p className="break-keep text-xs font-medium leading-relaxed text-gray-500">
            본 가이드는 &quot;{major.source}&quot;에 기반하여 작성되었으나, 대학별/연도별 입시 요강이 변동될 수 있으므로 실제 지원 시 반드시 해당 대학의 최신 모집요강을 개별적으로 확인하시기 바랍니다.
          </p>
        </div>
        <h3 className="text-base font-bold text-gray-900">{major.name}</h3>
      </div>

      <CardContent className="space-y-6 p-6">
        {/* ── 입학사정관의 시선 카드 ── */}
        <div className="relative rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-5 shadow-sm">
          {/* 상단 헤더 행 */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                <Lightbulb className="size-4 text-indigo-600" />
              </div>
              <p className="text-sm font-bold text-indigo-900">
                💡 입학사정관의 시선 (평가 스타일)
              </p>
            </div>
            {/* 평가 스타일 원본 배지 */}
            <span className="shrink-0 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              {major.evaluationStyle}
            </span>
          </div>

          {/* 키워드 기반 서술 리스트 */}
          <ul className="space-y-2.5">
            {styleDescriptions.map((desc, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 rounded-xl bg-white/70 px-4 py-3 text-sm font-medium leading-snug text-indigo-900 shadow-[0_1px_3px_rgba(99,102,241,0.08)] backdrop-blur-sm"
              >
                <span className="mt-px shrink-0 text-base leading-none">{desc.slice(0, 2)}</span>
                <span>{desc.slice(2).trim()}</span>
              </li>
            ))}
          </ul>

          {/* evaluationNotice 보조 텍스트 */}
          {major.evaluationNotice && (
            <p className="mt-3.5 border-t border-indigo-100 pt-3 text-xs leading-relaxed text-indigo-700/80">
              {major.evaluationNotice}
            </p>
          )}
        </div>

        {/* 핵심 권장 과목 (Core) */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Star className="size-4 text-[#1e3a5f]" />
            <h4 className="text-sm font-bold text-gray-900">핵심 권장 과목 (Core)</h4>
            {coreData.subjects.length > 0 && (
              <span className="rounded-full bg-[#1e3a5f] px-2 py-0.5 text-xs font-semibold text-white">
                {coreData.subjects.length}개
              </span>
            )}
          </div>

          {/* 카테고리별 그룹 칩 */}
          {coreData.subjects.length > 0 ? (
            <GroupedChips subjects={coreData.subjects} variant="core" />
          ) : (
            <p className="text-sm text-gray-400">지정 과목 없음 — 아래 조건을 확인하세요.</p>
          )}

          {/* 조건 안내 — 그룹핑 영역 바깥에 배치 */}
          <ConditionNotes conditions={coreData.conditions} variant="core" />
        </div>

        {/* 권장 과목 (Recommended) */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="size-4 text-blue-500" />
            <h4 className="text-sm font-bold text-gray-900">권장 과목 (Recommended)</h4>
            {recData.subjects.length > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {recData.subjects.length}개
              </span>
            )}
          </div>

          {/* 카테고리별 그룹 칩 */}
          {recData.subjects.length > 0 ? (
            <GroupedChips subjects={recData.subjects} variant="rec" />
          ) : (
            <p className="text-sm text-gray-400">지정 과목 없음 — 아래 조건을 확인하세요.</p>
          )}

          {/* 조건 안내 — 그룹핑 영역 바깥에 배치 */}
          <ConditionNotes conditions={recData.conditions} variant="rec" />
        </div>
      </CardContent>
    </Card>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────
export default function SubjectRecommendPage() {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");

  // 선택된 대학의 학과 목록
  const availableMajors = useMemo(() => {
    const uni = universityData.find((u) => u.university === selectedUniversity);
    return uni ? uni.majors.map((m) => m.name) : [];
  }, [selectedUniversity]);

  // 선택된 학과 데이터
  const selectedMajorData = useMemo(() => {
    const uni = universityData.find((u) => u.university === selectedUniversity);
    return uni?.majors.find((m) => m.name === selectedMajor) ?? null;
  }, [selectedUniversity, selectedMajor]);

  function handleUniversityChange(value: string) {
    setSelectedUniversity(value);
    setSelectedMajor(""); // 대학 변경 시 학과 초기화
  }

  const universityNames = universityData.map((u) => u.university);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── 헤더 ── */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4 border-blue-400/30 bg-blue-500/20 px-4 py-1.5 text-sm text-blue-200">
            📚 대학 공식 가이드 기반 · 무료 제공
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            목표 대학·전공별 맞춤 선택 과목 안내
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-blue-100 sm:text-base">
            각 대학이 공식 발표한 전공 연계 교과이수 가이드를 분석했습니다.
            <br className="hidden sm:block" />
            대학과 학과를 선택하면, 핵심 권장 과목과 평가 방식을 즉시 확인할 수 있습니다.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        {/* ── 필터 영역 ── */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-gray-500">
            대학 및 학과 선택
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Step 1: 대학 선택 */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                <span className="flex size-5 items-center justify-center rounded-full bg-[#1e3a5f] text-white text-[10px] font-extrabold">
                  1
                </span>
                대학 선택
              </label>
              <StyledSelect
                value={selectedUniversity}
                onChange={handleUniversityChange}
                placeholder="대학을 먼저 선택하세요"
                options={universityNames}
              />
            </div>

            {/* Step 2: 학과 선택 */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                <span
                  className={`flex size-5 items-center justify-center rounded-full text-[10px] font-extrabold ${
                    selectedUniversity
                      ? "bg-[#1e3a5f] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  2
                </span>
                학과(전공) 선택
              </label>
              <StyledSelect
                value={selectedMajor}
                onChange={setSelectedMajor}
                disabled={!selectedUniversity}
                placeholder={
                  selectedUniversity
                    ? "학과를 선택하세요"
                    : "먼저 대학을 선택하세요"
                }
                options={availableMajors}
              />
            </div>
          </div>

          {/* 안내 문구 */}
          {!selectedUniversity && (
            <p className="mt-4 text-center text-xs text-gray-400">
              위에서 대학과 학과를 선택하면 맞춤 가이드라인이 바로 나타납니다.
            </p>
          )}
          {selectedUniversity && !selectedMajor && (
            <p className="mt-4 text-center text-xs text-blue-500 font-medium">
              {selectedUniversity}의 학과를 선택하세요.
            </p>
          )}
        </section>

        {/* ── 결과 카드 ── */}
        {selectedMajorData && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <ResultCard major={selectedMajorData} />
          </section>
        )}

        {/* ── 빈 상태 안내 (대학만 선택, 학과 미선택) ── */}
        {selectedUniversity && !selectedMajor && (
          <section className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center text-gray-400">
            <BookOpen className="mx-auto mb-3 size-10 text-gray-300" />
            <p className="text-sm font-medium">학과를 선택하면 가이드라인이 표시됩니다.</p>
          </section>
        )}

        {/* ── 데이터 출처 안내 ── */}
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-400">
            모든 가이드라인은 각 대학의 공식 전공 연계 교과이수 가이드를 기반으로 작성되었습니다.
            <br />
            입시 전략 수립 시에는 반드시 해당 대학의 최신 공식 자료를 함께 확인하세요.
          </p>
        </section>
      </div>
    </main>
  );
}
