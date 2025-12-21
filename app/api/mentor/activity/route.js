import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Verify mentor authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'mentor') {
      return NextResponse.json({ success: false, message: 'Mentor access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get recent activity related to this mentor
    const [
      recentSubmissions,
      recentAssignments,
      recentSessions
    ] = await Promise.all([
      // Recent submissions for review
      query(`
        SELECT 'submission' as type,
               CONCAT(u.first_name, ' ', u.last_name, ' submitted: ', s.title) as description,
               s.submission_date as timestamp
        FROM idad_submissions s
        JOIN users u ON s.user_id = u.id
        WHERE s.instructor_id = $1 AND s.submission_date > NOW() - INTERVAL '7 days'
        ORDER BY s.submission_date DESC
        LIMIT 3
      `, [decoded.userId]),
      
      // Recent assignments created
      query(`
        SELECT 'assignment' as type,
               CONCAT('Created assignment: ', title) as description,
               created_at as timestamp
        FROM assignments
        WHERE instructor_id = $1 AND created_at > NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC
        LIMIT 3
      `, [decoded.userId]),
      
      // Recent counseling sessions
      query(`
        SELECT 'session' as type,
               CONCAT('Counseling session with ', u.first_name, ' ', u.last_name) as description,
               cs.scheduled_date as timestamp
        FROM counseling_sessions cs
        JOIN users u ON cs.student_id = u.id
        WHERE cs.counselor_id = $1 AND cs.scheduled_date > NOW() - INTERVAL '7 days'
        ORDER BY cs.scheduled_date DESC
        LIMIT 3
      `, [decoded.userId])
    ]);

    // Combine and sort all activities
    const allActivities = [
      ...recentSubmissions.rows,
      ...recentAssignments.rows,
      ...recentSessions.rows
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
     .slice(0, limit)
     .map(activity => ({
       ...activity,
       timestamp: formatTimeAgo(activity.timestamp)
     }));

    return NextResponse.json({
      success: true,
      activities: allActivities
    });

  } catch (error) {
    console.error('Error fetching mentor activity:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch mentor activity' },
      { status: 500 }
    );
  }
}

function formatTimeAgo(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  return date.toLocaleDateString();
}