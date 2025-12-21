import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getUserById, getUserProgress, getUserMentor } from '@/lib/db/utils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function verifyToken(request) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  try {
    // Verify authentication
    const decoded = await verifyToken(request);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user data
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user progress
    const progress = await getUserProgress(decoded.userId);

    // Get mentor information
    const mentorInfo = await getUserMentor(decoded.userId);

    // Format response
    const userData = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      gender: user.gender,
      department: user.department,
      year: user.academic_year,
      role: user.role,
      level: user.level,
      profilePhoto: user.profile_photo,
      bio: user.bio,
      phone: user.phone,
      enrollmentDate: user.enrollment_date,
      lastLogin: user.last_login,
      progress: progress,
      mentor: mentorInfo ? {
        name: mentorInfo.name,
        contact: mentorInfo.contact
      } : null,
      usrahGroup: mentorInfo?.usrahGroup || null
    };

    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Dashboard user API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}