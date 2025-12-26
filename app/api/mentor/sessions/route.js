import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/middleware.js';
import { query } from '@/lib/db/connection';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'mentor') {
      return NextResponse.json({ success: false, message: 'Mentor access required' }, { status: 403 });
    }

    const result = await query(
      `SELECT
        cs.id,
        cs.session_type,
        cs.scheduled_date,
        cs.status,
        CONCAT(u.first_name, ' ', u.last_name) as student_name
      FROM counseling_sessions cs
      LEFT JOIN users u ON u.id = cs.student_id
      WHERE cs.counselor_id = $1
      ORDER BY cs.scheduled_date ASC NULLS LAST, cs.created_at DESC`,
      [user.id]
    );

    const sessions = (result.rows || []).map((row) => {
      const type = 'One-on-One';
      const title = row.student_name ? `${row.session_type} - ${row.student_name}` : row.session_type;
      const date = row.scheduled_date ? new Date(row.scheduled_date).toISOString().slice(0, 16) : null;
      return {
        id: row.id,
        title,
        type,
        date,
        students: 1,
        status: row.status === 'scheduled' ? 'upcoming' : row.status,
      };
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error('Error fetching mentor sessions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'mentor') {
      return NextResponse.json({ success: false, message: 'Mentor access required' }, { status: 403 });
    }

    const body = await request.json();
    const { studentId, sessionType, scheduledDate, durationMinutes = 60, notes } = body || {};

    if (!studentId || !sessionType || !scheduledDate) {
      return NextResponse.json(
        { success: false, message: 'studentId, sessionType and scheduledDate are required' },
        { status: 400 }
      );
    }

    const scheduled = new Date(scheduledDate);
    if (Number.isNaN(scheduled.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid scheduledDate' },
        { status: 400 }
      );
    }

    // Ensure the student is assigned to this mentor.
    const assignmentCheck = await query(
      `SELECT 1
       FROM mentorship m
       WHERE m.mentor_id = $1 AND m.student_id = $2 AND m.is_active = true
       LIMIT 1`,
      [user.id, studentId]
    );
    if (!assignmentCheck.rows?.length) {
      return NextResponse.json(
        { success: false, message: 'Student is not assigned to you' },
        { status: 403 }
      );
    }

    const insert = await query(
      `INSERT INTO counseling_sessions (student_id, counselor_id, session_type, scheduled_date, duration_minutes, status, notes, is_confidential, created_at)
       VALUES ($1, $2, $3, $4, $5, 'scheduled', $6, true, NOW())
       RETURNING id`,
      [studentId, user.id, sessionType, scheduled.toISOString(), Number(durationMinutes) || 60, notes || null]
    );

    return NextResponse.json({ success: true, sessionId: insert.rows?.[0]?.id });
  } catch (error) {
    console.error('Error scheduling mentor session:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to schedule session' },
      { status: 500 }
    );
  }
}
