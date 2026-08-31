-- ==============================================================================
-- Migration: Seminar write policies → authenticated
--   Project đã bỏ RBAC custom (20260823_cleanup_rbac.sql) về chuẩn Supabase
--   anon/authenticated. Policies cũ còn tham chiếu claim 'user_role'
--   (không còn tồn tại) → KHÔNG ai ghi được. Chuyển về authenticated.
-- ==============================================================================

DROP POLICY IF EXISTS "Seminars editor write" ON public.seminars;
CREATE POLICY "Seminars authenticated write"
ON public.seminars FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Speakers editor write" ON public.seminar_speakers;
CREATE POLICY "Speakers authenticated write"
ON public.seminar_speakers FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);