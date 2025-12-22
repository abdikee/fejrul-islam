import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get recent activity from multiple sources
    const [
      recentUsers,
      recentSubmissions,
      recentAnnouncements,
      recentProgress
    ] = await Promise.all([
      // Recent user registrations
      query(`
        SELECT 'user_registration' as type, 
               CONCAT(first_name, ' ', last_name) as description,
               created_at as timestamp,
               role as metadata
        FROM users 
        WHERE created_at > NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC 
        LIMIT 5
      `),
      
      // Recent submissions
      query(`
        SELECT 'submission' as type,
               CONCAT(u.first_name, ' ', u.last_name, ' submitted: ', s.title) as description,
               s.submission_date as timestamp,
               s.submission_type as metadata
        FROM idad_submissions s
        JOIN users u ON s.user_id = u.id
        WHERE s.submission_date > NOW() - INTERVAL '7 days'
        ORDER BY s.submission_date DESC
        LIMIT 5
      `),
      
      // Recent announcements
      query(`
        SELECT 'announcement' as type,
               CONCAT('New announcement: ', title) as description,
               created_at as timestamp,
               announcement_type as metadata
        FROM announcements
        WHERE created_at > NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC
        LIMIT 5
      `),
      
      // Recent progress updates
      query(`
        SELECT 'progress_update' as type,
               CONCAT(u.first_name, ' ', u.last_name, ' updated progress in ', ls.name) as description,
               up.updated_at as timestamp,
               CONCAT(up.progress_percentage, '%') as metadata
        FROM user_progress up
        JOIN users u ON up.user_id = u.id
        JOIN learning_sectors ls ON up.sector_id = ls.id
        WHERE up.updated_at > NOW() - INTERVAL '7 days'
        ORDER BY up.updated_at DESC
        LIMIT 5
      `)
    ]);

    // Combine and sort all activities
    const allActivities = [
      ...recentUsers.rows,
      ...recentSubmissions.rows,
      ...recentAnnouncements.rows,
      ...recentProgress.rows
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
     .slice(0, limit);

    // Get system health metrics
    const [
      dbHealthResult,
      activeSessionsResult,
      errorLogsResult
    ] = await Promise.all([
      // Database health check
      query('SELECT NOW() as db_time'),
      
      // Active sessions (users logged in today)
      query('SELECT COUNT(*) as count FROM users WHERE last_login > CURRENT_DATE'),
      
      // Mock error logs count (you can implement actual error logging)
      Promise.resolve({ rows: [{ count: 0 }] })
    ]);

    const systemHealth = {
      database: dbHealthResult.rows.length > 0 ? 'healthy' : 'error',
      activeSessions: parseInt(activeSessionsResult.rows[0].count),
      errorCount: parseInt(errorLogsResult.rows[0].count),
      uptime: '99.9%', // You can implement actual uptime tracking
      lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Mock last backup
    };

    return NextResponse.json({
      success: true,
      activities: allActivities,
      systemHealth
    });

  } catch (error) {
    console.error('Error fetching admin activity:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch activity data' },
      { status: 500 }
    );
  }
}