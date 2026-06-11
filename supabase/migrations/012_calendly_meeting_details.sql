-- Calendly invitee details and form responses on meetings
ALTER TABLE meetings
  ADD COLUMN IF NOT EXISTS invitee_name TEXT,
  ADD COLUMN IF NOT EXISTS invitee_email TEXT,
  ADD COLUMN IF NOT EXISTS form_responses JSONB,
  ADD COLUMN IF NOT EXISTS service_slug TEXT,
  ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS calendly_invitee_uri TEXT;

CREATE INDEX IF NOT EXISTS idx_meetings_lead_id ON meetings(lead_id);
CREATE INDEX IF NOT EXISTS idx_meetings_invitee_email ON meetings(invitee_email);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_at ON meetings(scheduled_at DESC);
