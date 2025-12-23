import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/middleware.js';
import pool from '@/lib/db/connection.js';

export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get or create user progress
    let progressQuery = `
      SELECT * FROM qirat_user_progress WHERE user_id = $1
    `;
    
    let result = await pool.query(progressQuery, [user.id]);
    
    if (result.rows.length === 0) {
      // Create initial progress
      const insertQuery = `
        INSERT INTO qirat_user_progress (user_id, current_level, current_book)
        VALUES ($1, 1, 1)
        RETURNING *
      `;
      result = await pool.query(insertQuery, [user.id]);
    }

    return NextResponse.json({
      success: true,
      progress: result.rows[0]
    });

  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { current_level, current_book, level_completed } = await request.json();

    let updateQuery = `
      UPDATE qirat_user_progress 
      SET current_level = $1, 
          current_book = $2,
          updated_at = NOW()
    `;
    
    const params = [current_level, current_book];
    
    if (level_completed) {
      updateQuery += `, level_${level_completed}_completed = true`;
    }
    
    updateQuery += ` WHERE user_id = $3 RETURNING *`;
    params.push(user.id);

    const result = await pool.query(updateQuery, params);

    return NextResponse.json({
      success: true,
      progress: result.rows[0]
    });

  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
