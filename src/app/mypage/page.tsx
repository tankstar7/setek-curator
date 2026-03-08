"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { forceSignOut } from "@/lib/authUtils";
import {
  REGIONS, ROLES, DREAM_MAJORS, INTEREST_SUBJECTS,
  ROLE_EMOJI, MAJOR_EMOJI, SUBJECT_EMOJI,
} from "@/lib/profileOptions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  nickname: string;
  role: string;
  region: string;
  school_name: string;
  company_name: string | null;
  dream_majors: string[];
  interest_subjects: string[];
  updated_at: string;
  account_tier: string;
  phone_number?: string;
}

function toggle(arr: string[], val: string, max: number): string[] {
  return arr.includes(val)
    ? arr.filter((v) => v !== val)
    : arr.length < max ? [...arr, val] : arr;
}


export default function MyPage() {
  const router = useRouter();
  const [user, setUser]         = useState<User | null>(null);
  const [profile, setProfile]   = useState<Profile | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]); // AI 분석 기록
  const [viewedReports, setViewedReports]     = useState<any[]>([]); // 열람한 세특 보고서
  const [savedReports, setSavedReports]       = useState<any[]>([]); // 저장한 세특 보고서
  const [loading, setLoading]   = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editing, setEditing]   = useState(false);

  // 편집 상태
  const [eNickname,   setENickname]   = useState("");
  const [eRole,       setERole]       = useState("");
  const [eRegion,     setERegion]     = useState("");
  const [eSchool,     setESchool]     = useState("");
  const [eCompany,    setECompany]    = useState(""); // 추가
  const [ePhone,      setEPhone]      = useState("");
  const [eMajors,     setEMajors]     = useState<string[]>([]);
  const [eSubjects,   setESubjects]   = useState<string[]>([]);
  const [saving,      setSaving]      = useState(false);
  const [editError,   setEditError]   = useState("");

  useEffect(() => {
    let cancelled = false;

    // 5초 내 로딩 완료 안 되면 오류 UI 표시
    const loadTimer = setTimeout(() => {
      if (!cancelled) {
        cancelled = true;
        setLoadError(true);
        setLoading(false);
      }
    }, 5_000);

    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (cancelled) return;

        if (!user) {
          clearTimeout(loadTimer);
          router.replace("/login");
          return;
        }
        setUser(user);

        // 1. 프로필 정보 가져오기
        const { data: profileData } = await supabase
          .from("profiles").select("*").eq("id", user.id).maybeSingle();

        if (cancelled) return;
        if (!profileData) { router.replace("/onboarding"); return; }
        setProfile(profileData as Profile);

        // 2. AI 생기부 분석 전체 기록 (저장 유무 무관)
        const { data: analysisData } = await supabase
          .from("analysis_results")
          .select("id, major, created_at, is_saved")
          .eq("user_email", user.email)
          .order("created_at", { ascending: false });

        if (!cancelled && analysisData) {
          setAnalysisHistory(analysisData);
        }

        // 3. 세특 탐구소에서 열람한 보고서 (report_user_history + premium_reports 조인, 최대 10개)
        const { data: historyData } = await supabase
          .from("report_user_history")
          .select(`
            viewed_at,
            premium_reports:report_id (id, title, subject, target_majors)
          `)
          .eq("user_id", user.id)
          .order("viewed_at", { ascending: false })
          .limit(10);

        if (!cancelled && historyData) {
          setViewedReports(historyData);
        }

        // 4. 세특 탐구소에서 저장한 보고서 (report_user_saved + premium_reports 조인)
        const { data: savedData } = await supabase
          .from("report_user_saved")
          .select(`
            saved_at,
            premium_reports:report_id (id, title, subject, target_majors)
          `)
          .eq("user_id", user.id)
          .order("saved_at", { ascending: false });

        if (!cancelled && savedData) {
          setSavedReports(savedData);
        }

        clearTimeout(loadTimer);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.error("데이터 로딩 중 오류:", err);
        clearTimeout(loadTimer);
        setLoadError(true);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; clearTimeout(loadTimer); };
  }, [router]);

  const startEdit = () => {
    if (!profile) return;
    setENickname(profile.nickname);
    setERole(profile.role);
    setERegion(profile.region);
    setESchool(profile.school_name);
    setECompany(profile.company_name || ""); // 기존 정보 로드
    setEPhone(profile.phone_number || "");
    setEMajors([...profile.dream_majors]);
    setESubjects([...profile.interest_subjects]);
    setEditError("");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!eNickname.trim())    { setEditError("닉네임을 입력해주세요."); return; }
    if (!ePhone.trim() || ePhone.trim().length < 10) { setEditError("휴대폰 번호를 올바르게 입력해주세요."); return; }
    if (!eRole)                { setEditError("신분을 선택해주세요."); return; }
    if (!eRegion)              { setEditError("지역을 선택해주세요."); return; }
    // 학교명 혹은 회사/학원명 중 하나는 필수
    if (!eSchool.trim() && !eCompany.trim()) { setEditError("학교명 또는 회사/학원명 중 하나를 입력해주세요."); return; }
    if (eMajors.length === 0)  { setEditError("희망 전공을 1개 이상 선택해주세요."); return; }
    if (eSubjects.length === 0){ setEditError("관심 과목을 1개 이상 선택해주세요."); return; }
    if (!user) return;

    setSaving(true);
    setEditError("");

    const { error } = await supabase.from("profiles").update({
      nickname:          eNickname.trim(),
      phone_number:      ePhone.trim(),
      role:              eRole,
      region:            eRegion,
      school_name:       eSchool.trim(),
      company_name:      eCompany.trim() || null,
      dream_majors:      eMajors,
      interest_subjects: eSubjects,
      privacy_consent_at: new Date().toISOString(), // 추가
      updated_at:        new Date().toISOString(),
    }).eq("id", user.id);

    if (error) { 
      console.error("[MyPage] 프로필 저장 에러 상세:", error);
      setEditError(`저장 중 오류가 발생했습니다: ${error.message}`); 
      setSaving(false); 
      return; 
    }

    setProfile((p) => p ? {
      ...p, nickname: eNickname.trim(), phone_number: ePhone.trim(), role: eRole,
      region: eRegion, school_name: eSchool.trim(), company_name: eCompany.trim() || null,
      dream_majors: eMajors, interest_subjects: eSubjects,
    } : p);
    setSaving(false);
    setEditing(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await fetch("/api/mark-onboarded", { method: "DELETE" });
    router.push("/");
  };

  const handleWithdraw = async () => {
    const ok = window.confirm(
      "⚠️ 회원 탈퇴 안내\n\n탈퇴 시 회원님의 모든 프로필 정보와 활동 내역이 즉시 삭제되며, 이는 절대로 복구할 수 없습니다.\n\n정말로 세특큐레이터에서 탈퇴하시겠습니까?"
    );
    if (!ok) return;

    try {
      if (!user) return;
      
      // 1. 프로필 데이터 삭제 (Supabase RLS가 본인 데이터 삭제를 허용한다고 가정)
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (error) {
        console.error("프로필 삭제 중 오류:", error);
        alert("탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      // 2. 로그아웃 및 홈 이동
      await supabase.auth.signOut();
      alert("탈퇴 처리가 완료되었습니다. 그동안 이용해주셔서 감사합니다.");
      router.push("/");
    } catch (err) {
      console.error("탈퇴 프로세스 오류:", err);
      alert("탈퇴 처리 중 예상치 못한 오류가 발생했습니다.");
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="animate-pulse text-slate-400">불러오는 중...</p>
    </div>
  );

  if (loadError) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 text-center px-4">
      <p className="text-4xl">⚠️</p>
      <p className="font-semibold text-slate-700">네트워크 상태가 원활하지 않습니다.</p>
      <p className="text-sm text-slate-400">잠시 후 다시 시도하거나, 초기화 후 재시작해 주세요.</p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
      >
        다시 시도
      </button>
      <button
        onClick={forceSignOut}
        className="rounded-xl border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
      >
        로그아웃 후 재시작
      </button>
      <a href="/" className="text-xs text-slate-400 underline hover:text-slate-600">
        홈으로 돌아가기
      </a>
    </div>
  );

  const roleEmoji = ROLE_EMOJI[profile?.role ?? ""] ?? "👤";

  // 통계 데이터 동적 계산
  const stats = [
    { label: "AI 분석 횟수",        value: analysisHistory.length.toString(), icon: "🤖" },
    { label: "열람한 세특 보고서",  value: viewedReports.length.toString(),   icon: "📄" },
    { label: "저장한 세특 보고서",  value: savedReports.length.toString(),    icon: "🔖" },
    { label: "보유 크레딧",         value: "0",                               icon: "💎" },
  ];


  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── 프로필 헤더 ── */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-4 py-14 text-white">
        <div className="mx-auto max-w-4xl flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/20 text-4xl shadow-inner">
            {roleEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-500/40 px-2.5 py-0.5 text-[11px] font-semibold text-blue-100">
                {profile?.role}
              </span>
              <span className="text-xs text-blue-300">{user?.email}</span>
            </div>
            <h1 className="text-3xl font-extrabold">{profile?.nickname}</h1>
            <p className="mt-1 text-sm text-blue-200">
              📍 {profile?.region} · 🏫 {profile?.school_name}
            </p>
          </div>
          <button
            onClick={startEdit}
            className="hidden shrink-0 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 sm:block"
          >
            ✏️ 프로필 수정
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">

        {/* ── 모바일 수정 버튼 ── */}
        {!editing && (
          <button
            onClick={startEdit}
            className="block w-full rounded-xl border border-[#1e3a5f]/20 bg-white py-3 text-sm font-semibold text-[#1e3a5f] shadow-sm transition hover:bg-[#1e3a5f]/5 sm:hidden"
          >
            ✏️ 프로필 수정
          </button>
        )}

        {/* ── 프로필 요약 카드 ── */}
        {!editing && (
          <Card className="border-gray-200">
            <CardContent className="space-y-5 pt-6">
              {/* 희망 전공 */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  희망 전공 계열
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {profile?.dream_majors.map((m) => (
                    <span
                      key={m}
                      className="flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 border border-violet-200"
                    >
                      <span>{MAJOR_EMOJI[m]}</span> {m}
                    </span>
                  ))}
                </div>
              </div>
              {/* 관심 과목 */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  관심 과목
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {profile?.interest_subjects.map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200"
                    >
                      <span>{SUBJECT_EMOJI[s]}</span> {s}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── 프로필 수정 패널 ── */}
        {editing && (
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base text-[#1e3a5f]">
                ✏️ 프로필 수정
                <button
                  onClick={() => setEditing(false)}
                  className="text-sm font-normal text-gray-400 hover:text-gray-600"
                >
                  ✕ 닫기
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* 닉네임 */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">닉네임</label>
                <input
                  type="text" value={eNickname} maxLength={20}
                  onChange={(e) => setENickname(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* 휴대폰 번호 */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">휴대폰 번호</label>
                <input
                  type="tel" value={ePhone}
                  onChange={(e) => setEPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="'-' 없이 숫자만 입력"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* 신분 */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">신분</label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => (
                    <button key={r.value} onClick={() => setERole(r.value)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                        eRole === r.value
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                      }`}
                    >
                      {r.emoji} {r.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* 지역 + 학교/회사 */}
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">지역</label>
                  <select value={eRegion} onChange={(e) => setERegion(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">선택</option>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">학교명</label>
                    <input type="text" value={eSchool}
                      onChange={(e) => setESchool(e.target.value)}
                      placeholder="학교명 입력"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">회사 / 학원명</label>
                    <input type="text" value={eCompany}
                      onChange={(e) => setECompany(e.target.value)}
                      placeholder="회사 또는 학원명 입력"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">* 학교명 또는 회사/학원명 중 하나를 입력하세요.</p>
              </div>

              {/* 희망 전공 */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    희망 전공 계열 <span className="text-xs font-normal text-slate-400">(최대 3개)</span>
                  </label>
                  <span className="text-xs font-bold text-violet-600">{eMajors.length}/3</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {DREAM_MAJORS.map((m) => {
                    const sel   = eMajors.includes(m.value);
                    const maxed = eMajors.length >= 3 && !sel;
                    return (
                      <button key={m.value} onClick={() => setEMajors(toggle(eMajors, m.value, 3))}
                        disabled={maxed}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                          sel   ? "border-violet-500 bg-violet-500 text-white"
                               : maxed ? "cursor-not-allowed border-slate-100 text-slate-300"
                               : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                        }`}
                      >
                        {m.emoji} {m.value}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 관심 과목 */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    관심 과목 <span className="text-xs font-normal text-slate-400">(최대 5개)</span>
                  </label>
                  <span className="text-xs font-bold text-emerald-600">{eSubjects.length}/5</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_SUBJECTS.map((s) => {
                    const sel   = eSubjects.includes(s.value);
                    const maxed = eSubjects.length >= 5 && !sel;
                    return (
                      <button key={s.value} onClick={() => setESubjects(toggle(eSubjects, s.value, 5))}
                        disabled={maxed}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                          sel   ? "border-emerald-500 bg-emerald-500 text-white"
                               : maxed ? "cursor-not-allowed border-slate-100 text-slate-300"
                               : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                        }`}
                      >
                        {s.emoji} {s.value}
                      </button>
                    );
                  })}
                </div>
              </div>

              {editError && (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{editError}</p>
              )}

              <div className="flex gap-2 pt-1">
                <Button onClick={handleSave} disabled={saving}
                  className="bg-[#1e3a5f] text-white hover:bg-[#152c4a]"
                >
                  {saving ? "저장 중..." : "저장하기"}
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>취소</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── 관리자 전용 섹션 ── */}
        {profile?.account_tier === "admin" && (
          <Card className="border-2 border-red-200 bg-red-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 text-base">
                <span>🛡️</span> 관리자 전용 메뉴
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/admin" className="flex-1">
                  <Button className="w-full bg-red-600 font-bold text-white hover:bg-red-700">
                    📊 대시보드 바로가기
                  </Button>
                </Link>
                <Link href="/onboarding" className="flex-1">
                  <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-100 font-bold">
                    ✨ 온보딩 페이지 미리보기
                  </Button>
                </Link>
              </div>
              <p className="text-[11px] text-red-400">
                * 온보딩 미리보기를 통해 가입 절차를 확인하고 정보를 직접 수정할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── 활동 통계 ── */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-900">나의 활동</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label} className="border-gray-200 text-center">
                <CardContent className="pt-5">
                  <p className="mb-1 text-3xl">{s.icon}</p>
                  <p className="text-2xl font-extrabold text-[#1e3a5f]">{s.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── AI 생기부 분석 기록 ── */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-900">AI 생기부 분석 기록</h2>
          {analysisHistory.length === 0 ? (
            <Card className="border-dashed border-gray-300">
              <CardContent className="py-12 text-center text-gray-400">
                <p className="mb-2 text-3xl">📭</p>
                <p className="text-sm">아직 분석한 생기부가 없어요.</p>
                <Link href="/lab">
                  <Button className="mt-4 bg-[#1e3a5f] text-white hover:bg-[#152c4a]">
                    AI 분석 시작하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {analysisHistory.slice(0, 6).map((item) => (
                <Link key={item.id} href={`/lab/result?id=${item.id}`}>
                  <Card className="group h-full cursor-pointer border-gray-200 transition-all hover:border-blue-300 hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-2xl">🎓</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(item.created_at).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <h3 className="mb-2 line-clamp-2 text-sm font-bold text-gray-800 group-hover:text-blue-600">
                        {item.major} 계열 분석 리포트
                      </h3>
                      {item.is_saved && (
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] text-green-600 border border-green-200">
                          저장됨
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── 저장한 세특 보고서 ── */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-900">저장한 세특 보고서</h2>
          {savedReports.length === 0 ? (
            <Card className="border-dashed border-gray-300">
              <CardContent className="py-12 text-center text-gray-400">
                <p className="mb-2 text-3xl">🔖</p>
                <p className="text-sm">아직 저장한 세특 보고서가 없어요.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedReports.map((saved, idx) => {
                const r = saved.premium_reports;
                if (!r) return null;
                return (
                  <Link key={`${r.id}-${idx}`} href={`/reports/${r.id}`}>
                    <Card className="group h-full cursor-pointer border-gray-200 transition-all hover:border-blue-300 hover:shadow-md">
                      <CardContent className="p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-2xl">🔖</span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(saved.saved_at).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                        <h3 className="mb-2 line-clamp-2 text-sm font-bold text-gray-800 group-hover:text-blue-600">
                          {r.title}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {(r.target_majors || []).slice(0, 1).map((m: string) => (
                            <span key={m} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-600">
                              {m}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ── 열람한 세특 보고서 ── */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-900">열람한 세특 보고서</h2>
          {viewedReports.length === 0 ? (
            <Card className="border-dashed border-gray-300">
              <CardContent className="py-12 text-center text-gray-400">
                <p className="mb-2 text-3xl">📭</p>
                <p className="text-sm">아직 열람한 세특 보고서가 없어요.</p>
                <Link href="/explorer">
                  <Button className="mt-4 bg-[#1e3a5f] text-white hover:bg-[#152c4a]">
                    탐구 주제 찾으러 가기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {viewedReports.map((history, idx) => {
                const r = history.premium_reports;
                if (!r) return null;
                return (
                  <Link key={`${r.id}-${idx}`} href={`/reports/${r.id}`}>
                    <Card className="group h-full cursor-pointer border-gray-200 transition-all hover:border-blue-300 hover:shadow-md">
                      <CardContent className="p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-2xl">📄</span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(history.viewed_at).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                        <h3 className="mb-2 line-clamp-2 text-sm font-bold text-gray-800 group-hover:text-blue-600">
                          {r.title}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {(r.target_majors || []).slice(0, 1).map((m: string) => (
                            <span key={m} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-600">
                              {m}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ── 로그아웃 & 회원 탈퇴 ── */}
        <div className="flex items-center justify-center gap-6 pb-4">
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-400 underline underline-offset-2 transition hover:text-gray-600"
          >
            로그아웃
          </button>
          <button
            onClick={handleWithdraw}
            className="text-sm text-gray-300 underline underline-offset-2 transition hover:text-red-500"
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </main>
  );
}
