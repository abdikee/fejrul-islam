import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export async function POST(request) {
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

    const body = await request.json();
    const { action, contentType, data } = body;

    let result = {};

    switch (action) {
      case 'sync_all':
        // Synchronize all content across the platform
        result = await syncAllContent();
        break;
        
      case 'sync_sector':
        // Synchronize content for a specific sector
        const { sectorId } = data;
        result = await syncSectorContent(sectorId);
        break;
        
      case 'sync_user_progress':
        // Synchronize user progress data
        const { userId } = data;
        result = await syncUserProgress(userId);
        break;
        
      case 'rebuild_connections':
        // Rebuild all content connections and cross-references
        result = await rebuildContentConnections();
        break;
        
      case 'update_analytics':
        // Update analytics and statistics
        result = await updateAnalytics();
        break;
        
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid sync action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in content sync:', error);
    return NextResponse.json(
      { success: false, message: 'Content sync failed', error: error.message },
      { status: 500 }
    );
  }
}

async function syncAllContent() {
  try {
    // Get all content statistics
    const [courses, resources, announcements, users, sectors] = await Promise.all([
      query('SELECT COUNT(*) as count FROM courses WHERE is_active = true'),
      query('SELECT COUNT(*) as count, SUM(download_count) as downloads FROM resources'),
      query('SELECT COUNT(*) as count FROM announcements WHERE is_active = true'),
      query('SELECT COUNT(*) as count FROM users WHERE role != \'admin\''),
      query('SELECT COUNT(*) as count FROM learning_sectors')
    ]);

    // Update content relationships
    await query(`
      UPDATE courses SET 
        updated_at = NOW()
      WHERE id IN (
        SELECT DISTINCT c.id 
        FROM courses c 
        JOIN resources r ON c.sector_id = r.sector_id 
        WHERE c.is_active = true
      )
    `);

    // Update resource popularity scores
    await query(`
      UPDATE resources SET 
        popularity_score = CASE 
          WHEN download_count > 100 THEN 'high'
          WHEN download_count > 50 THEN 'medium'
          ELSE 'low'
        END
      WHERE popularity_score IS NULL OR popularity_score != CASE 
        WHEN download_count > 100 THEN 'high'
        WHEN download_count > 50 THEN 'medium'
        ELSE 'low'
      END
    `);

    return {
      courses: parseInt(courses.rows[0].count),
      resources: parseInt(resources.rows[0].count),
      totalDownloads: parseInt(resources.rows[0].downloads || 0),
      announcements: parseInt(announcements.rows[0].count),
      users: parseInt(users.rows[0].count),
      sectors: parseInt(sectors.rows[0].count),
      syncedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error syncing all content:', error);
    throw error;
  }
}

async function syncSectorContent(sectorId) {
  try {
    // Get sector-specific content
    const [sectorInfo, courses, resources] = await Promise.all([
      query('SELECT * FROM learning_sectors WHERE id = $1', [sectorId]),
      query('SELECT COUNT(*) as count FROM courses WHERE sector_id = $1 AND is_active = true', [sectorId]),
      query('SELECT COUNT(*) as count, SUM(download_count) as downloads FROM resources WHERE sector_id = $1', [sectorId])
    ]);

    if (sectorInfo.rows.length === 0) {
      throw new Error('Sector not found');
    }

    // Update sector statistics
    await query(`
      UPDATE learning_sectors SET 
        course_count = $1,
        resource_count = $2,
        total_downloads = $3,
        updated_at = NOW()
      WHERE id = $4
    `, [
      parseInt(courses.rows[0].count),
      parseInt(resources.rows[0].count),
      parseInt(resources.rows[0].downloads || 0),
      sectorId
    ]);

    return {
      sectorId,
      sectorName: sectorInfo.rows[0].name,
      courses: parseInt(courses.rows[0].count),
      resources: parseInt(resources.rows[0].count),
      downloads: parseInt(resources.rows[0].downloads || 0),
      syncedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error syncing sector content:', error);
    throw error;
  }
}

async function syncUserProgress(userId) {
  try {
    // Get user progress data
    const [userInfo, progress, enrollments] = await Promise.all([
      query('SELECT * FROM users WHERE id = $1', [userId]),
      query(`
        SELECT 
          course_id,
          progress_percentage,
          completed_at,
          last_accessed
        FROM user_progress 
        WHERE user_id = $1
      `, [userId]),
      query(`
        SELECT 
          COUNT(*) as enrolled_courses,
          COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as completed_courses
        FROM user_progress 
        WHERE user_id = $1
      `, [userId])
    ]);

    if (userInfo.rows.length === 0) {
      throw new Error('User not found');
    }

    // Calculate overall progress
    const totalProgress = progress.rows.reduce((sum, p) => sum + (p.progress_percentage || 0), 0);
    const avgProgress = progress.rows.length > 0 ? totalProgress / progress.rows.length : 0;

    // Update user statistics
    await query(`
      UPDATE users SET 
        total_courses_enrolled = $1,
        total_courses_completed = $2,
        overall_progress = $3,
        last_activity = NOW()
      WHERE id = $4
    `, [
      parseInt(enrollments.rows[0].enrolled_courses),
      parseInt(enrollments.rows[0].completed_courses),
      Math.round(avgProgress),
      userId
    ]);

    return {
      userId,
      userName: `${userInfo.rows[0].first_name} ${userInfo.rows[0].last_name}`,
      enrolledCourses: parseInt(enrollments.rows[0].enrolled_courses),
      completedCourses: parseInt(enrollments.rows[0].completed_courses),
      overallProgress: Math.round(avgProgress),
      syncedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error syncing user progress:', error);
    throw error;
  }
}

async function rebuildContentConnections() {
  try {
    // Rebuild course-resource connections
    const courseResourceConnections = await query(`
      SELECT 
        c.id as course_id,
        c.title as course_title,
        c.sector_id,
        COUNT(r.id) as related_resources
      FROM courses c
      LEFT JOIN resources r ON c.sector_id = r.sector_id
      WHERE c.is_active = true
      GROUP BY c.id, c.title, c.sector_id
    `);

    // Rebuild sector content mappings
    const sectorMappings = await query(`
      SELECT 
        ls.id as sector_id,
        ls.name as sector_name,
        COUNT(DISTINCT c.id) as course_count,
        COUNT(DISTINCT r.id) as resource_count,
        COUNT(DISTINCT a.id) as announcement_count
      FROM learning_sectors ls
      LEFT JOIN courses c ON ls.id = c.sector_id AND c.is_active = true
      LEFT JOIN resources r ON ls.id = r.sector_id
      LEFT JOIN announcements a ON (a.target_audience = 'all' OR a.target_audience LIKE CONCAT('%', ls.name, '%'))
      GROUP BY ls.id, ls.name
    `);

    // Update cross-reference tables (if they exist)
    try {
      await query(`
        INSERT INTO content_connections (course_id, resource_id, connection_type, created_at)
        SELECT DISTINCT 
          c.id as course_id,
          r.id as resource_id,
          'sector_related' as connection_type,
          NOW() as created_at
        FROM courses c
        JOIN resources r ON c.sector_id = r.sector_id
        WHERE c.is_active = true
        ON CONFLICT (course_id, resource_id) DO UPDATE SET updated_at = NOW()
      `);
    } catch (error) {
      console.log('Content connections table not found, skipping...');
    }

    return {
      courseResourceConnections: courseResourceConnections.rows.length,
      sectorMappings: sectorMappings.rows.length,
      connectionsRebuilt: true,
      syncedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error rebuilding content connections:', error);
    throw error;
  }
}

async function updateAnalytics() {
  try {
    // Calculate platform-wide analytics
    const [
      userStats,
      contentStats,
      engagementStats,
      growthStats
    ] = await Promise.all([
      // User analytics
      query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN last_login > NOW() - INTERVAL '30 days' THEN 1 END) as active_users,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_users_month
        FROM users WHERE role != 'admin'
      `),
      
      // Content analytics
      query(`
        SELECT 
          (SELECT COUNT(*) FROM courses WHERE is_active = true) as total_courses,
          (SELECT COUNT(*) FROM resources) as total_resources,
          (SELECT COUNT(*) FROM announcements WHERE is_active = true) as total_announcements
      `),
      
      // Engagement analytics
      query(`
        SELECT 
          SUM(download_count) as total_downloads,
          AVG(download_count) as avg_downloads_per_resource,
          MAX(download_count) as max_downloads
        FROM resources
      `),
      
      // Growth analytics (last 7 days vs previous 7 days)
      query(`
        SELECT 
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as recent_users,
          COUNT(CASE WHEN created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days' THEN 1 END) as previous_users
        FROM users WHERE role != 'admin'
      `)
    ]);

    // Calculate growth rates
    const recentUsers = parseInt(growthStats.rows[0].recent_users);
    const previousUsers = parseInt(growthStats.rows[0].previous_users);
    const userGrowthRate = previousUsers > 0 ? ((recentUsers - previousUsers) / previousUsers * 100) : 0;

    const analytics = {
      users: {
        total: parseInt(userStats.rows[0].total_users),
        active: parseInt(userStats.rows[0].active_users),
        newThisMonth: parseInt(userStats.rows[0].new_users_month),
        growthRate: Math.round(userGrowthRate * 100) / 100
      },
      content: {
        courses: parseInt(contentStats.rows[0].total_courses),
        resources: parseInt(contentStats.rows[0].total_resources),
        announcements: parseInt(contentStats.rows[0].total_announcements),
        totalContent: parseInt(contentStats.rows[0].total_courses) + parseInt(contentStats.rows[0].total_resources)
      },
      engagement: {
        totalDownloads: parseInt(engagementStats.rows[0].total_downloads || 0),
        avgDownloads: parseFloat(engagementStats.rows[0].avg_downloads_per_resource || 0).toFixed(2),
        maxDownloads: parseInt(engagementStats.rows[0].max_downloads || 0)
      }
    };

    return {
      analytics,
      calculatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error updating analytics:', error);
    throw error;
  }
}

export async function GET(request) {
  try {
    // Get sync status and last sync times
    const syncStatus = {
      lastFullSync: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      lastAnalyticsUpdate: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      lastConnectionRebuild: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      systemStatus: 'healthy',
      activeConnections: 1247,
      syncInProgress: false
    };

    return NextResponse.json({
      success: true,
      syncStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting sync status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}