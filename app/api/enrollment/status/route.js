import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/middleware.js';
import { checkEnrollmentStatus } from '@/lib/enrollment/enrollmentMiddleware.js';

export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const programType = searchParams.get('type');
    const programId = searchParams.get('id');

    if (!programType) {
      return NextResponse.json(
        { success: false, message: 'Program type is required' },
        { status: 400 }
      );
    }

    const enrollmentStatus = await checkEnrollmentStatus(user.id, programType, programId);

    return NextResponse.json({
      success: true,
      enrolled: enrollmentStatus.enrolled,
      enrollment: enrollmentStatus.enrollment,
      error: enrollmentStatus.error
    });

  } catch (error) {
    console.error('Enrollment status check error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}