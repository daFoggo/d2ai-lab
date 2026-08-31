-- ==============================================================================
-- Migration: Simplify speaker socials → plain TEXT field
--   Bỏ bảng chuẩn hoá seminar_speaker_socials; lưu socials dạng text
--   (mỗi URL 1 dòng). UI detect platform (X/LinkedIn) từ định dạng đường dẫn.
-- ==============================================================================

-- 1. Thêm cột socials TEXT trên speaker
ALTER TABLE public.seminar_speakers
    ADD COLUMN IF NOT EXISTS socials TEXT;

-- 2. Backfill: gộp các href hiện có (theo sort_order) thành text, mỗi URL 1 dòng
UPDATE public.seminar_speakers sp
SET socials = agg.socials
FROM (
    SELECT speaker_id, string_agg(href, E'\n' ORDER BY sort_order) AS socials
    FROM public.seminar_speaker_socials
    GROUP BY speaker_id
) agg
WHERE sp.id = agg.speaker_id;

-- 3. Bỏ bảng chuẩn hoá cũ (kèm index + RLS policies)
DROP TABLE IF EXISTS public.seminar_speaker_socials CASCADE;