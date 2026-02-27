import { supabase } from './supabase';

/**
 * 인증 상태를 완전히 초기화하는 최후 수단 함수.
 * 네트워크 오류·인증 루프 발생 시 호출하여 모든 세션/쿠키/localStorage를 지우고
 * /login으로 전체 페이지를 새로고침합니다.
 */
export async function forceSignOut(): Promise<void> {
  try { await supabase.auth.signOut(); } catch { /* ignore */ }
  try { await fetch('/api/mark-onboarded', { method: 'DELETE' }); } catch { /* ignore */ }

  // Supabase가 localStorage에 저장한 세션 토큰 강제 삭제
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('sb-') || k.includes('supabase'))
      .forEach((k) => localStorage.removeItem(k));
  } catch { /* SSR 환경 등에서 localStorage 접근 불가 시 무시 */ }

  window.location.href = '/login';
}
