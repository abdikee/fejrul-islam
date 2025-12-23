import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection.js';

export async function GET(request) {
  try {
    // Fetch all levels
    const levelsQuery = `
      SELECT * FROM qirat_levels ORDER BY level_number ASC
    `;
    const levelsResult = await pool.query(levelsQuery);

    // Fetch all books
    const booksQuery = `
      SELECT * FROM qirat_books ORDER BY level_id ASC, order_index ASC
    `;
    const booksResult = await pool.query(booksQuery);

    return NextResponse.json({
      success: true,
      levels: levelsResult.rows,
      books: booksResult.rows
    });

  } catch (error) {
    console.error('Levels fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
