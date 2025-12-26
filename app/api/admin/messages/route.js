import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      recipientIds, 
      subject, 
      content, 
      messageType = 'admin_broadcast', 
      priority = 'normal',
      sendToAll = false,
      filterBy = null // 'students', 'mentors', 'sector', etc.
    } = body;

    if (!content || (!recipientIds && !sendToAll)) {
      return NextResponse.json(
        { success: false, message: 'Content and recipients are required' },
        { status: 400 }
      );
    }

    let targetUserIds = [];

    if (sendToAll) {
      // Send to all users based on filter
      let userQuery = 'SELECT id FROM users WHERE id != $1'; // Exclude admin
      let queryParams = [decoded.userId];

      if (filterBy === 'students') {
        userQuery += ' AND role = $2';
        queryParams.push('student');
      } else if (filterBy === 'mentors') {
        userQuery += ' AND role = $2';
        queryParams.push('mentor');
      } else if (filterBy && filterBy.startsWith('sector:')) {
        const sectorName = filterBy.replace('sector:', '');
        userQuery += ` AND id IN (
          SELECT DISTINCT user_id FROM student_sector_enrollments sse
          JOIN sectors s ON sse.sector_code = s.code
          WHERE s.name = $2
        )`;
        queryParams.push(sectorName);
      }

      const usersResult = await query(userQuery, queryParams);
      targetUserIds = usersResult.rows.map(row => row.id);
    } else {
      targetUserIds = recipientIds;
    }

    if (targetUserIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid recipients found' },
        { status: 400 }
      );
    }

    // Insert messages for all recipients
    const insertPromises = targetUserIds.map(recipientId => {
      return query(
        `INSERT INTO messages (sender_id, recipient_id, subject, content, message_type, priority, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [decoded.userId, recipientId, subject, content, messageType, priority]
      );
    });

    await Promise.all(insertPromises);

    return NextResponse.json({
      success: true,
      message: `Message sent successfully to ${targetUserIds.length} recipients`,
      recipientCount: targetUserIds.length
    });

  } catch (error) {
    console.error('Error sending admin message:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    // Get message templates
    const templatesQuery = `
      SELECT id, title, subject, content, template_type, is_active, created_at
      FROM admin_message_templates
      WHERE is_active = TRUE
      ORDER BY template_type, title
    `;

    const templatesResult = await query(templatesQuery);

    // Get user statistics for targeting
    const statsQuery = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'student' THEN 1 END) as students,
        COUNT(CASE WHEN role = 'mentor' THEN 1 END) as mentors,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins
      FROM users
    `;

    const statsResult = await query(statsQuery);

    // Get sector enrollment counts
    const sectorStatsQuery = `
      SELECT 
        s.name as sector_name,
        COUNT(DISTINCT sse.user_id) as enrolled_users
      FROM sectors s
      LEFT JOIN student_sector_enrollments sse ON s.code = sse.sector_code
      GROUP BY s.id, s.name
      ORDER BY s.name
    `;

    const sectorStatsResult = await query(sectorStatsQuery);

    return NextResponse.json({
      success: true,
      templates: templatesResult.rows,
      userStats: statsResult.rows[0],
      sectorStats: sectorStatsResult.rows
    });

  } catch (error) {
    console.error('Error fetching admin messaging data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch messaging data' },
      { status: 500 }
    );
  }
}