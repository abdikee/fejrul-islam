import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/middleware.js';
import { query } from '@/lib/db/connection';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'mentor') {
      return NextResponse.json({ success: false, message: 'Mentor access required' }, { status: 403 });
    }

    const assignmentId = params?.id;

    const result = await query(
      `SELECT
        a.id,
        a.title,
        a.description,
        a.assignment_type,
        a.due_date,
        a.priority,
        a.is_active,
        a.created_at,
        c.title as course_title,
        COUNT(ua.id) as total_assigned,
        COUNT(CASE WHEN ua.status IN ('submitted', 'graded') OR ua.submission_id IS NOT NULL THEN 1 END) as submissions
      FROM assignments a
      LEFT JOIN courses c ON c.id = a.course_id
      LEFT JOIN user_assignments ua ON ua.assignment_id = a.id
      WHERE a.id = $1 AND a.instructor_id = $2
      GROUP BY a.id, c.title
      LIMIT 1`,
      [assignmentId, user.id]
    );

    const row = result.rows?.[0];
    if (!row) {
      return NextResponse.json({ success: false, message: 'Assignment not found' }, { status: 404 });
    }

    const assignment = {
      id: row.id,
      title: row.title,
      description: row.description,
      assignmentType: row.assignment_type,
      dueDate: row.due_date ? new Date(row.due_date).toISOString() : null,
      priority: row.priority,
      isActive: row.is_active,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
      course: row.course_title || '—',
      submissions: Number(row.submissions || 0),
      total: Number(row.total_assigned || 0),
    };

    return NextResponse.json({ success: true, assignment });
  } catch (error) {
    console.error('Error fetching mentor assignment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch assignment' },
      { status: 500 }
    );
  }
}
