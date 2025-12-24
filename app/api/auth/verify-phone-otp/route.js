import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/middleware';
import { verifyPhoneOTP, updateUserPhoneNumber } from '@/lib/db/phoneVerificationUtils';
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

    const { phoneNumber, otpCode } = await request.json();

    if (!phoneNumber || !otpCode) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP code are required' },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otpCode)) {
      return NextResponse.json(
        { success: false, message: 'OTP must be a 6-digit number' },
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

    // Verify OTP
    const verificationResult = await verifyPhoneOTP(user.id, normalizedPhone, otpCode);

    if (!verificationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: verificationResult.message,
          error: verificationResult.error
        },
        { status: 400 }
      );
    }

    // Update user's phone number if it's different from current
    if (user.phone !== normalizedPhone) {
      const updateResult = await updateUserPhoneNumber(user.id, normalizedPhone);
      if (!updateResult.success) {
        return NextResponse.json(
          { 
            success: false, 
            message: updateResult.message,
            error: updateResult.error
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Phone number verified successfully',
      phoneNumber: normalizedPhone,
      verifiedAt: verificationResult.verifiedAt
    });

  } catch (error) {
    console.error('Verify phone OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}