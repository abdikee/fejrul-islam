-- Check and fix email verification setup

-- First, check if email_verified column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'email_verified'
    ) THEN
        ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added email_verified column to users table';
    ELSE
        RAISE NOTICE 'email_verified column already exists';
    END IF;
END $$;

-- Create or replace email_verifications table
CREATE TABLE IF NOT EXISTS email_verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drop the unique constraint if it exists, then recreate it
DO $$ 
BEGIN
    -- Drop existing constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_user_verification' 
        AND table_name = 'email_verifications'
    ) THEN
        ALTER TABLE email_verifications DROP CONSTRAINT unique_user_verification;
    END IF;
    
    -- Add the constraint
    ALTER TABLE email_verifications ADD CONSTRAINT unique_user_verification UNIQUE (user_id);
    RAISE NOTICE 'Added unique_user_verification constraint';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'unique_user_verification constraint already exists';
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);

-- Display current state
SELECT 
    'Setup complete!' as status,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE email_verified = true) as verified_users,
    (SELECT COUNT(*) FROM email_verifications WHERE verified_at IS NULL AND expires_at > NOW()) as pending_verifications;
