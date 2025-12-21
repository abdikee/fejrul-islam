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

    // Get mentor statistics
    const [
      studentsResult,
      submissionsResult,
      assignmentsResult,
      sessionsResult,
      messagesResult
    ] = await Promise.all([
      // Total students assigned to this mentor
      query('SELECT COUNT(*) as count FROM mentorship WHERE mentor_id = $1 AND is_active = true', [decoded.userId]),
      
      // Pending submissions for review
      query('SELECT COUNT(*) as count FROM idad_submissions WHERE instructor_id = $1 AND review_status = \'pending\'', [decoded.userId]),
      
      // Active assignments created by this mentor
      query('SELECT COUNT(*) as count FROM assignments WHERE instructor_id = $1 AND is_active = true', [decoded.userId]),
      
      // Upcoming counseling sessions
      query('SELECT COUNT(*) as count FROM counseling_sessions WHERE counselor_id = $1 AND status = \'scheduled\' AND scheduled_date > NOW()', [decoded.userId]),
      
      // Unread messages (placeholder - you'll need to implement message system)
      Promise.resolve({ rows: [{ count: 0 }] })
    ]);

    // Calculate completion rate (placeholder calculation)
    const completionRate = 85; // This should be calculated based on actual student progress

    const stats = {
      totalStudents: parseInt(studentsResult.rows[0].count),
      pendingSubmissions: parseInt(submissionsResult.rows[0].count),
      activeAssignments: parseInt(assignmentsResult.rows[0].count),
      upcomingSessions: parseInt(sessionsResult.rows[0].count),
      messagesUnread: parseInt(messagesResult.rows[0].count),
      completionRate: completionRate
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