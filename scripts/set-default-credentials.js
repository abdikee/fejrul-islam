#!/usr/bin/env node

import bcrypt from 'bcryptjs';
import pool from '../lib/db/connection.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'abdikedir@gmail.com';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Abdike';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';

const MENTOR_EMAIL = process.env.MENTOR_EMAIL || 'abdurehman@gmail.com';
const MENTOR_NAME = process.env.MENTOR_NAME || 'Abdurahman';
const MENTOR_PASSWORD = process.env.MENTOR_PASSWORD || 'password123';

async function findTargetUserId({ role, preferredEmail }) {
  if (preferredEmail) {
    const byEmail = await pool.query(
      `SELECT id FROM users WHERE role = $1 AND email = $2 LIMIT 1`,
      [role, preferredEmail]
    );
    if (byEmail.rows[0]?.id) return byEmail.rows[0].id;
  }

  const byRole = await pool.query(
    `SELECT id FROM users WHERE role = $1 ORDER BY created_at ASC LIMIT 1`,
    [role]
  );
  return byRole.rows[0]?.id || null;
}

async function ensureEmailAvailable({ email, excludeUserId }) {
  const existing = await pool.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );

  if (existing.rows.length === 0) return;
  if (excludeUserId && existing.rows[0].id === excludeUserId) return;
  throw new Error(`Email already in use: ${email}`);
}

async function updateUser({ role, fromEmail, toEmail, firstName, password }) {
  const targetUserId = await findTargetUserId({ role, preferredEmail: fromEmail });
  if (!targetUserId) return { updated: false, user: null };

  await ensureEmailAvailable({ email: toEmail, excludeUserId: targetUserId });
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
      UPDATE users
      SET email = $1,
          first_name = $2,
          password_hash = $3,
          email_verified = true
      WHERE id = $4 AND role = $5
      RETURNING id, email, first_name, last_name, role
    `,
    [toEmail, firstName, passwordHash, targetUserId, role]
  );

  if (result.rows.length > 0) {
    return { updated: true, user: result.rows[0], usedFallback: fromEmail ? false : true };
  }

  return { updated: false, user: null };
}

async function main() {
  try {
    console.log('🔐 Updating default credentials...');

    await pool.query('BEGIN');

    const adminResult = await updateUser({
      role: 'admin',
      fromEmail: process.env.ADMIN_FROM_EMAIL || 'admin@humsj.edu',
      toEmail: ADMIN_EMAIL,
      firstName: ADMIN_NAME,
      password: ADMIN_PASSWORD
    });

    const mentorResult = await updateUser({
      role: 'mentor',
      fromEmail: process.env.MENTOR_FROM_EMAIL || 'sheikh.abdullah@humsj.edu',
      toEmail: MENTOR_EMAIL,
      firstName: MENTOR_NAME,
      password: MENTOR_PASSWORD
    });

    await pool.query('COMMIT');

    if (!adminResult.updated) {
      console.error('❌ No admin user found to update.');
      process.exitCode = 1;
    } else {
      console.log(
        `✅ Admin updated: ${adminResult.user.email} (${adminResult.user.first_name} ${adminResult.user.last_name})`
      );
    }

    if (!mentorResult.updated) {
      console.error('❌ No mentor user found to update.');
      process.exitCode = 1;
    } else {
      console.log(
        `✅ Mentor updated: ${mentorResult.user.email} (${mentorResult.user.first_name} ${mentorResult.user.last_name})`
      );
    }

    console.log('✅ Done.');
  } catch (error) {
    try {
      await pool.query('ROLLBACK');
    } catch {
      // ignore
    }
    console.error('❌ Failed to update credentials:', error?.message || error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
