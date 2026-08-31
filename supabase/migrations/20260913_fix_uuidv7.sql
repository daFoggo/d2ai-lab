-- ==============================================================================
-- Migration: Fix uuidv7() — set_byte cần integer, không phải bigint
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
  bytes := set_byte(bytes, 0, ((ts >> 40) & 255)::int);
  bytes := set_byte(bytes, 1, ((ts >> 32) & 255)::int);
  bytes := set_byte(bytes, 2, ((ts >> 24) & 255)::int);
  bytes := set_byte(bytes, 3, ((ts >> 16) & 255)::int);
  bytes := set_byte(bytes, 4, ((ts >> 8) & 255)::int);
  bytes := set_byte(bytes, 5, (ts & 255)::int);
  -- version 7
  bytes := set_byte(bytes, 6, (get_byte(bytes, 6) & 15) | 112);
  -- variant 10xxxxxx
  bytes := set_byte(bytes, 8, (get_byte(bytes, 8) & 63) | 128);
  RETURN encode(bytes, 'hex')::uuid;
END;
$$;