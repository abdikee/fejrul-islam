import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sectorId = searchParams.get('sectorId');
    const resourceType = searchParams.get('resourceType');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query conditions
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (sectorId) {
      whereConditions.push(`(r.sector_id = $${paramIndex} OR r.sector_id IS NULL)`);
      queryParams.push(parseInt(sectorId));
      paramIndex++;
    }

    if (resourceType) {
      whereConditions.push(`r.resource_type = $${paramIndex}`);
      queryParams.push(resourceType);
      paramIndex++;
    }

    // Add access level filter (public resources only for non-authenticated requests)
    whereConditions.push(`r.access_level = 'public'`);

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get resources with sector info
    const resourcesQuery = `
      SELECT 
        r.id, r.title, r.description, r.resource_type, r.file_path, 
        r.file_size, r.download_count, r.created_at,
        ls.name as sector_name, ls.color as sector_color
      FROM resources r
      LEFT JOIN learning_sectors ls ON r.sector_id = ls.id
      ${whereClause}
      ORDER BY r.created_at DESC 
      LIMIT $${paramIndex}
    `;

    queryParams.push(limit);

    const result = await query(resourcesQuery, queryParams);

    return NextResponse.json({
      success: true,
      resources: result.rows
    });

  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('download');

    if (resourceId) {
      // Increment download count
      await query(
        'UPDATE resources SET download_count = download_count + 1 WHERE id = $1',
        [resourceId]
      );

      return NextResponse.json({
        success: true,
        message: 'Download count updated'
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating download count:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update download count' },
      { status: 500 }
    );
  }
}