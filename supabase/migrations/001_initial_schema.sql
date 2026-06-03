-- ============================================================
-- Eduardo Mendes Advisory Platform
-- Migration 001: Initial Schema — 24 Tables
-- Run this in the Supabase SQL Editor BEFORE any UI work.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Enums ────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('lead', 'client', 'admin');
CREATE TYPE lead_status AS ENUM (
  'new', 'assessment_completed', 'call_booked', 'call_completed',
  'qualified', 'not_qualified', 'client_approved', 'closed'
);
CREATE TYPE project_status AS ENUM (
  'planning', 'pre_construction', 'in_construction',
  'on_hold', 'completed', 'cancelled'
);
CREATE TYPE proposal_status AS ENUM (
  'draft', 'sent', 'viewed', 'approved', 'declined', 'expired', 'paid'
);
CREATE TYPE payment_status AS ENUM (
  'pending', 'completed', 'failed', 'refunded'
);
CREATE TYPE buildcheck_status AS ENUM ('pending', 'reviewing', 'completed');
CREATE TYPE document_category AS ENUM (
  'builder_quotes', 'contracts', 'plans', 'photos',
  'reports', 'council_documents', 'other'
);
CREATE TYPE notification_type AS ENUM (
  'lead_created', 'assessment_completed', 'call_booked',
  'proposal_sent', 'proposal_approved', 'payment_received',
  'document_uploaded', 'message_received', 'meeting_booked'
);

-- ── Updated-at trigger helper ────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── 1. users (extends auth.users) ───────────────────────────
CREATE TABLE users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL UNIQUE,
  role       user_role NOT NULL DEFAULT 'lead',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 2. user_profiles ────────────────────────────────────────
CREATE TABLE user_profiles (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name         TEXT,
  last_name          TEXT,
  phone              TEXT,
  address            TEXT,
  suburb             TEXT,
  state              TEXT,
  postcode           TEXT,
  notification_email BOOLEAN DEFAULT true,
  notification_sms   BOOLEAN DEFAULT false,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 3. leads ────────────────────────────────────────────────
CREATE TABLE leads (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lead_status lead_status NOT NULL DEFAULT 'new',
  project_type TEXT,
  project_stage TEXT,
  budget_range  TEXT,
  location      TEXT,
  source        TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);
CREATE INDEX idx_leads_user_id     ON leads(user_id);
CREATE INDEX idx_leads_lead_status ON leads(lead_status);
CREATE INDEX idx_leads_created_at  ON leads(created_at);
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 4. assessments ──────────────────────────────────────────
CREATE TABLE assessments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id          UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  project_type     TEXT NOT NULL,
  land_type        TEXT,
  location         TEXT,
  suburb           TEXT,
  state            TEXT,
  postcode         TEXT,
  project_stage    TEXT NOT NULL,
  budget_range     TEXT NOT NULL,
  finish_level     TEXT,
  assessment_score SMALLINT NOT NULL DEFAULT 0,
  is_current       BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_assessments_lead_id    ON assessments(lead_id);
CREATE INDEX idx_assessments_is_current ON assessments(is_current);
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 5. meetings ─────────────────────────────────────────────
CREATE TABLE meetings (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id            UUID REFERENCES leads(id) ON DELETE SET NULL,
  client_id          UUID,
  meeting_type       TEXT NOT NULL DEFAULT 'strategy_call',
  scheduled_at       TIMESTAMPTZ,
  duration_minutes   INTEGER DEFAULT 30,
  status             TEXT NOT NULL DEFAULT 'scheduled',
  calendly_event_id  TEXT,
  calendly_event_url TEXT,
  meeting_url        TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 6. meeting_notes (DB-02 additions) ──────────────────────
CREATE TABLE meeting_notes (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id               UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  notes                    TEXT,
  outcome                  TEXT,
  project_potential_rating SMALLINT,
  recommended_services     TEXT[],
  next_action              TEXT,
  created_by               UUID REFERENCES users(id),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_meeting_notes_updated_at
  BEFORE UPDATE ON meeting_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 7. clients (DB-01: lead_id FK) ──────────────────────────
CREATE TABLE clients (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lead_id       UUID REFERENCES leads(id) ON DELETE SET NULL,
  client_status TEXT NOT NULL DEFAULT 'active',
  company_name  TEXT,
  notes         TEXT,
  activated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 8. projects ─────────────────────────────────────────────
CREATE TABLE projects (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id        UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_name     TEXT NOT NULL,
  project_type     TEXT,
  project_status   project_status NOT NULL DEFAULT 'planning',
  project_stage    TEXT,
  location         TEXT,
  suburb           TEXT,
  state            TEXT,
  postcode         TEXT,
  budget_range     TEXT,
  finish_level     TEXT,
  confidence_score SMALLINT DEFAULT 0,
  notes            TEXT,
  started_at       TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 9. project_timeline ─────────────────────────────────────
CREATE TABLE project_timeline (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id            UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_name        TEXT NOT NULL,
  milestone_description TEXT,
  status                TEXT NOT NULL DEFAULT 'pending',
  order_index           INTEGER NOT NULL DEFAULT 0,
  due_date              DATE,
  completed_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_project_timeline_updated_at
  BEFORE UPDATE ON project_timeline
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 10. buildchecks (DB-08: lead_id) ────────────────────────
CREATE TABLE buildchecks (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id       UUID REFERENCES projects(id) ON DELETE CASCADE,
  lead_id          UUID REFERENCES leads(id) ON DELETE SET NULL,
  buildcheck_status buildcheck_status NOT NULL DEFAULT 'pending',
  title            TEXT NOT NULL DEFAULT 'BuildCheck Review',
  builder_name     TEXT,
  quote_amount     DECIMAL(12,2),
  savings_min      DECIMAL(12,2),
  savings_max      DECIMAL(12,2),
  risk_level       TEXT,
  summary          TEXT,
  notes            TEXT,
  completed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_buildchecks_updated_at
  BEFORE UPDATE ON buildchecks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 11. buildcheck_findings ─────────────────────────────────
CREATE TABLE buildcheck_findings (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buildcheck_id  UUID NOT NULL REFERENCES buildchecks(id) ON DELETE CASCADE,
  finding_type   TEXT NOT NULL,
  severity       TEXT NOT NULL DEFAULT 'medium',
  title          TEXT NOT NULL,
  description    TEXT,
  recommendation TEXT,
  order_index    INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 12. documents (DB-05: lead_id nullable + check) ─────────
CREATE TABLE documents (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id    UUID REFERENCES clients(id) ON DELETE CASCADE,
  lead_id      UUID REFERENCES leads(id) ON DELETE CASCADE,
  project_id   UUID REFERENCES projects(id) ON DELETE SET NULL,
  file_name    TEXT NOT NULL,
  file_size    INTEGER,
  file_type    TEXT,
  storage_path TEXT NOT NULL,
  category     document_category NOT NULL DEFAULT 'other',
  description  TEXT,
  uploaded_by  UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT documents_owner_check
    CHECK (client_id IS NOT NULL OR lead_id IS NOT NULL)
);
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_client_id  ON documents(client_id);

-- ── 13. messages ────────────────────────────────────────────
CREATE TABLE messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender_id  UUID NOT NULL REFERENCES users(id),
  content    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_messages_project_id ON messages(project_id);

-- ── 14. message_attachments ─────────────────────────────────
CREATE TABLE message_attachments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id   UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_name    TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size    INTEGER,
  file_type    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 15. tasks ───────────────────────────────────────────────
CREATE TABLE tasks (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
  lead_id      UUID REFERENCES leads(id) ON DELETE CASCADE,
  assigned_to  UUID REFERENCES users(id),
  title        TEXT NOT NULL,
  description  TEXT,
  status       TEXT NOT NULL DEFAULT 'pending',
  due_date     DATE,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 16. proposals (DB-04: all status timestamps + expiry) ───
CREATE TABLE proposals (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id    UUID REFERENCES projects(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  status        proposal_status NOT NULL DEFAULT 'draft',
  total_amount  DECIMAL(12,2) NOT NULL DEFAULT 0,
  valid_until   DATE,
  notes         TEXT,
  terms         TEXT,
  sent_at       TIMESTAMPTZ,
  viewed_at     TIMESTAMPTZ,
  approved_at   TIMESTAMPTZ,
  declined_at   TIMESTAMPTZ,
  expired_at    TIMESTAMPTZ,
  paid_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 17. proposal_items ──────────────────────────────────────
CREATE TABLE proposal_items (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id        UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  service_catalog_id UUID,
  item_name          TEXT NOT NULL,
  description        TEXT,
  quantity           INTEGER NOT NULL DEFAULT 1,
  unit_price         DECIMAL(12,2) NOT NULL,
  total_price        DECIMAL(12,2) NOT NULL,
  order_index        INTEGER DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 18. payments (DB-03: stripe_session_id) ─────────────────
CREATE TABLE payments (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id                UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  proposal_id              UUID REFERENCES proposals(id) ON DELETE SET NULL,
  amount                   DECIMAL(12,2) NOT NULL,
  currency                 TEXT NOT NULL DEFAULT 'AUD',
  payment_status           payment_status NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  stripe_session_id        TEXT,
  paid_at                  TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 19. notifications (DB-10: action_url, entity_type, entity_id) ──
CREATE TABLE notifications (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type notification_type NOT NULL,
  title             TEXT NOT NULL,
  message           TEXT,
  is_read           BOOLEAN DEFAULT false,
  action_url        TEXT,
  entity_type       TEXT,
  entity_id         UUID,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ── 20. reports ─────────────────────────────────────────────
CREATE TABLE reports (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  buildcheck_id UUID REFERENCES buildchecks(id) ON DELETE SET NULL,
  report_type   TEXT NOT NULL,
  title         TEXT NOT NULL,
  storage_path  TEXT,
  generated_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 21. audit_logs ──────────────────────────────────────────
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   UUID,
  metadata    JSONB,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_user_id    ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ── 22. email_templates ─────────────────────────────────────
CREATE TABLE email_templates (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_key  TEXT NOT NULL UNIQUE,
  subject       TEXT NOT NULL,
  html_content  TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 23. service_catalog (DB-09 — confirmed Sprint 01) ───────
CREATE TABLE service_catalog (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_name  TEXT NOT NULL,
  description   TEXT,
  default_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_service_catalog_updated_at
  BEFORE UPDATE ON service_catalog
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 24. referrals (DB-07 — future-ready schema only) ────────
-- NO UI, NO BUSINESS LOGIC, NO TRIGGERS in Sprints 1–4.
-- Implementation deferred to post-Sprint 04 phase.
CREATE TABLE referrals (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_client_id  UUID REFERENCES clients(id) ON DELETE SET NULL,
  referred_user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  status              TEXT NOT NULL DEFAULT 'pending',
  reward_type         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Auto-create user + lead on auth signup ───────────────────
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'lead')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.leads (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();
