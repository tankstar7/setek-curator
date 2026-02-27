import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  GraduationCap,
  TrendingDown,
  Network,
  Calculator,
  FlaskConical,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// ── 색상 매핑 (Tailwind 동적 클래스 문제 방지) ─────────────────────────────────
const COLOR_MAP = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
} as const;

// ── 데이터 ────────────────────────────────────────────────────────────────────

const CREDIT_CARDS = [
  {
    icon: <GraduationCap className="size-8 text-blue-400" />,
    badge: "수업량 적정화",
    title: "192학점 시대",
    points: [
      "기존 204단위 → 192학점으로 슬림화",
      "미이수(I등급) 제도 신설로 최소 성취 보장",
      "자율 이수 90학점 확대, 선택권 폭발적 증가",
    ],
  },
  {
    icon: <TrendingDown className="size-8 text-orange-400" />,
    badge: "핵심 전략 변화",
    title: "5등급 상대평가 전환",
    points: [
      "기존 9등급 → 5등급으로 내신 변별력 하락",
      "진짜 승부처는 교과 내신이 아닌 '심화 세특'",
      "탐구의 깊이와 전공 연계성이 당락을 결정",
    ],
  },
  {
    icon: <Network className="size-8 text-green-400" />,
    badge: "과목 선택 혁명",
    title: "전공의 세분화",
    points: [
      "물리학Ⅱ → '역학과 에너지' + '전자기와 양자'로 분할",
      "지망 전공에 맞는 세부 과목 선택이 필수 전략",
      "잘못된 과목 선택 = 지원 불가 또는 불리",
    ],
  },
];

const COMPARE_TABLE = [
  {
    category: "이수 체계",
    old: "단위제 (204단위)",
    new: "학점제 (192학점)",
    highlight: true,
  },
  {
    category: "선택 과목 구조",
    old: "일반·진로 선택 2원 구조",
    new: "일반·진로·융합 선택 3원 구조",
    highlight: true,
  },
  {
    category: "자율 이수 학점",
    old: "제한적 (소수 진로선택 과목)",
    new: "최대 90학점까지 자율 이수 가능",
    highlight: true,
  },
  {
    category: "공통 필수 과목",
    old: "공통수학, 공통과학, 통합사회 고정",
    new: "학점 축소 + 학교별 자율 편성 확대",
    highlight: false,
  },
  {
    category: "이공계 심화 과목",
    old: "물리Ⅱ·화학Ⅱ·생명과학Ⅱ (고정 II과목)",
    new: "주제 중심 8개 세부 전공으로 전면 재편",
    highlight: true,
  },
  {
    category: "AI·정보 교육",
    old: "선택과목 수준 (소수 학교만 개설)",
    new: "인공지능 수학·데이터 과학 등 계열 전반 강화",
    highlight: false,
  },
  {
    category: "융합 선택 과목",
    old: "사실상 없음",
    new: "기후변화와 환경생태, 로봇과 공학설계 등 신설",
    highlight: false,
  },
];

const MATH_CHANGES = [
  {
    label: "행렬 부활",
    tag: "공통과목",
    tagColor: "bg-blue-100 text-blue-700",
    old: "공통수학에서 행렬 단원 삭제됨",
    new: "공통수학 1·2에 행렬 단원 부활 — 이공계 필수 기초",
    important: false,
  },
  {
    label: "수학Ⅰ/Ⅱ → 대수 + 미적분Ⅰ",
    tag: "일반선택",
    tagColor: "bg-blue-100 text-blue-700",
    old: "수학Ⅰ (삼각함수·수열) + 수학Ⅱ (미분·적분·함수의 극한)",
    new: "대수 (지수·로그·수열·행렬) + 미적분Ⅰ (삼각함수·극한·미분·적분)",
    important: false,
  },
  {
    label: "미적분 → 미적분Ⅱ (이과 전용 격상)",
    tag: "진로선택",
    tagColor: "bg-orange-100 text-orange-700",
    old: "미적분 (일반선택 — 이과·문과 누구나 이수 가능)",
    new: "미적분Ⅱ (진로선택) — 이과 전용 심화, 이공계 대입 필수 신호",
    important: true,
  },
  {
    label: "AI·데이터 과목 대거 신설",
    tag: "진로선택",
    tagColor: "bg-green-100 text-green-700",
    old: "해당 없음 (정보 교과 단일 구조)",
    new: "인공지능 수학, 직업수학, 수학과 문화 등 다양한 진로 연계 과목 신설",
    important: false,
  },
];

const SCIENCE_SUBJECTS = [
  {
    emoji: "⚡",
    old: "물리학Ⅱ",
    new: ["역학과 에너지", "전자기와 양자"],
    color: "blue" as const,
  },
  {
    emoji: "⚗️",
    old: "화학Ⅱ",
    new: ["물질과 에너지", "화학 반응의 세계"],
    color: "orange" as const,
  },
  {
    emoji: "🧬",
    old: "생명과학Ⅱ",
    new: ["세포와 물질대사", "생물의 유전"],
    color: "green" as const,
  },
  {
    emoji: "🌍",
    old: "지구과학Ⅱ",
    new: ["지구시스템과학", "행성우주과학"],
    color: "purple" as const,
  },
];

const FUSION_SUBJECTS = [
  "기후변화와 환경생태",
  "융합과학 탐구",
  "과학의 역사와 문화",
  "로봇과 공학설계",
  "환경과 에너지",
];

// ── 2022 개정 과목 매트릭스 데이터 ────────────────────────────────────────────
const SUBJECT_MATRIX = [
  {
    type: "일반선택",
    chipClass: "bg-blue-50 border-blue-200 text-blue-700",
    rowBg: "bg-blue-50/30",
    labelClass: "bg-blue-100 text-blue-700",
    subjects: {
      math: ["대수", "미적분Ⅰ", "확률과 통계"],
      science: ["물리학", "화학", "생명과학", "지구과학"],
    },
  },
  {
    type: "진로선택",
    chipClass: "bg-orange-50 border-orange-200 text-orange-700",
    rowBg: "bg-orange-50/30",
    labelClass: "bg-orange-100 text-orange-700",
    subjects: {
      math: ["미적분Ⅱ", "기하", "경제 수학", "인공지능 수학", "직무 수학"],
      science: [
        "역학과 에너지", "전자기와 양자",
        "물질과 에너지", "화학 반응의 세계",
        "세포와 물질대사", "생물의 유전",
        "지구시스템과학", "행성우주과학",
      ],
    },
  },
  {
    type: "융합선택",
    chipClass: "bg-violet-50 border-violet-200 text-violet-700",
    rowBg: "bg-violet-50/30",
    labelClass: "bg-violet-100 text-violet-700",
    subjects: {
      math: ["수학과 문화", "실용 통계", "수학과제 탐구"],
      science: [
        "과학의 역사와 문화", "기후변화와 환경생태", "융합과학 탐구",
      ],
    },
  },
] as const;

// ── 과목 칩 렌더링 ─────────────────────────────────────────────────────────────
function SubjectChips({
  subjects,
  chipClass,
  wrapperClass,
}: {
  subjects: readonly string[];
  chipClass: string;
  wrapperClass?: string;
}) {
  return (
    <div className={wrapperClass ?? "flex flex-wrap justify-center gap-1.5"}>
      {subjects.map((s) => (
        <span
          key={s}
          className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium leading-snug ${chipClass}`}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

// ── 페이지 ────────────────────────────────────────────────────────────────────

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* ───────────── 1. HERO ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2540] via-[#1e3a5f] to-[#2d5282] px-4 py-20 text-white">
        {/* 배경 장식 */}
        <div className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-blue-500/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-blue-400/10" />

        <div className="relative mx-auto max-w-4xl text-center">
          <Badge className="mb-6 border-blue-400/30 bg-blue-500/20 px-4 py-1.5 text-sm text-blue-200">
            📋 22개정 공식 분석 리포트 · 무료 공개
          </Badge>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            2025년 고교학점제 전면 도입,
            <br />
            <span className="text-blue-300">당신의 세특 로드맵은</span>
            <br className="hidden sm:block" />
            <span className="text-blue-300"> 준비되었습니까?</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-blue-100 sm:text-lg">
            2015 개정과 2022 개정의 결정적 차이부터 최상위권 필수 생존 전략까지,
            <br className="hidden sm:block" />
            세특큐레이터가 완벽 분석했습니다.
          </p>


          {/* 통계 배너 */}
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
            {[
              { num: "192", unit: "학점", desc: "새 이수 체계" },
              { num: "8", unit: "세부과목", desc: "과학 II 전면 재편" },
              { num: "90", unit: "학점", desc: "자율 이수 가능" },
            ].map((s) => (
              <div key={s.desc}>
                <p className="text-2xl font-extrabold sm:text-4xl">
                  {s.num}
                  <span className="ml-1 text-lg text-blue-300 sm:text-2xl">{s.unit}</span>
                </p>
                <p className="mt-1 text-xs text-blue-200 sm:text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16">

        {/* ───────────── 2. 핵심 요약 카드 ───────────── */}
        <section>
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
              고교학점제 핵심 요약
            </p>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              입시판이 바뀌었습니다
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              고교학점제가 바꿔놓은 세 가지 핵심 패러다임 변화
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {CREDIT_CARDS.map((card) => (
              <Card
                key={card.title}
                className="border-gray-200 transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="rounded-xl bg-gray-100 p-2.5 shrink-0">
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        {card.badge}
                      </p>
                      <h3 className="mt-0.5 text-base font-bold text-gray-900">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {card.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
                        <ChevronRight className="mt-0.5 size-4 shrink-0 text-blue-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ───────────── 3. 15개정 vs 22개정 비교 테이블 ───────────── */}
        <section>
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
              교육과정 핵심 비교
            </p>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              15개정 vs 22개정, 무엇이 달라졌나
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              이공계 진로를 목표로 한다면 반드시 확인해야 할 7가지 변경사항
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="w-36 px-5 py-4 text-left font-semibold sm:w-44">항목</th>
                  <th className="px-5 py-4 text-left font-semibold">
                    <span className="rounded bg-white/10 px-2 py-0.5 text-xs">2015 개정</span>
                  </th>
                  <th className="px-5 py-4 text-left font-semibold">
                    <span className="rounded bg-blue-400/30 px-2 py-0.5 text-xs">✨ 2022 개정</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_TABLE.map((row, i) => (
                  <tr
                    key={row.category}
                    className={`border-b last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/70"}`}
                  >
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      <span className="flex items-center gap-2">
                        {row.highlight && (
                          <span className="inline-block size-2 shrink-0 rounded-full bg-blue-500" />
                        )}
                        {row.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 line-through">{row.old}</td>
                    <td className="px-5 py-4">
                      {row.highlight ? (
                        <span className="font-semibold text-[#1e3a5f]">{row.new}</span>
                      ) : (
                        <span className="text-gray-700">{row.new}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-center text-xs text-gray-400">
            ● 파란 점 = 이공계 진로에 직접적 영향을 미치는 핵심 변경사항
          </p>
        </section>

        {/* ───────────── 4. 수학·과학 딥 다이브 탭 ───────────── */}
        <section>
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
              과목 편제 딥 다이브
            </p>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              수학·과학, 구체적으로 무엇이 어떻게 바뀌었나
            </h2>
          </div>

          {/* ── 2022 개정 과목 매트릭스 ── */}
          <div className="mb-4 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full table-fixed border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-24 bg-gray-800 px-3 py-4 text-left text-xs font-semibold text-gray-300 sm:w-28">
                    선택 유형
                  </th>
                  <th className="w-[40%] bg-blue-600 px-4 py-4 text-center text-sm font-bold text-white">
                    <span className="mr-1 text-base">📐</span>수학
                  </th>
                  <th className="bg-emerald-600 px-4 py-4 text-center text-sm font-bold text-white">
                    <span className="mr-1 text-base">🔬</span>과학
                  </th>
                </tr>
              </thead>
              <tbody>
                {SUBJECT_MATRIX.map((row) => (
                  <tr key={row.type} className={`border-b border-gray-100 last:border-0 ${row.rowBg}`}>
                    {/* 선택 유형 레이블 — 수평·수직 모두 가운데 정렬 */}
                    <td className="px-3 py-4 align-middle text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${row.labelClass}`}>
                          {row.type}
                        </span>
                        {row.type === "융합선택" && (
                          <span className="inline-block break-keep rounded bg-rose-100 px-2 py-0.5 text-[9px] font-extrabold leading-tight text-rose-600 ring-1 ring-rose-200">
                            🌟 절대평가
                          </span>
                        )}
                      </div>
                    </td>
                    {/* 수학 — 자연 flex-wrap */}
                    <td className="px-4 py-4 align-top">
                      <SubjectChips subjects={row.subjects.math} chipClass={row.chipClass} />
                    </td>
                    {/* 과학 — 진로선택만 4열 grid, 나머지는 flex-wrap */}
                    <td className="px-4 py-4 align-top">
                      <SubjectChips
                        subjects={row.subjects.science}
                        chipClass={row.chipClass}
                        wrapperClass={
                          row.type === "진로선택"
                            ? "grid grid-cols-2 sm:grid-cols-4 gap-1.5 justify-items-center"
                            : undefined
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── 고교학점제 졸업 요건 인포그래픽 ── */}
          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3.5 rounded-xl border border-[#1e3a5f]/20 bg-[#1e3a5f]/5 px-5 py-4">
              <span className="shrink-0 text-2xl leading-none">🎓</span>
              <div>
                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-[#1e3a5f]">
                  필수 이수 기준
                </p>
                <p className="text-sm font-bold text-gray-800">
                  3년간 총 192학점 이수 필수
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  1학점 = 50분 기준 16회 수업
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
              <span className="shrink-0 text-2xl leading-none">🚫</span>
              <div>
                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-red-700">
                  미도달(F) 방지
                </p>
                <p className="text-sm font-bold text-gray-800">
                  출석률 2/3 이상 + 학업 성취율 40% 이상
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  두 조건을 모두 충족해야 학점 취득이 가능합니다.
                </p>
              </div>
            </div>
          </div>

          <p className="mb-8 text-center text-sm text-gray-500">
            탭을 전환하여 각 교과별 세부 변화를 확인하세요
          </p>

          <Tabs defaultValue="math" className="w-full">
            <TabsList className="mb-6 h-12 w-full">
              <TabsTrigger value="math" className="flex-1 gap-2 text-sm font-semibold">
                <Calculator className="size-4" />
                수학 과목 편제
              </TabsTrigger>
              <TabsTrigger value="science" className="flex-1 gap-2 text-sm font-semibold">
                <FlaskConical className="size-4" />
                과학 과목 편제
              </TabsTrigger>
            </TabsList>

            {/* ─── 수학 탭 ─── */}
            <TabsContent value="math">
              <div className="space-y-4">
                {MATH_CHANGES.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-xl border p-5 ${
                      item.important
                        ? "border-orange-300 bg-orange-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {item.important && (
                          <AlertTriangle className="size-5 shrink-0 text-orange-500" />
                        )}
                        <h3
                          className={`font-bold ${
                            item.important ? "text-orange-900" : "text-gray-900"
                          }`}
                        >
                          {item.label}
                        </h3>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${item.tagColor}`}
                      >
                        {item.tag}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg bg-gray-100 p-4">
                        <p className="mb-1.5 text-xs font-bold text-gray-400">
                          📌 기존 (15개정)
                        </p>
                        <p className="text-sm text-gray-500">{item.old}</p>
                      </div>
                      <div
                        className={`rounded-lg p-4 ${
                          item.important ? "bg-orange-100" : "bg-blue-50"
                        }`}
                      >
                        <p
                          className={`mb-1.5 text-xs font-bold ${
                            item.important ? "text-orange-600" : "text-blue-600"
                          }`}
                        >
                          ✨ 변경 (22개정)
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            item.important ? "text-orange-900" : "text-blue-900"
                          }`}
                        >
                          {item.new}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ─── 과학 탭 ─── */}
            <TabsContent value="science">
              {/* 핵심 경고 배너 */}
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-red-700">
                  <AlertTriangle className="size-5 shrink-0" />
                  핵심 변화: 기존 II과목(물·화·생·지) 전면 해체 → 8개 세부 전공으로 분할
                </p>
                <p className="mt-1.5 text-xs text-red-600">
                  이제 단순히 &quot;물리학Ⅱ&quot;가 아닌, 지망 전공에 맞는 세부 과목을 전략적으로 선택해야 합니다.
                  과목 선택 자체가 전공 적합성 신호가 됩니다.
                </p>
              </div>

              {/* 과목 분할 다이어그램 */}
              <div className="space-y-4">
                {SCIENCE_SUBJECTS.map((s) => {
                  const colors = COLOR_MAP[s.color];
                  return (
                    <div
                      key={s.old}
                      className={`rounded-xl border p-5 ${colors.bg} ${colors.border}`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* 기존 과목 */}
                        <div className="flex items-center gap-3 rounded-lg bg-gray-100 px-4 py-3 sm:w-48 sm:shrink-0">
                          <span className="text-2xl">{s.emoji}</span>
                          <div>
                            <p className="text-xs font-semibold text-gray-400">기존</p>
                            <p className="font-bold text-gray-500 line-through">{s.old}</p>
                          </div>
                        </div>

                        {/* 화살표 */}
                        <ArrowRight
                          className={`hidden size-6 shrink-0 sm:block ${colors.text}`}
                        />

                        {/* 신설 과목 */}
                        <div className="flex flex-1 flex-wrap gap-3">
                          {s.new.map((n) => (
                            <div
                              key={n}
                              className={`min-w-36 flex-1 rounded-lg border bg-white px-4 py-3 ${colors.border}`}
                            >
                              <p className="mb-1 text-xs font-semibold text-gray-400">
                                ✨ 신설
                              </p>
                              <p className={`font-bold ${colors.text}`}>{n}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 융합 선택 과목 */}
              <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-5">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-violet-800">
                  <Sparkles className="size-5" />
                  신설 융합 선택 과목 (이공계 주목)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {FUSION_SUBJECTS.map((sub) => (
                    <span
                      key={sub}
                      className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-sm font-medium text-violet-700"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* ───────────── 5. 페인포인트 자극 섹션 ───────────── */}
        <section className="rounded-2xl bg-[#0f2540] px-6 py-14 text-center text-white">
          <div className="mx-auto max-w-2xl">
            <span className="text-5xl" aria-hidden="true">🤯</span>
            <h2 className="mt-5 text-2xl font-extrabold leading-snug sm:text-3xl">
              이 수많은 과목 중,
              <br />
              내 지망 전공에 맞는 과목은
              <br />
              <span className="text-blue-300">대체 무엇일까요?</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-blue-100">
              세특큐레이터는{" "}
              <strong className="text-white">상위 50개 대학 및 전공 입시 가이드</strong>를 분석하여,
              <br className="hidden sm:block" />
              각 대학 및 전공에 최적화된{" "}
              <strong className="text-white">선택 과목</strong>을 제공합니다.
            </p>

            <div className="mt-8">
              <Link href="/subject-recommend">
                <Button className="h-14 rounded-full bg-white px-8 text-base font-extrabold text-[#0f2540] shadow-lg transition-all hover:scale-105 hover:bg-blue-50 sm:px-12 sm:text-lg">
                  👉 내 목표 대학/전공 맞춤 선택 과목 확인하기
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
