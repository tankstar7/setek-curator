"use client";

import { useEffect } from "react";

/**
 * 인앱 브라우저(카카오톡, 인스타그램 등)를 감지하여 
 * 외부 브라우저(Chrome, Safari)로 전환을 유도하는 컴포넌트입니다.
 */
export default function InAppBrowserHandler() {
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
      userAgent.includes("fbav") || // Facebook App for iOS
      userAgent.includes("fban");   // Facebook App for iOS

    if (isInApp) {
      const currentUrl = window.location.href;

      if (isAndroid) {
        // 안드로이드: Intent 스킴을 사용하여 크롬으로 이동 시도
        // 크롬 브라우저 패키지명을 지정하여 강제 실행
        const intentUrl = `intent://${currentUrl.replace(/https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
        window.location.href = intentUrl;
      } else if (isIOS) {
        // iOS: 카카오톡 전용 외부 브라우저 열기 스킴
        if (userAgent.includes("kakaotalk")) {
          window.location.href = `kakaotalk://web/openExternalApp/?url=${encodeURIComponent(currentUrl)}`;
        } else {
          // 기타 iOS 인앱(인스타그램 등)은 직접 리다이렉트가 어려우므로 
          // 사용자에게 알림을 띄우거나 안내 메시지를 노출하는 것이 일반적입니다.
          // 여기서는 간단한 alert 후 안내를 권장합니다.
          alert(`더 원활한 서비스 이용(구글 로그인 등)을 위해 사파리(Safari) 브라우저에서 열어주세요.

화면 하단의 공유 아이콘을 눌러 'Safari로 열기'를 선택할 수 있습니다.`);
        }
      }
    }
  }, []);

  return null; // UI 없이 로직만 수행
}
