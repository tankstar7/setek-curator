-- ============================================================
-- Supabase RLS (Row Level Security) 진단 및 수정 SQL
-- Supabase Dashboard → SQL Editor 에서 실행
-- ============================================================

-- ① 현재 premium_reports 테이블의 RLS 정책 목록 확인
SELECT
  policyname,
  permissive,
  roles,
  cmd,
  qual        AS "조건(USING)",
  with_check  AS "쓰기조건(WITH CHECK)"
FROM pg_policies
WHERE tablename = 'premium_reports'
ORDER BY policyname;


-- ② RLS 활성화 여부 확인
SELECT
  relname        AS table_name,
  relrowsecurity AS rls_enabled
FROM pg_class
WHERE relname = 'premium_reports';


-- ─────────────────────────────────────────────────────────────
-- 【수정 1】 anon + authenticated 모두 SELECT 허용 (가장 흔한 해법)
--   증상: 목록은 되는데 상세(.single())가 안 될 때
--         또는 로그인 안 한 유저에게 데이터가 안 보일 때
-- ─────────────────────────────────────────────────────────────
-- 기존 SELECT 정책이 있으면 먼저 삭제 후 재생성
DROP POLICY IF EXISTS "allow_public_select" ON premium_reports;

CREATE POLICY "allow_public_select" ON premium_reports
  FOR SELECT
  TO anon, authenticated
  USING (true);   -- 모든 행 읽기 허용


-- ─────────────────────────────────────────────────────────────
-- 【수정 2】RLS 자체를 끄기 (개발 단계 임시 방편)
--   증상: 위 정책을 추가해도 여전히 안 될 때
-- ─────────────────────────────────────────────────────────────
-- ALTER TABLE premium_reports DISABLE ROW LEVEL SECURITY;


-- ─────────────────────────────────────────────────────────────
-- 【확인용】 anon 역할로 직접 조회 테스트
--   아래 쿼리가 데이터를 반환하면 RLS는 정상
-- ─────────────────────────────────────────────────────────────
-- SET ROLE anon;
-- SELECT id, title, access_tier FROM premium_reports LIMIT 5;
-- RESET ROLE;


-- ─────────────────────────────────────────────────────────────
-- 참고: profiles 테이블도 동일하게 확인
-- ─────────────────────────────────────────────────────────────
SELECT
  policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
