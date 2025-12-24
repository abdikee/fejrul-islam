import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection.js';
import { verifyAuth } from '@/lib/auth/middleware';

async function columnExists(tableName, columnName) {
  const result = await pool.query(
    `
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name = $2
      LIMIT 1
    `,
    [tableName, columnName]
  );

  return result.rows.length > 0;
}

export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');
    const type = searchParams.get('type') || 'all';

    if (courseId && lessonId) {
      // Get specific lesson content
      const lessonQuery = `
        SELECT 
          l.id,
          l.title,
          l.description,
          l.content_type,
          l.content_url,
          l.duration_minutes,
          l.order_index,
          l.is_locked,
          c.title as course_title,
          s.name as sector_name
        FROM lessons l
        JOIN courses c ON l.course_id = c.id
        JOIN sectors s ON c.sector_id = s.id
        WHERE l.id = $1 AND l.course_id = $2
      `;

      const lessonResult = await pool.query(lessonQuery, [lessonId, courseId]);

      if (lessonResult.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Lesson not found' },
          { status: 404 }
        );
      }

      // Get lesson resources
      const hasIsActive = await columnExists('resources', 'is_active');
      const resourcesQuery = `
        SELECT 
          r.id,
          r.title,
          r.description,
          r.resource_type,
          r.file_path,
          r.file_size
        FROM lesson_resources lr
        JOIN resources r ON lr.resource_id = r.id
        WHERE lr.lesson_id = $1 ${hasIsActive ? 'AND r.is_active = true' : ''}
      `;

      const resourcesResult = await pool.query(resourcesQuery, [lessonId]);

      return NextResponse.json({
        success: true,
        lesson: {
          ...lessonResult.rows[0],
          resources: resourcesResult.rows
        }
      });
    }

    if (courseId) {
      // Get course content structure
      const courseQuery = `
        SELECT 
          c.id,
          c.title,
          c.description,
          c.difficulty_level,
          c.estimated_weeks,
          s.name as sector_name,
          s.color as sector_color
        FROM courses c
        JOIN sectors s ON c.sector_id = s.id
        WHERE c.id = $1 AND c.is_active = true
      `;

      const courseResult = await pool.query(courseQuery, [courseId]);

      if (courseResult.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Course not found' },
          { status: 404 }
        );
      }

      // Get course modules and lessons
      const modulesQuery = `
        SELECT 
          m.id,
          m.title,
          m.description,
          m.order_index,
          COUNT(l.id) as lesson_count,
          SUM(l.duration_minutes) as total_duration
        FROM course_modules m
        LEFT JOIN lessons l ON m.id = l.module_id
        WHERE m.course_id = $1
        GROUP BY m.id, m.title, m.description, m.order_index
        ORDER BY m.order_index
      `;

      const modulesResult = await pool.query(modulesQuery, [courseId]);

      // Get lessons for each module
      const lessonsQuery = `
        SELECT 
          l.id,
          l.module_id,
          l.title,
          l.description,
          l.content_type,
          l.duration_minutes,
          l.order_index,
          l.is_locked
        FROM lessons l
        JOIN course_modules m ON l.module_id = m.id
        WHERE m.course_id = $1
        ORDER BY m.order_index, l.order_index
      `;

      const lessonsResult = await pool.query(lessonsQuery, [courseId]);

      // Group lessons by module
      const modules = modulesResult.rows.map(module => ({
        ...module,
        lessons: lessonsResult.rows.filter(lesson => lesson.module_id === module.id)
      }));

      return NextResponse.json({
        success: true,
        course: {
          ...courseResult.rows[0],
          modules
        }
      });
    }

    // Get user's current learning content
    const currentContentQuery = `
      SELECT 
        c.id as course_id,
        c.title as course_title,
        c.description as course_description,
        s.name as sector_name,
        s.color as sector_color,
        scp.progress_percentage,
        scp.course_status,
        l.id as current_lesson_id,
        l.title as current_lesson_title,
        l.content_type,
        l.duration_minutes
      FROM student_course_progress scp
      JOIN courses c ON scp.course_id = c.id
      JOIN sectors s ON c.sector_id = s.id
      LEFT JOIN lessons l ON l.course_id = c.id AND l.order_index = (
        SELECT MIN(l2.order_index) 
        FROM lessons l2 
        WHERE l2.course_id = c.id AND l2.is_locked = false
      )
      WHERE scp.user_id = $1 AND scp.course_status = 'in_progress'
      ORDER BY scp.updated_at DESC
      LIMIT 1
    `;

    const currentContentResult = await pool.query(currentContentQuery, [user.id]);

    return NextResponse.json({
      success: true,
      currentContent: currentContentResult.rows[0] || null
    });

  } catch (error) {
    console.error('Error fetching learning content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch content', error: error.message },
      { status: 500 }
    );
  }
}