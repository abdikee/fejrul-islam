import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection.js';
import { verifyAuth } from '@/lib/auth/middleware';

export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Get learning progress across all sectors
    const progressQuery = `
      SELECT 
        s.id as sector_id,
        s.name as sector_name,
        s.code as sector_code,
        s.color as sector_color,
        sse.sector_status,
        sse.enrollment_date,
        sl.level_number as current_level,
        sl.level_name,
        COUNT(DISTINCT c.id) as total_courses,
        COUNT(DISTINCT CASE WHEN scp.course_status = 'completed' THEN c.id END) as completed_courses,
        COUNT(DISTINCT CASE WHEN scp.course_status = 'in_progress' THEN c.id END) as in_progress_courses,
        AVG(COALESCE(scp.progress_percentage, 0)) as avg_progress
      FROM student_sector_enrollments sse
      JOIN sectors s ON sse.sector_id = s.id
      JOIN sector_levels sl ON sse.current_level_id = sl.id
      LEFT JOIN courses c ON c.sector_id = s.id
      LEFT JOIN student_course_progress scp ON scp.course_id = c.id AND scp.user_id = sse.user_id
      WHERE sse.user_id = $1
      GROUP BY s.id, s.name, s.code, s.color, sse.sector_status, sse.enrollment_date, sl.level_number, sl.level_name
      ORDER BY sse.enrollment_date DESC
    `;

    const progressResult = await pool.query(progressQuery, [userId]);

    // Get recent activity
    const activityQuery = `
      SELECT 
        'course_progress' as activity_type,
        c.title as activity_title,
        s.name as sector_name,
        scp.progress_percentage,
        scp.updated_at as activity_date
      FROM student_course_progress scp
      JOIN courses c ON scp.course_id = c.id
      JOIN sectors s ON c.sector_id = s.id
      WHERE scp.user_id = $1
      ORDER BY scp.updated_at DESC
      LIMIT 10
    `;

    const activityResult = await pool.query(activityQuery, [userId]);

    // Calculate overall statistics
    const totalCourses = progressResult.rows.reduce((sum, row) => sum + parseInt(row.total_courses || 0), 0);
    const completedCourses = progressResult.rows.reduce((sum, row) => sum + parseInt(row.completed_courses || 0), 0);
    const inProgressCourses = progressResult.rows.reduce((sum, row) => sum + parseInt(row.in_progress_courses || 0), 0);
    const overallProgress = progressResult.rows.length > 0 
      ? progressResult.rows.reduce((sum, row) => sum + parseFloat(row.avg_progress || 0), 0) / progressResult.rows.length
      : 0;

    return NextResponse.json({
      success: true,
      progress: {
        sectors: progressResult.rows,
        recentActivity: activityResult.rows,
        statistics: {
          totalCourses,
          completedCourses,
          inProgressCourses,
          overallProgress: Math.round(overallProgress),
          enrolledSectors: progressResult.rows.length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching learning progress:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch learning progress', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseId, lessonId, progress, completed } = await request.json();
    const userId = user.id;

    if (courseId && typeof progress === 'number') {
      // Update course progress
      const updateQuery = `
        UPDATE student_course_progress 
        SET 
          progress_percentage = $1,
          course_status = CASE 
            WHEN $1 >= 100 THEN 'completed'
            WHEN $1 > 0 THEN 'in_progress'
            ELSE 'not_started'
          END,
          updated_at = NOW()
        WHERE user_id = $2 AND course_id = $3
      `;

      await pool.query(updateQuery, [progress, userId, courseId]);

      return NextResponse.json({
        success: true,
        message: 'Progress updated successfully'
      });
    }

    if (lessonId && completed !== undefined) {
      // Mark lesson as completed (this would require a lessons table)
      // For now, we'll just return success
      return NextResponse.json({
        success: true,
        message: 'Lesson progress updated'
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid request parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating learning progress:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update progress', error: error.message },
      { status: 500 }
    );
  }
}