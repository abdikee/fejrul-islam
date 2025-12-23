# Troubleshooting: Registration Failed - Internal Server Error

## Quick Fix

### Step 1: Run Database Migration

Open your terminal and run:

```bash
# Connect to your database
psql -U humsj_user -d humsj_db -h localhost

# Then paste this SQL:
```

```sql
-- Add email_verified column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Create email_verifications table
CREATE TABLE IF NOT EXISTS email_verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add unique constraint (drop first if exists)
DO $$ 
BEGIN
    ALTER TABLE email_verifications DROP CONSTRAINT IF EXISTS unique_user_verification;
    ALTER TABLE email_verifications ADD CONSTRAINT unique_user_verification UNIQUE (user_id);
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);

-- Verify setup
SELECT 'Setup complete!' as status;
```

### Step 2: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Try Registration Again

The error should be fixed now!

## Alternative: Use the SQL File

```bash
psql -U humsj_user -d humsj_db -h localhost -f scripts/check-and-fix-verification.sql
```

## Check Server Console

After trying to register, check your terminal where `npm run dev` is running. You should see:

### Success:
```
=================================
📧 EMAIL VERIFICATION OTP
=================================
To: your@email.com
Name: YourName
OTP Code: 123456
Valid for: 10 minutes
=================================
```

### If Error:
Look for error messages like:
- `relation "email_verifications" does not exist` → Run the migration
- `column "email_verified" does not exist` → Run the migration
- `duplicate key value` → Email already registered, try different email

## Common Issues

### Issue 1: Database Connection Failed
**Error:** `connect ECONNREFUSED`

**Solution:**
1. Make sure PostgreSQL is running:
   ```bash
   # On Linux/Mac:
   sudo systemctl status postgresql
   # or
   brew services list
   
   # On Windows:
   # Check Services app for PostgreSQL
   ```

2. Verify database credentials in `.env.local`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=humsj_db
   DB_USER=humsj_user
   DB_PASSWORD=humsj_password
   ```

### Issue 2: Table Doesn't Exist
**Error:** `relation "email_verifications" does not exist`

**Solution:** Run the database migration (Step 1 above)

### Issue 3: Column Doesn't Exist
**Error:** `column "email_verified" does not exist`

**Solution:** Run the database migration (Step 1 above)

### Issue 4: Email Already Exists
**Error:** `Email already exists`

**Solution:** Use a different email address or delete the existing user:
```sql
DELETE FROM users WHERE email = 'your@email.com';
```

## Verify Database Setup

Run this query to check if everything is set up correctly:

```sql
-- Check users table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'email_verified';

-- Check email_verifications table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'email_verifications';

-- Check constraints
SELECT constraint_name, table_name 
FROM information_schema.table_constraints 
WHERE table_name = 'email_verifications';
```

Expected output:
- `email_verified` column exists in `users` table
- `email_verifications` table has columns: id, user_id, token, expires_at, verified_at, created_at
- `unique_user_verification` constraint exists

## Still Having Issues?

1. **Check the server console** for detailed error messages
2. **Check database logs** for PostgreSQL errors
3. **Verify all tables exist**:
   ```sql
   \dt
   ```
4. **Check if users table exists**:
   ```sql
   SELECT * FROM users LIMIT 1;
   ```

## Test Registration Step by Step

1. Open browser console (F12)
2. Go to Network tab
3. Try to register
4. Look at the `/api/auth/signup` request
5. Check the response for detailed error message

In development mode, the error message will include more details!

## Need to Reset Everything?

If you want to start fresh:

```sql
-- WARNING: This deletes all data!
DROP TABLE IF EXISTS email_verifications CASCADE;
DELETE FROM users; -- or DROP TABLE users CASCADE;

-- Then run the migration again
```

## Contact Support

If none of these solutions work, please provide:
1. Error message from server console
2. Error message from browser console
3. PostgreSQL version: `SELECT version();`
4. Node.js version: `node --version`
