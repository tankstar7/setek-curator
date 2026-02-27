import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── 절대로 리다이렉트하면 안 되는 탈출구 경로 ──────────────────────────────────
// 이 경로가 막히면 즉시 무한루프 발생!
const BYPASS_PREFIXES = [
  '/login',
  '/onboarding',
  '/auth',        // /auth/callback 포함
  '/api',         // API 라우트
  '/_next',
  '/favicon.ico',
  '/guide',
  '/major-result',
  '/skill-tree',
];

// ── 온보딩 쿠키가 있어야 접근 가능한 경로 ─────────────────────────────────────
const PROTECTED_PREFIXES = ['/explorer', '/lab', '/mypage', '/reports', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ① 탈출구 경로는 무조건 통과 (리다이렉트 절대 금지)
  if (BYPASS_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ② 보호 경로: setek_profile_ok 쿠키 없으면 /login으로
  //    /login 페이지가 기존 Supabase 세션을 감지해 쿠키를 복구해줌
  const profileOk = request.cookies.get('setek_profile_ok')?.value === '1';
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !profileOk) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // _next 정적 파일·이미지·favicon은 미들웨어 실행 제외
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
