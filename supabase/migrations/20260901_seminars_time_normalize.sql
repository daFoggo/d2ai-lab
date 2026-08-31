-- ==============================================================================
-- Migration: Normalize seminar time fields
--   date DATE + time TEXT ("14:00 - 15:30")  →  starts_at TIMESTAMPTZ + ends_at TIMESTAMPTZ
-- (chuẩn event scheduling: lưu timestamp đầy đủ, UI derive date/time, đúng TZ)
-- ==============================================================================

-- 1. Thêm cột timestamp canonical
ALTER TABLE public.seminars
    ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS ends_at   TIMESTAMPTZ;

-- 2. Backfill từ date + time (dạng "HH:MM - HH:MM")
UPDATE public.seminars
SET starts_at = (date + (split_part(time, ' - ', 1))::time) AT TIME ZONE 'UTC',
    ends_at   = (date + (split_part(time, ' - ', 2))::time) AT TIME ZONE 'UTC'
WHERE starts_at IS NULL
  AND time ~ '^[0-9]{2}:[0-9]{2}\s*-\s*[0-9]{2}:[0-9]{2}$';

-- Fallback cho rows thiếu time hợp lệ
UPDATE public.seminars
SET starts_at = (date + '09:00'::time) AT TIME ZONE 'UTC',
    ends_at   = (date + '10:30'::time) AT TIME ZONE 'UTC'
WHERE starts_at IS NULL AND date IS NOT NULL;

-- 3. Ràng buộc NOT NULL
ALTER TABLE public.seminars ALTER COLUMN starts_at SET NOT NULL;

-- 4. Bỏ cột legacy
ALTER TABLE public.seminars
    DROP COLUMN IF EXISTS date,
    DROP COLUMN IF EXISTS time;

-- 5. Index cho query mới
DROP INDEX IF EXISTS public.seminars_date_idx;
DROP INDEX IF EXISTS public.seminars_status_idx;
CREATE INDEX IF NOT EXISTS seminars_starts_at_idx
    ON public.seminars(starts_at DESC);
CREATE INDEX IF NOT EXISTS seminars_status_starts_at_idx
    ON public.seminars(status, starts_at);