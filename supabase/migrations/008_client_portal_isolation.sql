-- Client portal: messages by client, meeting inserts, RLS isolation per client

-- messages: allow client-scoped threads without a project row
ALTER TABLE messages
  ALTER COLUMN project_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS subject TEXT;

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_scope_check;
ALTER TABLE messages ADD CONSTRAINT messages_scope_check
  CHECK (project_id IS NOT NULL OR client_id IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_messages_client_id ON messages(client_id);

-- Replace broad policy with explicit client-scoped policies
DROP POLICY IF EXISTS "messages_own_all" ON messages;

CREATE POLICY "messages_client_select"
  ON messages FOR SELECT
  USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    OR project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "messages_client_insert"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND (
      client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
      OR project_id IN (
        SELECT p.id FROM projects p
        JOIN clients c ON c.id = p.client_id
        WHERE c.user_id = auth.uid()
      )
    )
  );

-- message_attachments: match client-scoped messages
DROP POLICY IF EXISTS "attachments_own_select" ON message_attachments;

CREATE POLICY "attachments_client_select"
  ON message_attachments FOR SELECT
  USING (
    message_id IN (
      SELECT m.id FROM messages m
      WHERE m.client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
         OR m.project_id IN (
           SELECT p.id FROM projects p
           JOIN clients c ON c.id = p.client_id
           WHERE c.user_id = auth.uid()
         )
    )
  );

-- meetings: clients can record bookings (webhook / portal)
CREATE POLICY "meetings_client_insert"
  ON meetings FOR INSERT
  WITH CHECK (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    OR lead_id IN (SELECT id FROM leads WHERE user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_meetings_client_id ON meetings(client_id);
