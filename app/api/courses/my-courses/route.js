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

    // Get all enrolled courses with details
    const coursesQuery = `
      SELECT 
        c.id,
        c.code,
        c.title,
        c.description,
        c.category,
        c.estimated_weeks,
        c.difficulty_level,
        s.name as sector_name,
        s.code as sector_code,
        s.color as sector_color,
        sl.level_number,
        sl.level_name,
        scp.course_status,
        scp.progress_percentage,
        scp.enrollment_date,
        scp.test_score,
        scp.test_passed,
        scp.mid_score,
        scp.mid_passed,
        scp.assignment_score,
        scp.assignment_passed,
        scp.final_score,
        scp.final_passed,
        scp.overall_grade,
        scp.course_passed,
        scp.completion_date
      FROM student_course_progress scp
      JOIN courses c ON scp.course_id = c.id
      JOIN sector_levels sl ON c.level_id = sl.id
      JOIN sectors s ON c.sector_id = s.id
      WHERE scp.user_id = $1
      ORDER BY scp.enrollment_date DESC, s.display_order, sl.level_number, c.display_order
    `;

    const coursesResult = await pool.query(coursesQuery, [userId]);

    // Get enrolled sectors
    const sectorsQuery = `
      SELECT 
        s.id,
        s.code,
        s.name,
        s.color,
        sse.sector_status,
        sse.enrollment_date,
        sl.level_number as current_level
      FROM student_sector_enrollments sse
      JOIN sectors s ON sse.sector_id = s.id
      JOIN sector_levels sl ON sse.current_level_id = sl.id
      WHERE sse.user_id = $1
      ORDER BY sse.enrollment_date DESC
    `;

    const sectorsResult = await pool.query(sectorsQuery, [userId]);

    // Calculate statistics
    const totalCourses = coursesResult.rows.length;
    const completedCourses = coursesResult.rows.filter(c => c.course_status === 'completed').length;
    const inProgressCourses = coursesResult.rows.filter(c => c.course_status === 'in_progress').length;
    const notStartedCourses = coursesResult.rows.filter(c => c.course_status === 'not_started').length;
    
    const avgProgress = totalCourses > 0 
      ? coursesResult.rows.reduce((sum, c) => sum + parseFloat(c.progress_percentage || 0), 0) / totalCourses 
      : 0;

    return NextResponse.json({
      success: true,
      courses: coursesResult.rows,
      sectors: sectorsResult.rows,
      stats: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        notStartedCourses,
        averageProgress: Math.round(avgProgress)
      }
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses', error: error.message },
      { status: 500 }
    );
  }
}
