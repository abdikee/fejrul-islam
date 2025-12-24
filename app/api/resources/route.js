import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

async function columnExists(tableName, columnName) {
  const result = await query(
    `
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name = $2
      LIMIT 1
    `,
    [tableName, columnName]
  );

  return result.rows.length > 0;
}

function accessLevelsForRole(role) {
  switch (role) {
    case 'admin':
      return ['public', 'student', 'mentor', 'admin'];
    case 'mentor':
      return ['public', 'student', 'mentor'];
    case 'student':
      return ['public', 'student'];
    default:
      return ['public'];
  }
}

export async function GET(request) {
  try {
    const hasIsActive = await columnExists('resources', 'is_active');

    const { searchParams } = new URL(request.url);
    const sectorId = searchParams.get('sectorId');
    const courseId = searchParams.get('courseId');
    const resourceType = searchParams.get('resourceType');
    const limit = parseInt(searchParams.get('limit') || '10');

    let role = null;
    const token = request.cookies.get('auth-token')?.value;
    if (token) {
      try {
        const decoded = verifyJwtToken(token);
        const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
        role = userResult.rows?.[0]?.role || null;
      } catch {
        role = null;
      }
    }

    const allowedAccessLevels = accessLevelsForRole(role);

    // Build query conditions
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (sectorId) {
      whereConditions.push(`(r.sector_id = $${paramIndex} OR r.sector_id IS NULL)`);
      queryParams.push(parseInt(sectorId));
      paramIndex++;
    }

    if (courseId) {
      whereConditions.push(`r.course_id = $${paramIndex}`);
      queryParams.push(parseInt(courseId));
      paramIndex++;
    }

    if (resourceType) {
      whereConditions.push(`r.resource_type = $${paramIndex}`);
      queryParams.push(resourceType);
      paramIndex++;
    }

    // Access level filter (public for unauth; include student/mentor/admin when authenticated)
    whereConditions.push(`r.access_level = ANY($${paramIndex}::text[])`);
    queryParams.push(allowedAccessLevels);
    paramIndex++;

    // Hide soft-deleted resources when the column exists
    if (hasIsActive) {
      whereConditions.push(`r.is_active = true`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get resources with sector info
    const resourcesQuery = `
      SELECT 
        r.id, r.title, r.description, r.resource_type, r.file_path, 
        r.file_size, r.download_count, r.created_at,
        r.course_id,
        c.title as course_title,
        ls.name as sector_name, ls.color as sector_color
      FROM resources r
      LEFT JOIN learning_sectors ls ON r.sector_id = ls.id
      LEFT JOIN courses c ON r.course_id = c.id
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