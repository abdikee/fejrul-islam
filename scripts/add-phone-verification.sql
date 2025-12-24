-- Add phone verification support to the database with SMS OTP

-- Add phone_verified column to users table if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;

-- Create phone_verifications table for SMS OTP codes
CREATE TABLE IF NOT EXISTS phone_verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL, -- Stores international format phone number
  otp_code VARCHAR(6) NOT NULL, -- Stores 6-digit SMS OTP code
  expires_at TIMESTAMP NOT NULL, -- OTP expires in 5 minutes
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attempts INTEGER DEFAULT 0, -- Track verification attempts
  is_used BOOLEAN DEFAULT false -- Prevent OTP reuse
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_phone_verifications_user_id ON phone_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone ON phone_verifications(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_otp ON phone_verifications(otp_code);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_expires ON phone_verifications(expires_at);

-- Add comments
COMMENT ON TABLE phone_verifications IS 'Stores SMS OTP codes for phone verification (6-digit codes, 5-minute expiry)';
COMMENT ON COLUMN phone_verifications.phone_number IS 'International format phone number (e.g., +251911234567)';
COMMENT ON COLUMN phone_verifications.otp_code IS 'Stores 6-digit SMS OTP code';
COMMENT ON COLUMN phone_verifications.expires_at IS 'OTP expires 5 minutes after creation';
COMMENT ON COLUMN phone_verifications.attempts IS 'Number of verification attempts (max 3)';
COMMENT ON COLUMN phone_verifications.is_used IS 'Prevents OTP code reuse';
COMMENT ON COLUMN users.phone_verified IS 'Indicates whether the user has verified their phone number';

-- Create function to clean up expired phone verifications
CREATE OR REPLACE FUNCTION cleanup_expired_phone_verifications()
RETURNS void AS $$
BEGIN
  DELETE FROM phone_verifications 
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_phone_verification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER phone_verification_update_timestamp
  BEFORE UPDATE ON phone_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_phone_verification_timestamp();

-- Display success message
SELECT 'Phone verification with SMS OTP system created successfully!' AS status;