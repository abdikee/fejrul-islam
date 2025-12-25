import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db/utils.js';
import { signJwtToken } from '@/lib/auth/jwt.js';
import { isValidEmail, normalizeAndValidatePhone, normalizeEmail } from '@/lib/validation/contact.js';
import pool from '@/lib/db/connection.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Production safety checks (avoid confusing DB/JWT errors on Vercel)
    if (process.env.NODE_ENV === 'production') {
      const hasConnectionString = Boolean(
        process.env.DATABASE_URL ||
          process.env.POSTGRES_URL ||
          process.env.POSTGRES_PRISMA_URL ||
          process.env.POSTGRES_URL_NON_POOLING ||
          process.env.NEON_DATABASE_URL
      );
      const dbHost = (process.env.DB_HOST || '').trim();
      const hasDiscreteDbConfig = Boolean(dbHost) && dbHost !== 'localhost' && dbHost !== '127.0.0.1';

      if (!hasConnectionString && !hasDiscreteDbConfig) {
        return NextResponse.json(
          {
            success: false,
            message:
              'Server database is not configured correctly. Please set DATABASE_URL (recommended) or POSTGRES_URL (Vercel/Neon), or DB_HOST/DB_NAME/DB_USER/DB_PASSWORD for production.'
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

    const { 
      email, 
      password, 
      confirmPassword,
      firstName, 
      lastName, 
      phone,
      gender, 
      department, 
      academicYear 
    } = await request.json();

    // Validate input
    if (!email || !password || !firstName || !lastName || !gender) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);
    // Validate email format
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    const phoneCheck = normalizeAndValidatePhone(phone, 'ET');
    if (!phoneCheck.ok) {
      return NextResponse.json(
        { success: false, message: phoneCheck.message },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Validate gender
    if (!['male', 'female'].includes(gender)) {
      return NextResponse.json(
        { success: false, message: 'Gender must be either male or female' },
        { status: 400 }
      );
    }

    // Determine role (for development, we can create mentors by email pattern)
    let role = 'student';
    if (normalizedEmail.includes('mentor') || normalizedEmail.includes('ustadh') || normalizedEmail.includes('teacher')) {
      role = 'mentor';
    }

    // Create user
    const userData = {
      email: normalizedEmail,
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      department: department?.trim() || null,
      academicYear: academicYear ? parseInt(academicYear) : null,
      phone: phoneCheck.value,
      role
    };

    const newUser = await createUser(userData);

    // Verification feature removed: mark the new user as email-verified immediately.
    // Don't reference phone_verified here because older DB schemas may not have that column.
    const verifyResult = await pool.query(
      'UPDATE users SET email_verified = true WHERE id = $1 RETURNING email_verified',
      [newUser.id]
    );
    const verifiedRow = verifyResult.rows?.[0] || {};

    // Create JWT token
    const token = signJwtToken(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role,
        gender: newUser.gender 
      },
      { expiresIn: '7d' }
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      requiresVerification: false,
      redirectUrl:
        role === 'mentor'
          ? '/mentor/dashboard'
          : role === 'admin'
            ? '/admin/dashboard'
            : `/dashboard/${gender}`,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        gender: newUser.gender,
        role: newUser.role,
        level: newUser.level,
        department: newUser.department,
        academicYear: newUser.academic_year,
        phone: newUser.phone,
        emailVerified: verifiedRow.email_verified === true,
        phoneVerified: false
      }
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
    console.error('Signup error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    if (error.message.includes('duplicate key')) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 409 }
      );
    }
    
    const message = String(error?.message || '').toLowerCase();
    const looksLikeDb =
      message.includes('econnrefused') ||
      message.includes('enotfound') ||
      message.includes('password authentication failed') ||
      message.includes('no pg_hba.conf entry') ||
      message.includes('error creating user') ||
      message.includes('postgres') ||
      message.includes('connect');

    // In production, avoid leaking internals but give actionable config hints.
    return NextResponse.json(
      {
        success: false,
        message: looksLikeDb
          ? 'Server database is not configured correctly. Please check production DB environment variables.'
          : process.env.NODE_ENV === 'development'
            ? `Internal server error: ${error.message}`
            : 'Internal server error'
      },
      { status: 500 }
    );
  }
}