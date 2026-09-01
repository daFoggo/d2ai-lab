-- ==============================================================================
-- Migration: Move migration-tracking table out of public schema
--   public.schema_migrations → app_migrations.applied (schema private,
--   không bị PostgREST expose → linter rls_disabled_in_public hết báo).
-- ==============================================================================

CREATE SCHEMA IF NOT EXISTS app_migrations;

CREATE TABLE IF NOT EXISTS app_migrations.applied (
    name       TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Copy dữ liệu tracking hiện có (nếu có) rồi bỏ bảng public
INSERT INTO app_migrations.applied (name, applied_at)
SELECT name, applied_at
FROM public.schema_migrations
ON CONFLICT (name) DO NOTHING;

DROP TABLE IF EXISTS public.schema_migrations;