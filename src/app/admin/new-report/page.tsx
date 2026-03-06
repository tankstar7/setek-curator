"use client"; // 💡 유저의 입력을 받기 위해 클라이언트 모드로 작동시킵니다.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function NewReportAdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // 📝 입력창에 들어갈 데이터들의 빈 칸을 준비합니다.
  const [formData, setFormData] = useState({
    subject: '',
    large_unit_name: '',
    large_unit_order: 1,
    small_unit_name: '',
    small_unit_order: 1,
    target_majors: '', 
    title: '',
    preview_content: '',
    main_content: '',
    access_tier: 'PREMIUM'
  });

  // 유저가 글자를 타이핑할 때마다 빈 칸을 채워주는 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🚀 [등록하기] 버튼을 눌렀을 때 실행되는 핵심 로직!
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 전공 텍스트를 쉼표(,) 기준으로 잘라서 예쁜 배열로 만듭니다. (예: "화학, 물리" -> ["화학", "물리"])
    const majorsArray = formData.target_majors.split(',').map(m => m.trim()).filter(m => m !== '');

    // Supabase 금고에 데이터를 쏙 집어넣습니다!
    const { error } = await supabase
      .from('premium_reports')
      .insert([
        {
          subject: formData.subject,
          large_unit_name: formData.large_unit_name,
          large_unit_order: Number(formData.large_unit_order),
          small_unit_name: formData.small_unit_name,
          small_unit_order: Number(formData.small_unit_order),
          target_majors: majorsArray,
          title: formData.title,
          preview_content: formData.preview_content,
          main_content: formData.main_content,
          access_tier: formData.access_tier,
        }
      ]);

    setIsLoading(false);

    if (error) {
      alert('저장 중 오류가 발생했습니다: ' + error.message);
    } else {
      alert('🎉 성공적으로 보고서가 등록되었습니다!');
      router.push('/reports'); // 등록 완료 후, 상점 진열대 페이지로 자동 이동!
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b border-slate-200">
          🛠️ 새 프리미엄 보고서 등록 (관리자용)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. 과목 및 단원 정보 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">교과목명</label>
              <input type="text" name="subject" required placeholder="예: 생명과학 I"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">추천 전공 (쉼표로 구분)</label>
              <input type="text" name="target_majors" required placeholder="예: 의예과, 생명공학과"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">대단원명</label>
              <input type="text" name="large_unit_name" required placeholder="예: 유전"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">대단원 순서 (숫자)</label>
              <input type="number" name="large_unit_order" required min="1"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={handleChange} defaultValue={1} />
            </div>
          </div>

          {/* 2. 제목 및 등급 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">보고서 제목</label>
            <input type="text" name="title" required placeholder="시선을 끄는 매력적인 제목을 입력하세요"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
              onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">결제 접근 등급</label>
            <select name="access_tier" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange}>
              <option value="PREMIUM">PREMIUM (프리미엄)</option>
              <option value="VIP">VIP (최상위 컨설팅)</option>
              <option value="BASIC">BASIC (베이직)</option>
              <option value="FREE">FREE (무료공개)</option>
            </select>
          </div>

          {/* 3. 본문 작성 영역 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">미리보기 서론 (무료 열람 구간)</label>
            <textarea name="preview_content" required rows={4} placeholder="모든 유저가 볼 수 있는 서론을 마크다운으로 작성하세요..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">심화 본문 (유료 결제자 전용 구간)</label>
            <textarea name="main_content" required rows={10} placeholder="수식($$)과 심화 내용이 포함된 본문을 마크다운으로 작성하세요..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
              onChange={handleChange} />
          </div>

          {/* 4. 등록 버튼 */}
          <button type="submit" disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-md text-lg mt-8 disabled:bg-slate-400">
            {isLoading ? 'DB에 저장하는 중...' : '🚀 프리미엄 보고서 등록하기'}
          </button>
        </form>

      </div>
    </div>
  );
}