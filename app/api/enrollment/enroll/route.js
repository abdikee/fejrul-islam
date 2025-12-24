import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/middleware.js';
import { createEnrollment, checkEnrollmentStatus } from '@/lib/enrollment/enrollmentMiddleware.js';

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { programType, programId, enrollmentData } = await request.json();

    console.log('Enrollment request:', { programType, programId, enrollmentData, userId: user.id });

    if (!programType) {
      return NextResponse.json(
        { success: false, message: 'Program type is required' },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await checkEnrollmentStatus(user.id, programType, programId);
    
    console.log('Existing enrollment check:', existingEnrollment);
    
    if (existingEnrollment.enrolled) {
      return NextResponse.json(
        { success: false, message: 'Already enrolled in this program' },
        { status: 400 }
      );
    }

    // Create new enrollment
    const result = await createEnrollment(user.id, programType, programId, enrollmentData);

    console.log('Enrollment result:', result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Enrollment successful',
        enrollment: result.enrollment
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Enrollment creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}