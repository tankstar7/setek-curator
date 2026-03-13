import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ── 환경변수 누락 감지 ─────────────────────────────────────────────────────
// undefined인 채로 createClient가 호출되면 모든 쿼리가 조용히 hanging 상태가 됨
if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [
    !supabaseUrl     && 'NEXT_PUBLIC_SUPABASE_URL',
    !supabaseAnonKey && 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ].filter(Boolean).join(', ');
  console.error(
    `%c[Supabase] ❌ 환경변수 누락: ${missing}\n.env.local 파일에 해당 값이 있는지 확인하세요.`,
    'color: red; font-weight: bold; font-size: 14px;'
  );
}

// localStorage가 차단된 환경(일부 기업 브라우저, 개인정보보호 설정 등)에서
// PKCE code verifier 저장 실패를 방지하기 위한 안전한 스토리지 폴백
const safeStorage = (() => {
  if (typeof window === 'undefined') return undefined; // SSR 환경에서는 사용 안 함
  try {
    const TEST_KEY = '__sb_storage_test__';
    localStorage.setItem(TEST_KEY, '1');
    localStorage.removeItem(TEST_KEY);
    return localStorage; // 정상: localStorage 사용
  } catch {
    // localStorage 차단됨 → sessionStorage 시도
    try {
      return sessionStorage;
    } catch {
      return undefined; // 모두 차단 시 SDK 기본값 사용
    }
  }
})();

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',          // 명시적 PKCE 지정 (보안 강화, 기본값이지만 명시)
    ...(safeStorage ? { storage: safeStorage } : {}),
  },
});