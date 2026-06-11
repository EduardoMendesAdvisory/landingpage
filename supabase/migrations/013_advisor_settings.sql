-- Saved advisor preferences (e.g. default invoice bank details)
CREATE TABLE advisor_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by  UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE TRIGGER update_advisor_settings_updated_at
  BEFORE UPDATE ON advisor_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE advisor_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "advisor_settings_admin_all"
  ON advisor_settings FOR ALL
  USING (private.is_admin());
