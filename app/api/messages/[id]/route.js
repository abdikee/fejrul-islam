import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userId = decoded.userId;
    const messageId = params.id;

    // Get message with sender and recipient details
    const messageQuery = `
      SELECT 
        m.*,
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
      WHERE m.id = $1 AND (m.sender_id = $2 OR m.recipient_id = $2)
    `;

    const result = await query(messageQuery, [messageId, userId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userId = decoded.userId;
    const messageId = params.id;

    const body = await request.json();
    const { isRead, isArchived } = body;

    // Verify user has access to this message
    const accessCheck = await query(
      'SELECT id, recipient_id FROM messages WHERE id = $1 AND (sender_id = $2 OR recipient_id = $2)',
      [messageId, userId]
    );

    if (accessCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }

    const message = accessCheck.rows[0];

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (typeof isRead === 'boolean') {
      updates.push(`is_read = $${paramCount}`);
      values.push(isRead);
      paramCount++;

      if (isRead && message.recipient_id === userId) {
        updates.push(`read_at = NOW()`);
      }
    }

    if (typeof isArchived === 'boolean') {
      updates.push(`is_archived = $${paramCount}`);
      values.push(isArchived);
      paramCount++;
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid updates provided' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = NOW()`);
    values.push(messageId);

    const updateQuery = `
      UPDATE messages 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await query(updateQuery, values);

    return NextResponse.json({
      success: true,
      message: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userId = decoded.userId;
    const messageId = params.id;

    // Verify user has access to this message (only sender can delete)
    const accessCheck = await query(
      'SELECT id FROM messages WHERE id = $1 AND sender_id = $2',
      [messageId, userId]
    );

    if (accessCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Message not found or access denied' },
        { status: 404 }
      );
    }

    // Delete the message
    await query('DELETE FROM messages WHERE id = $1', [messageId]);

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete message' },
      { status: 500 }
    );
  }
}