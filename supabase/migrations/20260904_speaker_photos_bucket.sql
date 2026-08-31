-- ==============================================================================
-- Migration: Storage bucket cho speaker photos (public) + RLS
-- ==============================================================================

-- Bucket public: đọc được qua URL công khai
INSERT INTO storage.buckets (id, name, public)
VALUES ('speaker-photos', 'speaker-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
DROP POLICY IF EXISTS "speaker photos public read" ON storage.objects;
CREATE POLICY "speaker photos public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'speaker-photos');

-- Write chỉ cho content-editor ('researcher')
DROP POLICY IF EXISTS "speaker photos editor write" ON storage.objects;
CREATE POLICY "speaker photos editor write"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'speaker-photos'
    AND (auth.jwt() ->> 'user_role') = 'researcher'
);