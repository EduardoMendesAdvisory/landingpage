-- Strategy calls are 15-minute Calendly consultations (not 30).
ALTER TABLE meetings
  ALTER COLUMN duration_minutes SET DEFAULT 15;

UPDATE meetings
SET duration_minutes = 15
WHERE meeting_type = 'strategy_call'
  AND (duration_minutes IS NULL OR duration_minutes = 30);

-- Remove incomplete ghost bookings with no schedule or Calendly reference.
DELETE FROM meetings
WHERE scheduled_at IS NULL
  AND calendly_event_id IS NULL
  AND calendly_invitee_uri IS NULL
  AND status = 'scheduled';
