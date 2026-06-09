-- ============================================================
-- Eduardo Mendes Advisory Platform
-- Migration 007: Project Stage Standardisation
-- Replaces ad-hoc project_stage text values with the approved
-- 7-step client journey.
-- ============================================================

-- Add a CHECK constraint so the column only accepts approved values.
-- (Existing rows with old values must be migrated first.)

-- Step 1: Migrate any existing rows that used the old stage names
UPDATE projects
SET project_stage = CASE project_stage
  WHEN 'assessment'           THEN 'project_assessment'
  WHEN 'strategy_call'        THEN 'strategy_session'
  WHEN 'quote_review'         THEN 'detailed_review'
  WHEN 'builder_selection'    THEN 'detailed_review'
  WHEN 'construction_support' THEN 'advisory_support'
  WHEN 'completed'            THEN 'completed'
  ELSE project_stage  -- leave anything already valid alone
END
WHERE project_stage IN (
  'assessment', 'strategy_call', 'quote_review',
  'builder_selection', 'construction_support', 'completed'
);

-- Step 2: Null-out any remaining unrecognised values
UPDATE projects
SET project_stage = NULL
WHERE project_stage IS NOT NULL
  AND project_stage NOT IN (
    'project_assessment',
    'strategy_session',
    'service_engagement',
    'detailed_review',
    'action_plan_delivered',
    'advisory_support',
    'completed'
  );

-- Step 3: Add constraint (idempotent)
ALTER TABLE projects
  DROP CONSTRAINT IF EXISTS projects_project_stage_check;

ALTER TABLE projects
  ADD CONSTRAINT projects_project_stage_check
  CHECK (project_stage IS NULL OR project_stage IN (
    'project_assessment',
    'strategy_session',
    'service_engagement',
    'detailed_review',
    'action_plan_delivered',
    'advisory_support',
    'completed'
  ));

-- Step 4: Index for fast stage-based queries
CREATE INDEX IF NOT EXISTS idx_projects_project_stage ON projects(project_stage);
