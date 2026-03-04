"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import { updateUserTier, scheduleUserDeletion, cancelUserDeletion, type Tier } from "./actions";

// ── 타입 ──────────────────────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  nickname: string | null;
  role: string | null;
  account_tier: string;
  created_at: string;
  school_name: string | null;
  company_name: string | null; // 추가
  region: string | null;
  phone_number: string | null; // 추가
  dream_majors: string[] | null;
  interest_subjects: string[] | null;
  deletion_scheduled_at: string | null;
  privacy_consent_at: string | null; // 추가
}

// ── 상수 ──────────────────────────────────────────────────────────────────────
const TIER_BADGE: Record<string, string> = {
  admin:   "bg-red-100 text-red-700 border border-red-200",
  premium: "bg-amber-100 text-amber-700 border border-amber-200",
  user:    "bg-gray-100 text-gray-600 border border-gray-200",
};
const TIER_LABEL: Record<string, string> = {
  admin: "어드민", premium: "프리미엄", user: "일반",
};
const BAR_COLORS = [
  "#3b82f6","#6366f1","#8b5cf6","#a78bfa","#60a5fa",
  "#818cf8","#93c5fd","#c4b5fd","#7dd3fc","#a5b4fc",
];
const PIE_COLORS = [
  "#1e3a5f","#2563eb","#7c3aed","#db2777","#d97706",
  "#059669","#0891b2","#dc2626","#4f46e5","#0d9488",
];

// ── 티어 드롭다운 ─────────────────────────────────────────────────────────────
function TierSelect({
  user,
  currentUserId,
  onChangeTier,
  updating,
}: {
  user: UserProfile;
  currentUserId: string | null;
  onChangeTier: (u: UserProfile, newTier: string) => void;
  updating: boolean;
}) {
  const isSelf = user.id === currentUserId;

  const selectStyle: Record<string, string> = {
    admin:   "border-red-200 bg-red-50 text-red-700",
    premium: "border-amber-200 bg-amber-50 text-amber-700",
    user:    "border-gray-200 bg-white text-gray-600",
  };

  return (
    <div className="relative inline-flex items-center gap-1">
      <select
        value={user.account_tier}
        disabled={isSelf || updating}
        title={isSelf ? "본인의 등급은 변경할 수 없습니다" : "등급 변경"}
        onChange={(e) => {
          const newTier = e.target.value;
          if (newTier !== user.account_tier) onChangeTier(user, newTier);
        }}
        className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold outline-none transition
          focus:ring-2 focus:ring-blue-200
          disabled:cursor-not-allowed disabled:opacity-40
          ${selectStyle[user.account_tier] ?? selectStyle["user"]}`}
      >
        <option value="user">일반</option>
        <option value="premium">프리미엄</option>
        <option value="admin">어드민</option>
      </select>
      {updating && (
        <span className="text-[10px] text-gray-400 animate-pulse">저장 중…</span>
      )}
      {isSelf && (
        <span className="text-[10px] text-gray-400">본인</span>
      )}
    </div>
  );
}

// ── 유저 상세 모달 ─────────────────────────────────────────────────────────────
function UserModal({
  user,
  currentUserId,
  onClose,
  onChangeTier,
  onScheduleDeletion,
  onCancelDeletion,
  onImmediateDeletion,
  updating,
}: {
  user: UserProfile;
  currentUserId: string | null;
  onClose: () => void;
  onChangeTier: (u: UserProfile, newTier: string) => void;
  onScheduleDeletion: (u: UserProfile) => void;
  onCancelDeletion: (u: UserProfile) => void;
  onImmediateDeletion: (u: UserProfile) => void;
  updating: boolean;
}) {
  // 남은 시간 계산 (72시간 유예)
  const remainingTime = useMemo(() => {
    if (!user.deletion_scheduled_at) return null;
    const end = new Date(user.deletion_scheduled_at).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    if (diff <= 0) return "삭제 처리 대기 중";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}시간 ${mins}분 남음`;
  }, [user.deletion_scheduled_at]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#1e3a5f] to-[#2d5282] px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
              가입자 상세
            </p>
            <h3 className="text-lg font-extrabold text-white">
              {user.nickname ?? "닉네임 없음"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* 모달 바디 */}
        <div className="max-h-[70vh] overflow-y-auto space-y-4 px-6 py-5">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "구분",    value: user.role ?? "—" },
              { label: "지역",    value: user.region ?? "—" },
              { label: "학교",    value: user.school_name ?? "—" },
              { label: "회사/학원", value: user.company_name ?? "—" },
              { label: "휴대폰",   value: user.phone_number ?? "—" },
              {
                label: "가입일",
                value: new Date(user.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric", month: "2-digit", day: "2-digit",
                }),
              },
              {
                label: "동의일",
                value: user.privacy_consent_at ? new Date(user.privacy_consent_at).toLocaleDateString("ko-KR", {
                  year: "numeric", month: "2-digit", day: "2-digit",
                }) : "—",
              },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-700">{value}</p>
              </div>
            ))}
          </div>

          {/* 티어 드롭다운 */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">계정 티어</p>
            <TierSelect
              user={user}
              currentUserId={currentUserId}
              onChangeTier={onChangeTier}
              updating={updating}
            />
          </div>

          {/* 희망 전공 */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">희망 전공</p>
            {user.dream_majors && user.dream_majors.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {user.dream_majors.map((m) => (
                  <span key={m} className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                    {m}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">미입력</p>
            )}
          </div>

          {/* 관심 과목 */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">관심 과목</p>
            {user.interest_subjects && user.interest_subjects.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {user.interest_subjects.map((s) => (
                  <span key={s} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">미입력</p>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">계정 관리</p>
            {user.deletion_scheduled_at ? (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                    <span className="animate-pulse">⏳</span> 계정 삭제 예약됨
                  </p>
                  <span className="text-[11px] font-bold text-red-600 bg-white px-2 py-0.5 rounded-full border border-red-100">
                    {remainingTime}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-red-500 mb-3">
                  이 계정은 관리자에 의해 삭제 예약되었습니다. 72시간 유예 기간이 지나면 데이터가 영구 삭제됩니다.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onCancelDeletion(user)}
                    disabled={updating}
                    className="flex-1 rounded-lg bg-white py-2 text-xs font-bold text-red-600 border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
                  >
                    삭제 예약 취소하기
                  </button>
                  <button
                    onClick={() => onImmediateDeletion(user)}
                    disabled={updating}
                    className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700 transition disabled:opacity-50"
                  >
                    즉시 삭제하기
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onScheduleDeletion(user)}
                disabled={updating || user.id === currentUserId}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-xs font-bold text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-500"
              >
                <span>🚫</span> 회원 계정 삭제 (72시간 유예)
              </button>
            )}
            {user.id === currentUserId && (
              <p className="mt-2 text-center text-[10px] text-gray-400">관리자 본인 계정은 삭제할 수 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers]               = useState<UserProfile[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [updating, setUpdating]         = useState<string | null>(null); // 처리 중인 userId
  const [token, setToken]               = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // ── 데이터 로드 ─────────────────────────────────────────────────────────────
  const loadUsers = useCallback(async (accessToken: string) => {
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status === 403) { router.replace("/"); return; }
    if (!res.ok) { setError("유저 목록을 불러오지 못했습니다."); return; }
    const json = await res.json();
    setUsers(json.users ?? []);
  }, [router]);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      setToken(session.access_token);
      setCurrentUserId(session.user.id);
      await loadUsers(session.access_token);
      setLoading(false);
    })();
  }, [router, loadUsers]);

  // ── 티어 변경 핸들러 ─────────────────────────────────────────────────────────
  const handleTierChange = async (targetUser: UserProfile, newTier: string) => {
    if (!token) return;

    // 자기 자신 변경 시도 차단 (Server Action에서도 막지만 UI에서도 차단)
    if (targetUser.id === currentUserId) {
      alert("본인의 등급은 변경할 수 없습니다.");
      return;
    }

    // 이미 같은 등급이면 무시
    if (targetUser.account_tier === newTier) return;

    const confirmed = window.confirm(
      `「${targetUser.nickname ?? targetUser.id}」 유저의 등급을\n` +
      `"${TIER_LABEL[targetUser.account_tier] ?? targetUser.account_tier}" → ` +
      `"${TIER_LABEL[newTier] ?? newTier}"으로 변경하시겠습니까?`
    );
    if (!confirmed) return;

    setUpdating(targetUser.id);

    // Server Action 호출 (SUPABASE_SERVICE_ROLE_KEY 사용, RLS 우회)
    const result = await updateUserTier(token, targetUser.id, newTier as Tier);

    if (result.ok) {
      // 테이블 상태 갱신
      setUsers((prev) =>
        prev.map((u) => u.id === targetUser.id ? { ...u, account_tier: newTier } : u)
      );
      // 열려 있는 모달 상태도 갱신
      setSelectedUser((prev) =>
        prev?.id === targetUser.id ? { ...prev, account_tier: newTier } : prev
      );
    } else {
      alert(`변경 실패: ${result.error ?? "알 수 없는 오류"}`);
    }

    setUpdating(null);
  };

  // ── 삭제 예약 핸들러 ─────────────────────────────────────────────────────────
  const handleScheduleDeletion = async (targetUser: UserProfile) => {
    if (!token) return;
    const confirmed = window.confirm(
      `「${targetUser.nickname ?? targetUser.id}」 유저의 계정을 삭제 예약하시겠습니까?\n\n` +
      `72시간의 유예 기간이 부여되며, 그 이후에는 모든 데이터가 영구 삭제됩니다.`
    );
    if (!confirmed) return;

    setUpdating(targetUser.id);
    const result = await scheduleUserDeletion(token, targetUser.id);

    if (result.ok) {
      const scheduledAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
      setUsers((prev) =>
        prev.map((u) => u.id === targetUser.id ? { ...u, deletion_scheduled_at: scheduledAt } : u)
      );
      setSelectedUser((prev) =>
        prev?.id === targetUser.id ? { ...prev, deletion_scheduled_at: scheduledAt } : prev
      );
    } else {
      alert(`예약 실패: ${result.error ?? "알 수 없는 오류"}`);
    }
    setUpdating(null);
  };

  // ── 삭제 취소 핸들러 ─────────────────────────────────────────────────────────
  const handleCancelDeletion = async (targetUser: UserProfile) => {
    if (!token) return;
    setUpdating(targetUser.id);
    const result = await cancelUserDeletion(token, targetUser.id);

    if (result.ok) {
      setUsers((prev) =>
        prev.map((u) => u.id === targetUser.id ? { ...u, deletion_scheduled_at: null } : u)
      );
      setSelectedUser((prev) =>
        prev?.id === targetUser.id ? { ...prev, deletion_scheduled_at: null } : prev
      );
    } else {
      alert(`취소 실패: ${result.error ?? "알 수 없는 오류"}`);
    }
    setUpdating(null);
  };

  // ── 즉시 삭제 핸들러 ─────────────────────────────────────────────────────────
  const handleImmediateDeletion = async (targetUser: UserProfile) => {
    if (!token) return;
    const confirmed = window.confirm(
      `🚨 [경고] 계정 즉시 삭제\n\n「${targetUser.nickname ?? targetUser.id}」 유저의 모든 정보를 지금 즉시 삭제하시겠습니까?\n\n이 작업은 72시간 유예 없이 즉시 실행되며, 프로필 정보와 로그인 계정 자체를 완전히 파괴합니다. 이 작업은 절대로 되돌릴 수 없습니다.`
    );
    if (!confirmed) return;

    setUpdating(targetUser.id);
    const result = await deleteUserPermanently(token, targetUser.id);

    if (result.ok) {
      alert("해당 계정이 완전히 삭제되었습니다.");
      setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
      setSelectedUser(null);
    } else {
      alert(`삭제 실패: ${result.error ?? "알 수 없는 오류"}`);
    }
    setUpdating(null);
  };

  // ── 통계 계산 ────────────────────────────────────────────────────────────────
  const total    = users.length;
  const premium  = users.filter((u) => u.account_tier === "premium").length;
  const regular  = users.filter((u) => u.account_tier === "user").length;
  const adminCnt = users.filter((u) => u.account_tier === "admin").length;
  const convRate = total > 0 ? Math.round((premium / total) * 100) : 0;

  const majorData = useMemo(() => {
    const freq: Record<string, number> = {};
    users.forEach((u) => (u.dream_majors ?? []).forEach((m) => { freq[m] = (freq[m] ?? 0) + 1; }));
    return Object.entries(freq).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
  }, [users]);

  const subjectData = useMemo(() => {
    const freq: Record<string, number> = {};
    users.forEach((u) => (u.interest_subjects ?? []).forEach((s) => { freq[s] = (freq[s] ?? 0) + 1; }));
    return Object.entries(freq).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [users]);

  // ── 로딩 / 에러 ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="animate-pulse text-sm text-gray-400">관리자 인증 중...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  // ── 렌더 ─────────────────────────────────────────────────────────────────────
  return (
    <>
      <main className="min-h-screen bg-gray-50 pb-20">

        {/* ── 헤더 ── */}
        <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] px-6 py-10 text-white">
          <div className="mx-auto max-w-6xl flex items-end justify-between">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-blue-300">
                Admin · 세특큐레이터
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
              <p className="mt-1 text-sm text-blue-200">가입자 현황 · 티어 관리 · 데이터 분석</p>
            </div>
            <div className="flex flex-col items-end gap-2 hidden sm:flex">
              <Link href="/onboarding">
                <Button size="sm" variant="outline" className="h-8 border-blue-400/50 bg-blue-400/10 text-[11px] font-bold text-blue-100 hover:bg-blue-400/20">
                  ✨ 온보딩 페이지
                </Button>
              </Link>
              <p className="text-xs text-blue-300">
                {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">

          {/* ── 통계 카드 4개 ── */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "전체 가입자", value: total,        sub: "누적 회원 수",    icon: "👥", accent: "from-blue-500 to-blue-600",    text: "text-blue-600",    bg: "bg-blue-50"    },
              { label: "프리미엄",   value: premium,       sub: `일반 ${regular}명`, icon: "⭐", accent: "from-amber-400 to-amber-500",   text: "text-amber-600",   bg: "bg-amber-50"   },
              { label: "전환율",     value: `${convRate}%`, sub: "유료 전환 비율",  icon: "📈", accent: "from-emerald-500 to-emerald-600", text: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "어드민",     value: adminCnt,      sub: "관리자 계정",     icon: "🛡️", accent: "from-red-500 to-red-600",         text: "text-red-600",     bg: "bg-red-50"     },
            ].map((stat) => (
              <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg} text-lg`}>
                  {stat.icon}
                </div>
                <p className={`text-3xl font-extrabold tracking-tight ${stat.text}`}>{stat.value}</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-700">{stat.label}</p>
                <p className="mt-0.5 text-[11px] text-gray-400">{stat.sub}</p>
                <div className={`absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-gradient-to-br opacity-10 ${stat.accent}`} />
              </div>
            ))}
          </div>

          {/* ── 차트 섹션 ── */}
          {(majorData.length > 0 || subjectData.length > 0) && (
            <div className="grid gap-6 lg:grid-cols-2">
              {majorData.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-1 text-sm font-bold text-gray-800">🎯 희망 전공 선호도</h2>
                  <p className="mb-4 text-[11px] text-gray-400">가입자가 선택한 전공 계열 (복수 선택)</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={majorData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                      <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
                      <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} formatter={(v) => [`${v}명`, "선택 수"]} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {majorData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {subjectData.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-1 text-sm font-bold text-gray-800">📚 관심 과목 분포</h2>
                  <p className="mb-4 text-[11px] text-gray-400">가입자가 선택한 과목 분포 (복수 선택)</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={subjectData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={75}
                        label={({ name, percent }: { name?: string; percent?: number }) =>
                          (percent ?? 0) > 0.05 ? `${name} ${((percent ?? 0) * 100).toFixed(0)}%` : ""
                        }
                        labelLine={false}
                        style={{ fontSize: "10px", fontWeight: "600" }}
                      >
                        {subjectData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} formatter={(v) => [`${v}명`, "선택 수"]} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* ── 가입자 테이블 ── */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-sm font-bold text-gray-800">가입자 목록</h2>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-500">
                {total}명
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">닉네임</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">구분</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">지역</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden md:table-cell">가입일</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">등급 변경</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="cursor-pointer transition-colors hover:bg-blue-50/40"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">
                            {user.nickname ?? <span className="text-gray-300">미설정</span>}
                          </span>
                          {/* 티어 뱃지 */}
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TIER_BADGE[user.account_tier] ?? TIER_BADGE["user"]}`}>
                            {TIER_LABEL[user.account_tier] ?? user.account_tier}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{user.role ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{user.region ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">
                        {new Date(user.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}
                      </td>
                      {/* 등급 변경 드롭다운 — 행 클릭과 분리 */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <TierSelect
                          user={user}
                          currentUserId={currentUserId}
                          onChangeTier={handleTierChange}
                          updating={updating === user.id}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="py-12 text-center text-sm text-gray-400">가입자가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── 상세 모달 ── */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          currentUserId={currentUserId}
          onClose={() => setSelectedUser(null)}
          onChangeTier={handleTierChange}
          onScheduleDeletion={handleScheduleDeletion}
          onCancelDeletion={handleCancelDeletion}
          onImmediateDeletion={handleImmediateDeletion}
          updating={updating === selectedUser.id}
        />
      )}
    </>
  );
}
