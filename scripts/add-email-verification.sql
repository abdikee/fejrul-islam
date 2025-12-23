-- Add email verification support to the database with OTP

-- Add email_verified column to users table if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Create email_verifications table for OTP codes
CREATE TABLE IF NOT EXISTS email_verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL, -- Stores 6-digit OTP code
  expires_at TIMESTAMP NOT NULL, -- OTP expires in 10 minutes
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_verification UNIQUE (user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);

-- Add comments
COMMENT ON TABLE email_verifications IS 'Stores OTP codes for email verification (6-digit codes, 10-minute expiry)';
COMMENT ON COLUMN email_verifications.token IS 'Stores 6-digit OTP code';
COMMENT ON COLUMN email_verifications.expires_at IS 'OTP expires 10 minutes after creation';
COMMENT ON COLUMN users.email_verified IS 'Indicates whether the user has verified their email address';

-- Display success message
SELECT 'Email verification with OTP system created successfully!' AS status;
