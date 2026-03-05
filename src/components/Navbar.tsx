"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { forceSignOut } from "@/lib/authUtils";
import type { User } from "@supabase/supabase-js";
import { ChevronDown, Megaphone, Gift, Headset } from "lucide-react";

const NAV_ITEMS = [
  { label: "홈",            href: "/" },
  { label: "22개정 가이드", href: "/guide" },
  { label: "세특 탐구소",   href: "/explorer" },
  { label: "AI 생기부 분석실", href: "/lab" },
  { label: "마이페이지",    href: "/mypage" },
];

const BOARD_ITEMS = [
  { label: "공지사항", href: "/notices",  icon: <Megaphone className="size-4" /> },
  { label: "이벤트",   href: "/events",   icon: <Gift className="size-4" /> },
  { label: "고객센터", href: "/inquiry", icon: <Headset className="size-4" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen]           = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [user, setUser]           = useState<User | null>(null);
  const [nickname, setNickname]   = useState<string | null>(null);
  const [accountTier, setAccountTier] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const authTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 프로필 fetch 헬퍼 (nickname + account_tier)
  const fetchProfile = async (uid: string) => {
    // .maybeSingle() — 프로필 미완료 유저(0 rows)여도 406 에러 없이 null 반환
    const { data } = await supabase
      .from("profiles")
      .select("nickname, account_tier")
      .eq("id", uid)
      .maybeSingle();
    setNickname(data?.nickname ?? null);
    setAccountTier(data?.account_tier ?? null);
  };

  useEffect(() => {
    // 5초 내에 getUser 응답이 없으면 연결 오류로 판단
    authTimeoutRef.current = setTimeout(() => {
      setConnectionError(true);
      setAuthReady(true);
    }, 5_000);

    supabase.auth.getUser()
      .then(async ({ data }) => {
        if (authTimeoutRef.current) {
          clearTimeout(authTimeoutRef.current);
          authTimeoutRef.current = null;
        }
        setUser(data.user);
        if (data.user) {
          try { await fetchProfile(data.user.id); } catch { /* 프로필 실패 시 이메일 fallback */ }
        }
        setAuthReady(true);
      })
      .catch(() => {
        // getUser 자체가 실패(네트워크 단절 등) → 연결 오류 UI 표시
        if (authTimeoutRef.current) {
          clearTimeout(authTimeoutRef.current);
          authTimeoutRef.current = null;
        }
        setConnectionError(true);
        setAuthReady(true);
      });

    // onAuthStateChange에서 async/await를 쓰면 Supabase 내부 이벤트 큐가
    // 콜백 Promise가 resolve될 때까지 다른 쿼리를 블로킹한다 (데드락).
    // 이 앱은 로그인·로그아웃 시 항상 페이지를 리다이렉트하므로
    // onAuthStateChange 없이 getUser() 최초 1회 조회만으로 충분하다.
    return () => {
      if (authTimeoutRef.current) clearTimeout(authTimeoutRef.current);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await fetch("/api/mark-onboarded", { method: "DELETE" });
    router.push("/");
  };

  // admin 유저는 마이페이지 → /admin 으로 리다이렉트
  const resolveHref = (href: string) =>
    href === "/mypage" && accountTier === "admin" ? "/admin" : href;

  const isActive = (href: string) => {
    const resolved = resolveHref(href);
    return resolved === "/" ? pathname === "/" : pathname.startsWith(resolved);
  };

  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => {
    // authReady 전에는 스켈레톤으로 자리 유지 (return null 금지 — 버튼 소멸 방지)
    if (!authReady) {
      return (
        <div
          className={`h-8 animate-pulse rounded-full bg-white/20 ${
            mobile ? "w-full" : "w-28"
          }`}
        />
      );
    }

    // 연결 오류 시 강제 로그아웃 버튼 노출
    if (connectionError) {
      return (
        <div className={`flex flex-col items-end gap-1 ${mobile ? "w-full" : ""}`}>
          <span className="text-[11px] text-red-300">연결이 원활하지 않습니다</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={forceSignOut}
            className={`text-red-300 hover:bg-white/10 hover:text-red-200 ${mobile ? "w-full" : ""}`}
          >
            로그아웃 후 재시작
          </Button>
        </div>
      );
    }

    if (user) {
      return (
        <div className={`flex items-center gap-3 ${mobile ? "flex-col items-stretch" : ""}`}>
          {/* ── 이벤트/고객센터 드롭다운 (Desktop) ── */}
          {!mobile && (
            <div className="group relative">
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-100 transition-colors hover:text-white">
                이벤트/고객센터
                <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
              </button>
              
              <div className="invisible absolute right-0 top-full w-40 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#152c4a] p-1.5 shadow-xl shadow-black/20">
                  {BOARD_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-blue-100 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── 이벤트/고객센터 아코디언 (Mobile) ── */}
          {mobile && (
            <div className="space-y-1">
              <button 
                onClick={() => setBoardOpen(!boardOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-blue-100 hover:bg-white/10"
              >
                이벤트/고객센터
                <ChevronDown className={`size-4 transition-transform ${boardOpen ? "rotate-180" : ""}`} />
              </button>
              {boardOpen && (
                <div className="ml-4 space-y-1 border-l border-white/10 pl-2">
                  {BOARD_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-blue-100 hover:text-white"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* 닉네임 뱃지 (없으면 이메일 앞부분) */}
            <span className="max-w-[140px] truncate rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-100">
              {nickname ?? user.email?.split("@")[0]}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className={`text-blue-100 hover:bg-white/10 hover:text-white ${mobile ? "flex-1" : ""}`}
            >
              로그아웃
            </Button>
          </div>
        </div>
      );
    }

    return (
      <Button
        size="sm"
        onClick={() => router.push("/login")}
        className={`bg-blue-500 text-white hover:bg-blue-400 ${mobile ? "w-full" : ""}`}
      >
        로그인 / 가입하기
      </Button>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1e3a5f] shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            세특<span className="text-blue-300">큐레이터</span>
          </span>
          <span className="hidden rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-semibold text-white sm:inline">
            22개정
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={resolveHref(href)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(href)
                  ? "bg-white/15 text-white"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 lg:flex">
          <AuthButtons />
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 p-2 lg:hidden"
          aria-label="메뉴"
        >
          <span className={`block h-0.5 w-6 bg-white transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-white/10 bg-[#152c4a] px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ label, href }) => (
              <Link
                key={href}
                href={resolveHref(href)}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-white/15 text-white"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4">
            <AuthButtons mobile />
          </div>
        </div>
      )}
    </header>
  );
}
