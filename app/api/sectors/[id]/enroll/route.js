import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection.js';
import { verifyAuth } from '@/lib/auth/middleware';

export async function POST(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;
    const sectorId = params.id;
    const body = await request.json();
    const { motivation, studyHours, previousKnowledge } = body;

    // Validate required fields
    if (!motivation || !studyHours) {
      return NextResponse.json(
        { success: false, message: 'Motivation and study hours are required' },
        { status: 400 }
      );
    }

    // Check if user is already enrolled
    const checkQuery = `
      SELECT id FROM student_sector_enrollments 
      WHERE user_id = $1 AND sector_id = $2
    `;
    const checkResult = await pool.query(checkQuery, [userId, sectorId]);

    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'You are already enrolled in this sector' },
        { status: 400 }
      );
    }

    // Get Level 1 for this sector
    const levelQuery = `
      SELECT id FROM sector_levels 
      WHERE sector_id = $1 AND level_number = 1 AND is_active = true
    `;
    const levelResult = await pool.query(levelQuery, [sectorId]);

    if (levelResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Level 1 not found for this sector' },
        { status: 404 }
      );
    }

    const level1Id = levelResult.rows[0].id;

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Create sector enrollment
      const sectorEnrollQuery = `
        INSERT INTO student_sector_enrollments (
          user_id, sector_id, current_level_id, sector_status,
          motivation, study_hours_per_week, previous_knowledge
        ) VALUES ($1, $2, $3, 'active', $4, $5, $6)
        RETURNING *
      `;
      const sectorEnrollResult = await client.query(sectorEnrollQuery, [
        userId, sectorId, level1Id, motivation, studyHours, previousKnowledge || null
      ]);

      // 2. Create level enrollment for Level 1
      const levelEnrollQuery = `
        INSERT INTO student_level_enrollments (
          user_id, sector_id, level_id, level_status
        ) VALUES ($1, $2, $3, 'in_progress')
        RETURNING *
      `;
      await client.query(levelEnrollQuery, [userId, sectorId, level1Id]);

      // 3. Get all courses for Level 1
      const coursesQuery = `
        SELECT id FROM courses 
        WHERE level_id = $1 AND is_active = true
        ORDER BY display_order
      `;
      const coursesResult = await client.query(coursesQuery, [level1Id]);

      // 4. Enroll student in all Level 1 courses
      for (const course of coursesResult.rows) {
        const courseEnrollQuery = `
          INSERT INTO student_course_progress (
            user_id, course_id, course_status, progress_percentage
          ) VALUES ($1, $2, 'not_started', 0)
        `;
        await client.query(courseEnrollQuery, [userId, course.id]);
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Successfully enrolled in sector',
        enrollment: sectorEnrollResult.rows[0],
        coursesEnrolled: coursesResult.rows.length
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process enrollment', error: error.message },
      { status: 500 }
    );
  }
}
