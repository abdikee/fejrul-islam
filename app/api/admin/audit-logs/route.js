import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection.js';
import { verifyAuth } from '@/lib/auth/middleware';

export async function GET(request) {
  try {
    // Verify admin authentication
    const admin = await verifyAuth(request);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const actionType = searchParams.get('actionType');
    const userId = searchParams.get('userId');

    let query = `
      SELECT 
        al.*,
        u.first_name,
        u.last_name,
        u.email,
        u.role
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (actionType) {
      query += ` AND al.action_type = $${paramCount}`;
      params.push(actionType);
      paramCount++;
    }

    if (userId) {
      query += ` AND al.user_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    }

    query += ` ORDER BY al.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM audit_logs WHERE 1=1';
    const countParams = [];
    let countParamCount = 1;

    if (actionType) {
      countQuery += ` AND action_type = $${countParamCount}`;
      countParams.push(actionType);
      countParamCount++;
    }

    if (userId) {
      countQuery += ` AND user_id = $${countParamCount}`;
      countParams.push(userId);
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      success: true,
      logs: result.rows,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Audit logs error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch audit logs', error: error.message },
      { status: 500 }
    );
  }
}

// Create new audit log entry
export async function POST(request) {
  try {
    const admin = await verifyAuth(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { actionType, actionDescription, targetType, targetId, metadata } = await request.json();

    const result = await pool.query(
      `INSERT INTO audit_logs (user_id, action_type, action_description, target_type, target_id, metadata, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        admin.id,
        actionType,
        actionDescription,
        targetType || null,
        targetId || null,
        metadata ? JSON.stringify(metadata) : null,
        request.headers.get('x-forwarded-for') || 'unknown'
      ]
    );

    return NextResponse.json({
      success: true,
      log: result.rows[0]
    });
  } catch (error) {
    console.error('Create audit log error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
