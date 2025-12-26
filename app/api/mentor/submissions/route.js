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

    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') || 'pending').toLowerCase();

    const params = [user.id];
    let statusClause = '';
    if (status !== 'all') {
      params.push(status);
      statusClause = ` AND s.review_status = $2`;
    }

    const result = await query(
      `SELECT
        s.id,
        s.submission_date,
        s.review_status,
        COALESCE(a.title, s.title) as assignment_title,
        CONCAT(u.first_name, ' ', u.last_name) as student_name
      FROM idad_submissions s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN user_assignments ua ON ua.submission_id = s.id
      LEFT JOIN assignments a ON a.id = ua.assignment_id
      WHERE s.instructor_id = $1${statusClause}
      ORDER BY s.submission_date DESC`,
      params
    );

    const submissions = (result.rows || []).map((row) => ({
      id: row.id,
      student: row.student_name,
      assignment: row.assignment_title,
      submittedAt: row.submission_date ? new Date(row.submission_date).toISOString().slice(0, 10) : null,
      status: row.review_status,
    }));

    return NextResponse.json({ success: true, submissions });
  } catch (error) {
    console.error('Error fetching mentor submissions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
