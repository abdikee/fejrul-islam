import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Get course details with sector info
    const courseResult = await query(`
      SELECT 
        c.id, c.code, c.title, c.description, c.sector_id,
        COALESCE(c.difficulty_level, c.level, 'Beginner') as level, 
        COALESCE(c.estimated_weeks, c.duration_weeks, 8) as duration_weeks, 
        c.prerequisites, c.learning_objectives, c.created_at, 
        COALESCE(c.is_active, true) as is_active,
        COALESCE(s.name, 'General') as sector_name, 
        COALESCE(s.color, 'blue') as sector_color,
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as enrolled_students
      FROM courses c
      LEFT JOIN sectors s ON c.sector_id = s.id
      WHERE c.id = $1
    `, [id]);

    if (courseResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      );
    }

    const course = courseResult.rows[0];

    // Check if user is enrolled and get progress
    const token = request.cookies.get('auth-token')?.value;
    if (token) {
      try {
        const decoded = verifyJwtToken(token);
        const enrollmentResult = await query(`
          SELECT progress_percentage, enrolled_at, completed_at
          FROM enrollments
          WHERE user_id = $1 AND course_id = $2
        `, [decoded.userId, id]);

        if (enrollmentResult.rows.length > 0) {
          course.is_enrolled = true;
          course.progress_percentage = enrollmentResult.rows[0].progress_percentage || 0;
          course.enrolled_at = enrollmentResult.rows[0].enrolled_at;
          course.completed_at = enrollmentResult.rows[0].completed_at;
        }
      } catch (e) {
        // Token invalid, continue without enrollment info
      }
    }

    return NextResponse.json({
      success: true,
      course
    });

  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch course: ' + error.message },
      { status: 500 }
    );
  }
}
