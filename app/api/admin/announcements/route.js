import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || '';

    const offset = (page - 1) * limit;

    // Build query conditions
    let whereConditions = ['is_active = true'];
    let queryParams = [];
    let paramIndex = 1;

    if (type) {
      whereConditions.push(`announcement_type = $${paramIndex}`);
      queryParams.push(type);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get announcements with creator info
    const announcementsQuery = `
      SELECT 
        a.id, a.title, a.content, a.announcement_type, a.target_audience,
        a.department, a.priority, a.publish_date, a.expire_date, a.created_at,
        u.first_name, u.last_name
      FROM announcements a
      LEFT JOIN users u ON a.created_by = u.id
      ${whereClause}
      ORDER BY a.created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const [announcementsResult, countResult] = await Promise.all([
      query(announcementsQuery, queryParams),
      query(`SELECT COUNT(*) as total FROM announcements ${whereClause}`, queryParams.slice(0, -2))
    ]);

    const totalAnnouncements = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalAnnouncements / limit);

    return NextResponse.json({
      success: true,
      announcements: announcementsResult.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalAnnouncements,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      title, content, announcementType, targetAudience, 
      department, priority, expireDate 
    } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Create announcement
    const newAnnouncementResult = await query(`
      INSERT INTO announcements (
        title, content, announcement_type, target_audience, 
        department, priority, expire_date, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, title, announcement_type, priority, created_at
    `, [
      title, content, announcementType || 'general', targetAudience || 'all',
      department, priority || 'normal', expireDate, decoded.userId
    ]);

    return NextResponse.json({
      success: true,
      message: 'Announcement created successfully',
      announcement: newAnnouncementResult.rows[0]
    });

  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      announcementId, title, content, announcementType, 
      targetAudience, department, priority, expireDate, isActive 
    } = body;

    if (!announcementId) {
      return NextResponse.json(
        { success: false, message: 'Announcement ID is required' },
        { status: 400 }
      );
    }

    // Update announcement
    const updateResult = await query(`
      UPDATE announcements SET 
        title = $1, content = $2, announcement_type = $3, 
        target_audience = $4, department = $5, priority = $6, 
        expire_date = $7, is_active = $8
      WHERE id = $9
      RETURNING id, title, announcement_type, priority, is_active
    `, [
      title, content, announcementType, targetAudience, 
      department, priority, expireDate, isActive, announcementId
    ]);

    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Announcement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Announcement updated successfully',
      announcement: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update announcement' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const announcementId = searchParams.get('announcementId');

    if (!announcementId) {
      return NextResponse.json(
        { success: false, message: 'Announcement ID is required' },
        { status: 400 }
      );
    }

    // Soft delete announcement
    const deleteResult = await query(`
      UPDATE announcements SET is_active = false
      WHERE id = $1
      RETURNING id, title
    `, [announcementId]);

    if (deleteResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Announcement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully',
      announcement: deleteResult.rows[0]
    });

  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}