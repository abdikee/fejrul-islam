const { query } = require('../lib/db/connection.js');

async function testEnrollment() {
  try {
    console.log('Testing enrollment system...');
    
    // 1. Check if sectors table exists and has data
    console.log('\n1. Checking sectors table:');
    const sectorsResult = await query('SELECT id, code, name FROM sectors ORDER BY display_order');
    console.log('Sectors found:', sectorsResult.rows);
    
    // 2. Check if student_sector_enrollments table exists
    console.log('\n2. Checking student_sector_enrollments table structure:');
    const tableCheck = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'student_sector_enrollments'
      ORDER BY ordinal_position
    `);
    console.log('Table columns:', tableCheck.rows);
    
    // 3. Test sector lookup for "qirat-ilm"
    console.log('\n3. Testing sector lookup for "qirat-ilm":');
    const qiratLookup = await query('SELECT id, code, name FROM sectors WHERE code = $1', ['qirat-ilm']);
    console.log('Qirat lookup result:', qiratLookup.rows);
    
    // 4. Check if users table has test users
    console.log('\n4. Checking for test users:');
    const usersResult = await query('SELECT id, email, role, gender FROM users LIMIT 3');
    console.log('Sample users:', usersResult.rows);
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testEnrollment();