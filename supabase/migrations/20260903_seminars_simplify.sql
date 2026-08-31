-- ==============================================================================
-- Migration: Simplify seminar time + derive status from data
--   - Bỏ ends_at → chỉ giữ starts_at TIMESTAMPTZ làm thời điểm duy nhất
--   - Bỏ cột status (không chỉnh sửa tay) → status tính từ starts_at:
--       PAST khi starts_at <= now(), ngược lại UPCOMING
-- ==============================================================================

-- 1. Bỏ ends_at
ALTER TABLE public.seminars
    DROP COLUMN IF EXISTS ends_at;

-- 2. Bỏ cột status (được tính từ dữ liệu)
ALTER TABLE public.seminars
    DROP COLUMN IF EXISTS status;

-- 3. Bỏ enum seminar_status (không còn dùng)
DROP TYPE IF EXISTS public.seminar_status;

-- 4. Index: composite (status, starts_at) không còn cần thiết
DROP INDEX IF EXISTS public.seminars_status_starts_at_idx;
CREATE INDEX IF NOT EXISTS seminars_starts_at_idx
    ON public.seminars(starts_at DESC);