import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pool from '../lib/db/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  console.log('🚀 Running Contact Submissions Migration...\n');

  try {
    // Test connection
    console.log('📡 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');

    // Read and execute migration
    console.log('📋 Creating contact_submissions table...');
    const migrationSQL = readFileSync(join(__dirname, 'add-contact-submissions.sql'), 'utf8');
    await pool.query(migrationSQL);
    console.log('✅ Migration executed successfully\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
