-- ============================================================
-- Eduardo Mendes Advisory Platform
-- Migration 003: Seed Data
-- Run AFTER migration 002.
-- ============================================================

-- ── service_catalog: Eduardo's 6 standard services ──────────
INSERT INTO service_catalog
  (service_name, description, default_price, is_active, order_index)
VALUES
  (
    'BuildCheck',
    'Comprehensive review of your builder quotes, contracts, and project scope to identify risks and potential savings.',
    1500.00, true, 1
  ),
  (
    'Pre-Construction Advisory',
    'Expert guidance through the pre-construction phase including design review, builder selection, and contract negotiation.',
    3500.00, true, 2
  ),
  (
    'Construction Advisory',
    'Ongoing advisory throughout the construction phase, including site visit reports, progress reviews, and issue resolution.',
    5000.00, true, 3
  ),
  (
    'Site Visits & Inspections',
    'Professional site inspections at key construction milestones to verify quality, compliance, and progress.',
    750.00, true, 4
  ),
  (
    'Owner Builder Program',
    'Complete end-to-end advisory program for owner builders, covering all phases of the project lifecycle.',
    8000.00, true, 5
  ),
  (
    'Custom Service',
    'Custom advisory service tailored to your specific project needs. Price to be confirmed.',
    0.00, true, 6
  );

-- ── email_template keys (content added in Sprint 04) ────────
INSERT INTO email_templates (template_key, subject, is_active)
VALUES
  ('welcome',               'Welcome to Eduardo Mendes Advisory',     true),
  ('assessment_completed',  'Your Project Assessment is Ready',        true),
  ('call_confirmed',        'Your Strategy Call is Confirmed',         true),
  ('proposal_sent',         'Your Proposal from Eduardo Mendes',       true),
  ('proposal_approved',     'Proposal Approved — Next Steps',          true),
  ('payment_confirmed',     'Payment Confirmed — Welcome to BuildIQ',  true),
  ('buildiq_access',        'Your BuildIQ Portal is Ready',            true),
  ('document_uploaded',     'New Document Uploaded to Your Project',   true),
  ('project_completed',     'Congratulations — Project Complete!',     true);
