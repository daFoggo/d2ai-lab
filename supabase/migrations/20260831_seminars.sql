-- ==============================================================================
-- Migration: Seminars content management (admin CRUD + public read)
-- Tables: seminars, seminar_speakers, seminar_speaker_socials
-- RLS:   public SELECT; writes gated to content-editor role ('researcher')
--        (giữ nguyên pattern RBAC của research_papers — không thay đổi enum).
-- Idempotent: an toàn khi chạy lại toàn bộ migrations.
-- ==============================================================================

-- 1. Enum status
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seminar_status') THEN
        CREATE TYPE public.seminar_status AS ENUM ('UPCOMING', 'PAST');
    END IF;
END $$;

-- 2. Bảng seminars
CREATE TABLE IF NOT EXISTS public.seminars (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 300),
    description      TEXT NOT NULL CHECK (char_length(description) BETWEEN 1 AND 10000),
    date             DATE NOT NULL,
    time             TEXT,                       -- "14:00 - 15:30"
    location         TEXT,
    status           public.seminar_status NOT NULL DEFAULT 'UPCOMING'::public.seminar_status,
    registration_url TEXT,
    created_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Bảng seminar_speakers (normalized — nhiều speaker / 1 seminar)
CREATE TABLE IF NOT EXISTS public.seminar_speakers (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seminar_id UUID NOT NULL REFERENCES public.seminars(id) ON DELETE CASCADE,
    name       TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
    role       TEXT NOT NULL CHECK (char_length(role) BETWEEN 1 AND 300),
    photo_url  TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Bảng seminar_speaker_socials (normalized — nhiều social / 1 speaker)
CREATE TABLE IF NOT EXISTS public.seminar_speaker_socials (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    speaker_id UUID NOT NULL REFERENCES public.seminar_speakers(id) ON DELETE CASCADE,
    type       TEXT NOT NULL CHECK (type IN ('x', 'linkedin')),
    label      TEXT,
    href       TEXT NOT NULL CHECK (char_length(href) BETWEEN 1 AND 500),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Indexes cho query pattern thường dùng (list theo ngày/status, join theo FK)
CREATE INDEX IF NOT EXISTS seminars_date_idx          ON public.seminars(date DESC);
CREATE INDEX IF NOT EXISTS seminars_status_idx        ON public.seminars(status);
CREATE INDEX IF NOT EXISTS seminar_speakers_seminar_idx  ON public.seminar_speakers(seminar_id);
CREATE INDEX IF NOT EXISTS seminar_socials_speaker_idx   ON public.seminar_speaker_socials(speaker_id);

-- 6. updated_at trigger (chung cho cả 3 bảng)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS seminars_set_updated_at ON public.seminars;
CREATE TRIGGER seminars_set_updated_at
    BEFORE UPDATE ON public.seminars
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS seminar_speakers_set_updated_at ON public.seminar_speakers;
CREATE TRIGGER seminar_speakers_set_updated_at
    BEFORE UPDATE ON public.seminar_speakers
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS seminar_socials_set_updated_at ON public.seminar_speaker_socials;
CREATE TRIGGER seminar_socials_set_updated_at
    BEFORE UPDATE ON public.seminar_speaker_socials
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. RLS: public SELECT; INSERT/UPDATE/DELETE chỉ cho content-editor ('researcher')
ALTER TABLE public.seminars               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seminar_speakers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seminar_speaker_socials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Seminars public read" ON public.seminars;
CREATE POLICY "Seminars public read"
ON public.seminars FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Seminars editor write" ON public.seminars;
CREATE POLICY "Seminars editor write"
ON public.seminars FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'user_role') = 'researcher')
WITH CHECK ((auth.jwt() ->> 'user_role') = 'researcher');

DROP POLICY IF EXISTS "Speakers public read" ON public.seminar_speakers;
CREATE POLICY "Speakers public read"
ON public.seminar_speakers FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Speakers editor write" ON public.seminar_speakers;
CREATE POLICY "Speakers editor write"
ON public.seminar_speakers FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'user_role') = 'researcher')
WITH CHECK ((auth.jwt() ->> 'user_role') = 'researcher');

DROP POLICY IF EXISTS "Socials public read" ON public.seminar_speaker_socials;
CREATE POLICY "Socials public read"
ON public.seminar_speaker_socials FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Socials editor write" ON public.seminar_speaker_socials;
CREATE POLICY "Socials editor write"
ON public.seminar_speaker_socials FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'user_role') = 'researcher')
WITH CHECK ((auth.jwt() ->> 'user_role') = 'researcher');

-- 8. Grants
GRANT SELECT ON public.seminars, public.seminar_speakers, public.seminar_speaker_socials TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seminars, public.seminar_speakers, public.seminar_speaker_socials TO authenticated;
GRANT ALL ON public.seminars, public.seminar_speakers, public.seminar_speaker_socials TO service_role;

-- 9. Seed data (idempotent — ON CONFLICT DO NOTHING, id cố định)
INSERT INTO public.seminars (id, title, description, date, time, location, status, registration_url)
VALUES
    (
        '00000000-0000-4000-8000-000000000001',
        'From Chain-of-Evidence to verifiable autonomous science',
        'Autonomous research agents risk hallucinating evidence and producing unverifiable claims. This seminar walks through the Chain-of-Evidence framework that traces every scientific claim back to an auditable source, and how it can be used to build trustworthy self-driving research pipelines.',
        CURRENT_DATE + 14,
        '14:00 - 15:30',
        'Main Auditorium & Online',
        'UPCOMING',
        'https://forms.gle/example'
    ),
    (
        '00000000-0000-4000-8000-000000000002',
        'Learning in the wild: robustness of foundation models',
        'Foundation models are deployed in shifting, uncontrolled environments. We examine fragility under distribution shift, the sources of spurious correlations, and practical robustness techniques that keep models reliable when the data changes under our feet.',
        CURRENT_DATE + 21,
        '16:00 - 17:30',
        'Room B204',
        'UPCOMING',
        'https://forms.gle/example'
    ),
    (
        '00000000-0000-4000-8000-000000000003',
        'Adaptive education at scale: diagnostics and generative curricula',
        'Cognitive diagnostics are typically static. We close the loop between student state estimation and generative lesson planning, producing curricula that adapt to learners in real time, and share lessons from deploying at scale.',
        CURRENT_DATE - 10,
        '09:00 - 10:30',
        'Main Auditorium',
        'PAST',
        NULL
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.seminar_speakers (id, seminar_id, name, role, photo_url, sort_order)
VALUES
    ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'Prof. Sarah Chen', 'University of Toronto', '/demo-seminar/dat.jpg', 0),
    ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'Dr. Elisa Moreau', 'Associate Professor, Sorbonne', NULL, 1),
    ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000002', 'Dr. Michael Ross', 'Google DeepMind', NULL, 0),
    ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000003', 'Prof. Nguyen Thi An', 'D2AI Lab', NULL, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.seminar_speaker_socials (id, speaker_id, type, label, href, sort_order)
VALUES
    ('00000000-0000-4000-8000-000000000901', '00000000-0000-4000-8000-000000000101', 'x', 'X profile', 'https://x.com', 0),
    ('00000000-0000-4000-8000-000000000902', '00000000-0000-4000-8000-000000000101', 'linkedin', 'LinkedIn profile', 'https://linkedin.com', 1),
    ('00000000-0000-4000-8000-000000000903', '00000000-0000-4000-8000-000000000201', 'x', 'X profile', 'https://x.com', 0)
ON CONFLICT (id) DO NOTHING;