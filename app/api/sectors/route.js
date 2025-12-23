import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection.js';
import { verifyAuth } from '@/lib/auth/middleware';

export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Get all active sectors
    const sectorsQuery = `
      SELECT 
        s.*,
        CASE 
          WHEN sse.id IS NOT NULL THEN true 
          ELSE false 
        END as is_enrolled,
        sse.sector_status,
        sse.enrollment_date,
        sse.current_level_id
      FROM sectors s
      LEFT JOIN student_sector_enrollments sse 
        ON s.id = sse.sector_id AND sse.user_id = $1
      WHERE s.is_active = true
      ORDER BY s.display_order
    `;

    const sectorsResult = await pool.query(sectorsQuery, [userId]);

    // Get level counts for each sector
    const levelsQuery = `
      SELECT sector_id, COUNT(*) as level_count
      FROM sector_levels
      WHERE is_active = true
      GROUP BY sector_id
    `;
    const levelsResult = await pool.query(levelsQuery);
    const levelCounts = {};
    levelsResult.rows.forEach(row => {
      levelCounts[row.sector_id] = parseInt(row.level_count);
    });

    // Add level counts to sectors
    const sectors = sectorsResult.rows.map(sector => ({
      ...sector,
      level_count: levelCounts[sector.id] || 0
    }));

    return NextResponse.json({
      success: true,
      sectors
    });

  } catch (error) {
    console.error('Error fetching sectors:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sectors', error: error.message },
      { status: 500 }
    );
  }
}
