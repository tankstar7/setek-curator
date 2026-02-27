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

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});