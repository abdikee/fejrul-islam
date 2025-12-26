-- Expand users.profile_photo to support base64 Data URLs (and longer URLs)
-- Safe to run multiple times.

DO $$
BEGIN
  -- Only attempt if the column exists.
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'users'
      AND column_name = 'profile_photo'
  ) THEN
    -- If it's already TEXT, this is a no-op.
    ALTER TABLE users
      ALTER COLUMN profile_photo TYPE TEXT;
  END IF;
END $$;
