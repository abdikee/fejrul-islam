import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const type = searchParams.get('type');
    const audience = searchParams.get('audience') || 'all';

    // Build query conditions
    let whereConditions = [
      'is_active = true',
      '(expire_date IS NULL OR expire_date > NOW())',
      'publish_date <= NOW()'
    ];
    let queryParams = [];
    let paramIndex = 1;

    if (type) {
      whereConditions.push(`announcement_type = $${paramIndex}`);
      queryParams.push(type);
      paramIndex++;
    }

    // Filter by target audience
    whereConditions.push(`(target_audience = 'all' OR target_audience = $${paramIndex})`);
    queryParams.push(audience);
    paramIndex++;

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    // Get recent announcements
    const announcementsQuery = `
      SELECT 
        id, title, content, announcement_type, priority, 
        publish_date, created_at, target_audience
      FROM announcements
      ${whereClause}
      ORDER BY 
        CASE priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'normal' THEN 3 
          WHEN 'low' THEN 4 
        END,
        created_at DESC 
      LIMIT $${paramIndex}
    `;

    queryParams.push(limit);

    const result = await query(announcementsQuery, queryParams);

    return NextResponse.json({
      success: true,
      announcements: result.rows
    });

  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}