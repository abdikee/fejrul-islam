import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db/utils.js';
import { signJwtToken } from '@/lib/auth/jwt.js';
import { generateOTP, sendOTPEmail } from '@/lib/email/emailService.js';
import { createOTPVerification } from '@/lib/db/verificationUtils.js';

export async function POST(request) {
  try {
    const { 
      email, 
      password, 
      confirmPassword,
      firstName, 
      lastName, 
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
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
    if (email.includes('mentor') || email.includes('ustadh') || email.includes('teacher')) {
      role = 'mentor';
    }

    // Create user
    const userData = {
      email: email.toLowerCase().trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      department: department?.trim() || null,
      academicYear: academicYear ? parseInt(academicYear) : null,
      role
    };

    const newUser = await createUser(userData);

    // Email verification disabled - users can access immediately
    // If you want to enable it later, uncomment the code below:
    /*
    const otp = generateOTP();
    await createOTPVerification(newUser.id, otp);
    const emailResult = await sendOTPEmail(newUser.email, otp, newUser.first_name);
    */

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
      requiresVerification: false, // Changed to false
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
        emailVerified: true // Set to true by default
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
    
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Internal server error: ${error.message}`
      : 'Internal server error';
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}