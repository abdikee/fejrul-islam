import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/db/utils.js';
import { signJwtToken } from '@/lib/auth/jwt.js';

export async function POST(request) {
  try {
    // Production safety checks (avoid confusing DB connection errors on Vercel)
    if (process.env.NODE_ENV === 'production') {
      const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
      const dbHost = (process.env.DB_HOST || '').trim();
      const hasDiscreteDbConfig = Boolean(dbHost) && dbHost !== 'localhost' && dbHost !== '127.0.0.1';

      if (!hasDatabaseUrl && !hasDiscreteDbConfig) {
        return NextResponse.json(
          {
            success: false,
            message:
              'Server database is not configured correctly. Please set DATABASE_URL (recommended) or DB_HOST/DB_NAME/DB_USER/DB_PASSWORD for production.'
          },
          { status: 500 }
        );
      }

      if (!process.env.JWT_SECRET) {
        return NextResponse.json(
          {
            success: false,
            message: 'Server authentication is not configured correctly. Please set JWT_SECRET in production.'
          },
          { status: 500 }
        );
      }
    }

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = signJwtToken(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        gender: user.gender 
      },
      { expiresIn: '7d' }
    );

    // Create response
    const requiresVerification = user.email_verified !== true;

    const response = NextResponse.json({
      success: true,
      message: requiresVerification ? 'Login successful. Please verify your email to continue.' : 'Login successful',
      requiresVerification,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        gender: user.gender,
        role: user.role,
        level: user.level,
        department: user.department,
        academicYear: user.academic_year,
        emailVerified: user.email_verified === true
      },
      redirectUrl: requiresVerification
        ? '/auth/verify-email'
        : user.role === 'mentor'
          ? '/mentor/dashboard'
          : user.role === 'admin'
            ? '/admin/dashboard'
            : `/dashboard/${user.gender}`
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days (seconds)
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);

    const message = String(error?.message || '').toLowerCase();
    const looksLikeDb =
      message.includes('econnrefused') ||
      message.includes('enotfound') ||
      message.includes('password authentication failed') ||
      message.includes('no pg_hba.conf entry') ||
      message.includes('error authenticating user') ||
      message.includes('postgres') ||
      message.includes('connect');

    return NextResponse.json(
      {
        success: false,
        message: looksLikeDb
          ? 'Server database is not configured correctly. Please check production DB environment variables.'
          : 'Internal server error'
      },
      { status: 500 }
    );
  }
}