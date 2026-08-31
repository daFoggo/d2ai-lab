-- ==============================================================================
-- Migration: Seminars → TEXT slug PK (URL đẹp, nhất quán với content khác)
--   UUID → slug id (ví dụ 'verifiable-autonomous-science'). Speakers cũng
--   chuyển FK sang TEXT. Re-seed idempotent.
-- ==============================================================================

DROP TABLE IF EXISTS public.seminar_speakers CASCADE;
DROP TABLE IF EXISTS public.seminars CASCADE;

CREATE TABLE public.seminars (
    id               TEXT PRIMARY KEY,
    title            TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 300),
    description      TEXT NOT NULL CHECK (char_length(description) BETWEEN 1 AND 10000),
    starts_at        TIMESTAMPTZ NOT NULL,
    location         TEXT,
    registration_url TEXT,
    created_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.seminar_speakers (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seminar_id TEXT NOT NULL REFERENCES public.seminars(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    role       TEXT NOT NULL,
    photo_url  TEXT,
    socials    TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX seminars_starts_at_idx ON public.seminars(starts_at DESC);
CREATE INDEX seminar_speakers_seminar_idx ON public.seminar_speakers(seminar_id);

DROP TRIGGER IF EXISTS seminars_set_updated_at ON public.seminars;
CREATE TRIGGER seminars_set_updated_at
    BEFORE UPDATE ON public.seminars
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS seminar_speakers_set_updated_at ON public.seminar_speakers;
CREATE TRIGGER seminar_speakers_set_updated_at
    BEFORE UPDATE ON public.seminar_speakers
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.seminars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seminar_speakers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Seminars public read" ON public.seminars;
CREATE POLICY "Seminars public read"
ON public.seminars FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Seminars authenticated write" ON public.seminars;
CREATE POLICY "Seminars authenticated write"
ON public.seminars FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Speakers public read" ON public.seminar_speakers;
CREATE POLICY "Speakers public read"
ON public.seminar_speakers FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Speakers authenticated write" ON public.seminar_speakers;
CREATE POLICY "Speakers authenticated write"
ON public.seminar_speakers FOR ALL TO authenticated USING (true) WITH CHECK (true);

GRANT SELECT ON public.seminars, public.seminar_speakers TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seminars, public.seminar_speakers TO authenticated;
GRANT ALL ON public.seminars, public.seminar_speakers TO service_role;

-- Seed (idempotent)
INSERT INTO public.seminars (id, title, description, starts_at, location, registration_url)
VALUES
    (
        'verifiable-autonomous-science',
        'From Chain-of-Evidence to verifiable autonomous science',
        'Autonomous research agents risk hallucinating evidence and producing unverifiable claims. This seminar walks through the Chain-of-Evidence framework that traces every scientific claim back to an auditable source, and how it can be used to build trustworthy self-driving research pipelines.',
        ((CURRENT_DATE + 14) + '14:00'::time) AT TIME ZONE 'UTC',
        'Main Auditorium & Online',
        'https://forms.gle/example'
    ),
    (
        'robustness-of-foundation-models',
        'Learning in the wild: robustness of foundation models',
        'Foundation models are deployed in shifting, uncontrolled environments. We examine fragility under distribution shift, the sources of spurious correlations, and practical robustness techniques that keep models reliable when the data changes under our feet.',
        ((CURRENT_DATE + 21) + '16:00'::time) AT TIME ZONE 'UTC',
        'Room B204',
        'https://forms.gle/example'
    ),
    (
        'adaptive-education-at-scale',
        'Adaptive education at scale: diagnostics and generative curricula',
        'Cognitive diagnostics are typically static. We close the loop between student state estimation and generative lesson planning, producing curricula that adapt to learners in real time, and share lessons from deploying at scale.',
        ((CURRENT_DATE - 10) + '09:00'::time) AT TIME ZONE 'UTC',
        'Main Auditorium',
        NULL
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.seminar_speakers (seminar_id, name, role, photo_url, socials, sort_order)
VALUES
    ('verifiable-autonomous-science', 'Prof. Sarah Chen', 'University of Toronto', '/demo-seminar/dat.jpg', E'https://x.com\nhttps://linkedin.com', 0),
    ('verifiable-autonomous-science', 'Dr. Elisa Moreau', 'Associate Professor, Sorbonne', NULL, NULL, 1),
    ('robustness-of-foundation-models', 'Dr. Michael Ross', 'Google DeepMind', NULL, E'https://x.com', 0),
    ('adaptive-education-at-scale', 'Prof. Nguyen Thi An', 'D2AI Lab', NULL, NULL, 0);