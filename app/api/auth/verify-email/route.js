import { NextResponse } from 'next/server';
import { verifyEmailToken } from '@/lib/db/verificationUtils.js';
import { signJwtToken } from '@/lib/auth/jwt.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Verify the token
    const result = await verifyEmailToken(token);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // Create JWT token for auto-login
    const jwtToken = signJwtToken(
      { 
        userId: result.user.id, 
        email: result.user.email, 
        role: result.user.role,
        gender: result.user.gender 
      },
      { expiresIn: '7d' }
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now access your account.',
      user: result.user
    });

    // Set HTTP-only cookie for auto-login
    response.cookies.set('auth-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
