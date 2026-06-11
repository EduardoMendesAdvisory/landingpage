-- Manual invoice flow: proposals scoped to leads or clients, no Stripe required

ALTER TABLE proposals
  ALTER COLUMN client_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS service_slug TEXT,
  ADD COLUMN IF NOT EXISTS recipient_email TEXT,
  ADD COLUMN IF NOT EXISTS recipient_name TEXT,
  ADD COLUMN IF NOT EXISTS payment_instructions TEXT,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE proposals DROP CONSTRAINT IF EXISTS proposals_scope_check;
ALTER TABLE proposals ADD CONSTRAINT proposals_scope_check
  CHECK (client_id IS NOT NULL OR lead_id IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_proposals_lead_id ON proposals(lead_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);

-- Clients can read invoices linked to their client row or lead
DROP POLICY IF EXISTS "proposals_own_select" ON proposals;
CREATE POLICY "proposals_own_select"
  ON proposals FOR SELECT
  USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    OR lead_id IN (SELECT id FROM leads WHERE user_id = auth.uid())
  );
