import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'humsj_db',
  user: process.env.DB_USER || 'humsj_user',
  password: process.env.DB_PASSWORD || 'humsj_password'
});

async function runSQL() {
  try {
    const sqlPath = path.join(__dirname, 'update-messaging-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await pool.query(sql);
    console.log('✅ Messaging system tables created successfully');
  } catch (error) {
    console.error('❌ Error creating messaging tables:', error.message);
  } finally {
    await pool.end();
  }
}

runSQL();