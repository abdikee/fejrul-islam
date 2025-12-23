import { NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/db/verificationUtils.js';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export async function POST(request) {
  try {
    const { otp } = await request.json();

    if (!otp) {
      return NextResponse.json(
        { success: false, message: 'Verification code is required' },
        { status: 400 }
      );
    }

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

    // Verify the OTP
    const result = await verifyOTP(decoded.userId, otp.trim());

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You now have full access to your account.',
      user: result.user
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
