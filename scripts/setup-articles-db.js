import { query } from '../lib/db/connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupArticlesDb() {
  try {
    console.log('Setting up articles database...');

    // 1. Run the creation SQL
    const sqlPath = path.join(__dirname, 'create-articles-system.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Remove COMMIT; as it might cause issues if not in a transaction block managed by us
    // But actually, let's just try running it.
    
    console.log('Executing create-articles-system.sql...');
    await query(sqlContent);
    console.log('Articles table created/verified.');

    // 2. Add new columns
    console.log('Adding video_url and attachment_url columns...');
    await query(`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS video_url TEXT,
      ADD COLUMN IF NOT EXISTS attachment_url TEXT;
    `);
    console.log('Columns added successfully.');

  } catch (error) {
    console.error('Error setting up articles DB:', error);
    process.exit(1);
  }
}

setupArticlesDb();
