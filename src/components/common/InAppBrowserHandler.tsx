"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, Share } from "lucide-react";

/**
 * 인앱 브라우저(카카오톡, 인스타그램 등)를 감지하여 
 * 안드로이드는 강제 이탈, iOS는 전체 화면 안내 모달을 띄우는 컴포넌트입니다.
 */
export default function InAppBrowserHandler() {
  const [showIOSOverlay, setShowIOSOverlay] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);

    // 감지할 인앱 브라우저 키워드
    const isInApp = 
      userAgent.includes("kakaotalk") ||
      userAgent.includes("instagram") ||
      userAgent.includes("line") ||
      userAgent.includes("naver") ||
      userAgent.includes("fbav") || 
      userAgent.includes("fban");

    if (isInApp) {
      const currentUrl = window.location.href;

      if (isAndroid) {
        // 안드로이드: 크롬으로 강제 전환 시도 (intent:// 스킴)
        const intentUrl = `intent://${currentUrl.replace(/https?:\/\//i, "")}#Intent;scheme=https;package=com.android.chrome;end`;
        window.location.href = intentUrl;
      } else if (isIOS) {
        // iOS: 카카오톡은 전용 스킴으로 이탈 시도
        if (userAgent.includes("kakaotalk")) {
          window.location.href = `kakaotalk://web/openExternalApp/?url=${encodeURIComponent(currentUrl)}`;
        } else {
          // 기타 iOS 인앱(인스타그램 등)은 강제 이탈이 불가능하므로 안내 오버레이 노출
          setShowIOSOverlay(true);
          // 배경 스크롤 방지
          document.body.style.overflow = "hidden";
        }
      }
    }
  }, []);

  if (!showIOSOverlay) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1e3a5f] px-6 text-white text-center font-sans tracking-tight">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20 shadow-2xl">
        <ExternalLink className="h-10 w-10 text-blue-300" />
      </div>

      <h2 className="mb-4 text-2xl font-extrabold leading-tight">
        보안을 위해<br />
        <span className="text-blue-300">Safari 브라우저</span>에서 열어주세요
      </h2>

      <p className="mb-10 text-lg font-medium text-blue-100/80 leading-relaxed">
        구글 로그인 등 안전한 서비스 이용을 위해<br />
        외부 브라우저 사용이 필요합니다.
      </p>

      <div className="w-full max-w-sm space-y-4 rounded-3xl bg-white/10 p-8 backdrop-blur-md border border-white/10">
        <p className="text-base font-bold text-white mb-4">전환 방법</p>
        
        <div className="flex flex-col gap-6 text-left">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold">1</div>
            <p className="text-sm leading-snug">
              화면 하단(또는 상단)의 <span className="font-bold text-blue-300">공유 아이콘</span> 또는 <span className="font-bold text-blue-300">점 세 개(···)</span> 메뉴를 누릅니다.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold">2</div>
            <p className="text-sm leading-snug">
              메뉴에서 <span className="font-bold text-blue-300">&apos;Safari로 열기&apos;</span>를 선택하면 정상적으로 이용하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => {
          setShowIOSOverlay(false);
          document.body.style.overflow = "auto";
        }}
        className="mt-12 text-sm text-white/40 underline underline-offset-4"
      >
        창 닫고 그냥 구경하기
      </button>
    </div>
  );
}
