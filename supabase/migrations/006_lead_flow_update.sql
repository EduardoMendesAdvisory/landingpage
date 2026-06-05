-- ============================================================
-- Eduardo Mendes Advisory Platform
-- Migration 006: Lead Flow Update
-- Adds anonymous lead support, extended assessment fields,
-- services table, service_recommendations table, and projects update.
-- ============================================================

-- ?? 1. Make leads.user_id nullable (anonymous free leads) ???
ALTER TABLE leads ALTER COLUMN user_id DROP NOT NULL;

-- Add new columns to leads
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS email     TEXT,
  ADD COLUMN IF NOT EXISTS phone     TEXT,
  ADD COLUMN IF NOT EXISTS suburb    TEXT,
  ADD COLUMN IF NOT EXISTS state     TEXT;

-- Add new lead_status values
DO $$
BEGIN
  -- Add values that don't exist yet
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'lead_status'::regtype
      AND enumlabel = 'assessment_started'
  ) THEN
    ALTER TYPE lead_status ADD VALUE 'assessment_started';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'lead_status'::regtype
      AND enumlabel = 'preliminary_assessment_completed'
  ) THEN
    ALTER TYPE lead_status ADD VALUE 'preliminary_assessment_completed';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'lead_status'::regtype
      AND enumlabel = 'converted'
  ) THEN
    ALTER TYPE lead_status ADD VALUE 'converted';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'lead_status'::regtype
      AND enumlabel = 'lost'
  ) THEN
    ALTER TYPE lead_status ADD VALUE 'lost';
  END IF;
END
$$;

-- ?? 2. Extend assessments table ??????????????????????????????
ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS user_id                  UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS project_subtype          TEXT,
  ADD COLUMN IF NOT EXISTS uploaded_quote_url       TEXT,
  ADD COLUMN IF NOT EXISTS potential_savings_min    INTEGER,
  ADD COLUMN IF NOT EXISTS potential_savings_max    INTEGER,
  ADD COLUMN IF NOT EXISTS risk_count               SMALLINT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS recommended_actions_count SMALLINT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS benchmark_position       TEXT,
  ADD COLUMN IF NOT EXISTS assessment_type          TEXT NOT NULL DEFAULT 'free_preliminary';

CREATE INDEX IF NOT EXISTS idx_assessments_assessment_type ON assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);

-- ?? 3. Create services table ?????????????????????????????????
CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  tagline     TEXT,
  description TEXT,
  price       NUMERIC(10,2),
  currency    TEXT NOT NULL DEFAULT 'AUD',
  inclusions  JSONB NOT NULL DEFAULT '[]',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ?? 4. Create service_recommendations table ??????????????????
CREATE TABLE IF NOT EXISTS service_recommendations (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id             UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  service_id          UUID NOT NULL REFERENCES services(id),
  recommended_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  recommendation_note TEXT,
  payment_status      TEXT NOT NULL DEFAULT 'pending',
  stripe_checkout_url TEXT,
  stripe_session_id   TEXT UNIQUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_recommendations_lead_id ON service_recommendations(lead_id);
CREATE INDEX IF NOT EXISTS idx_service_recommendations_stripe_session ON service_recommendations(stripe_session_id);

CREATE TRIGGER update_service_recommendations_updated_at
  BEFORE UPDATE ON service_recommendations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ?? 5. Update projects table (add assessment_id & service_id) ?
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS service_id    UUID REFERENCES services(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS lead_id       UUID REFERENCES leads(id) ON DELETE SET NULL;

-- Add new project_status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'project_status'::regtype
      AND enumlabel = 'paid'
  ) THEN
    ALTER TYPE project_status ADD VALUE 'paid';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'project_status'::regtype
      AND enumlabel = 'onboarding_started'
  ) THEN
    ALTER TYPE project_status ADD VALUE 'onboarding_started';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'project_status'::regtype
      AND enumlabel = 'information_submitted'
  ) THEN
    ALTER TYPE project_status ADD VALUE 'information_submitted';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'project_status'::regtype
      AND enumlabel = 'eduardo_reviewing'
  ) THEN
    ALTER TYPE project_status ADD VALUE 'eduardo_reviewing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'project_status'::regtype
      AND enumlabel = 'report_in_progress'
  ) THEN
    ALTER TYPE project_status ADD VALUE 'report_in_progress';
  END IF;
END
$$;

-- ?? 6. RLS for new tables ?????????????????????????????????????
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_recommendations ENABLE ROW LEVEL SECURITY;

-- Services are publicly readable (needed for /recommended-service/[slug])
CREATE POLICY "services_public_read"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "services_admin_all"
  ON services FOR ALL
  USING (private.is_admin());

-- Service recommendations: admin full access, lead owner can read their own
CREATE POLICY "service_recommendations_admin_all"
  ON service_recommendations FOR ALL
  USING (private.is_admin());

-- Leads: allow anonymous insert (for free lead capture)
-- and allow reading/updating own lead by email match (no user_id needed)
CREATE POLICY "leads_anon_insert"
  ON leads FOR INSERT
  WITH CHECK (user_id IS NULL);

-- ?? 7. Seed services ?????????????????????????????????????????
INSERT INTO services (slug, name, tagline, description, price, inclusions)
VALUES
  (
    'buildcheck',
    'BuildCheck Assessment',
    'Know exactly what you''re buying before you build',
    'A comprehensive review of your builder quotes, contracts and plans to identify risks, overpricing and missing items before you sign.',
    497.00,
    '[
      "Full builder quote analysis",
      "Contract red flag review",
      "Specification comparison",
      "Cost benchmark report",
      "Written recommendations report",
      "30-min debrief call with Eduardo"
    ]'::jsonb
  ),
  (
    'pre-construction-advisory',
    'Pre-Construction Advisory',
    'Start your build on the right foundation',
    'Expert guidance through the critical pre-construction phase — from design reviews and budget planning to builder selection and contract negotiation.',
    897.00,
    '[
      "Design and scope review",
      "Budget validation and benchmarking",
      "Builder shortlist and selection guidance",
      "Contract review and negotiation support",
      "Council and approval process guidance",
      "Two one-on-one sessions with Eduardo"
    ]'::jsonb
  ),
  (
    'construction-advisory',
    'Construction Advisory',
    'Expert support throughout your entire build',
    'Ongoing advisory support throughout your build to protect your investment, manage risks and achieve the best possible outcome.',
    350.00,
    '[
      "Regular site visit reports at key milestones",
      "Progress claim review and approval guidance",
      "Variation management and cost control",
      "Quality and compliance monitoring",
      "Builder communication support",
      "Issue resolution and dispute guidance",
      "Defect identification and documentation"
    ]'::jsonb
  ),
  (
    'quote-review',
    'Quote & Contract Review',
    'Don''t sign until you''re certain',
    'A detailed review of your builder quote and contract to identify pricing discrepancies, missing items and contractual risks before you commit.',
    297.00,
    '[
      "Line-by-line quote analysis",
      "Contract term review",
      "Risk and exclusion identification",
      "Pricing benchmark comparison",
      "Written summary report",
      "30-min consultation with Eduardo"
    ]'::jsonb
  ),
  (
    'site-visits-inspections',
    'Site Visits & Inspections',
    'Independent eyes on your build',
    'Professional site visits at critical construction stages to verify quality, compliance and progress — giving you peace of mind at every milestone.',
    247.00,
    '[
      "Pre-slab inspection",
      "Frame and structure inspection",
      "Lock-up stage inspection",
      "Fixing stage inspection",
      "Practical completion inspection",
      "Detailed written report for each visit"
    ]'::jsonb
  ),
  (
    'owner-builder-program',
    'Owner Builder Program',
    'Build with confidence as your own project manager',
    'A structured mentoring program for owner builders — giving you the knowledge, tools and expert guidance to manage your own build successfully.',
    697.00,
    '[
      "Owner builder permit guidance",
      "Project management framework",
      "Subcontractor selection and management",
      "Budget tracking and cost control tools",
      "Monthly one-on-one sessions with Eduardo",
      "Access to Eduardo''s supplier network",
      "Ongoing email and phone support"
    ]'::jsonb
  )
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  tagline     = EXCLUDED.tagline,
  description = EXCLUDED.description,
  price       = EXCLUDED.price,
  inclusions  = EXCLUDED.inclusions,
  updated_at  = NOW();
