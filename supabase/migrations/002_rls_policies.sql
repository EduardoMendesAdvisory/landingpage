-- ============================================================
-- Eduardo Mendes Advisory Platform
-- Migration 002: Row Level Security Policies
-- Run AFTER migration 001.
-- SEC-01: RLS is mandatory. All policies below must be in place
--         before any UI work begins.
-- ============================================================

-- ── Enable RLS on all 24 tables ─────────────────────────────
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads               ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients             ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects            ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_timeline    ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildchecks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildcheck_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents           ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks               ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals           ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports             ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_catalog     ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals           ENABLE ROW LEVEL SECURITY;

-- ── Helper functions (SECURITY DEFINER avoids recursion) ─────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_client()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'client'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── 1. users ─────────────────────────────────────────────────
CREATE POLICY "users_read_own"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "users_admin_all"
  ON users FOR ALL
  USING (is_admin());

-- ── 2. user_profiles ────────────────────────────────────────
CREATE POLICY "profiles_own_all"
  ON user_profiles FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "profiles_admin_all"
  ON user_profiles FOR ALL
  USING (is_admin());

-- ── 3. leads ────────────────────────────────────────────────
CREATE POLICY "leads_own_all"
  ON leads FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "leads_admin_all"
  ON leads FOR ALL
  USING (is_admin());

-- ── 4. assessments ──────────────────────────────────────────
CREATE POLICY "assessments_own_select"
  ON assessments FOR SELECT
  USING (
    lead_id IN (SELECT id FROM leads WHERE user_id = auth.uid())
  );

CREATE POLICY "assessments_own_insert"
  ON assessments FOR INSERT
  WITH CHECK (
    lead_id IN (SELECT id FROM leads WHERE user_id = auth.uid())
  );

CREATE POLICY "assessments_own_update"
  ON assessments FOR UPDATE
  USING (
    lead_id IN (SELECT id FROM leads WHERE user_id = auth.uid())
  );

CREATE POLICY "assessments_admin_all"
  ON assessments FOR ALL
  USING (is_admin());

-- ── 5. meetings ─────────────────────────────────────────────
CREATE POLICY "meetings_own_select"
  ON meetings FOR SELECT
  USING (
    lead_id IN (SELECT id FROM leads WHERE user_id = auth.uid())
    OR client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );

CREATE POLICY "meetings_admin_all"
  ON meetings FOR ALL
  USING (is_admin());

-- ── 6. meeting_notes (admin only) ───────────────────────────
CREATE POLICY "meeting_notes_admin_all"
  ON meeting_notes FOR ALL
  USING (is_admin());

-- ── 7. clients ──────────────────────────────────────────────
CREATE POLICY "clients_own_select"
  ON clients FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "clients_admin_all"
  ON clients FOR ALL
  USING (is_admin());

-- ── 8. projects ─────────────────────────────────────────────
CREATE POLICY "projects_own_select"
  ON projects FOR SELECT
  USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );

CREATE POLICY "projects_admin_all"
  ON projects FOR ALL
  USING (is_admin());

-- ── 9. project_timeline ─────────────────────────────────────
CREATE POLICY "timeline_own_select"
  ON project_timeline FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "timeline_admin_all"
  ON project_timeline FOR ALL
  USING (is_admin());

-- ── 10. buildchecks ─────────────────────────────────────────
CREATE POLICY "buildchecks_own_select"
  ON buildchecks FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "buildchecks_admin_all"
  ON buildchecks FOR ALL
  USING (is_admin());

-- ── 11. buildcheck_findings ─────────────────────────────────
CREATE POLICY "findings_own_select"
  ON buildcheck_findings FOR SELECT
  USING (
    buildcheck_id IN (
      SELECT bc.id FROM buildchecks bc
      JOIN projects p ON p.id = bc.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "findings_admin_all"
  ON buildcheck_findings FOR ALL
  USING (is_admin());

-- ── 12. documents ───────────────────────────────────────────
CREATE POLICY "documents_own_select"
  ON documents FOR SELECT
  USING (
    lead_id IN (SELECT id FROM leads WHERE user_id = auth.uid())
    OR client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );

CREATE POLICY "documents_lead_insert"
  ON documents FOR INSERT
  WITH CHECK (
    lead_id IN (SELECT id FROM leads WHERE user_id = auth.uid())
  );

CREATE POLICY "documents_client_insert"
  ON documents FOR INSERT
  WITH CHECK (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );

CREATE POLICY "documents_admin_all"
  ON documents FOR ALL
  USING (is_admin());

-- ── 13. messages ────────────────────────────────────────────
CREATE POLICY "messages_own_all"
  ON messages FOR ALL
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "messages_admin_all"
  ON messages FOR ALL
  USING (is_admin());

-- ── 14. message_attachments ─────────────────────────────────
CREATE POLICY "attachments_own_select"
  ON message_attachments FOR SELECT
  USING (
    message_id IN (
      SELECT m.id FROM messages m
      JOIN projects p ON p.id = m.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "attachments_admin_all"
  ON message_attachments FOR ALL
  USING (is_admin());

-- ── 15. tasks ───────────────────────────────────────────────
CREATE POLICY "tasks_own_select"
  ON tasks FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "tasks_admin_all"
  ON tasks FOR ALL
  USING (is_admin());

-- ── 16. proposals ───────────────────────────────────────────
CREATE POLICY "proposals_own_select"
  ON proposals FOR SELECT
  USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );

CREATE POLICY "proposals_admin_all"
  ON proposals FOR ALL
  USING (is_admin());

-- ── 17. proposal_items ──────────────────────────────────────
CREATE POLICY "proposal_items_own_select"
  ON proposal_items FOR SELECT
  USING (
    proposal_id IN (
      SELECT pr.id FROM proposals pr
      JOIN clients c ON c.id = pr.client_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "proposal_items_admin_all"
  ON proposal_items FOR ALL
  USING (is_admin());

-- ── 18. payments ────────────────────────────────────────────
CREATE POLICY "payments_own_select"
  ON payments FOR SELECT
  USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );

CREATE POLICY "payments_admin_all"
  ON payments FOR ALL
  USING (is_admin());

-- ── 19. notifications ───────────────────────────────────────
CREATE POLICY "notifications_own_select"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications_own_update"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "notifications_admin_all"
  ON notifications FOR ALL
  USING (is_admin());

-- ── 20. reports ─────────────────────────────────────────────
CREATE POLICY "reports_own_select"
  ON reports FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "reports_admin_all"
  ON reports FOR ALL
  USING (is_admin());

-- ── 21. audit_logs (admin only) ─────────────────────────────
CREATE POLICY "audit_logs_admin_all"
  ON audit_logs FOR ALL
  USING (is_admin());

-- ── 22. email_templates (admin only) ────────────────────────
CREATE POLICY "email_templates_admin_all"
  ON email_templates FOR ALL
  USING (is_admin());

-- ── 23. service_catalog (all authenticated users can read) ──
CREATE POLICY "service_catalog_read_active"
  ON service_catalog FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "service_catalog_admin_all"
  ON service_catalog FOR ALL
  USING (is_admin());

-- ── 24. referrals (admin only — future-ready) ───────────────
CREATE POLICY "referrals_admin_all"
  ON referrals FOR ALL
  USING (is_admin());
