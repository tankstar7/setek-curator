"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  REGIONS, ROLES, DREAM_MAJORS, INTEREST_SUBJECTS,
} from "@/lib/profileOptions";
import type { User } from "@supabase/supabase-js";

// ── 단계 정의 ─────────────────────────────────────────────────────────────────
const STEPS = ["기본 정보", "희망 전공", "관심 과목"] as const;

// ── 칩 선택 토글 헬퍼 ─────────────────────────────────────────────────────────
function toggle(arr: string[], val: string, max: number): string[] {
  return arr.includes(val)
    ? arr.filter((v) => v !== val)
    : arr.length < max ? [...arr, val] : arr;
}

export default function OnboardingPage() {
  const router = useRouter();

  const [user, setUser]     = useState<User | null>(null);
  const [pageReady, setPageReady] = useState(false);
  const [step, setStep]     = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  // Step 1
  const [nickname,     setNickname]     = useState("");
  const [role,         setRole]         = useState("");
  const [region,       setRegion]       = useState("");
  const [schoolName,   setSchoolName]   = useState("");
  const [companyName,  setCompanyName]  = useState("");

  // Step 2
  const [dreamMajors, setDreamMajors] = useState<string[]>([]);

  // Step 3
  const [subjects, setSubjects] = useState<string[]>([]);

  // ── 초기 인증 확인 ────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      // .maybeSingle() — 신규 유저(0 rows)여도 406 에러 없이 null 반환
      const { data: profile } = await supabase
        .from("profiles").select("id").eq("id", user.id).maybeSingle();

      if (profile) {
        await fetch("/api/mark-onboarded", { method: "POST" });
        router.replace("/explorer");
        return;
      }

      setUser(user);
      setPageReady(true);
    })();
  }, [router]);

  // ── 유효성 ────────────────────────────────────────────────────────────────
  const step1Valid =
    nickname.trim().length > 0 && role && region &&
    (schoolName.trim().length > 0 || companyName.trim().length > 0);
  const step2Valid = dreamMajors.length > 0;
  const step3Valid = subjects.length > 0;

  // ── 저장 ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!step3Valid || !user) return;
    setSaving(true);
    setError("");

    const { error: dbErr } = await supabase.from("profiles").insert({
      id:                user.id,
      nickname:          nickname.trim(),
      role,
      region,
      school_name:       schoolName.trim(),
      company_name:      companyName.trim() || null,
      dream_majors:      dreamMajors,
      interest_subjects: subjects,
      updated_at:        new Date().toISOString(),
    });

    if (dbErr) {
      setError("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      setSaving(false);
      return;
    }

    await fetch("/api/mark-onboarded", { method: "POST" });
    router.replace("/explorer");
  };

  // ── 로딩 ──────────────────────────────────────────────────────────────────
  if (!pageReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="animate-pulse text-slate-400">잠시만 기다려주세요...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-4 py-12">
      <div className="w-full max-w-lg">

        {/* ── 진행 표시줄 ── */}
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-xs font-semibold text-blue-200">
            {STEPS.map((label, i) => (
              <span
                key={label}
                className={i + 1 <= step ? "text-white" : "text-blue-300/50"}
              >
                {i + 1}. {label}
              </span>
            ))}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-blue-400 transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* ── 카드 ── */}
        <div className="rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">

          {/* ═══════════ STEP 1: 기본 정보 ═══════════ */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">👋</div>
                <h2 className="text-xl font-extrabold text-slate-900">반가워요!</h2>
                <p className="mt-1 text-sm text-slate-500">기본 정보를 입력해주세요</p>
              </div>

              {/* 닉네임 */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  닉네임 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="사용할 닉네임 (최대 20자)"
                  maxLength={20}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* 신분 */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  신분 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      className={`flex flex-col items-start rounded-xl border-2 px-4 py-3 text-left transition-all ${
                        role === r.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="mb-0.5 text-xl">{r.emoji}</span>
                      <span className="text-sm font-bold text-slate-800">{r.value}</span>
                      <span className="text-[10px] text-slate-400">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 지역 */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  지역 <span className="text-red-500">*</span>
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">지역을 선택하세요</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* 학교명 / 회사·학원명 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    학교명
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="예: OO고등학교"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    회사 / 학원명
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="예: OO학원, OO회사"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">학교명 또는 회사/학원명 중 하나만 입력하면 됩니다.</p>

              <button
                onClick={() => setStep(2)}
                disabled={!step1Valid}
                className="w-full rounded-xl bg-[#1e3a5f] py-3.5 font-bold text-white transition hover:bg-[#152c4a] disabled:cursor-not-allowed disabled:opacity-40"
              >
                다음 단계 →
              </button>
            </div>
          )}

          {/* ═══════════ STEP 2: 희망 전공 ═══════════ */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-3xl">🎯</div>
                <h2 className="text-xl font-extrabold text-slate-900">희망 전공 계열</h2>
                <p className="mt-1 text-sm text-slate-500">
                  관심 있는 계열을{" "}
                  <span className="font-bold text-violet-600">최대 3개</span>까지 선택하세요
                </p>
              </div>

              {/* 선택 카운터 */}
              <div className="flex items-center justify-between rounded-xl bg-violet-50 px-4 py-2">
                <span className="text-sm text-violet-700">선택됨</span>
                <span className="text-sm font-bold text-violet-700">
                  {dreamMajors.length} / 3
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {DREAM_MAJORS.map((m) => {
                  const selected = dreamMajors.includes(m.value);
                  const maxed    = dreamMajors.length >= 3 && !selected;
                  return (
                    <button
                      key={m.value}
                      onClick={() => setDreamMajors(toggle(dreamMajors, m.value, 3))}
                      disabled={maxed}
                      className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                        selected
                          ? "border-violet-500 bg-violet-50 text-violet-800"
                          : maxed
                          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                          : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50"
                      }`}
                    >
                      <span className="text-base">{m.emoji}</span>
                      <span className="leading-tight">{m.value}</span>
                      {selected && <span className="ml-auto text-violet-500">✓</span>}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  ← 이전
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!step2Valid}
                  className="flex-[2] rounded-xl bg-[#1e3a5f] py-3.5 font-bold text-white transition hover:bg-[#152c4a] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  다음으로 →
                </button>
              </div>

            </div>
          )}

          {/* ═══════════ STEP 3: 관심 과목 ═══════════ */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">📚</div>
                <h2 className="text-xl font-extrabold text-slate-900">관심 과목</h2>
                <p className="mt-1 text-sm text-slate-500">
                  좋아하는 과목을{" "}
                  <span className="font-bold text-emerald-600">최대 5개</span>까지 선택하세요
                </p>
              </div>

              {/* 선택 카운터 */}
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-2">
                <span className="text-sm text-emerald-700">선택됨</span>
                <span className="text-sm font-bold text-emerald-700">
                  {subjects.length} / 5
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {INTEREST_SUBJECTS.map((s) => {
                  const selected = subjects.includes(s.value);
                  const maxed    = subjects.length >= 5 && !selected;
                  return (
                    <button
                      key={s.value}
                      onClick={() => setSubjects(toggle(subjects, s.value, 5))}
                      disabled={maxed}
                      className={`flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-medium transition-all ${
                        selected
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                          : maxed
                          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      <span>{s.emoji}</span>
                      <span>{s.value}</span>
                    </button>
                  );
                })}
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  ← 이전
                </button>
                <button
                  onClick={handleSave}
                  disabled={!step3Valid || saving}
                  className="flex-[2] rounded-xl bg-[#1e3a5f] py-3 font-bold text-white transition hover:bg-[#152c4a] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? "저장 중..." : "세특큐레이터 시작하기 🚀"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-blue-200">
          마이페이지에서 언제든지 정보를 수정할 수 있어요
        </p>
      </div>
    </div>
  );
}
