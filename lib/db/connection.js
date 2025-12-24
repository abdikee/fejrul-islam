import { Pool } from 'pg';

function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.NEON_DATABASE_URL ||
    null
  );
}

function getSslConfig() {
  const sslOverride = process.env.DB_SSL;
  if (sslOverride === 'false' || sslOverride === '0') return false;
  if (process.env.NODE_ENV !== 'production') return false;
  return { rejectUnauthorized: false };
}

function getPoolConfig() {
  const connectionString = getConnectionString();

  if (connectionString) {
    return {
      connectionString,
      ssl: getSslConfig(),
    };
  }

  return {
    user: process.env.DB_USER || 'humsj_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'humsj_db',
    password: process.env.DB_PASSWORD || 'humsj_password',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    ssl: getSslConfig(),
  };
}

// Create/reuse connection pool (important for serverless)
const globalForPg = globalThis;
const pool = globalForPg.__pgPool || new Pool(getPoolConfig());
if (!globalForPg.__pgPool) globalForPg.__pgPool = pool;

if (process.env.NODE_ENV !== 'production') {
  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });
}

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