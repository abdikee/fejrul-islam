#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pool from '../lib/db/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  console.log('🚀 Running Mentor Fields Migration...\n');

  try {
    console.log('📡 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');

    console.log('📋 Applying migration (specialization + email_verified)...');
    const sql = readFileSync(join(__dirname, 'add-mentor-specialization.sql'), 'utf8');
    await pool.query(sql);
    console.log('✅ Migration applied successfully\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runMigration();
