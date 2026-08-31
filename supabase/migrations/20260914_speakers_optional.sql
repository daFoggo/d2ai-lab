-- ==============================================================================
-- Migration: Relax seminar speaker name/role (chỉ seminar essentials là bắt buộc)
-- ==============================================================================

ALTER TABLE public.seminar_speakers
    ALTER COLUMN name DROP NOT NULL,
    ALTER COLUMN role DROP NOT NULL;