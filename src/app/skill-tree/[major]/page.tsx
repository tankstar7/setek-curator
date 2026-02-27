import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSkillTreeByMajor, getAllSkillTrees, getReports } from "@/lib/db";

interface PageProps {
  params: Promise<{ major: string }>;
}

export default async function SkillTreePage({ params }: PageProps) {
  const { major } = await params;
  const decoded = decodeURIComponent(major);

  const [data, allTrees, relatedReports] = await Promise.all([
    getSkillTreeByMajor(decoded),
    getAllSkillTrees(),
    getReports({ target_major: decoded, limitCount: 4 }),
  ]);

  if (!data) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-5xl">🔍</p>
        <h1 className="text-2xl font-bold text-gray-800">
          &apos;{decoded}&apos; 전공 데이터를 준비 중이에요
        </h1>
        <p className="text-gray-500 text-sm">현재 지원 전공</p>
        <div className="flex flex-wrap justify-center gap-2">
          {allTrees.map((t) => (
            <Link key={t.major_name} href={`/skill-tree/${encodeURIComponent(t.major_name)}`}>
              <Button variant="outline" size="sm">{t.major_name}</Button>
            </Link>
          ))}
        </div>
        <Link href="/">
          <Button className="mt-4 bg-[#1e3a5f] text-white hover:bg-[#152c4a]">홈으로 돌아가기</Button>
        </Link>
      </main>
    );
  }

  const combo = data.ai_recommended_combo[0];

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      {/* ── Header ── */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-4 py-14 text-white">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white">
            ← 홈으로
          </Link>
          <Badge className="mb-3 bg-blue-500/20 text-blue-200 border-blue-400/30">22개정 전공 스킬 트리</Badge>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{data.major_name}</h1>
          {data.description && <p className="mt-2 text-blue-100">{data.description}</p>}
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
        {/* ── 필수 이수 과목 ── */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">📚 필수 이수 과목</h2>
          <Card className="border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-blue-700 font-semibold">공통 필수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.core_required.map((course) => (
                  <div key={course} className="flex items-center gap-1 rounded-full bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white">
                    <span className="text-blue-300">✓</span>{course}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {data.advanced_required && data.advanced_required.length > 0 && (
            <Card className="mt-4 border-orange-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-orange-600 font-semibold">심화·선택 권장</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.advanced_required.map((course) => (
                    <div key={course} className="flex items-center gap-1 rounded-full border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
                      ⚡ {course}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* ── AI 추천 꿀조합 ── */}
        {combo && (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">🤖 AI 추천 진로/융합 선택 3과목 꿀조합</h2>
              <Badge className="bg-blue-100 text-blue-700">AI 큐레이션</Badge>
            </div>
            <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-white shadow-md">
              <CardContent className="pt-6">
                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                  {combo.courses.map((course, i) => (
                    <div key={course} className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm border border-blue-200 text-center">
                      <span className="absolute right-2 top-2 text-xs font-bold text-blue-300">0{i + 1}</span>
                      <p className="text-2xl mb-1">{["📗", "🔬", "💡"][i]}</p>
                      <p className="font-bold text-sm text-[#1e3a5f]">{course}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-blue-600/5 border border-blue-200 p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-500">이 조합을 추천하는 이유</p>
                  <p className="text-sm leading-relaxed text-gray-700">{combo.reason}</p>
                </div>
                {combo.highlight_major.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold text-gray-500">이 조합에 맞는 진로:</p>
                    <div className="flex flex-wrap gap-2">
                      {combo.highlight_major.map((m) => (
                        <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── 추천 세특 탐구 주제 ── */}
        {relatedReports.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-900">📝 추천 세특 탐구 주제</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedReports.map((report) => (
                <Link key={report.id} href={`/generate?keyword=${encodeURIComponent(report.trend_keyword)}`}>
                  <Card className="group cursor-pointer border-gray-200 transition-all hover:border-blue-300 hover:shadow-md">
                    <CardContent className="pt-5">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{report.subject}</Badge>
                        <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">#{report.trend_keyword}</Badge>
                      </div>
                      <h3 className="mb-2 text-sm font-semibold leading-relaxed text-gray-800 group-hover:text-[#1e3a5f]">
                        {report.report_title}
                      </h3>
                      <p className="text-xs text-gray-400">👁 {(report.views ?? 0).toLocaleString()}명 조회</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white px-4 py-4 shadow-2xl sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div>
            <p className="text-sm font-bold text-gray-900">🎯 이 3과목이 융합된 맞춤형 심화 세특 보고서 생성하기</p>
            <p className="text-xs text-gray-500">현직 연구원 시선의 심화 탐구 · 전공 연계 비전 포함</p>
          </div>
          <Link href="/generate">
            <Button className="w-full shrink-0 bg-gradient-to-r from-blue-600 to-[#1e3a5f] px-8 py-5 text-base font-bold text-white hover:from-blue-500 hover:to-[#2d5282] sm:w-auto rounded-xl">
              ✨ 프리미엄 보고서 생성하기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
