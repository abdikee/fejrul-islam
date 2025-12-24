# Enrollment System Troubleshooting Guide

## Common Issues and Solutions

### 1. "Qirat & Ilm" Enrollment Not Working

**Problem**: Clicking "Quick Enroll" on Qirat & Ilm sector shows error or doesn't work.

**Possible Causes & Solutions**:

#### A. Database Setup Issues
```bash
# Run the setup script to ensure tables exist
psql -d your_database -f app/scripts/setup-enrollment-system.sql

# Or run the test script to check database state
node app/scripts/test-enrollment.js
```

#### B. Sector Code Mismatch
The system expects these exact sector codes in the database:
- `qirat-ilm` for "Qirat & Ilm"
- `literature-history` for "Literature & History"
- `dawah-comparative-religion` for "Dawah & Comparative Religion"
- `tarbiya-idad` for "Tarbiya & Idad"
- `ziyara` for "Ziyara"

**Check database**:
```sql
SELECT code, name FROM sectors ORDER BY display_order;
```

#### C. Missing Database Tables
Ensure these tables exist:
- `sectors`
- `sector_levels`
- `student_sector_enrollments`
- `users`

**Check tables**:
```sql
\dt
```

### 2. Authentication Issues

**Problem**: User gets redirected to login but enrollment doesn't work after login.

**Solutions**:
1. Check if user is properly authenticated:
   ```javascript
   // In browser console
   fetch('/api/auth/me').then(r => r.json()).then(console.log)
   ```

2. Verify email verification status:
   ```sql
   SELECT email, email_verified FROM users WHERE email = 'user@example.com';
   ```

### 3. Database Connection Issues

**Problem**: Enrollment fails with "Internal server error".

**Check**:
1. Database connection in `lib/db/connection.js`
2. Environment variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   ```

3. Test connection:
   ```bash
   node app/scripts/test-db-connection.js
   ```

### 4. API Route Issues

**Problem**: Enrollment API returns errors.

**Debug Steps**:
1. Check browser Network tab for API calls
2. Look at server logs for detailed error messages
3. Test API directly:
   ```bash
   curl -X POST http://localhost:3000/api/enrollment/enroll \
     -H "Content-Type: application/json" \
     -d '{"programType":"sector","programId":"qirat-ilm","enrollmentData":{}}'
   ```

### 5. Frontend Issues

**Problem**: Button doesn't respond or shows wrong state.

**Check**:
1. Browser console for JavaScript errors
2. React component state in React DevTools
3. Network requests in browser DevTools

## Debugging Commands

### Database Queries
```sql
-- Check sectors
SELECT * FROM sectors;

-- Check enrollments for a user
SELECT sse.*, s.name as sector_name 
FROM student_sector_enrollments sse 
JOIN sectors s ON sse.sector_id = s.id 
WHERE sse.user_id = 'user-uuid-here';

-- Check sector levels
SELECT sl.*, s.name as sector_name 
FROM sector_levels sl 
JOIN sectors s ON sl.sector_id = s.id 
ORDER BY s.display_order, sl.level_number;
```

### API Testing
```bash
# Test enrollment status
curl "http://localhost:3000/api/enrollment/status?type=sector&id=qirat-ilm"

# Test enrollment creation (requires authentication)
curl -X POST http://localhost:3000/api/enrollment/enroll \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=your-token-here" \
  -d '{"programType":"sector","programId":"qirat-ilm","enrollmentData":{}}'
```

### Frontend Debugging
```javascript
// In browser console - check enrollment button data
document.querySelector('[data-program-id]')?.getAttribute('data-program-id')

// Check authentication state
localStorage.getItem('auth-token')

// Test enrollment function directly
fetch('/api/enrollment/enroll', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    programType: 'sector',
    programId: 'qirat-ilm',
    enrollmentData: { source: 'debug_test' }
  })
}).then(r => r.json()).then(console.log)
```

## Setup Verification Checklist

- [ ] Database tables created (`sectors`, `student_sector_enrollments`, etc.)
- [ ] Sector data seeded with correct codes
- [ ] User authentication working
- [ ] Email verification enabled/working
- [ ] API routes responding correctly
- [ ] Frontend components loading without errors
- [ ] Database connection established
- [ ] Environment variables set correctly

## Quick Fix Commands

### Reset Enrollment System
```bash
# 1. Drop and recreate tables
psql -d your_database -c "DROP TABLE IF EXISTS student_sector_enrollments CASCADE;"
psql -d your_database -c "DROP TABLE IF EXISTS sector_levels CASCADE;"
psql -d your_database -c "DROP TABLE IF EXISTS sectors CASCADE;"

# 2. Recreate everything
psql -d your_database -f app/scripts/setup-enrollment-system.sql
```

### Create Test User
```sql
INSERT INTO users (id, email, password_hash, first_name, last_name, gender, role, email_verified)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  '$2b$10$hash_here', -- Use proper bcrypt hash
  'Test',
  'User',
  'male',
  'student',
  true
);
```

### Test Enrollment Manually
```sql
-- Get user and sector IDs
SELECT id FROM users WHERE email = 'test@example.com';
SELECT id FROM sectors WHERE code = 'qirat-ilm';

-- Create test enrollment
INSERT INTO student_sector_enrollments (user_id, sector_id, sector_status, motivation)
VALUES ('user-uuid', sector-id, 'active', 'Test enrollment');
```

## Error Messages and Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Sector not found: qirat-ilm" | Missing sector in database | Run setup script |
| "Authentication required" | User not logged in | Check auth system |
| "Already enrolled in this program" | Duplicate enrollment | Check enrollment status |
| "Internal server error" | Database/server issue | Check logs and connection |
| "Invalid program type" | Wrong programType parameter | Use 'sector', 'course', or 'qirat' |

## Contact Information

If issues persist after following this guide:
1. Check server logs for detailed error messages
2. Verify database schema matches expected structure
3. Test with a fresh user account
4. Ensure all environment variables are set correctly

The enrollment system should work seamlessly once properly configured!