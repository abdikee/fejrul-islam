import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    // Get system statistics
    const [
      totalUsersResult,
      activeUsersResult,
      totalCoursesResult,
      totalAnnouncementsResult,
      recentRegistrationsResult,
      usersByRoleResult,
      usersByDepartmentResult,
      progressStatsResult
    ] = await Promise.all([
      // Total users
      query('SELECT COUNT(*) as count FROM users WHERE is_active = true'),
      
      // Active users (logged in within last 30 days)
      query('SELECT COUNT(*) as count FROM users WHERE last_login > NOW() - INTERVAL \'30 days\' AND is_active = true'),
      
      // Total courses
      query('SELECT COUNT(*) as count FROM courses WHERE is_active = true'),
      
      // Total announcements
      query('SELECT COUNT(*) as count FROM announcements WHERE is_active = true'),
      
      // Recent registrations (last 7 days)
      query('SELECT COUNT(*) as count FROM users WHERE created_at > NOW() - INTERVAL \'7 days\''),
      
      // Users by role
      query('SELECT role, COUNT(*) as count FROM users WHERE is_active = true GROUP BY role'),
      
      // Users by department
      query('SELECT department, COUNT(*) as count FROM users WHERE is_active = true AND department IS NOT NULL GROUP BY department ORDER BY count DESC LIMIT 10'),
      
      // Progress statistics
      query('SELECT AVG(progress_percentage) as avg_progress, COUNT(*) as total_enrollments FROM user_progress')
    ]);

    const stats = {
      totalUsers: parseInt(totalUsersResult.rows[0].count),
      activeUsers: parseInt(activeUsersResult.rows[0].count),
      totalCourses: parseInt(totalCoursesResult.rows[0].count),
      totalAnnouncements: parseInt(totalAnnouncementsResult.rows[0].count),
      recentRegistrations: parseInt(recentRegistrationsResult.rows[0].count),
      usersByRole: usersByRoleResult.rows,
      usersByDepartment: usersByDepartmentResult.rows,
      averageProgress: parseFloat(progressStatsResult.rows[0].avg_progress || 0),
      totalEnrollments: parseInt(progressStatsResult.rows[0].total_enrollments || 0)
    };

    return NextResponse.json({ success: true, stats });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}