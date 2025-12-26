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

    const submissionId = params?.id;
    const result = await query(
      `SELECT
        s.id,
        s.title,
        s.description,
        s.file_path,
        s.submission_type,
        s.submission_date,
        s.review_status,
        s.score,
        s.feedback,
        CONCAT(u.first_name, ' ', u.last_name) as student_name,
        u.email as student_email,
        COALESCE(a.title, s.title) as assignment_title
      FROM idad_submissions s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN user_assignments ua ON ua.submission_id = s.id
      LEFT JOIN assignments a ON a.id = ua.assignment_id
      WHERE s.id = $1 AND s.instructor_id = $2
      LIMIT 1`,
      [submissionId, user.id]
    );

    const submission = result.rows?.[0];
    if (!submission) {
      return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'mentor') {
      return NextResponse.json({ success: false, message: 'Mentor access required' }, { status: 403 });
    }

    const submissionId = params?.id;
    const body = await request.json();
    const { reviewStatus, score, feedback } = body || {};

    if (!reviewStatus) {
      return NextResponse.json(
        { success: false, message: 'reviewStatus is required' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE idad_submissions
       SET review_status = $1,
           score = $2,
           feedback = $3,
           reviewed_at = NOW()
       WHERE id = $4 AND instructor_id = $5`,
      [reviewStatus, score ?? null, feedback ?? null, submissionId, user.id]
    );

    await query(
      `UPDATE user_assignments
       SET status = 'graded', graded_at = NOW()
       WHERE submission_id = $1`,
      [submissionId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reviewing submission:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
