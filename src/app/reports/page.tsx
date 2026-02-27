import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default async function ReportStorePage() {
  // 🚀 DB에서 보고서 목록 가져오기
  // 💡 포인트: 목록 페이지이므로 무거운 '본문(main_content)'은 빼고, 제목과 미리보기 등 가벼운 정보만 골라서 가져옵니다! (속도 최적화)
  const { data: reports, error } = await supabase
    .from('premium_reports')
    .select('id, subject, title, target_majors, access_tier, large_unit_name, preview_content')
    .order('created_at', { ascending: false });

  if (error) return <div className="p-10 text-center text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* 스토어 헤더 섹션 */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            프리미엄 세특 라이브러리 📚
          </h1>
          <p className="text-lg text-slate-600">
            상위 1% 합격생들의 전공 심화 탐구 보고서를 열람해 보세요.
          </p>
        </div>

        {/* 보고서 카드 그리드 (반응형: 모바일 1줄, 태블릿 2줄, PC 3줄) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports?.map((report) => (
            // 카드를 클릭하면 상세 페이지(/report-test)로 이동하도록 Link를 걸어둡니다.
            <Link href={`/reports/${report.id}`} key={report.id} className="group block h-full">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                
                {/* 👑 카드 상단 (과목명 & 결제 등급 뱃지) */}
                <div className="bg-slate-900 px-5 py-4 flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-300 bg-blue-900/50 px-2.5 py-1 rounded-md">
                    {report.subject}
                  </span>
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-900/50 px-2.5 py-1 rounded-md border border-yellow-700/50">
                    {report.access_tier} 전용
                  </span>
                </div>
                
                {/* 📝 카드 본문 (제목 & 미리보기) */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs font-semibold text-slate-400 mb-2">
                    {report.large_unit_name}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {report.title}
                  </h2>
                  
                  {/* 마크다운 기호를 대충 지우고 텍스트만 보여주는 꼼수 적용 */}
                  <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed flex-1">
                    {report.preview_content?.replace(/[#*`>$]/g, '')} 
                  </p>
                  
                  {/* 🎯 추천 전공 태그 (하단 고정) */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100">
                    {report.target_majors.slice(0, 3).map((major: string, idx: number) => (
                      <span key={idx} className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        #{major}
                      </span>
                    ))}
                    {report.target_majors.length > 3 && (
                      <span className="text-[11px] text-slate-400 py-1 font-medium">
                        +{report.target_majors.length - 3}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}