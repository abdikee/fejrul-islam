-- Add mentor-related columns to users table if missing

-- specialization used in Admin Mentor Management UI
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS specialization VARCHAR(255);

-- email_verified is used across auth/enrollment; keep it in sync
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
