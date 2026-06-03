-- ============================================================
-- Migration 004 — Supabase Storage Buckets
-- Sprint 01 | Eduardo Mendes Advisory Platform
--
-- Creates 6 private storage buckets with file-size limits and
-- MIME type restrictions that match BR-07 (validators.ts).
-- RLS policies mirror the same access rules as table policies.
-- ============================================================

-- ── Bucket creation ──────────────────────────────────────────
-- ON CONFLICT DO NOTHING makes this migration idempotent.
-- File size limits (bytes): lead 25 MB | client/admin 50 MB.
-- All buckets are PRIVATE (public = false).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'lead-documents',
    'lead-documents',
    false,
    26214400, -- 25 MB
    ARRAY[
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/png',
      'image/jpeg',
      'image/webp'
    ]
  ),
  (
    'client-documents',
    'client-documents',
    false,
    52428800, -- 50 MB
    ARRAY[
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/png',
      'image/jpeg',
      'image/webp'
    ]
  ),
  (
    'buildcheck-reports',
    'buildcheck-reports',
    false,
    52428800, -- 50 MB
    ARRAY[
      'application/pdf'
    ]
  ),
  (
    'project-files',
    'project-files',
    false,
    52428800, -- 50 MB
    ARRAY[
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/png',
      'image/jpeg',
      'image/webp'
    ]
  ),
  (
    'site-photos',
    'site-photos',
    false,
    52428800, -- 50 MB
    ARRAY[
      'image/png',
      'image/jpeg',
      'image/webp'
    ]
  ),
  (
    'proposal-files',
    'proposal-files',
    false,
    52428800, -- 50 MB
    ARRAY[
      'application/pdf'
    ]
  )
ON CONFLICT (id) DO NOTHING;


-- ── Storage RLS policies ─────────────────────────────────────
-- Storage paths follow convention: {user_id}/{uuid}.{ext}
-- The first segment of storage.objects.name is the owner's user_id.
--
-- Helper: extract owner user_id from the storage path.
-- Path format: "user_id/filename.ext"  →  split on '/' → first element.

-- ── lead-documents ───────────────────────────────────────────
-- Leads: upload their own files only.
-- Admins: full access.
-- Clients: no access (leads upload before conversion).

CREATE POLICY "lead_documents_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'lead-documents'
    AND auth.uid()::text = split_part(name, '/', 1)
  );

CREATE POLICY "lead_documents_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'lead-documents'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "lead_documents_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'lead-documents'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "lead_documents_admin_all"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'lead-documents'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ── client-documents ─────────────────────────────────────────
-- Clients: upload and read their own files.
-- Admins: full access.

CREATE POLICY "client_documents_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'client-documents'
    AND auth.uid()::text = split_part(name, '/', 1)
  );

CREATE POLICY "client_documents_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'client-documents'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "client_documents_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'client-documents'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );


-- ── buildcheck-reports ───────────────────────────────────────
-- Admins: upload and manage all reports.
-- Clients: read reports associated with their project only.
--   (Path includes client's user_id as the first segment.)

CREATE POLICY "buildcheck_reports_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'buildcheck-reports'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "buildcheck_reports_select"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'buildcheck-reports'
    AND (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
      OR auth.uid()::text = split_part(name, '/', 1)
    )
  );

CREATE POLICY "buildcheck_reports_admin_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'buildcheck-reports'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ── project-files ────────────────────────────────────────────
-- Clients: upload and read their own project files.
-- Admins: full access.

CREATE POLICY "project_files_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-files'
    AND auth.uid()::text = split_part(name, '/', 1)
  );

CREATE POLICY "project_files_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'project-files'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "project_files_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'project-files'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );


-- ── site-photos ──────────────────────────────────────────────
-- Clients: upload and read their own site photos.
-- Admins: full access.

CREATE POLICY "site_photos_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'site-photos'
    AND auth.uid()::text = split_part(name, '/', 1)
  );

CREATE POLICY "site_photos_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'site-photos'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "site_photos_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'site-photos'
    AND (
      auth.uid()::text = split_part(name, '/', 1)
      OR EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );


-- ── proposal-files ───────────────────────────────────────────
-- Admins: upload and manage proposal PDFs.
-- Clients: read-only access to files in their own path.

CREATE POLICY "proposal_files_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'proposal-files'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "proposal_files_select"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'proposal-files'
    AND (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
      )
      OR auth.uid()::text = split_part(name, '/', 1)
    )
  );

CREATE POLICY "proposal_files_admin_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'proposal-files'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
