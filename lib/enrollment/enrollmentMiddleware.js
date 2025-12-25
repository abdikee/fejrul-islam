import { verifyAuth } from '@/lib/auth/middleware.js';
import { NextResponse } from 'next/server';

/**
 * Middleware to handle enrollment access control
 * Redirects unauthenticated users to login/register
 * Routes authenticated users to appropriate portals
 */
export async function requireAuthForEnrollment(request, options = {}) {
  const { 
    requireRole = null, 
    redirectTo = null,
    allowedRoles = ['student', 'mentor', 'admin']
  } = options;

  try {
    const user = await verifyAuth(request);
    
    if (!user) {
      // User not authenticated - redirect to login with return URL
      const returnUrl = encodeURIComponent(request.url);
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('returnUrl', returnUrl);
      
      return NextResponse.redirect(loginUrl);
    }

    // Check role requirements
    if (requireRole && user.role !== requireRole) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    // Redirect to appropriate portal if specified
    if (redirectTo) {
      const redirectUrl = getPortalRedirect(user, redirectTo);
      if (redirectUrl) {
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }

    return { user, authenticated: true };

  } catch (error) {
    console.error('Enrollment auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication error' },
      { status: 500 }
    );
  }
}

/**
 * Get appropriate portal redirect based on user role and request
 */
function getPortalRedirect(user, requestType) {
  const portalMap = {
    'student': {
      'idad': `/dashboard/${user.gender}/sectors/tarbiya-idad`,
      'qirat': `/dashboard/${user.gender}/qirat`,
      'course': `/dashboard/${user.gender}/courses`,
      'default': `/dashboard/${user.gender}`
    },
    'mentor': {
      'idad': '/mentor/sectors',
      'qirat': '/mentor/sectors',
      'course': '/mentor/courses',
      'default': '/mentor/dashboard'
    },
    'admin': {
      'default': '/admin/dashboard'
    }
  };

  const userPortals = portalMap[user.role];
  return userPortals ? (userPortals[requestType] || userPortals.default) : null;
}

/**
 * Check if user is enrolled in a specific program/course
 */
export async function checkEnrollmentStatus(userId, programType, programId) {
  try {
    const { query } = await import('@/lib/db/connection.js');
    
    let enrollmentQuery;
    let params;

    switch (programType) {
      case 'sector':
        // First get sector ID by code
        const sectorQuery = `
          SELECT id FROM sectors 
          WHERE code = $1
        `;
        const sectorResult = await query(sectorQuery, [programId]);
        
        if (sectorResult.rows.length === 0) {
          return { enrolled: false, error: `Sector not found: ${programId}` };
        }
        
        const sectorId = sectorResult.rows[0].id;
        
        enrollmentQuery = `
          SELECT * FROM student_sector_enrollments 
          WHERE user_id = $1 AND sector_id = $2 AND sector_status = 'active'
        `;
        params = [userId, sectorId];
        break;
        
      case 'course':
        enrollmentQuery = `
          SELECT * FROM course_enrollments 
          WHERE user_id = $1 AND course_id = $2 AND status = 'active'
        `;
        params = [userId, programId];
        break;
        
      case 'qirat':
        enrollmentQuery = `
          SELECT * FROM qirat_enrollments 
          WHERE user_id = $1 AND status = 'active'
        `;
        params = [userId];
        break;
        
      default:
        return { enrolled: false, error: 'Invalid program type' };
    }

    const result = await query(enrollmentQuery, params);
    return { 
      enrolled: result.rows.length > 0, 
      enrollment: result.rows[0] || null 
    };

  } catch (error) {
    console.error('Enrollment status check error:', error);
    return { enrolled: false, error: error.message };
  }
}

/**
 * Create enrollment record
 */
export async function createEnrollment(userId, programType, programId, enrollmentData = {}) {
  try {
    const { query } = await import('@/lib/db/connection.js');
    
    let insertQuery;
    let params;

    switch (programType) {
      case 'sector':
        // First get sector ID by code
        const sectorQuery = `
          SELECT id FROM sectors 
          WHERE code = $1
        `;
        const sectorResult = await query(sectorQuery, [programId]);
        
        if (sectorResult.rows.length === 0) {
          throw new Error(`Sector not found: ${programId}`);
        }
        
        const sectorId = sectorResult.rows[0].id;
        
        insertQuery = `
          INSERT INTO student_sector_enrollments (
            user_id, sector_id, sector_status, enrollment_date, 
            motivation, study_hours_per_week, previous_knowledge
          )
          VALUES ($1, $2, 'active', NOW(), $3, $4, $5)
          ON CONFLICT (user_id, sector_id) 
          DO UPDATE SET 
            sector_status = 'active',
            enrollment_date = NOW(),
            updated_at = NOW()
          RETURNING *
        `;
        params = [
          userId, 
          sectorId, 
          enrollmentData.goals || 'Enrolled from homepage',
          enrollmentData.commitment || '2-4 hours',
          enrollmentData.level || 'beginner'
        ];
        break;
        
      case 'course':
        insertQuery = `
          INSERT INTO course_enrollments (user_id, course_id, status, enrolled_at, progress)
          VALUES ($1, $2, 'active', NOW(), 0)
          RETURNING *
        `;
        params = [userId, programId];
        break;
        
      case 'qirat':
        insertQuery = `
          INSERT INTO qirat_enrollments (
            user_id, level, recitation_style, preferred_schedule, 
            goals, status, enrolled_at
          )
          VALUES ($1, $2, $3, $4, $5, 'active', NOW())
          RETURNING *
        `;
        params = [
          userId,
          enrollmentData.level || 'beginner',
          enrollmentData.recitationStyle || 'hafs',
          enrollmentData.preferredSchedule || 'flexible',
          enrollmentData.goals || ''
        ];
        break;
        
      default:
        throw new Error('Invalid program type');
    }

    const result = await query(insertQuery, params);
    return { success: true, enrollment: result.rows[0] };

  } catch (error) {
    console.error('Create enrollment error:', error);
    return { success: false, error: error.message };
  }
}