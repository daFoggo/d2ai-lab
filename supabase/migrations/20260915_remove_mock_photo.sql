-- ==============================================================================
-- Migration: Bỏ photo mock FE (/demo-seminar/*) — ảnh thật sẽ lên qua Supabase Storage
-- ==============================================================================

UPDATE public.seminar_speakers
SET photo_url = NULL
WHERE photo_url LIKE '/demo-seminar/%';