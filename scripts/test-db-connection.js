// Test database connection and verify tables
import pool from '../lib/db/connection.js';

async function testConnection() {
  try {
    console.log('Testing database connection...\n');
    
    // Test basic connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully!');
    console.log('   Server time:', result.rows[0].now);
    console.log('');
    
    // Check if users table exists
    const usersCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    console.log('✅ Users table exists:', usersCheck.rows[0].exists);
    
    // Check if email_verified column exists
    const emailVerifiedCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'email_verified'
      );
    `);
    console.log('✅ email_verified column exists:', emailVerifiedCheck.rows[0].exists);
    
    // Check if email_verifications table exists
    const verificationsCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'email_verifications'
      );
    `);
    console.log('✅ email_verifications table exists:', verificationsCheck.rows[0].exists);
    
    console.log('');
    
    if (!emailVerifiedCheck.rows[0].exists || !verificationsCheck.rows[0].exists) {
      console.log('⚠️  WARNING: Email verification tables not set up!');
      console.log('   Please run: psql -U humsj_user -d humsj_db -f scripts/check-and-fix-verification.sql');
      console.log('');
    } else {
      console.log('✅ All email verification tables are set up correctly!');
      console.log('');
      
      // Show stats
      const stats = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM users WHERE email_verified = true) as verified_users,
          (SELECT COUNT(*) FROM email_verifications WHERE verified_at IS NULL AND expires_at > NOW()) as pending_verifications
      `);
      
      console.log('Database Statistics:');
      console.log('  Total users:', stats.rows[0].total_users);
      console.log('  Verified users:', stats.rows[0].verified_users);
      console.log('  Pending verifications:', stats.rows[0].pending_verifications);
    }
    
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('   Error:', error.message);
    console.error('');
    console.error('Please check:');
    console.error('  1. PostgreSQL is running');
    console.error('  2. Database credentials in .env.local are correct');
    console.error('  3. Database "humsj_db" exists');
    console.error('  4. User "humsj_user" has access');
    console.error('');
    process.exit(1);
  }
}

testConnection();
