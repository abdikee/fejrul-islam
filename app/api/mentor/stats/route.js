import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/middleware.js';
import { query } from '@/lib/db/connection';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Verify mentor authentication
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'mentor') {
      return NextResponse.json({ success: false, message: 'Mentor access required' }, { status: 403 });
    }

    const [studentsResult, pendingSubmissionsResult, activeAssignmentsResult, upcomingSessionsResult, messagesUnreadResult, completionRateResult] = await Promise.all([
      query(
        `SELECT COUNT(*)::int as total_students
         FROM mentorship m
         WHERE m.mentor_id = $1 AND m.is_active = true`,
        [user.id]
      ),
      query(
        `SELECT COUNT(*)::int as pending_submissions
         FROM idad_submissions s
         WHERE s.instructor_id = $1 AND s.review_status = 'pending'`,
        [user.id]
      ),
      query(
        `SELECT COUNT(*)::int as active_assignments
         FROM assignments a
         WHERE a.instructor_id = $1 AND a.is_active = true`,
        [user.id]
      ),
      query(
        `SELECT COUNT(*)::int as upcoming_sessions
         FROM counseling_sessions cs
         WHERE cs.counselor_id = $1
           AND cs.status = 'scheduled'
           AND cs.scheduled_date >= NOW()`,
        [user.id]
      ),
      query(
        `SELECT COUNT(*)::int as unread
         FROM messages m
         WHERE m.recipient_id = $1 AND m.is_read = false`,
        [user.id]
      ),
      query(
        `SELECT COALESCE(AVG(up.progress_percentage), 0) as avg_progress
         FROM mentorship m
         JOIN user_progress up ON up.user_id = m.student_id
         WHERE m.mentor_id = $1 AND m.is_active = true`,
        [user.id]
      ),
    ]);

    const stats = {
      totalStudents: Number(studentsResult.rows?.[0]?.total_students || 0),
      pendingSubmissions: Number(pendingSubmissionsResult.rows?.[0]?.pending_submissions || 0),
      activeAssignments: Number(activeAssignmentsResult.rows?.[0]?.active_assignments || 0),
      upcomingSessions: Number(upcomingSessionsResult.rows?.[0]?.upcoming_sessions || 0),
      messagesUnread: Number(messagesUnreadResult.rows?.[0]?.unread || 0),
      completionRate: Math.round(Number(completionRateResult.rows?.[0]?.avg_progress || 0))
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching mentor stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch mentor statistics' },
      { status: 500 }
    );
  }
}