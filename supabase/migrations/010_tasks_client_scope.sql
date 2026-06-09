-- Tasks scoped by client_id so clients without a project row still receive tasks

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON tasks(client_id);

DROP POLICY IF EXISTS "tasks_own_select" ON tasks;

CREATE POLICY "tasks_client_select"
  ON tasks FOR SELECT
  USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    OR project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = auth.uid()
    )
    OR lead_id IN (
      SELECT l.id FROM leads l
      WHERE l.user_id = auth.uid()
    )
  );

CREATE POLICY "tasks_client_update"
  ON tasks FOR UPDATE
  USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    OR project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = auth.uid()
    )
    OR lead_id IN (
      SELECT l.id FROM leads l
      WHERE l.user_id = auth.uid()
    )
  )
  WITH CHECK (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    OR project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = auth.uid()
    )
    OR lead_id IN (
      SELECT l.id FROM leads l
      WHERE l.user_id = auth.uid()
    )
  );
