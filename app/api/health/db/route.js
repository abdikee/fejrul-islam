import { NextResponse } from 'next/server';
import pool, { query } from '@/lib/db/connection.js';

function sanitizeHost(host) {
  if (!host) return null;
  return host.replace(/\s+/g, '');
}

function summarizeDatabaseUrl(databaseUrl) {
  if (!databaseUrl) return null;
  try {
    const url = new URL(databaseUrl);
    return {
      protocol: url.protocol,
      host: url.hostname,
      port: url.port || null,
      database: url.pathname?.replace(/^\//, '') || null,
      hasUser: Boolean(url.username),
      sslmode: url.searchParams.get('sslmode'),
    };
  } catch {
    return { parseError: true };
  }
}

export async function GET() {
  const nodeEnv = process.env.NODE_ENV;
  const databaseUrl = process.env.DATABASE_URL;
  const dbHost = sanitizeHost(process.env.DB_HOST);
  const dbSsl = process.env.DB_SSL;
  const jwtSecretSet = Boolean(process.env.JWT_SECRET);

  const configSummary = {
    nodeEnv,
    jwtSecretSet,
    dbSsl,
    hasDatabaseUrl: Boolean(databaseUrl),
    databaseUrl: summarizeDatabaseUrl(databaseUrl),
    dbHost: dbHost || null,
    hasDiscreteDbConfig: Boolean(dbHost) && dbHost !== 'localhost' && dbHost !== '127.0.0.1',
  };

  let db = { canConnect: false };

  try {
    // Lightweight connectivity check
    await query('SELECT 1 as ok');
    db = { canConnect: true };
  } catch (error) {
    const message = String(error?.message || 'unknown');
    db = {
      canConnect: false,
      errorType: error?.code || error?.name || 'unknown',
      message: message.slice(0, 200),
    };
  }

  // Don't expose full pool internals, just whether it exists.
  const runtime = {
    hasPool: Boolean(pool),
  };

  return NextResponse.json({ ok: true, config: configSummary, db, runtime });
}
