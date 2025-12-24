-- Add course targeting for resources (optional per resource)
-- This lets admins attach files to a specific course/program.

ALTER TABLE resources
  ADD COLUMN IF NOT EXISTS course_id INTEGER;

DO $$
BEGIN
  -- Add FK if courses(id) exists and column has no FK yet.
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    WHERE tc.table_name = 'resources'
      AND tc.constraint_type = 'FOREIGN KEY'
      AND tc.constraint_name = 'resources_course_id_fkey'
  ) THEN
    ALTER TABLE resources
      ADD CONSTRAINT resources_course_id_fkey
      FOREIGN KEY (course_id) REFERENCES courses(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_resources_course_id ON resources(course_id);
