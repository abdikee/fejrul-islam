import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection.js';
import { verifyAuth } from '@/lib/auth/middleware';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function requireAdmin(request) {
  const user = await verifyAuth(request);
  if (!user) {
    return { ok: false, response: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }) };
  }
  if (user.role !== 'admin') {
    return { ok: false, response: NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 }) };
  }
  return { ok: true, user };
}

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;
    
    const query = `
      SELECT * FROM contact_submissions 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);

    return NextResponse.json({
      success: true,
      submissions: result.rows
    });

  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'ID and status are required' },
        { status: 400 }
      );
    }

    const query = `
      UPDATE contact_submissions 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, id]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      submission: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
