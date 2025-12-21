import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sectorId = searchParams.get('sectorId');
    const level = searchParams.get('level');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query conditions
    let whereConditions = ['c.is_active = true'];
    let queryParams = [];
    let paramIndex = 1;

    if (sectorId) {
      whereConditions.push(`c.sector_id = $${paramIndex}`);
      queryParams.push(parseInt(sectorId));
      paramIndex++;
    }

    if (level) {
      whereConditions.push(`c.level = $${paramIndex}`);
      queryParams.push(level);
      paramIndex++;
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    // Get courses with sector info
    const coursesQuery = `
      SELECT 
        c.id, c.title, c.description, c.level, c.duration_weeks, 
        c.prerequisites, c.learning_objectives, c.created_at,
        ls.name as sector_name, ls.description as sector_description,
        ls.icon as sector_icon, ls.color as sector_color
      FROM courses c
      LEFT JOIN learning_sectors ls ON c.sector_id = ls.id
      ${whereClause}
      ORDER BY c.created_at DESC 
      LIMIT $${paramIndex}
    `;

    queryParams.push(limit);

    const result = await query(coursesQuery, queryParams);

    return NextResponse.json({
      success: true,
      courses: result.rows
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}