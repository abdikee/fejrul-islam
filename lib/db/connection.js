import { Pool } from 'pg';

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'humsj_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'humsj_db',
  password: process.env.DB_PASSWORD || 'humsj_password',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

// Query function wrapper
export const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

export default pool;