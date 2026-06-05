-- ============================================================
-- Migration 005: Security & integrity fixes
-- - Move RLS helpers to private schema (not exposed via PostgREST RPC)
-- - Harden function search_path
-- - Revoke public RPC access to auth trigger function
-- - Add missing foreign keys
-- - Allow leads to read BuildChecks linked by lead_id
-- - Add storage UPDATE policies for upsert support
-- ============================================================

-- ?? 1. Private schema for internal helpers ?????????????????
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO postgres, service_role, authenticated, anon;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION private.is_client()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'client'
  );
$$;

GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION private.is_client() TO authenticated, anon, service_role;

-- ?? 2. Harden remaining public functions ???????????????????
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'lead')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.leads (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_auth_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_auth_user() FROM anon, authenticated;

-- ?? 3. Recreate RLS policies referencing private.is_admin() ?
DROP POLICY IF EXISTS "users_admin_all" ON users;
CREATE POLICY "users_admin_all"
  ON users FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "profiles_admin_all" ON user_profiles;
CREATE POLICY "profiles_admin_all"
  ON user_profiles FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "leads_admin_all" ON leads;
CREATE POLICY "leads_admin_all"
  ON leads FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "assessments_admin_all" ON assessments;
CREATE POLICY "assessments_admin_all"
  ON assessments FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "meetings_admin_all" ON meetings;
CREATE POLICY "meetings_admin_all"
  ON meetings FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "meeting_notes_admin_all" ON meeting_notes;
CREATE POLICY "meeting_notes_admin_all"
  ON meeting_notes FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "clients_admin_all" ON clients;
CREATE POLICY "clients_admin_all"
  ON clients FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "projects_admin_all" ON projects;
CREATE POLICY "projects_admin_all"
  ON projects FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "timeline_admin_all" ON project_timeline;
CREATE POLICY "timeline_admin_all"
  ON project_timeline FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "buildchecks_admin_all" ON buildchecks;
CREATE POLICY "buildchecks_admin_all"
  ON buildchecks FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "findings_admin_all" ON buildcheck_findings;
CREATE POLICY "findings_admin_all"
  ON buildcheck_findings FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "documents_admin_all" ON documents;
CREATE POLICY "documents_admin_all"
  ON documents FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "messages_admin_all" ON messages;
CREATE POLICY "messages_admin_all"
  ON messages FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "attachments_admin_all" ON message_attachments;
CREATE POLICY "attachments_admin_all"
  ON message_attachments FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "tasks_admin_all" ON tasks;
CREATE POLICY "tasks_admin_all"
  ON tasks FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "proposals_admin_all" ON proposals;
CREATE POLICY "proposals_admin_all"
  ON proposals FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "proposal_items_admin_all" ON proposal_items;
CREATE POLICY "proposal_items_admin_all"
  ON proposal_items FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "payments_admin_all" ON payments;
CREATE POLICY "payments_admin_all"
  ON payments FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "notifications_admin_all" ON notifications;
CREATE POLICY "notifications_admin_all"
  ON notifications FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "reports_admin_all" ON reports;
CREATE POLICY "reports_admin_all"
  ON reports FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "audit_logs_admin_all" ON audit_logs;
CREATE POLICY "audit_logs_admin_all"
  ON audit_logs FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "email_templates_admin_all" ON email_templates;
CREATE POLICY "email_templates_admin_all"
  ON email_templates FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "service_catalog_read_active" ON service_catalog;
CREATE POLICY "service_catalog_read_active"
  ON service_catalog FOR SELECT
  USING (is_active = true OR private.is_admin());

DROP POLICY IF EXISTS "service_catalog_admin_all" ON service_catalog;
CREATE POLICY "service_catalog_admin_all"
  ON service_catalog FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "referrals_admin_all" ON referrals;
CREATE POLICY "referrals_admin_all"
  ON referrals FOR ALL
  USING (private.is_admin());

-- ?? 4. Remove public helpers (PostgREST RPC surface) ???????
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_client();

-- ?? 5. BuildCheck visibility for leads (pre-client conversion) ?
CREATE POLICY "buildchecks_lead_select"
  ON buildchecks FOR SELECT
  USING (
    lead_id IN (SELECT id FROM leads WHERE user_id = auth.uid())
  );

CREATE POLICY "findings_lead_select"
  ON buildcheck_findings FOR SELECT
  USING (
    buildcheck_id IN (
      SELECT bc.id FROM buildchecks bc
      WHERE bc.lead_id IN (SELECT id FROM leads WHERE user_id = auth.uid())
    )
  );

-- ?? 6. Missing foreign keys ????????????????????????????????
ALTER TABLE meetings
  ADD CONSTRAINT meetings_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;

ALTER TABLE proposal_items
  ADD CONSTRAINT proposal_items_service_catalog_id_fkey
  FOREIGN KEY (service_catalog_id) REFERENCES service_catalog(id) ON DELETE SET NULL;

-- ?? 7. Storage UPDATE policies (required for upsert) ???????
CREATE POLICY "client_documents_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'client-documents'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR private.is_admin()
    )
  )
  WITH CHECK (
    bucket_id = 'client-documents'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR private.is_admin()
    )
  );

CREATE POLICY "project_files_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'project-files'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR private.is_admin()
    )
  )
  WITH CHECK (
    bucket_id = 'project-files'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR private.is_admin()
    )
  );

CREATE POLICY "site_photos_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'site-photos'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR private.is_admin()
    )
  )
  WITH CHECK (
    bucket_id = 'site-photos'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR private.is_admin()
    )
  );

CREATE POLICY "lead_documents_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'lead-documents'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR private.is_admin()
    )
  )
  WITH CHECK (
    bucket_id = 'lead-documents'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR private.is_admin()
    )
  );
