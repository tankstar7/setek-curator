import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { standardMajors } from "@/lib/data/standardMajors";

interface PageProps {
  params: Promise<{ id: string }>;
}

// ── 과목 분류 칩 스타일 ─────────────────────────────────────────────────────
const SUBJECT_CHIP: Record<string, string> = {
  general:     "bg-blue-50 text-blue-600 border border-blue-200",
  career:      "bg-violet-50 text-violet-600 border border-violet-200",
  convergence: "bg-amber-50 text-amber-600 border border-amber-200",
};
const SUBJECT_LABEL: Record<string, string> = {
  general:     "일반선택",
  career:      "진로선택",
  convergence: "융합선택",
};

// ── 과목 → 교과 매핑 (2022 개정 기준, 수학·과학만) ──────────────────────────
const SUBJECT_DISCIPLINE: Record<string, "math" | "science"> = {
  // 수학 일반선택
  "대수": "math", "미적분Ⅰ": "math", "확률과 통계": "math",
  // 수학 진로선택
  "미적분Ⅱ": "math", "기하": "math", "경제 수학": "math",
  "인공지능 수학": "math", "직무 수학": "math",
  // 수학 융합선택
  "수학과 문화": "math", "실용 통계": "math", "수학과제 탐구": "math",
  // 과학 일반선택
  "물리학": "science", "화학": "science", "생명과학": "science", "지구과학": "science",
  // 과학 진로선택
  "역학과 에너지": "science", "전자기와 양자": "science", "물질과 에너지": "science",
  "화학 반응의 세계": "science", "세포와 물질대사": "science", "생물의 유전": "science",
  "지구시스템과학": "science", "행성우주과학": "science",
  // 과학 융합선택
  "과학의 역사와 문화": "science", "기후변화와 환경생태": "science",
  "융합과학 탐구": "science",
};

const DISC_LABEL: Record<string, string> = {
  math: "수학 📐", science: "과학 ⚗️",
};

export default async function MajorResultPage({ params }: PageProps) {
  const { id } = await params;
  const major = standardMajors.find((m) => m.id === id);
  if (!major) notFound();

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* ── 헤더 ── */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-4 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-1 text-sm text-blue-200 transition-colors hover:text-white"
          >
            ← 홈으로
          </Link>
          <Badge className="mb-3 border-blue-400/30 bg-blue-500/20 text-blue-200">
            22개정 전공 계열 가이드
          </Badge>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{major.categoryName}</h1>
          <p className="mt-2 text-blue-100">
            2022 개정 교육과정 기반 추천 과목 및 AI 꿀조합
          </p>
        </div>
      </section>

      {/* ── 콘텐츠 ── */}
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">

          {/* ── 왼쪽: 메인 통합 카드 ── */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* ① 면책 안내문 */}
            <div className="flex gap-2.5 border-b border-amber-100 bg-amber-50 px-6 py-4">
              <span className="mt-px shrink-0 text-base">💡</span>
              <p className="text-xs leading-relaxed text-amber-800">
                본 추천 과목은 해당 계열의 일반적인 가이드라인입니다. 대학 및 전공별로
                실제 요구하는 이수 과목이 다를 수 있으므로, 반드시 지원하고자 하는
                대학의 최신 모집 요강을 확인하시기 바랍니다.
              </p>
            </div>

            <div className="space-y-6 px-6 py-6">

              {/* ⏳ 과목 선택 조사 타임라인 알림 배너 */}
              <div className="flex items-center gap-3 rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3">
                <span className="shrink-0 text-xl">⏳</span>
                <div>
                  <p className="text-xs font-extrabold text-orange-800">
                    고1 5~6월 과목 선택 조사 전 필수 확인!
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-orange-600">
                    이 페이지의 추천 조합을 미리 검토하고 담임 선생님·진로 교사와 반드시 상담하세요.
                  </p>
                </div>
              </div>

              {/* 🤖 타이틀 */}
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">
                  🤖 AI 추천 핵심 과목 꿀조합
                </h2>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                  AI 큐레이션
                </span>
              </div>

              {/* ② 수학 / 과학 / 정보 × 일반선택 / 진로선택 / 융합선택 매트릭스 */}
              <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse text-xs">
                  <thead>
                    <tr>
                      {/* 레이블 열: 고정 너비 / 수학·과학이 나머지를 1:1로 분할 */}
                      <th className="w-20 pb-2 text-center text-[10px] font-bold text-gray-400"></th>
                      <th className="w-[40%] px-2 pb-2 text-center text-[10px] font-bold text-gray-500">
                        {DISC_LABEL["math"]}
                      </th>
                      <th className="px-2 pb-2 text-center text-[10px] font-bold text-gray-500">
                        {DISC_LABEL["science"]}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(["general", "career", "convergence"] as const).map((type) => (
                      <tr key={type} className="border-t border-gray-100">
                        {/* 선택 유형 레이블 — 수평·수직 모두 가운데 정렬 */}
                        <td className="py-2 pr-2 align-middle text-center">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${SUBJECT_CHIP[type]}`}>
                            {SUBJECT_LABEL[type]}
                          </span>
                        </td>
                        {(["math", "science"] as const).map((disc) => {
                          const items = major.recommendedSubjects[type].filter(
                            (s) => SUBJECT_DISCIPLINE[s] === disc
                          );
                          return (
                            <td key={disc} className="px-2 py-2 align-top text-center">
                              {items.length === 0 ? (
                                <span className="text-[11px] text-gray-300">—</span>
                              ) : (
                                <div className="flex flex-wrap justify-center gap-1">
                                  {items.map((s) => (
                                    <span
                                      key={s}
                                      className="whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-700"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ③ 이 조합을 추천하는 이유 */}
              <div className="rounded-xl border border-blue-100 bg-blue-600/5 px-5 py-4">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-500">
                  이 조합을 추천하는 이유
                </p>
                <p className="text-sm leading-relaxed text-gray-700">
                  {major.combo.reason}
                </p>
              </div>

              {/* ④ 연계 진로 */}
              {major.combo.careers.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-gray-500">
                    이 조합에 맞는 연계 진로:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {major.combo.careers.map((career) => (
                      <span
                        key={career}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ⑤ 전형별/대학별 전략 유의사항 */}
              {major.specialNotes && major.specialNotes.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-extrabold text-red-700">
                    <span>🚨</span>
                    전형별/대학별 전략 유의사항
                  </p>
                  <ul className="space-y-2.5">
                    {major.specialNotes.map((note, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 rounded-lg bg-white/80 px-3 py-2.5 text-xs leading-relaxed text-red-900 shadow-sm"
                      >
                        <span className="mt-px shrink-0 text-sm leading-none">{note.slice(0, 2)}</span>
                        <span>{note.slice(2).trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ── 오른쪽: 추천 탐구 주제 + 다른 계열 ── */}
          <div className="space-y-4">

            {/* 추천 탐구 주제 */}
            {major.recommendedTopics.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3.5 text-sm font-bold text-gray-800">
                  📝 추천 탐구 주제
                </h2>
                <div className="space-y-2.5">
                  {major.recommendedTopics.map((topic) => (
                    <Link
                      key={`${topic.keyword}-${topic.title}`}
                      href={`/lab?keyword=${encodeURIComponent(topic.keyword)}`}
                      className="flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3 transition-colors hover:border-blue-200 hover:bg-blue-50"
                    >
                      <span className="mt-px shrink-0 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">
                        {topic.subject}
                      </span>
                      <p className="text-xs font-medium leading-relaxed text-gray-700">
                        {topic.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 다른 계열 보기 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-bold text-gray-800">
                다른 계열 보기
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {standardMajors
                  .filter((m) => m.id !== major.id)
                  .map((m) => (
                    <Link key={m.id} href={`/major-result/${m.id}`}>
                      <span className="inline-block rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] text-gray-600 transition-colors hover:border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5 hover:text-[#1e3a5f]">
                        {m.categoryName}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
