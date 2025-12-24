import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection';
import { getServerSession } from 'next-auth'; // Or however auth is handled
// Assuming there is some auth check middleware or utility

export async function GET(request) {
  try {
    // TODO: Add admin authentication check here
    // For now, we assume the middleware handles route protection or we check session
    
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
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
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
        { error: 'Submission not found' },
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
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
