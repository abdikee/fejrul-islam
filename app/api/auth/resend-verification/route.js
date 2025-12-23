import { NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth/jwt.js';
import { canResendVerification, createOTPVerification } from '@/lib/db/verificationUtils.js';
import { generateOTP, sendOTPEmail } from '@/lib/email/emailService.js';
import pool from '@/lib/db/connection.js';

export async function POST(request) {
  try {
    // Get user from auth token
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyJwtToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Check if user can resend (rate limiting)
    const canResend = await canResendVerification(decoded.userId);
    
    if (!canResend) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please wait at least 2 minutes before requesting another verification email' 
        },
        { status: 429 }
      );
    }

    // Get user details
    const userQuery = 'SELECT id, email, first_name, email_verified FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [decoded.userId]);
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json(
        { success: false, message: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new OTP code
    const otp = generateOTP();
    await createOTPVerification(user.id, otp);

    // Send OTP email
    const emailResult = await sendOTPEmail(user.email, otp, user.first_name);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully. Please check your inbox.',
      devOTP: emailResult.devOTP
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while sending verification email' },
      { status: 500 }
    );
  }
}
