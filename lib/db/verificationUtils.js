// Database utilities for email verification
import pool from './connection.js';

/**
 * Store OTP code in database
 */
export async function createOTPVerification(userId, otp) {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  
  const query = `
    INSERT INTO email_verifications (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      token = $2,
      expires_at = $3,
      created_at = NOW(),
      verified_at = NULL
    RETURNING *
  `;
  
  const result = await pool.query(query, [userId, otp, expiresAt]);
  return result.rows[0];
}

/**
 * Verify OTP code and mark email as verified
 */
export async function verifyOTP(userId, otp) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Find verification record
    const verifyQuery = `
      SELECT ev.*, u.email, u.first_name, u.last_name, u.role, u.gender
      FROM email_verifications ev
      JOIN users u ON ev.user_id = u.id
      WHERE ev.user_id = $1 AND ev.token = $2 AND ev.expires_at > NOW() AND ev.verified_at IS NULL
    `;
    
    const verifyResult = await client.query(verifyQuery, [userId, otp]);
    
    if (verifyResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return {
        success: false,
        message: 'Invalid or expired verification code'
      };
    }
    
    const verification = verifyResult.rows[0];
    
    // Mark email as verified
    await client.query(
      'UPDATE users SET email_verified = true WHERE id = $1',
      [verification.user_id]
    );
    
    // Mark verification as completed
    await client.query(
      'UPDATE email_verifications SET verified_at = NOW() WHERE id = $1',
      [verification.id]
    );
    
    await client.query('COMMIT');
    
    return {
      success: true,
      message: 'Email verified successfully',
      user: {
        id: verification.user_id,
        email: verification.email,
        firstName: verification.first_name,
        lastName: verification.last_name,
        role: verification.role,
        gender: verification.gender
      }
    };
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Verify an email token without requiring an authenticated user.
 * This is used by the link-based flow: /api/auth/verify-email?token=...
 *
 * NOTE: In this codebase, the token is the same OTP stored in email_verifications.
 */
export async function verifyEmailToken(token) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const verifyQuery = `
      SELECT ev.*, u.email, u.first_name, u.last_name, u.role, u.gender
      FROM email_verifications ev
      JOIN users u ON ev.user_id = u.id
      WHERE ev.token = $1 AND ev.expires_at > NOW() AND ev.verified_at IS NULL
      ORDER BY ev.created_at DESC
      LIMIT 1
    `;

    const verifyResult = await client.query(verifyQuery, [String(token).trim()]);

    if (verifyResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return { success: false, message: 'Invalid or expired verification token' };
    }

    const verification = verifyResult.rows[0];

    await client.query(
      'UPDATE users SET email_verified = true WHERE id = $1',
      [verification.user_id]
    );

    await client.query(
      'UPDATE email_verifications SET verified_at = NOW() WHERE id = $1',
      [verification.id]
    );

    await client.query('COMMIT');

    return {
      success: true,
      message: 'Email verified successfully',
      user: {
        id: verification.user_id,
        email: verification.email,
        firstName: verification.first_name,
        lastName: verification.last_name,
        role: verification.role,
        gender: verification.gender
      }
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Check if user's email is verified
 */
export async function isEmailVerified(userId) {
  const query = 'SELECT email_verified FROM users WHERE id = $1';
  const result = await pool.query(query, [userId]);
  
  if (result.rows.length === 0) {
    return false;
  }
  
  return result.rows[0].email_verified === true;
}

/**
 * Resend verification email
 */
export async function canResendVerification(userId) {
  const query = `
    SELECT created_at 
    FROM email_verifications 
    WHERE user_id = $1 
    ORDER BY created_at DESC 
    LIMIT 1
  `;
  
  const result = await pool.query(query, [userId]);
  
  if (result.rows.length === 0) {
    return true; // No previous verification sent
  }
  
  const lastSent = new Date(result.rows[0].created_at);
  const now = new Date();
  const minutesSinceLastSend = (now - lastSent) / (1000 * 60);
  
  // Allow resend after 2 minutes
  return minutesSinceLastSend >= 2;
}
