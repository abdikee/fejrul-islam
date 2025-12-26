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
        a.id,
        a.title,
        a.description,
        a.assignment_type,
        a.due_date,
        a.priority,
        a.is_active,
        c.title as course_title,
        COUNT(ua.id) as total_assigned,
        COUNT(CASE WHEN ua.status IN ('submitted', 'graded') OR ua.submission_id IS NOT NULL THEN 1 END) as submissions
      FROM assignments a
      LEFT JOIN courses c ON c.id = a.course_id
      LEFT JOIN user_assignments ua ON ua.assignment_id = a.id
      WHERE a.instructor_id = $1
      GROUP BY a.id, c.title
      ORDER BY a.created_at DESC`,
      [user.id]
    );

    const assignments = (result.rows || []).map((row) => {
      const dueDate = row.due_date ? new Date(row.due_date).toISOString().slice(0, 10) : null;
      const dueInFuture = row.due_date ? new Date(row.due_date).getTime() >= Date.now() : true;
      const status = row.is_active && dueInFuture ? 'active' : 'completed';
      return {
        id: row.id,
        title: row.title,
        course: row.course_title || '—',
        dueDate,
        submissions: Number(row.submissions || 0),
        total: Number(row.total_assigned || 0),
        status,
      };
    });

    return NextResponse.json({ success: true, assignments });
  } catch (error) {
    console.error('Error fetching mentor assignments:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch assignments' },
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
    const {
      title,
      description,
      assignmentType,
      dueDate,
      priority = 'medium',
      courseId = null,
      assignAll = true,
    } = body || {};

    if (!title) {
      return NextResponse.json(
        { success: false, message: 'title is required' },
        { status: 400 }
      );
    }

    const due = dueDate ? new Date(dueDate) : null;
    if (dueDate && Number.isNaN(due?.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid dueDate' },
        { status: 400 }
      );
    }

    const insert = await query(
      `INSERT INTO assignments (course_id, instructor_id, title, description, assignment_type, due_date, priority, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW())
       RETURNING id`,
      [courseId, user.id, title, description || null, assignmentType || null, due ? due.toISOString() : null, priority]
    );

    const assignmentId = insert.rows?.[0]?.id;

    if (assignAll && assignmentId) {
      const students = await query(
        `SELECT m.student_id
         FROM mentorship m
         WHERE m.mentor_id = $1 AND m.is_active = true`,
        [user.id]
      );

      for (const row of students.rows || []) {
        await query(
          `INSERT INTO user_assignments (assignment_id, user_id, status, created_at)
           VALUES ($1, $2, 'assigned', NOW())
           ON CONFLICT DO NOTHING`,
          [assignmentId, row.student_id]
        );
      }
    }

    return NextResponse.json({ success: true, assignmentId });
  } catch (error) {
    console.error('Error creating mentor assignment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create assignment' },
      { status: 500 }
    );
  }
}
