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

    const timeAgo = (date) => {
      const d = date instanceof Date ? date : new Date(date);
      const ms = Date.now() - d.getTime();
      if (!Number.isFinite(ms) || ms < 0) return 'Just now';
      const minutes = Math.floor(ms / 60000);
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
      const days = Math.floor(hours / 24);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    };

    const [messageEvents, submissionEvents, sessionEvents] = await Promise.all([
      query(
        `SELECT
          m.created_at as at,
          CONCAT('New message from ', COALESCE(s.first_name, ''), ' ', COALESCE(s.last_name, ''),
                 CASE WHEN m.subject IS NOT NULL AND m.subject <> '' THEN CONCAT(' (', m.subject, ')') ELSE '' END
          ) as description
        FROM messages m
        LEFT JOIN users s ON s.id = m.sender_id
        WHERE m.recipient_id = $1
        ORDER BY m.created_at DESC
        LIMIT 10`,
        [user.id]
      ),
      query(
        `SELECT
          s.submission_date as at,
          CONCAT(u.first_name, ' ', u.last_name, ' submitted: ', s.title) as description,
          s.review_status
        FROM idad_submissions s
        JOIN users u ON u.id = s.user_id
        WHERE s.instructor_id = $1
        ORDER BY s.submission_date DESC
        LIMIT 10`,
        [user.id]
      ),
      query(
        `SELECT
          cs.scheduled_date as at,
          CONCAT('Session ', cs.status, ': ', cs.session_type) as description,
          cs.status
        FROM counseling_sessions cs
        WHERE cs.counselor_id = $1
        ORDER BY cs.scheduled_date DESC NULLS LAST, cs.created_at DESC
        LIMIT 10`,
        [user.id]
      ),
    ]);

    const combined = [];
    for (const row of messageEvents.rows || []) {
      combined.push({ type: 'message', description: row.description, at: row.at });
    }
    for (const row of submissionEvents.rows || []) {
      combined.push({ type: row.review_status === 'pending' ? 'submission' : 'review', description: row.description, at: row.at });
    }
    for (const row of sessionEvents.rows || []) {
      combined.push({ type: 'session', description: row.description, at: row.at });
    }

    combined.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

    const activities = combined.slice(0, 15).map((e) => ({
      type: e.type,
      description: e.description,
      timestamp: timeAgo(e.at)
    }));

    return NextResponse.json({
      success: true,
      activities
    });

  } catch (error) {
    console.error('Error fetching mentor activity:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch mentor activity' },
      { status: 500 }
    );
  }
}