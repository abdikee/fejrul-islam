#!/usr/bin/env node

/**
 * HUMSJ Database Setup Script
 * 
 * This script sets up the PostgreSQL database for the HUMSJ platform.
 * Run this script after installing PostgreSQL and creating the database.
 * 
 * Usage: node scripts/setup-database.js
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pool from '../lib/db/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
  console.log('🚀 Setting up HUMSJ PostgreSQL database...\n');

  try {
    // Test connection
    console.log('📡 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');

    // Read and execute schema
    console.log('📋 Creating database schema...');
    const schemaSQL = readFileSync(join(__dirname, '../lib/db/schema.sql'), 'utf8');
    await pool.query(schemaSQL);
    console.log('✅ Database schema created successfully\n');

    // Read and execute seed data
    console.log('🌱 Inserting seed data...');
    const seedSQL = readFileSync(join(__dirname, '../lib/db/seed.sql'), 'utf8');
    await pool.query(seedSQL);
    console.log('✅ Seed data inserted successfully\n');

    // Verify setup
    console.log('🔍 Verifying database setup...');
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const sectorCount = await pool.query('SELECT COUNT(*) FROM learning_sectors');
    const verseCount = await pool.query('SELECT COUNT(*) FROM quran_verses');

    console.log(`📊 Database Statistics:`);
    console.log(`   Users: ${userCount.rows[0].count}`);
    console.log(`   Learning Sectors: ${sectorCount.rows[0].count}`);
    console.log(`   Quran Verses: ${verseCount.rows[0].count}`);

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Default Login Credentials:');
    console.log('   Student: ahmed.hassan@student.edu / password123');
    console.log('   Mentor: sheikh.abdullah@humsj.edu / password123');
    console.log('   Admin: admin@humsj.edu / password123');
    console.log('\n⚠️  Remember to change these passwords in production!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Make sure PostgreSQL is installed and running');
      console.log('   2. Create the database: createdb humsj_db');
      console.log('   3. Create the user: createuser -P humsj_user');
      console.log('   4. Grant permissions: GRANT ALL PRIVILEGES ON DATABASE humsj_db TO humsj_user;');
      console.log('   5. Update .env.local with your database credentials');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run setup
setupDatabase();