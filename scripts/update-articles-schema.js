import { query } from '../lib/db/connection.js';

async function updateArticlesSchema() {
  try {
    console.log('Adding video_url and attachment_url columns to articles table...');
    
    await query(`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS video_url TEXT,
      ADD COLUMN IF NOT EXISTS attachment_url TEXT;
    `);

    console.log('Successfully updated articles table schema.');
  } catch (error) {
    console.error('Error updating articles schema:', error);
    process.exit(1);
  }
}

updateArticlesSchema();
