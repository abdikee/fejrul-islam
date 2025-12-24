import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db/utils.js';
import { signJwtToken } from '@/lib/auth/jwt.js';
import { generateOTP, sendOTPEmail } from '@/lib/email/emailService.js';
import { createOTPVerification } from '@/lib/db/verificationUtils.js';
import { isValidEmail, normalizeAndValidatePhone, normalizeEmail } from '@/lib/validation/contact.js';

export async function POST(request) {
  try {
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

    // Generate email OTP
    const emailOTP = generateOTP();
    await createOTPVerification(newUser.id, emailOTP);
    const emailResult = await sendOTPEmail(newUser.email, emailOTP, newUser.first_name);
    const devEmailOTP = emailResult?.devOTP;

    // If phone number provided, also send SMS OTP for phone verification
    let smsResult = null;
    let devSMSOTP = null;
    if (phoneCheck.value) {
      try {
        const { generateSMSOTP, sendSMSOTP } = await import('@/lib/sms/smsService');
        const { createPhoneOTPVerification } = await import('@/lib/db/phoneVerificationUtils');
        
        const smsOTP = generateSMSOTP();
        await createPhoneOTPVerification(newUser.id, phoneCheck.value, smsOTP);
        smsResult = await sendSMSOTP(phoneCheck.value, smsOTP, newUser.first_name);
        devSMSOTP = smsResult?.devOTP;
      } catch (smsError) {
        console.error('SMS OTP error during signup:', smsError);
        // Don't fail registration if SMS fails
      }
    }

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
      message: 'Account created successfully! Please verify your email to continue.',
      requiresVerification: true,
      devEmailOTP: devEmailOTP,
      devSMSOTP: devSMSOTP,
      phoneVerificationAvailable: !!phoneCheck.value,
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
        emailVerified: false,
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