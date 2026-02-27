import { NextResponse } from 'next/server';

// 온보딩 완료 시 클라이언트가 호출 → httpOnly 쿠키 발급
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('setek_profile_ok', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1년
  });
  return res;
}

// 로그아웃 시 쿠키 삭제
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('setek_profile_ok', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
