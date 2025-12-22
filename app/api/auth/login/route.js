import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/db/utils.js';
import { signJwtToken } from '@/lib/auth/jwt.js';

export async function POST(request) {
  try {
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
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        gender: user.gender,
        role: user.role,
        level: user.level,
        department: user.department,
        academicYear: user.academic_year
      },
      redirectUrl: user.role === 'mentor' ? '/mentor/dashboard' : 
                   user.role === 'admin' ? '/admin/dashboard' : 
                   `/dashboard/${user.gender}`
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
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}