import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection.js';
import { verifyAuth } from '@/lib/auth/middleware';

export async function POST(request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authResult.user.id;
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
      SELECT id FROM qirat_user_progress 
      WHERE user_id = $1
    `;
    const checkResult = await pool.query(checkQuery, [userId]);

    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'You are already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create enrollment record
    const enrollQuery = `
      INSERT INTO qirat_user_progress (
        user_id,
        current_level,
        current_book,
        level_1_completed,
        level_2_completed,
        level_3_completed,
        enrollment_date,
        motivation,
        study_hours_per_week,
        previous_knowledge
      ) VALUES ($1, 1, 1, false, false, false, NOW(), $2, $3, $4)
      RETURNING *
    `;

    const enrollResult = await pool.query(enrollQuery, [
      userId,
      motivation,
      studyHours,
      previousKnowledge || null
    ]);

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in Qirat & Ilm Course',
      progress: enrollResult.rows[0]
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process enrollment', error: error.message },
      { status: 500 }
    );
  }
}
