-- ==============================================================================
-- Migration: Relax speaker-photo storage write to any authenticated user
--   Upload ảnh xảy ra trong lúc chỉnh form (trước khi lưu seminar), nên chặn
--   anon là đủ; việc tạo/sửa seminar vẫn giữ researcher-gated ở bảng seminars.
-- ==============================================================================

DROP POLICY IF EXISTS "speaker photos editor write" ON storage.objects;
CREATE POLICY "speaker photos authenticated write"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'speaker-photos');