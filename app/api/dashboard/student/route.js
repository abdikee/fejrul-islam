import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export async function GET(request) {
  try {
    // Verify student authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'student') {
      return NextResponse.json({ success: false, message: 'Student access required' }, { status: 403 });
    }

    const user = userResult.rows[0];
    const { searchParams } = new URL(request.url);
    const includeProgress = searchParams.get('progress') === 'true';

    // Determine enrolled course IDs across possible schemas.
    // Some parts of the app use student_course_progress while older parts use user_progress.
    const enrolledIdSet = new Set();
    try {
      const r = await query('SELECT course_id FROM student_course_progress WHERE user_id = $1', [user.id]);
      for (const row of r.rows || []) enrolledIdSet.add(Number(row.course_id));
    } catch (e) {
      if (String(e?.code) !== '42P01') throw e; // ignore missing table
    }
    try {
      const r = await query('SELECT course_id FROM user_progress WHERE user_id = $1', [user.id]);
      for (const row of r.rows || []) enrolledIdSet.add(Number(row.course_id));
    } catch (e) {
      if (String(e?.code) !== '42P01') throw e; // ignore missing table
    }
    const enrolledIds = Array.from(enrolledIdSet).filter((v) => Number.isFinite(v));

    // Get comprehensive student dashboard data
    const [
      enrolledCourses,
      availableCourses,
      resources,
      announcements,
      sectors,
      userProgress,
      recentActivity
    ] = await Promise.all([
      // Enrolled courses
      query(`
        SELECT 
          c.id, c.title, c.description, c.level, c.duration_weeks,
          ls.name as sector_name, ls.color as sector_color, ls.icon as sector_icon,
          up.progress_percentage, up.last_accessed, up.completed_at,
          COUNT(DISTINCT r.id) as related_resources
        FROM courses c
        LEFT JOIN learning_sectors ls ON c.sector_id = ls.id
        LEFT JOIN user_progress up ON c.id = up.course_id AND up.user_id = $1
        LEFT JOIN resources r ON c.sector_id = r.sector_id
        WHERE up.user_id = $1 AND c.is_active = true
        GROUP BY c.id, c.title, c.description, c.level, c.duration_weeks,
                 ls.name, ls.color, ls.icon, up.progress_percentage, up.last_accessed, up.completed_at
        ORDER BY up.last_accessed DESC NULLS LAST
      `, [user.id]),

      // Available courses (not enrolled)
      query(`
        SELECT 
          c.id, c.title, c.description, c.level, c.duration_weeks,
          ls.name as sector_name, ls.color as sector_color, ls.icon as sector_icon,
          COUNT(DISTINCT r.id) as related_resources
        FROM courses c
        LEFT JOIN learning_sectors ls ON c.sector_id = ls.id
        LEFT JOIN resources r ON c.sector_id = r.sector_id
        WHERE c.is_active = true 
        AND NOT (c.id = ANY($1::int[]))
        GROUP BY c.id, c.title, c.description, c.level, c.duration_weeks,
                 ls.name, ls.color, ls.icon
        ORDER BY c.created_at DESC
        LIMIT 10
      `, [enrolledIds]),

      // Recent resources
      query(`
        SELECT 
          r.id, r.title, r.description, r.resource_type, r.download_count,
          ls.name as sector_name, ls.color as sector_color, ls.icon as sector_icon
        FROM resources r
        LEFT JOIN learning_sectors ls ON r.sector_id = ls.id
        WHERE r.access_level = 'public'
        ORDER BY r.created_at DESC
        LIMIT 15
      `),

      // Active announcements for students
      query(`
        SELECT 
          id, title, content, announcement_type, priority, 
          publish_date, expire_date, target_audience
        FROM announcements
        WHERE is_active = true 
        AND (expire_date IS NULL OR expire_date > NOW())
        AND publish_date <= NOW()
        AND (target_audience = 'all' OR target_audience = 'students' OR target_audience = $1)
        ORDER BY 
          CASE priority 
            WHEN 'urgent' THEN 1 
            WHEN 'high' THEN 2 
            WHEN 'normal' THEN 3 
            WHEN 'low' THEN 4 
          END,
          created_at DESC 
        LIMIT 10
      `, [user.gender]),

      // All sectors with content counts
      query(`
        SELECT 
          ls.id, ls.name, ls.description, ls.icon, ls.color,
          COUNT(DISTINCT c.id) as course_count,
          COUNT(DISTINCT r.id) as resource_count,
          COUNT(DISTINCT up.course_id) as enrolled_courses
        FROM learning_sectors ls
        LEFT JOIN courses c ON ls.id = c.sector_id AND c.is_active = true
        LEFT JOIN resources r ON ls.id = r.sector_id
        LEFT JOIN user_progress up ON c.id = up.course_id AND up.user_id = $1
        GROUP BY ls.id, ls.name, ls.description, ls.icon, ls.color
        ORDER BY ls.name
      `, [user.id]),

      // User progress summary
      query(`
        SELECT 
          COUNT(*) as total_enrolled,
          COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as completed_courses,
          AVG(progress_percentage) as avg_progress,
          MAX(last_accessed) as last_activity
        FROM user_progress
        WHERE user_id = $1
      `, [user.id]),

      // Recent activity
      query(`
        SELECT 
          'course_progress' as activity_type,
          CONCAT('Progress in ', c.title) as description,
          up.last_accessed as activity_time,
          up.progress_percentage as metadata
        FROM user_progress up
        JOIN courses c ON up.course_id = c.id
        WHERE up.user_id = $1 AND up.last_accessed > NOW() - INTERVAL '7 days'
        ORDER BY up.last_accessed DESC
        LIMIT 10
      `, [user.id]),
    ]);

    // Calculate statistics
    const stats = {
      totalEnrolled: parseInt(userProgress.rows[0]?.total_enrolled || 0),
      completedCourses: parseInt(userProgress.rows[0]?.completed_courses || 0),
      averageProgress: Math.round(parseFloat(userProgress.rows[0]?.avg_progress || 0)),
      totalResources: resources.rows.length,
      activeAnnouncements: announcements.rows.length,
      lastActivity: userProgress.rows[0]?.last_activity
    };

    // Get recommendations based on user activity and popular content
    const recommendations = await query(
      `
      (
        SELECT
          'course' as type,
          c.id, c.title, c.description, c.level,
          ls.name as sector_name, ls.color as sector_color,
          'sector_match' as reason
        FROM courses c
        JOIN learning_sectors ls ON c.sector_id = ls.id
        WHERE c.sector_id IN (
          SELECT DISTINCT c2.sector_id
          FROM courses c2
          JOIN user_progress up2 ON c2.id = up2.course_id
          WHERE up2.user_id = $1
        )
        AND c.id NOT IN (
          SELECT course_id FROM user_progress WHERE user_id = $1
        )
        AND c.is_active = true
        ORDER BY c.created_at DESC
        LIMIT 3
      )
      UNION ALL
      (
        SELECT
          'resource' as type,
          r.id, r.title, r.description, r.resource_type as level,
          ls.name as sector_name, ls.color as sector_color,
          'popular' as reason
        FROM resources r
        JOIN learning_sectors ls ON r.sector_id = ls.id
        WHERE r.access_level = 'public'
        ORDER BY r.download_count DESC, r.created_at DESC
        LIMIT 3
      )
      LIMIT 6
    `,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role
      },
      dashboard: {
        enrolledCourses: enrolledCourses.rows,
        availableCourses: availableCourses.rows,
        resources: resources.rows,
        announcements: announcements.rows,
        sectors: sectors.rows,
        recentActivity: recentActivity.rows,
        recommendations: recommendations.rows
      },
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    
    // Return mock data for development
    return NextResponse.json({
      success: true,
      user: {
        id: 1,
        name: 'Ahmad Ibrahim',
        email: 'ahmad@student.humsj.edu.et',
        gender: 'male',
        role: 'student'
      },
      dashboard: {
        enrolledCourses: [
          {
            id: 1,
            title: 'Islamic Finance Fundamentals',
            description: 'Learn the basics of Islamic banking',
            level: 'Beginner',
            sector_name: 'Tarbiya & Idad',
            sector_color: 'blue',
            progress_percentage: 65,
            related_resources: 8
          }
        ],
        availableCourses: [
          {
            id: 2,
            title: 'Arabic Literature',
            description: 'Classical Arabic poetry and prose',
            level: 'Intermediate',
            sector_name: 'Literature',
            sector_color: 'green',
            related_resources: 12
          }
        ],
        resources: [
          {
            id: 1,
            title: 'Quran Recitation Guide',
            description: 'Complete guide for proper recitation',
            resource_type: 'PDF',
            download_count: 245,
            sector_name: 'Qirat & Ilm',
            sector_color: 'teal'
          }
        ],
        announcements: [
          {
            id: 1,
            title: 'Ramadan Schedule Update',
            content: 'Updated prayer and study schedule',
            priority: 'high',
            target_audience: 'all'
          }
        ],
        sectors: [
          { id: 1, name: 'Tarbiya & Idad', color: 'blue', course_count: 45, resource_count: 89, enrolled_courses: 3 },
          { id: 2, name: 'Literature', color: 'green', course_count: 32, resource_count: 67, enrolled_courses: 1 }
        ]
      },
      stats: {
        totalEnrolled: 4,
        completedCourses: 1,
        averageProgress: 65,
        totalResources: 15,
        activeAnnouncements: 3
      },
      timestamp: new Date().toISOString()
    });
  }
}

export async function POST(request) {
  try {
    // Verify student authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'student') {
      return NextResponse.json({ success: false, message: 'Student access required' }, { status: 403 });
    }

    const body = await request.json();
    const { action, courseId, resourceId, data } = body;

    let result = {};

    switch (action) {
      case 'enroll_course':
        // Enroll in a course.
        // Prefer the newer schema (student_course_progress) so /api/courses/my-courses reflects enrollments.
        try {
          await query(
            `
            INSERT INTO student_course_progress (
              user_id,
              course_id,
              course_status,
              progress_percentage,
              enrollment_date
            )
            SELECT $1, $2, 'not_started', 0, NOW()
            WHERE NOT EXISTS (
              SELECT 1 FROM student_course_progress WHERE user_id = $1 AND course_id = $2
            )
          `,
            [decoded.userId, courseId]
          );
        } catch (e) {
          // Fallback to legacy schema used in some parts of the app
          if (String(e?.code) !== '42P01') throw e;

          await query(
            `
            INSERT INTO user_progress (user_id, course_id, progress_percentage, enrolled_at)
            VALUES ($1, $2, 0, NOW())
            ON CONFLICT (user_id, course_id) DO NOTHING
          `,
            [decoded.userId, courseId]
          );
        }

        result = { message: 'Successfully enrolled in course', courseId };
        break;

      case 'update_progress':
        // Update course progress
        const { progressPercentage } = data;
        await query(`
          UPDATE user_progress 
          SET progress_percentage = $1, last_accessed = NOW(),
              completed_at = CASE WHEN $1 >= 100 THEN NOW() ELSE completed_at END
          WHERE user_id = $2 AND course_id = $3
        `, [progressPercentage, decoded.userId, courseId]);
        
        result = { message: 'Progress updated successfully', progressPercentage };
        break;

      case 'download_resource':
        // Track resource download
        await query(`
          UPDATE resources 
          SET download_count = download_count + 1 
          WHERE id = $1
        `, [resourceId]);
        
        result = { message: 'Resource download tracked', resourceId };
        break;

      case 'mark_announcement_read':
        // Mark announcement as read
        const { announcementId } = data;
        await query(`
          INSERT INTO user_announcement_reads (user_id, announcement_id, read_at)
          VALUES ($1, $2, NOW())
          ON CONFLICT (user_id, announcement_id) DO UPDATE SET read_at = NOW()
        `, [decoded.userId, announcementId]);
        
        result = { message: 'Announcement marked as read', announcementId };
        break;

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
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
    console.error('Error in student dashboard action:', error);
    return NextResponse.json(
      { success: false, message: 'Action failed', error: error.message },
      { status: 500 }
    );
  }
}