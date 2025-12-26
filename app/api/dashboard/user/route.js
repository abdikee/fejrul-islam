import { NextResponse } from 'next/server';
import { getUserById, getUserProgress, getUserMentor } from '@/lib/db/utils';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

async function verifyToken(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = verifyJwtToken(token);
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
        id: mentorInfo.id,
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

export async function PATCH(request) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { profilePhoto } = body || {};

    if (typeof profilePhoto !== 'string') {
      return NextResponse.json({ error: 'profilePhoto is required' }, { status: 400 });
    }

    // Basic size guard (data URLs can get large). ~2MB chars is plenty for small avatars.
    if (profilePhoto.length > 2_000_000) {
      return NextResponse.json(
        { error: 'Profile photo is too large. Please upload a smaller image.' },
        { status: 413 }
      );
    }

    try {
      await query(
        `UPDATE users SET profile_photo = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [profilePhoto, decoded.userId]
      );
    } catch (dbError) {
      // Common failure when the DB column is still VARCHAR(255)
      // but the app sends a base64 data URL.
      if (dbError?.code === '22001') {
        return NextResponse.json(
          {
            error:
              'Profile photo is too large for the current database schema. Run scripts/alter-users-profile-photo-to-text.sql to expand users.profile_photo, then try again.',
          },
          { status: 413 }
        );
      }
      throw dbError;
    }

    const user = await getUserById(decoded.userId);

    return NextResponse.json({
      success: true,
      profilePhoto: user?.profile_photo || null
    });
  } catch (error) {
    console.error('Dashboard user PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}