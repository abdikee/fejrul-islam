import pool from './connection.js';

/**
 * Store SMS OTP code in database
 */
export async function createPhoneOTPVerification(userId, phoneNumber, otp) {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  
  const query = `
    INSERT INTO phone_verifications (user_id, phone_number, otp_code, expires_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id, phone_number, otp_code, expires_at, created_at
  `;
  
  const result = await pool.query(query, [userId, phoneNumber, otp, expiresAt]);
  return result.rows[0];
}

/**
 * Verify SMS OTP code and mark phone as verified
 */
export async function verifyPhoneOTP(userId, phoneNumber, otp) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if OTP is valid and not expired
    const verifyQuery = `
      SELECT id, attempts, is_used
      FROM phone_verifications 
      WHERE user_id = $1 AND phone_number = $2 AND otp_code = $3 
        AND expires_at > NOW() AND is_used = false
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    const verifyResult = await client.query(verifyQuery, [userId, phoneNumber, otp]);
    
    if (verifyResult.rows.length === 0) {
      // Increment attempts for failed verification
      await client.query(`
        UPDATE phone_verifications 
        SET attempts = attempts + 1, updated_at = NOW()
        WHERE user_id = $1 AND phone_number = $2 AND expires_at > NOW()
      `, [userId, phoneNumber]);
      
      await client.query('COMMIT');
      return { 
        success: false, 
        message: 'Invalid or expired OTP code',
        error: 'INVALID_OTP'
      };
    }

    const verification = verifyResult.rows[0];
    
    // Check if too many attempts
    if (verification.attempts >= 3) {
      await client.query('COMMIT');
      return { 
        success: false, 
        message: 'Too many verification attempts. Request a new code.',
        error: 'TOO_MANY_ATTEMPTS'
      };
    }

    // Mark OTP as used and verified
    await client.query(`
      UPDATE phone_verifications 
      SET verified_at = NOW(), is_used = true, updated_at = NOW()
      WHERE id = $1
    `, [verification.id]);

    // Mark user's phone as verified
    await client.query(`
      UPDATE users 
      SET phone_verified = true, updated_at = NOW()
      WHERE id = $1
    `, [userId]);

    await client.query('COMMIT');
    
    return { 
      success: true, 
      message: 'Phone number verified successfully',
      verifiedAt: new Date()
    };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Check if phone number is already verified by another user
 */
export async function isPhoneNumberTaken(phoneNumber, excludeUserId = null) {
  let query = `
    SELECT id, first_name, last_name 
    FROM users 
    WHERE phone = $1 AND phone_verified = true AND is_active = true
  `;
  let params = [phoneNumber];
  
  if (excludeUserId) {
    query += ` AND id != $2`;
    params.push(excludeUserId);
  }
  
  const result = await pool.query(query, params);
  return {
    taken: result.rows.length > 0,
    user: result.rows[0] || null
  };
}

/**
 * Get recent phone verification attempts
 */
export async function getRecentPhoneVerificationAttempts(phoneNumber, windowMinutes = 15) {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
  
  const query = `
    SELECT COUNT(*) as attempt_count,
           MAX(created_at) as last_attempt
    FROM phone_verifications 
    WHERE phone_number = $1 AND created_at > $2
  `;
  
  const result = await pool.query(query, [phoneNumber, windowStart]);
  return result.rows[0];
}

/**
 * Clean up expired phone verifications
 */
export async function cleanupExpiredPhoneVerifications() {
  const query = `
    DELETE FROM phone_verifications 
    WHERE expires_at < NOW() - INTERVAL '1 hour'
    RETURNING COUNT(*) as deleted_count
  `;
  
  const result = await pool.query(query);
  return result.rows[0].deleted_count;
}

/**
 * Get user's phone verification status
 */
export async function getUserPhoneVerificationStatus(userId) {
  const query = `
    SELECT 
      u.phone,
      u.phone_verified,
      pv.phone_number as pending_phone,
      pv.created_at as verification_requested_at,
      pv.expires_at as verification_expires_at,
      pv.attempts
    FROM users u
    LEFT JOIN phone_verifications pv ON u.id = pv.user_id 
      AND pv.expires_at > NOW() 
      AND pv.is_used = false
    WHERE u.id = $1
    ORDER BY pv.created_at DESC
    LIMIT 1
  `;
  
  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
}

/**
 * Update user's phone number (requires re-verification)
 */
export async function updateUserPhoneNumber(userId, newPhoneNumber) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if phone is already taken
    const phoneCheck = await isPhoneNumberTaken(newPhoneNumber, userId);
    if (phoneCheck.taken) {
      await client.query('ROLLBACK');
      return {
        success: false,
        message: 'This phone number is already registered to another account',
        error: 'PHONE_TAKEN'
      };
    }
    
    // Update user's phone and mark as unverified
    await client.query(`
      UPDATE users 
      SET phone = $1, phone_verified = false, updated_at = NOW()
      WHERE id = $2
    `, [newPhoneNumber, userId]);
    
    // Invalidate any existing phone verifications for this user
    await client.query(`
      UPDATE phone_verifications 
      SET is_used = true, updated_at = NOW()
      WHERE user_id = $1 AND is_used = false
    `, [userId]);
    
    await client.query('COMMIT');
    
    return {
      success: true,
      message: 'Phone number updated. Please verify your new number.',
      requiresVerification: true
    };
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}