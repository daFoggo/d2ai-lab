-- ==============================================================================
-- Migration: Content tables (publications, projects, research, careers, teams)
--   Bỏ hoàn toàn mock data ở code → đọc từ Supabase. id TEXT (slug) giữ URL ổn định.
--   RLS: public SELECT; authenticated ALL (chuẩn anon/authenticated hiện tại).
-- ==============================================================================

-- 1. Research areas
CREATE TABLE IF NOT EXISTS public.research_areas (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    tag         TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0
);

-- 2. Research directions
CREATE TABLE IF NOT EXISTS public.research_directions (
    id          TEXT PRIMARY KEY,
    index       TEXT NOT NULL,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    focus       TEXT[] NOT NULL DEFAULT '{}',
    sort_order  INTEGER NOT NULL DEFAULT 0
);

-- 3. Research gaps
CREATE TABLE IF NOT EXISTS public.research_gaps (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    status      TEXT NOT NULL,
    area        TEXT NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0
);

-- 4. Careers
CREATE TABLE IF NOT EXISTS public.careers (
    id              TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    department      TEXT NOT NULL,
    type            TEXT NOT NULL,
    location        TEXT,
    description     TEXT NOT NULL,
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    qualifications  TEXT[] NOT NULL DEFAULT '{}',
    benefits        TEXT[] NOT NULL DEFAULT '{}',
    apply_url       TEXT,
    sort_order      INTEGER NOT NULL DEFAULT 0
);

-- 5. Teams + members
CREATE TABLE IF NOT EXISTS public.teams (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    tagline     TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.team_members (
    id         TEXT PRIMARY KEY,
    team_id    TEXT NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    role       TEXT NOT NULL,
    area       TEXT NOT NULL,
    initials   TEXT NOT NULL,
    image      TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 6. Publications
CREATE TABLE IF NOT EXISTS public.publications (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    venue       TEXT NOT NULL,
    year        INTEGER NOT NULL,
    authors     TEXT[] NOT NULL DEFAULT '{}',
    tags        TEXT[] NOT NULL DEFAULT '{}',
    type        TEXT NOT NULL DEFAULT 'RESEARCH',
    href        TEXT,
    abstract    TEXT NOT NULL,
    highlights  TEXT[] NOT NULL DEFAULT '{}',
    links       JSONB NOT NULL DEFAULT '[]',
    sort_order  INTEGER NOT NULL DEFAULT 0
);

-- 7. Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    category    TEXT NOT NULL,
    description TEXT NOT NULL,
    href        TEXT,
    thumbnail   TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order  INTEGER NOT NULL DEFAULT 0
);

-- 8. Indexes
CREATE INDEX IF NOT EXISTS publications_year_idx ON public.publications(year DESC);
CREATE INDEX IF NOT EXISTS projects_featured_idx ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS team_members_team_idx ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS research_gaps_status_idx ON public.research_gaps(status);

-- 9. RLS + grants (DRY)
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'research_areas','research_directions','research_gaps',
    'careers','teams','team_members','publications','projects'
  ]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'content public read ' || t, t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (true)', 'content public read ' || t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'content authenticated write ' || t, t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', 'content authenticated write ' || t, t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;

-- ============================================================
-- SEED (idempotent) — nội dung = mock cũ, giờ lưu trong Supabase
-- ============================================================

INSERT INTO public.research_areas (id, title, tag, description, sort_order) VALUES
  ('ai-ml-foundations', 'AI/ML Foundations', 'NEURAL ARCHITECTURES', 'Core research on deep learning architectures, representation learning, training dynamics, and scaling laws that underpin every applied system we build.', 0),
  ('smart-education', 'Smart Education', 'ADAPTIVE SYSTEMS', 'Personalized learning platforms combining cognitive diagnostics with generative curriculum planning to empower students in real time.', 1),
  ('ambient-iot', 'Ambient IoT', 'TELEMETRY & SENSORS', 'Ambient intelligence, edge sensing, and low-power telemetry systems that turn physical environments into measurable, responsive spaces.', 2),
  ('public-governance', 'Public Governance', 'DOCUMENT INTELLIGENCE', 'Intelligent document triage and automated public administrative assistants that make government services faster and more transparent.', 3),
  ('customer-experience', 'Customer Experience', 'CONVERSATIONAL AI', 'Conversational AI and natural language systems that deliver helpful, trustworthy experiences across products and services.', 4),
  ('optimization', 'Optimization', 'ALGORITHMIC FOUNDATIONS', 'Algorithmic foundations for combinatorial optimization, search, and decision-making under uncertainty.', 5),
  ('responsible-ai', 'Responsible AI', 'ETHICAL ML', 'Fairness, transparency, accountability, and safety research that keeps human values at the center of every AI system.', 6),
  ('climate-ecology', 'Climate & Ecology', 'SPATIAL SENSING', 'Spatial sensing and machine learning applied to climate monitoring, ecological tracking, and environmental forecasting.', 7)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.research_directions (id, index, title, description, focus, sort_order) VALUES
  ('direction-1', '01', 'From data to intelligence', 'Push the boundaries of learning from ever-richer data — multimodal, temporal, and structured — so that models reason about the world, not just parrot patterns.', ARRAY['Multimodal learning','Foundation models','Self-supervision'], 0),
  ('direction-2', '02', 'From ideas to impact', 'Close the gap between a published idea and a deployed solution by building evaluable, maintainable systems that survive contact with the real world.', ARRAY['Applied AI','Evaluation','Productization'], 1),
  ('direction-3', '03', 'Verifiable and trustworthy AI', 'Make every model decision auditable and every claim evidence-backed, so AI can be a trusted partner in science, governance, and healthcare.', ARRAY['Chain-of-evidence','Responsible AI','Explainability'], 2),
  ('direction-4', '04', 'Ambient intelligence for society', 'Embed intelligence into the physical world — classrooms, cities, clinics — through edge computing and privacy-preserving sensing that serves people directly.', ARRAY['Ambient IoT','Edge AI','Smart environments'], 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.research_gaps (id, title, description, status, area, sort_order) VALUES
  ('gap-1', 'Verifiable autonomous research via Chain-of-Evidence', 'Autonomous agents hallucinate under pressure. We are building a framework where every scientific claim is traced back to auditable evidence, enabling trustworthy self-driving research pipelines.', 'IN PROGRESS', 'AI/ML FOUNDATIONS', 0),
  ('gap-2', 'Empty shelves or lost keys? Recall as the bottleneck for parametric factuality', 'Large models struggle to recall rare but critical facts. We investigate when parametric knowledge retrieval fails and how hybrid memory systems can close the gap.', 'OPEN', 'AI/ML FOUNDATIONS', 1),
  ('gap-3', 'Expert-level audio-visual clinical consultations', 'Advancing AMIE towards consultations that reason over both audio and visual clinical signals, moving from text-only dialogue to multimodal diagnostic support.', 'IN PROGRESS', 'RESPONSIBLE AI', 2),
  ('gap-4', 'Real-time adaptive curriculum generation', 'Cognitive diagnostics are static; curricula should be living. We are closing the loop between student state estimation and generative lesson planning in real time.', 'OPEN', 'SMART EDUCATION', 3),
  ('gap-5', 'Privacy-preserving ambient sensing', 'Ambient IoT produces rich telemetry but risks surveillance. We are designing on-device inference and differential privacy so intelligence never requires raw data offboarding.', 'COLLABORATION', 'AMBIENT IOT', 4),
  ('gap-6', 'Ground-truth evaluation for public document intelligence', 'Automated triage of civic documents needs rigorous benchmarks. We are building annotated corpora and human-in-the-loop evaluation for governance AI.', 'OPEN', 'PUBLIC GOVERNANCE', 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.careers (id, title, department, type, location, description, responsibilities, qualifications, benefits, apply_url, sort_order) VALUES
  ('role-1', 'Research Scientist — Foundation Models', 'AI/ML FOUNDATIONS', 'FULL-TIME', 'Hanoi / Remote', 'Drive research on multimodal learning and scaling laws, with a focus on publishable, reproducible science that moves both the field and our applied systems forward.',
   ARRAY['Design and run experiments on multimodal learning, representation learning, and scaling behavior.','Author high-quality publications for top-tier ML venues and our internal research blog.','Collaborate with engineers to prototype and validate research ideas in real products.','Mentor interns and PhD students while contributing to the lab''s research roadmap.'],
   ARRAY['PhD (or equivalent research experience) in machine learning, computer science, or a related field.','Strong track record of published research in deep learning or foundation models.','Proficiency in Python and modern deep learning frameworks.','Excellent scientific writing and communication skills.'],
   ARRAY['Competitive compensation and research travel budget.','Access to lab-scale compute and global academic collaborators.','Flexible working arrangements and a research-first culture.'],
   'https://d2ailab.dev/careers', 0),
  ('role-2', 'Machine Learning Engineer', 'APPLIED AI', 'FULL-TIME', 'Hanoi', 'Productize lab research into working platforms, from adaptive learning to civic document intelligence.',
   ARRAY['Build and scale ML pipelines that turn research prototypes into production systems.','Own the end-to-end lifecycle of models: training, evaluation, deployment, and monitoring.','Work closely with researchers to translate findings into robust, maintainable features.','Champion engineering best practices across the codebase.'],
   ARRAY['Strong software engineering skills in Python and TypeScript.','Experience with ML frameworks and production ML infrastructure.','Familiarity with modern web application stacks and API design.','Comfortable working autonomously in a fast-moving research environment.'],
   ARRAY['Work on research with real-world impact across education and governance.','Collaborative engineering team with direct access to researchers.','Learning budget and conference opportunities.'],
   'https://d2ailab.dev/careers', 1),
  ('role-3', 'PhD Student — Responsible AI', 'RESPONSIBLE AI', 'PH.D.', 'Hanoi', 'Join our chain-of-evidence research on verifiable, auditable AI for high-stakes domains.',
   ARRAY['Conduct original research on verifiability, evidence tracing, and trustworthy AI.','Develop frameworks that make autonomous systems auditable and reliable.','Publish findings and collaborate with international academic partners.'],
   ARRAY['Strong background in machine learning, mathematics, or a related discipline.','Excellent academic record and research curiosity.','Proficiency in Python and experimental research workflows.'],
   ARRAY['Full PhD funding with dedicated supervision.','International research network and collaboration opportunities.','Compute, resources, and publication support.'],
   'https://d2ailab.dev/careers', 2),
  ('role-4', 'Research Intern — Ambient IoT', 'AMBIENT IOT', 'INTERNSHIP', 'Hanoi', 'Work on privacy-preserving telemetry and on-device models with our engineering team.',
   ARRAY['Prototype on-device inference for low-power ambient sensors.','Contribute to privacy-preserving data collection and evaluation pipelines.','Collaborate with researchers to validate approaches on real deployments.'],
   ARRAY['Currently pursuing a degree in computer science, EE, or a related field.','Experience with Python and embedded or edge computing is a plus.','Strong problem-solving and communication skills.'],
   ARRAY['Hands-on research experience with real deployments.','Mentorship from senior researchers and engineers.','Potential for full-time offers after graduation.'],
   'https://d2ailab.dev/careers', 3),
  ('role-5', 'Research Assistant — Smart Education', 'SMART EDUCATION', 'PART-TIME', 'Hanoi / Remote', 'Support adaptive curriculum research with data annotation, evaluation, and experiment tooling.',
   ARRAY['Assist with data annotation, curation, and quality control.','Help design and run experiments for adaptive curriculum systems.','Maintain experiment logs and evaluation dashboards.'],
   ARRAY['Undergraduate or graduate student in a quantitative discipline.','Attention to detail and strong organizational skills.','Familiarity with Python and data tooling is a plus.'],
   ARRAY['Flexible part-time schedule around coursework.','Direct mentorship and exposure to active research projects.','Pathway toward a full-time research role.'],
   'https://d2ailab.dev/careers', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.teams (id, name, tagline, description, sort_order) VALUES
  ('team-ai-ml', 'AI/ML Foundations', 'Fundamental and applied machine intelligence', 'We study the theory and practice of learning from data — from neural architecture design to scaling and robustness — that underpins every applied system in the lab.', 0),
  ('team-applied', 'Applied AI & Impact', 'Turning research into working products', 'This team closes the gap between an idea and a deployed solution — building evaluable, maintainable systems across education, governance, and smart living.', 1),
  ('team-intelligent-systems', 'Intelligent Systems & IoT', 'Intelligence that lives in the physical world', 'Embedding intelligence into classrooms, cities, and clinics through edge computing and privacy-preserving sensing that serves people directly.', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.team_members (id, team_id, name, role, area, initials, sort_order) VALUES
  ('m-1', 'team-ai-ml', 'Huynh Phan Ly', 'Director', 'Responsible AI', 'HL', 0),
  ('m-2', 'team-ai-ml', 'Le Quang Huy', 'PhD Student', 'AI/ML Foundations', 'LH', 1),
  ('m-3', 'team-ai-ml', 'Bui Hoang Nam', 'PhD Student', 'Responsible AI', 'BN', 2),
  ('m-4', 'team-applied', 'Nguyen Thi An', 'Associate Professor', 'Smart Education', 'NA', 0),
  ('m-5', 'team-applied', 'Pham Thu Trang', 'Researcher', 'Public Governance', 'PT', 1),
  ('m-6', 'team-applied', 'Vo Duy Khoa', 'Research Engineer', 'Optimization', 'VK', 2),
  ('m-7', 'team-intelligent-systems', 'Tran Minh Duc', 'Researcher', 'Ambient IoT', 'TD', 0),
  ('m-8', 'team-intelligent-systems', 'Dang Mai Linh', 'Research Assistant', 'Climate & Ecology', 'DL', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.publications (id, title, venue, year, authors, tags, type, abstract, highlights, links, sort_order) VALUES
  ('pub-1', 'Empty shelves or lost keys? Recall is the bottleneck for parametric factuality', 'arXiv', 2026,
   ARRAY['Huynh Phan Ly','Le Quang Huy','Bui Hoang Nam'],
   ARRAY['PARAMETRIC FACTUALITY','MEMORY'], 'RESEARCH',
   'Large language models often fail to recall rare but critical facts, a bottleneck that limits their reliability in high-stakes settings. We study when parametric knowledge retrieval breaks down and show that hybrid memory systems — combining parametric recall with non-parametric retrieval — can substantially close the gap.',
   ARRAY['We identify the recall bottleneck as a core failure mode of parametric factuality.','Hybrid memory systems close the gap between parametric and non-parametric knowledge.','We release evaluation harnesses that probe recall under distribution shift.'],
   '[{"label":"Paper","href":"https://arxiv.org"},{"label":"Code","href":"https://github.com"}]'::jsonb, 0),
  ('pub-2', 'Advancing AMIE towards expert-level audio-visual clinical consultations', 'arXiv', 2026,
   ARRAY['Huynh Phan Ly','Pham Thu Trang'],
   ARRAY['CLINICAL AI','MULTIMODAL'], 'RESEARCH',
   'We extend AMIE to consultations that reason over both audio and visual clinical signals, moving from text-only dialogue toward multimodal diagnostic support in real clinical settings.',
   ARRAY[]::TEXT[],
   '[{"label":"Paper","href":"https://arxiv.org"}]'::jsonb, 1),
  ('pub-3', 'Science One Framework: A verifiable autonomous research framework via Chain-of-Evidence', 'IJCAI', 2025,
   ARRAY['Bui Hoang Nam','Huynh Phan Ly'],
   ARRAY['CHAIN OF EVIDENCE','AUTONOMOUS AGENTS'], 'RESEARCH',
   'Autonomous research agents risk hallucinating evidence. We introduce a Chain-of-Evidence framework that traces every scientific claim back to an auditable source, enabling trustworthy self-driving research pipelines.',
   ARRAY[]::TEXT[],
   '[{"label":"Paper","href":"https://ijcai.org"},{"label":"Code","href":"https://github.com"}]'::jsonb, 2),
  ('pub-4', 'Adaptive curriculum generation from cognitive diagnostics', 'AAAI', 2025,
   ARRAY['Nguyen Thi An','Dang Mai Linh'],
   ARRAY['SMART EDUCATION','GENERATIVE'], 'RESEARCH',
   'Cognitive diagnostics are typically static. We close the loop between student state estimation and generative lesson planning, producing curricula that adapt to learners in real time.',
   ARRAY[]::TEXT[],
   '[{"label":"Paper","href":"https://aaai.org"}]'::jsonb, 3),
  ('pub-5', 'Privacy-preserving telemetry for ambient sensing', 'MobiCom', 2025,
   ARRAY['Tran Minh Duc','Vo Duy Khoa'],
   ARRAY['AMBIENT IOT','PRIVACY'], 'RESEARCH',
   'Ambient IoT produces rich telemetry but risks surveillance. We design on-device inference and differential privacy so intelligence is derived without raw data offboarding.',
   ARRAY[]::TEXT[],
   '[{"label":"Paper","href":"https://sigcomm.org"}]'::jsonb, 4),
  ('pub-6', 'Evaluating document intelligence for civic administration', 'FAccT', 2024,
   ARRAY['Pham Thu Trang','Huynh Phan Ly'],
   ARRAY['PUBLIC GOVERNANCE','EVALUATION'], 'RESEARCH',
   'Automated triage of civic documents needs rigorous benchmarks. We build annotated corpora and human-in-the-loop evaluation for governance AI.',
   ARRAY[]::TEXT[],
   '[{"label":"Paper","href":"https://facctconference.org"}]'::jsonb, 5),
  ('pub-7', 'A survey of optimization under uncertainty in practice', 'Lab Blog', 2024,
   ARRAY['Vo Duy Khoa'],
   ARRAY['OPTIMIZATION','SURVEY'], 'BLOG',
   'A practical survey of optimization and decision-making under uncertainty, connecting algorithmic foundations to deployed systems.',
   ARRAY[]::TEXT[],
   '[{"label":"Read article","href":"https://d2ailab.dev"}]'::jsonb, 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.projects (id, title, category, description, href, is_featured, sort_order) VALUES
  ('app-featured', 'Adaptive Learning Platform', 'SMART EDUCATION APP', 'A personalized learning web application combining cognitive diagnostics and generative curriculum planning to empower students in real time.', '#', true, 0),
  ('app-1', 'UrbanSense: Real-time environmental sensor dashboard and air quality forecasting system', 'SMART LIVING APP', 'Low-power sensors feed an edge dashboard that forecasts air quality for neighborhoods in real time.', '#', false, 1),
  ('app-2', 'CivicFlow: Intelligent document triage and automated public administrative assistant', 'CIVIC TECH APP', 'Automated triage of civic documents with auditable decision records for public administration.', '#', false, 2),
  ('app-3', 'CareMate: Conversational support for clinical consultations', 'CLINICAL AI APP', 'Audio-visual consultation assistant that supports clinicians with evidence-backed suggestions.', '#', false, 3),
  ('app-4', 'GridSense: Optimization toolkit for logistics', 'OPTIMIZATION APP', 'Combinatorial optimization engine for routing and scheduling problems under uncertainty.', '#', false, 4),
  ('app-5', 'EcoTrack: Spatial sensing for climate monitoring', 'CLIMATE & ECOLOGY APP', 'Spatial sensing and machine learning applied to ecological tracking and environmental forecasting.', '#', false, 5)
ON CONFLICT (id) DO NOTHING;