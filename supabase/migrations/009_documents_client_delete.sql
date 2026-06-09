-- Allow clients to delete their own document records (storage delete already scoped by user_id path)

CREATE POLICY "documents_client_delete"
  ON documents FOR DELETE
  USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );
