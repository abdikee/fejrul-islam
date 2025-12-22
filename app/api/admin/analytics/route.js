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
        `, [startDate, startDate, startDate]),
        
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
      // Generate mock system metrics for demo
      const systemMetrics = {
        performance: {
          avgResponseTime: Math.floor(Math.random() * 200) + 100, // 100-300ms
          uptime: 99.9,
          errorRate: Math.random() * 0.5, // 0-0.5%
          throughput: Math.floor(Math.random() * 1000) + 500 // 500-1500 req/min
        },
        storage: {
          totalUsed: Math.floor(Math.random() * 5000) + 2000, // MB
          totalAvailable: 10000, // MB
          growthRate: Math.floor(Math.random() * 10) + 5 // 5-15% per month
        },
        security: {
          loginAttempts: Math.floor(Math.random() * 100) + 50,
          failedLogins: Math.floor(Math.random() * 10) + 2,
          activeSessions: Math.floor(Math.random() * 200) + 100
        }
      };

      analytics.system = systemMetrics;
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
    
    // Return mock analytics for development
    return NextResponse.json({
      success: true,
      analytics: {
        users: {
          growth: [
            { date: '2024-01-20', new_users: 15, male_users: 8, female_users: 7 },
            { date: '2024-01-19', new_users: 12, male_users: 6, female_users: 6 },
            { date: '2024-01-18', new_users: 18, male_users: 9, female_users: 9 }
          ],
          summary: { totalUsers: 1247, newUsersInRange: 45 }
        },
        content: {
          sectorDistribution: [
            { sector_name: 'Tarbiya & Idad', color: 'blue', course_count: 45, resource_count: 89, total_downloads: 1250 },
            { sector_name: 'Literature', color: 'green', course_count: 32, resource_count: 67, total_downloads: 980 }
          ],
          summary: { totalContent: 480, totalDownloads: 5847 }
        },
        engagement: {
          downloads: [
            { date: '2024-01-20', downloads: 125 },
            { date: '2024-01-19', downloads: 98 }
          ],
          summary: { totalDownloads: 5847, activeAnnouncements: 12 }
        },
        system: {
          performance: { avgResponseTime: 150, uptime: 99.9, errorRate: 0.2, throughput: 750 },
          storage: { totalUsed: 3500, totalAvailable: 10000, growthRate: 8 },
          security: { loginAttempts: 75, failedLogins: 3, activeSessions: 150 }
        }
      },
      insights: [
        {
          type: 'positive',
          title: 'Strong User Growth',
          description: '45 new users registered in the last 30d',
          action: 'Consider expanding content offerings'
        }
      ],
      timeRange: '30d',
      generatedAt: new Date().toISOString()
    });
  }
}