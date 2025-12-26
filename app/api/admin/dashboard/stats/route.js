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

    // Get comprehensive dashboard statistics
    const [
      usersStats,
      usersPrevPeriod,
      coursesStats,
      coursesPrevPeriod,
      resourcesStats,
      resourcesPrevPeriod,
      announcementsStats,
      sectorsStats,
      recentActivity
    ] = await Promise.all([
      // Users statistics
      query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN last_login > NOW() - INTERVAL '30 days' THEN 1 END) as active_users,
          COUNT(CASE WHEN role = 'student' THEN 1 END) as total_students,
          COUNT(CASE WHEN role = 'mentor' THEN 1 END) as total_mentors,
          COUNT(CASE WHEN gender = 'male' THEN 1 END) as male_users,
          COUNT(CASE WHEN gender = 'female' THEN 1 END) as female_users,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_users_month
        FROM users WHERE role != 'admin'
      `),

      // Previous 30-day window users
      query(`
        SELECT
          COUNT(CASE WHEN created_at <= NOW() - INTERVAL '30 days'
                    AND created_at > NOW() - INTERVAL '60 days' THEN 1 END) as new_users_prev_month
        FROM users WHERE role != 'admin'
      `),
      
      // Courses statistics
      query(`
        SELECT 
          COUNT(*) as total_courses,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_courses,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_courses_month,
          AVG(duration_weeks) as avg_duration
        FROM courses
      `),

      // Previous 30-day window courses
      query(`
        SELECT
          COUNT(CASE WHEN created_at <= NOW() - INTERVAL '30 days'
                    AND created_at > NOW() - INTERVAL '60 days' THEN 1 END) as new_courses_prev_month
        FROM courses
      `),
      
      // Resources statistics
      query(`
        SELECT 
          COUNT(*) as total_resources,
          COALESCE(SUM(download_count), 0) as total_downloads,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_resources_month,
          COALESCE(SUM(file_size), 0) as total_storage_bytes
        FROM resources
      `)

      ,

      // Previous 30-day window resources
      query(`
        SELECT
          COUNT(CASE WHEN created_at <= NOW() - INTERVAL '30 days'
                    AND created_at > NOW() - INTERVAL '60 days' THEN 1 END) as new_resources_prev_month
        FROM resources
      `),

      // Announcements statistics
      query(`
        SELECT
          COUNT(*) as total_announcements,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_announcements,
          COUNT(CASE WHEN is_active = true AND priority = 'urgent' THEN 1 END) as urgent_announcements
        FROM announcements
      `),

      // Sector content distribution
      query(`
        SELECT
          ls.id,
          ls.name,
          ls.color,
          COUNT(DISTINCT c.id) as course_count,
          COUNT(DISTINCT r.id) as resource_count
        FROM learning_sectors ls
        LEFT JOIN courses c ON c.sector_id = ls.id
        LEFT JOIN resources r ON r.sector_id = ls.id
        GROUP BY ls.id, ls.name, ls.color
        ORDER BY ls.name
      `),

      // Recent activity (best-effort from audit_logs if present)
      query(`
        SELECT
          action_type as activity_type,
          action_description as description,
          created_at as activity_time,
          COALESCE((metadata->>'status'), 'info') as status,
          COALESCE((metadata->>'audience'), 'system') as gender
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT 15
      `)
    ]);

    const safeGrowthRate = (currentValue, previousValue) => {
      const current = Number(currentValue) || 0;
      const previous = Number(previousValue) || 0;
      if (previous <= 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };
    
    // Format storage size
    const formatBytes = (bytes) => {
      if (!bytes) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const stats = {
      users: {
        total: parseInt(usersStats.rows[0].total_users),
        active: parseInt(usersStats.rows[0].active_users),
        students: parseInt(usersStats.rows[0].total_students),
        mentors: parseInt(usersStats.rows[0].total_mentors),
        male: parseInt(usersStats.rows[0].male_users),
        female: parseInt(usersStats.rows[0].female_users),
        newThisMonth: parseInt(usersStats.rows[0].new_users_month),
        growthRate: safeGrowthRate(
          usersStats.rows[0].new_users_month,
          usersPrevPeriod.rows[0]?.new_users_prev_month
        )
      },
      courses: {
        total: parseInt(coursesStats.rows[0].total_courses),
        active: parseInt(coursesStats.rows[0].active_courses),
        newThisMonth: parseInt(coursesStats.rows[0].new_courses_month),
        averageDuration: parseFloat(coursesStats.rows[0].avg_duration || 0).toFixed(1),
        growthRate: safeGrowthRate(
          coursesStats.rows[0].new_courses_month,
          coursesPrevPeriod.rows[0]?.new_courses_prev_month
        )
      },
      resources: {
        total: parseInt(resourcesStats.rows[0].total_resources),
        totalDownloads: parseInt(resourcesStats.rows[0].total_downloads || 0),
        newThisMonth: parseInt(resourcesStats.rows[0].new_resources_month),
        totalStorage: formatBytes(parseInt(resourcesStats.rows[0].total_storage_bytes || 0)),
        storageBytes: parseInt(resourcesStats.rows[0].total_storage_bytes || 0),
        growthRate: safeGrowthRate(
          resourcesStats.rows[0].new_resources_month,
          resourcesPrevPeriod.rows[0]?.new_resources_prev_month
        )
      },
      announcements: {
        total: parseInt(announcementsStats.rows[0].total_announcements),
        active: parseInt(announcementsStats.rows[0].active_announcements),
        urgent: parseInt(announcementsStats.rows[0].urgent_announcements)
      },
      sectors: sectorsStats.rows.map(sector => ({
        id: sector.id,
        name: sector.name,
        color: sector.color,
        courseCount: parseInt(sector.course_count),
        resourceCount: parseInt(sector.resource_count),
        totalContent: parseInt(sector.course_count) + parseInt(sector.resource_count)
      })),
      recentActivity: recentActivity.rows.map(activity => ({
        type: activity.activity_type,
        description: activity.description,
        time: activity.activity_time,
        status: activity.status,
        audience: activity.gender
      })),
      systemHealth: {
        database: 'healthy',
        storage: 'healthy',
        api: 'healthy',
        users: 'healthy'
      },
      overview: {
        totalContent: parseInt(coursesStats.rows[0].total_courses) + parseInt(resourcesStats.rows[0].total_resources),
        totalEngagement: parseInt(resourcesStats.rows[0].total_downloads || 0),
        systemUptime: null,
        lastBackup: null
      }
    };

    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}