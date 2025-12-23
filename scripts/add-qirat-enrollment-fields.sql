-- Add enrollment fields to qirat_user_progress table

-- Add enrollment date if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'qirat_user_progress' 
    AND column_name = 'enrollment_date'
  ) THEN
    ALTER TABLE qirat_user_progress 
    ADD COLUMN enrollment_date TIMESTAMP DEFAULT NOW();
  END IF;
END $$;

-- Add motivation field
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'qirat_user_progress' 
    AND column_name = 'motivation'
  ) THEN
    ALTER TABLE qirat_user_progress 
    ADD COLUMN motivation TEXT;
  END IF;
END $$;

-- Add study hours per week field
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'qirat_user_progress' 
    AND column_name = 'study_hours_per_week'
  ) THEN
    ALTER TABLE qirat_user_progress 
    ADD COLUMN study_hours_per_week VARCHAR(20);
  END IF;
END $$;

-- Add previous knowledge field
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'qirat_user_progress' 
    AND column_name = 'previous_knowledge'
  ) THEN
    ALTER TABLE qirat_user_progress 
    ADD COLUMN previous_knowledge TEXT;
  END IF;
END $$;

-- Update existing records to have enrollment date
UPDATE qirat_user_progress 
SET enrollment_date = NOW() 
WHERE enrollment_date IS NULL;

SELECT 'Enrollment fields added successfully!' as message;
