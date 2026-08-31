-- ==============================================================================
-- Migration: Internal UUIDs → UUIDv7 (time-ordered, tránh fragmentation)
--   pg_uuidv7 extension không có sẵn → tự tạo hàm UUIDv7 (PL/pgSQL, chuẩn RFC 9562).
--   Áp dụng cho id nội bộ (seminar_speakers, research_papers).
--   Cột tham chiếu auth.users giữ nguyên (Supabase Auth dùng UUIDv4).
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.uuidv7()
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  ts    BIGINT;
  bytes BYTEA;
BEGIN
  ts := (EXTRACT(EPOCH FROM clock_timestamp()) * 1000)::BIGINT;
  bytes := gen_random_bytes(16);
  -- 48-bit unix_ms timestamp (bytes 0-5)
  bytes := set_byte(bytes, 0, (ts >> 40) & 255);
  bytes := set_byte(bytes, 1, (ts >> 32) & 255);
  bytes := set_byte(bytes, 2, (ts >> 24) & 255);
  bytes := set_byte(bytes, 3, (ts >> 16) & 255);
  bytes := set_byte(bytes, 4, (ts >> 8) & 255);
  bytes := set_byte(bytes, 5, ts & 255);
  -- version 7
  bytes := set_byte(bytes, 6, (get_byte(bytes, 6) & 15) | 112);
  -- variant 10xxxxxx
  bytes := set_byte(bytes, 8, (get_byte(bytes, 8) & 63) | 128);
  RETURN encode(bytes, 'hex')::uuid;
END;
$$;

ALTER TABLE public.seminar_speakers
    ALTER COLUMN id SET DEFAULT public.uuidv7();

ALTER TABLE public.research_papers
    ALTER COLUMN id SET DEFAULT public.uuidv7();