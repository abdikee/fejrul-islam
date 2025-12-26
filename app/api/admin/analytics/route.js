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

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '30d'; // 7d, 30d, 90d, 1y
    const metric = searchParams.get('metric') || 'all'; // users, content, engagement, system

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    let analytics = {};

    // User Analytics
    if (metric === 'all' || metric === 'users') {
      const [userGrowth, userActivity, userDemographics] = await Promise.all([
        // User growth over time
        query(`
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as new_users,
            COUNT(CASE WHEN gender = 'male' THEN 1 END) as male_users,
            COUNT(CASE WHEN gender = 'female' THEN 1 END) as female_users
          FROM users 
          WHERE created_at >= $1 AND role != 'admin'
          GROUP BY DATE(created_at)
          ORDER BY date DESC
        `, [startDate]),
        
        // User activity patterns
        query(`
          SELECT 
            EXTRACT(hour FROM last_login) as hour,
            COUNT(*) as active_users
          FROM users 
          WHERE last_login >= $1 AND role != 'admin'
          GROUP BY EXTRACT(hour FROM last_login)
          ORDER BY hour
        `, [startDate]),
        
        // User demographics
        query(`
          SELECT 
            role,
            gender,
            COUNT(*) as count
          FROM users 
          WHERE role != 'admin'
          GROUP BY role, gender
        `)
      ]);

      analytics.users = {
        growth: userGrowth.rows,
        activity: userActivity.rows,
        demographics: userDemographics.rows,
        summary: {
          totalUsers: userDemographics.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
          newUsersInRange: userGrowth.rows.reduce((sum, row) => sum + parseInt(row.new_users), 0)
        }
      };
    }

    // Content Analytics
    if (metric === 'all' || metric === 'content') {
      const [contentGrowth, contentPopularity, sectorDistribution] = await Promise.all([
        // Content creation over time
        query(`
          (SELECT 
            DATE(created_at) as date,
            'course' as content_type,
            COUNT(*) as count
          FROM courses 
          WHERE created_at >= $1
          GROUP BY DATE(created_at))
          UNION ALL
          (SELECT 
            DATE(created_at) as date,
            'resource' as content_type,
            COUNT(*) as count
          FROM resources 
          WHERE created_at >= $1
          GROUP BY DATE(created_at))
          UNION ALL
          (SELECT 
            DATE(created_at) as date,
            'announcement' as content_type,
            COUNT(*) as count
          FROM announcements 
          WHERE created_at >= $1
          GROUP BY DATE(created_at))
          ORDER BY date DESC
        `, [startDate]),
        
        // Most popular content
        query(`
          SELECT 
            r.title,
            r.resource_type,
            r.download_count,
            ls.name as sector_name
          FROM resources r
          LEFT JOIN learning_sectors ls ON r.sector_id = ls.id
          ORDER BY r.download_count DESC
          LIMIT 10
        `),
        
        // Content distribution by sector
        query(`
          SELECT 
            ls.name as sector_name,
            ls.color,
            COUNT(c.id) as course_count,
            COUNT(r.id) as resource_count,
            COALESCE(SUM(r.download_count), 0) as total_downloads
          FROM learning_sectors ls
          LEFT JOIN courses c ON ls.id = c.sector_id AND c.is_active = true
          LEFT JOIN resources r ON ls.id = r.sector_id
          GROUP BY ls.id, ls.name, ls.color
          ORDER BY (COUNT(c.id) + COUNT(r.id)) DESC
        `)
      ]);

      analytics.content = {
        growth: contentGrowth.rows,
        popular: contentPopularity.rows,
        sectorDistribution: sectorDistribution.rows,
        summary: {
          totalContent: contentGrowth.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
          totalDownloads: contentPopularity.rows.reduce((sum, row) => sum + parseInt(row.download_count || 0), 0)
        }
      };
    }

    // Engagement Analytics
    if (metric === 'all' || metric === 'engagement') {
      const [downloadTrends, announcementEngagement, sectorEngagement] = await Promise.all([
        // Download trends over time
        query(`
          SELECT 
            DATE(created_at) as date,
            SUM(download_count) as downloads
          FROM resources 
          WHERE created_at >= $1
          GROUP BY DATE(created_at)
          ORDER BY date DESC
        `, [startDate]),
        
        // Announcement engagement
        query(`
          SELECT 
            title,
            target_audience,
            priority,
            created_at
          FROM announcements 
          WHERE created_at >= $1 AND is_active = true
          ORDER BY created_at DESC
          LIMIT 20
        `, [startDate]),
        
        // Sector engagement
        query(`
          SELECT 
            ls.name as sector_name,
            ls.color,
            COUNT(DISTINCT c.id) as unique_courses,
            COUNT(DISTINCT r.id) as unique_resources,
            COALESCE(AVG(r.download_count), 0) as avg_downloads
          FROM learning_sectors ls
          LEFT JOIN courses c ON ls.id = c.sector_id
          LEFT JOIN resources r ON ls.id = r.sector_id
          GROUP BY ls.id, ls.name, ls.color
          ORDER BY avg_downloads DESC
        `)
      ]);

      analytics.engagement = {
        downloads: downloadTrends.rows,
        announcements: announcementEngagement.rows,
        sectors: sectorEngagement.rows,
        summary: {
          totalDownloads: downloadTrends.rows.reduce((sum, row) => sum + parseInt(row.downloads || 0), 0),
          activeAnnouncements: announcementEngagement.rows.length
        }
      };
    }

    // System Analytics
    if (metric === 'all' || metric === 'system') {
      const [dbTime, activeSessions, totals, resourceBytes] = await Promise.all([
        query('SELECT NOW() as db_time'),
        query("SELECT COUNT(*)::int as count FROM users WHERE last_login > NOW() - INTERVAL '1 hour'"),
        query(`
          SELECT
            (SELECT COUNT(*)::int FROM users WHERE role != 'admin') as users,
            (SELECT COUNT(*)::int FROM courses WHERE is_active = true) as courses,
            (SELECT COUNT(*)::int FROM resources) as resources,
            (SELECT COUNT(*)::int FROM announcements WHERE is_active = true) as announcements
        `),
        query('SELECT COALESCE(SUM(file_size), 0)::bigint as total_bytes FROM resources')
      ]);

      analytics.system = {
        database: {
          dbTime: dbTime.rows[0]?.db_time ?? null
        },
        usage: {
          activeSessionsLastHour: activeSessions.rows[0]?.count ?? 0,
          totals: totals.rows[0] ?? { users: 0, courses: 0, resources: 0, announcements: 0 }
        },
        storage: {
          resourcesBytes: resourceBytes.rows[0]?.total_bytes ?? 0,
          totalAvailableBytes: null
        },
        performance: {
          avgResponseTimeMs: null,
          errorRate: null,
          throughputPerMinute: null,
          uptimePercent: null
        }
      };
    }

    // Generate insights based on data
    const insights = [];
    
    if (analytics.users) {
      const userGrowthRate = analytics.users.summary.newUsersInRange;
      if (userGrowthRate > 50) {
        insights.push({
          type: 'positive',
          title: 'Strong User Growth',
          description: `${userGrowthRate} new users registered in the last ${timeRange}`,
          action: 'Consider expanding content offerings'
        });
      }
    }

    if (analytics.content) {
      const topSector = analytics.content.sectorDistribution[0];
      if (topSector) {
        insights.push({
          type: 'info',
          title: 'Popular Sector',
          description: `${topSector.sector_name} has the most content with ${topSector.course_count} courses`,
          action: 'Maintain quality in this popular sector'
        });
      }
    }

    return NextResponse.json({
      success: true,
      analytics,
      insights,
      timeRange,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}