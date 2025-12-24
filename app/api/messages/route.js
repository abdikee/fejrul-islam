import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userId = decoded.userId;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // all, sent, received, unread
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereClause = '';
    let queryParams = [userId];

    switch (type) {
      case 'sent':
        whereClause = 'WHERE m.sender_id = $1';
        break;
      case 'received':
        whereClause = 'WHERE m.recipient_id = $1';
        break;
      case 'unread':
        whereClause = 'WHERE m.recipient_id = $1 AND m.is_read = FALSE';
        break;
      default:
        whereClause = 'WHERE (m.sender_id = $1 OR m.recipient_id = $1)';
    }

    const messagesQuery = `
      SELECT 
        m.id,
        m.subject,
        m.content,
        m.message_type,
        m.priority,
        m.is_read,
        m.is_archived,
        COALESCE(m.created_at, m.sent_at) as created_at,
        m.read_at,
        m.sent_at,
        sender.first_name as sender_first_name,
        sender.last_name as sender_last_name,
        sender.email as sender_email,
        sender.role as sender_role,
        recipient.first_name as recipient_first_name,
        recipient.last_name as recipient_last_name,
        recipient.email as recipient_email,
        recipient.role as recipient_role
      FROM messages m
      LEFT JOIN users sender ON m.sender_id = sender.id
      LEFT JOIN users recipient ON m.recipient_id = recipient.id
      ${whereClause}
      ORDER BY COALESCE(m.created_at, m.sent_at) DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    queryParams.push(limit, offset);

    const result = await query(messagesQuery, queryParams);

    // Get unread count
    const unreadCountQuery = `
      SELECT COUNT(*) as unread_count
      FROM messages
      WHERE recipient_id = $1 AND is_read = FALSE
    `;
    const unreadResult = await query(unreadCountQuery, [userId]);

    return NextResponse.json({
      success: true,
      messages: result.rows,
      unreadCount: parseInt(unreadResult.rows[0].unread_count),
      pagination: {
        limit,
        offset,
        hasMore: result.rows.length === limit
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const senderId = decoded.userId;

    const body = await request.json();
    const { recipientId, subject, content, messageType = 'direct', priority = 'normal' } = body;

    if (!recipientId || !content) {
      return NextResponse.json(
        { success: false, message: 'Recipient and content are required' },
        { status: 400 }
      );
    }

    // Verify recipient exists
    const recipientCheck = await query('SELECT id FROM users WHERE id = $1', [recipientId]);
    if (recipientCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Recipient not found' },
        { status: 404 }
      );
    }

    // Insert message
    const insertQuery = `
      INSERT INTO messages (sender_id, recipient_id, subject, content, message_type, priority, sent_at, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;

    const result = await query(insertQuery, [
      senderId,
      recipientId,
      subject,
      content,
      messageType,
      priority
    ]);

    return NextResponse.json({
      success: true,
      message: result.rows[0],
      message_text: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 }
    );
  }
}