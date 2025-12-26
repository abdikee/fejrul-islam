import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // Verify mentor authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'mentor') {
      return NextResponse.json({ success: false, message: 'Mentor access required' }, { status: 403 });
    }

    const mentor = userResult.rows[0];
    const { searchParams } = new URL(request.url);
    const sectorId = searchParams.get('sectorId');

    // Get comprehensive mentor dashboard data
    const [
      assignedStudents,
      managedCourses,
      mentorResources,
      studentProgress,
      recentActivity,
      sectors,
      pendingTasks,
      mentorStats
    ] = await Promise.all([
      // Students assigned to this mentor
      query(`
        SELECT 
          u.id, u.first_name, u.last_name, u.email, u.gender, u.created_at, u.last_login,
          COUNT(DISTINCT up.course_id) as enrolled_courses,
          COUNT(CASE WHEN up.completed_at IS NOT NULL THEN 1 END) as completed_courses,
          AVG(up.progress_percentage) as avg_progress,
          MAX(up.last_accessed) as last_activity
        FROM users u
        JOIN mentorship m ON m.student_id = u.id AND m.mentor_id = $1 AND m.is_active = true
        LEFT JOIN user_progress up ON u.id = up.user_id
        WHERE u.role = 'student'
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.gender, u.created_at, u.last_login
        ORDER BY u.last_login DESC NULLS LAST
        LIMIT 50
      `, [mentor.id]),

      // Courses managed by mentor (in their expertise areas)
      query(`
        SELECT 
          c.id, c.title, c.description, c.level, c.duration_weeks, c.created_at,
          ls.name as sector_name, ls.color as sector_color, ls.icon as sector_icon,
          COUNT(DISTINCT up.user_id) as enrolled_students,
          AVG(up.progress_percentage) as avg_progress
        FROM courses c
        LEFT JOIN learning_sectors ls ON c.sector_id = ls.id
        LEFT JOIN user_progress up ON c.id = up.course_id
        WHERE c.is_active = true
        ${sectorId ? 'AND c.sector_id = $1' : ''}
        GROUP BY c.id, c.title, c.description, c.level, c.duration_weeks, c.created_at,
                 ls.name, ls.color, ls.icon
        ORDER BY c.created_at DESC
        LIMIT 20
      `, sectorId ? [sectorId] : []),

      // Resources uploaded/managed by mentor
      query(`
        SELECT 
          r.id, r.title, r.description, r.resource_type, r.download_count, r.created_at,
          ls.name as sector_name, ls.color as sector_color, ls.icon as sector_icon
        FROM resources r
        LEFT JOIN learning_sectors ls ON r.sector_id = ls.id
        WHERE r.uploaded_by = $1 OR r.access_level = 'public'
        ORDER BY r.created_at DESC
        LIMIT 15
      `, [mentor.id]),

      // Student progress overview
      query(`
        SELECT 
          c.title as course_title,
          ls.name as sector_name, ls.color as sector_color,
          COUNT(DISTINCT up.user_id) as total_students,
          COUNT(CASE WHEN up.completed_at IS NOT NULL THEN 1 END) as completed_students,
          AVG(up.progress_percentage) as avg_progress,
          COUNT(CASE WHEN up.last_accessed > NOW() - INTERVAL '7 days' THEN 1 END) as active_students
        FROM courses c
        LEFT JOIN learning_sectors ls ON c.sector_id = ls.id
        LEFT JOIN user_progress up ON c.id = up.course_id
        WHERE c.is_active = true
        GROUP BY c.id, c.title, ls.name, ls.color
        HAVING COUNT(DISTINCT up.user_id) > 0
        ORDER BY total_students DESC
        LIMIT 10
      `),

      // Recent mentor activity
      query(`
        (SELECT 
          'student_progress' as activity_type,
          CONCAT(u.first_name, ' ', u.last_name, ' made progress in ', c.title) as description,
          up.last_accessed as activity_time,
          up.progress_percentage as metadata,
          u.gender as audience
        FROM user_progress up
        JOIN users u ON up.user_id = u.id
        JOIN courses c ON up.course_id = c.id
        WHERE up.last_accessed > NOW() - INTERVAL '24 hours'
        AND EXISTS (
          SELECT 1 FROM mentorship m
          WHERE m.mentor_id = $1 AND m.student_id = u.id AND m.is_active = true
        )
        ORDER BY up.last_accessed DESC
        LIMIT 10)
        
        UNION ALL
        
        (SELECT 
          'resource_download' as activity_type,
          CONCAT('Resource "', r.title, '" was downloaded') as description,
          NOW() - INTERVAL '1 hour' as activity_time,
          r.download_count as metadata,
          'system' as audience
        FROM resources r
        WHERE r.uploaded_by = $1
        ORDER BY r.download_count DESC
        LIMIT 5)
        
        ORDER BY activity_time DESC
        LIMIT 15
      `, [mentor.id]),

      // All sectors for navigation
      query(`
        SELECT 
          ls.id, ls.name, ls.description, ls.icon, ls.color,
          COUNT(DISTINCT c.id) as course_count,
          COUNT(DISTINCT r.id) as resource_count,
          COUNT(DISTINCT up.user_id) as student_count
        FROM learning_sectors ls
        LEFT JOIN courses c ON ls.id = c.sector_id AND c.is_active = true
        LEFT JOIN resources r ON ls.id = r.sector_id
        LEFT JOIN user_progress up ON c.id = up.course_id
        GROUP BY ls.id, ls.name, ls.description, ls.icon, ls.color
        ORDER BY ls.name
      `),

      // Pending tasks for mentor
      query(`
        SELECT 
          'review_progress' as task_type,
          CONCAT('Review progress of ', COUNT(*), ' students') as title,
          'high' as priority,
          'Today' as due_date,
          COUNT(*) as count
        FROM user_progress up
        JOIN users u ON up.user_id = u.id
        WHERE up.last_accessed > NOW() - INTERVAL '7 days'
        AND EXISTS (
          SELECT 1 FROM mentorship m
          WHERE m.mentor_id = $1 AND m.student_id = u.id AND m.is_active = true
        )
        AND up.progress_percentage BETWEEN 80 AND 99
        
        UNION ALL
        
        SELECT 
          'content_review' as task_type,
          CONCAT('Review ', COUNT(*), ' new resources') as title,
          'medium' as priority,
          'This week' as due_date,
          COUNT(*) as count
        FROM resources r
        WHERE r.created_at > NOW() - INTERVAL '7 days'
        
        UNION ALL
        
        SELECT 
          'student_support' as task_type,
          CONCAT('Follow up with ', COUNT(*), ' inactive students') as title,
          'medium' as priority,
          'Tomorrow' as due_date,
          COUNT(*) as count
        FROM users u
        WHERE u.role = 'student' 
        AND EXISTS (
          SELECT 1 FROM mentorship m
          WHERE m.mentor_id = $1 AND m.student_id = u.id AND m.is_active = true
        )
        AND u.last_login < NOW() - INTERVAL '14 days'
      `, [mentor.id]),

      // Mentor statistics
      query(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE role = 'student' AND gender = $1) as total_students,
          (SELECT COUNT(*) FROM courses WHERE is_active = true) as total_courses,
          (SELECT COUNT(*) FROM resources WHERE uploaded_by = $2) as mentor_resources,
          (SELECT COUNT(DISTINCT up.user_id) FROM user_progress up 
           JOIN users u ON up.user_id = u.id 
           WHERE u.gender = $1 AND up.last_accessed > NOW() - INTERVAL '30 days') as active_students
      `, [mentor.gender, mentor.id])
    ]);

    // Calculate mentor-specific statistics
    const stats = {
      totalStudents: parseInt(mentorStats.rows[0]?.total_students || 0),
      activeStudents: parseInt(mentorStats.rows[0]?.active_students || 0),
      managedCourses: managedCourses.rows.length,
      uploadedResources: parseInt(mentorStats.rows[0]?.mentor_resources || 0),
      averageProgress: Math.round(
        studentProgress.rows.reduce((sum, course) => sum + (parseFloat(course.avg_progress) || 0), 0) / 
        Math.max(studentProgress.rows.length, 1)
      )
    };

    // Get mentor recommendations
    const recommendations = await query(`
      -- Students needing attention
      (SELECT 
        'student' as type,
        u.id, 
        CONCAT(u.first_name, ' ', u.last_name) as title,
        CONCAT('Last active: ', COALESCE(u.last_login::text, 'Never')) as description,
        'needs_attention' as reason,
        u.gender as metadata
      FROM users u
      WHERE u.role = 'student' 
      AND u.gender = $1
      AND (u.last_login < NOW() - INTERVAL '7 days' OR u.last_login IS NULL)
      ORDER BY u.last_login ASC NULLS FIRST
      LIMIT 5)
      
      UNION ALL
      
      -- Popular resources to review
      (SELECT 
        'resource' as type,
        r.id,
        r.title,
        CONCAT('Downloaded ', r.download_count, ' times') as description,
        'popular_content' as reason,
        r.resource_type as metadata
      FROM resources r
      ORDER BY r.download_count DESC
      LIMIT 3)
      
      ORDER BY type, reason
    `, [mentor.gender]);

    return NextResponse.json({
      success: true,
      mentor: {
        id: mentor.id,
        name: `${mentor.first_name} ${mentor.last_name}`,
        email: mentor.email,
        gender: mentor.gender,
        role: mentor.role
      },
      dashboard: {
        assignedStudents: assignedStudents.rows,
        managedCourses: managedCourses.rows,
        mentorResources: mentorResources.rows,
        studentProgress: studentProgress.rows,
        recentActivity: recentActivity.rows,
        sectors: sectors.rows,
        pendingTasks: pendingTasks.rows,
        recommendations: recommendations.rows
      },
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching mentor dashboard:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to fetch mentor dashboard' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify mentor authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'mentor') {
      return NextResponse.json({ success: false, message: 'Mentor access required' }, { status: 403 });
    }

    const body = await request.json();
    const { action, studentId, courseId, data } = body;

    let result = {};

    switch (action) {
      case 'update_student_progress':
        // Update student progress (mentor override)
        const { progressPercentage, notes } = data;
        await query(`
          UPDATE user_progress 
          SET progress_percentage = $1, mentor_notes = $2, updated_by_mentor = $3, last_accessed = NOW()
          WHERE user_id = $4 AND course_id = $5
        `, [progressPercentage, notes, decoded.userId, studentId, courseId]);
        
        result = { message: 'Student progress updated successfully', studentId, courseId };
        break;

      case 'send_student_message':
        // Send message to student
        const { message, priority } = data;
        await query(`
          INSERT INTO mentor_messages (mentor_id, student_id, message, priority, sent_at)
          VALUES ($1, $2, $3, $4, NOW())
        `, [decoded.userId, studentId, message, priority || 'normal']);
        
        result = { message: 'Message sent to student successfully', studentId };
        break;

      case 'create_announcement':
        // Create announcement for students
        const { title, content, targetAudience } = data;
        await query(`
          INSERT INTO announcements (title, content, announcement_type, target_audience, 
                                   priority, publish_date, created_by, is_active)
          VALUES ($1, $2, 'mentor_announcement', $3, 'normal', NOW(), $4, true)
        `, [title, content, targetAudience, decoded.userId]);
        
        result = { message: 'Announcement created successfully' };
        break;

      case 'upload_resource':
        // Upload new resource
        const { resourceTitle, description, resourceType, filePath, sectorId } = data;
        await query(`
          INSERT INTO resources (title, description, resource_type, file_path, 
                               sector_id, uploaded_by, access_level, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, 'public', NOW())
        `, [resourceTitle, description, resourceType, filePath, sectorId, decoded.userId]);
        
        result = { message: 'Resource uploaded successfully' };
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
    console.error('Error in mentor dashboard action:', error);
    return NextResponse.json(
      { success: false, message: 'Action failed', error: error.message },
      { status: 500 }
    );
  }
}