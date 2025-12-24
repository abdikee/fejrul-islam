import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/middleware';
import { generateSMSOTP, sendSMSOTP, checkSMSRateLimit } from '@/lib/sms/smsService';
import { createPhoneOTPVerification, isPhoneNumberTaken, getRecentPhoneVerificationAttempts } from '@/lib/db/phoneVerificationUtils';
import { normalizeAndValidatePhone } from '@/lib/validation/contact';

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate and normalize phone number
    const phoneValidation = normalizeAndValidatePhone(phoneNumber, 'ET');
    if (!phoneValidation.ok) {
      return NextResponse.json(
        { success: false, message: phoneValidation.message },
        { status: 400 }
      );
    }

    const normalizedPhone = phoneValidation.value;

    // Check if phone number is already taken by another user
    const phoneCheck = await isPhoneNumberTaken(normalizedPhone, user.id);
    if (phoneCheck.taken) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'This phone number is already registered to another account',
          error: 'PHONE_TAKEN'
        },
        { status: 409 }
      );
    }

    // Check rate limiting
    const rateLimit = checkSMSRateLimit(normalizedPhone);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: rateLimit.message,
          error: 'RATE_LIMITED',
          timeLeft: rateLimit.timeLeft
        },
        { status: 429 }
      );
    }

    // Check recent attempts from database
    const recentAttempts = await getRecentPhoneVerificationAttempts(normalizedPhone, 15);
    if (recentAttempts.attempt_count >= 3) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many verification attempts. Please wait 15 minutes before trying again.',
          error: 'TOO_MANY_ATTEMPTS'
        },
        { status: 429 }
      );
    }

    // Generate and send OTP
    const otp = generateSMSOTP();
    
    try {
      const smsResult = await sendSMSOTP(normalizedPhone, otp, user.firstName);
      
      // Store OTP in database
      await createPhoneOTPVerification(user.id, normalizedPhone, otp);
      
      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your phone',
        phoneNumber: normalizedPhone,
        remaining: rateLimit.remaining,
        devOTP: smsResult.devOTP // Only in development
      });

    } catch (smsError) {
      console.error('SMS sending error:', smsError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send verification code. Please try again.',
          error: 'SMS_FAILED'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Send phone OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}