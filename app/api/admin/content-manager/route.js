import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection.js';
import { verifyAuth } from '@/lib/auth/middleware';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Get all content
export async function GET(request) {
  try {
    const admin = await verifyAuth(request);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('type');
    const status = searchParams.get('status');

    let query = 'SELECT * FROM content_management WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (contentType) {
      query += ` AND content_type = $${paramCount}`;
      params.push(contentType);
      paramCount++;
    }

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ' ORDER BY updated_at DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      content: result.rows
    });
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// Create or update content
export async function POST(request) {
  try {
    const admin = await verifyAuth(request);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { contentKey, contentType, title, content, imageUrl, metadata, status } = await request.json();

    if (!contentKey || !contentType) {
      return NextResponse.json(
        { success: false, message: 'Content key and type are required' },
        { status: 400 }
      );
    }

    // Check if content exists
    const existingContent = await pool.query(
      'SELECT id FROM content_management WHERE content_key = $1',
      [contentKey]
    );

    let result;
    if (existingContent.rows.length > 0) {
      // Update existing content
      result = await pool.query(
        `UPDATE content_management 
         SET content_type = $1, title = $2, content = $3, image_url = $4, 
             metadata = $5, status = $6, updated_by = $7, updated_at = CURRENT_TIMESTAMP
         WHERE content_key = $8
         RETURNING *`,
        [contentType, title, content, imageUrl, metadata ? JSON.stringify(metadata) : null, 
         status || 'draft', admin.id, contentKey]
      );

      // Log audit
      await pool.query(
        `INSERT INTO audit_logs (user_id, action_type, action_description, target_type, target_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [admin.id, 'CONTENT_UPDATE', `Updated content: ${contentKey}`, 'content', contentKey]
      );
    } else {
      // Create new content
      result = await pool.query(
        `INSERT INTO content_management 
         (content_key, content_type, title, content, image_url, metadata, status, created_by, updated_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
         RETURNING *`,
        [contentKey, contentType, title, content, imageUrl, 
         metadata ? JSON.stringify(metadata) : null, status || 'draft', admin.id]
      );

      // Log audit
      await pool.query(
        `INSERT INTO audit_logs (user_id, action_type, action_description, target_type, target_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [admin.id, 'CONTENT_CREATE', `Created content: ${contentKey}`, 'content', contentKey]
      );
    }

    return NextResponse.json({
      success: true,
      content: result.rows[0],
      message: existingContent.rows.length > 0 ? 'Content updated successfully' : 'Content created successfully'
    });
  } catch (error) {
    console.error('Save content error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save content', error: error.message },
      { status: 500 }
    );
  }
}

// Delete content
export async function DELETE(request) {
  try {
    const admin = await verifyAuth(request);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const contentKey = searchParams.get('key');

    if (!contentKey) {
      return NextResponse.json(
        { success: false, message: 'Content key is required' },
        { status: 400 }
      );
    }

    await pool.query('DELETE FROM content_management WHERE content_key = $1', [contentKey]);

    // Log audit
    await pool.query(
      `INSERT INTO audit_logs (user_id, action_type, action_description, target_type, target_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [admin.id, 'CONTENT_DELETE', `Deleted content: ${contentKey}`, 'content', contentKey]
    );

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
