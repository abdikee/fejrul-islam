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

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const resourceType = searchParams.get('resourceType');
    const sectorId = searchParams.get('sectorId');
    const courseId = searchParams.get('courseId');

    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (resourceType) {
      whereConditions.push(`r.resource_type = $${paramIndex}`);
      queryParams.push(resourceType);
      paramIndex++;
    }

    if (sectorId) {
      whereConditions.push(`r.sector_id = $${paramIndex}`);
      queryParams.push(sectorId);
      paramIndex++;
    }

    if (courseId) {
      whereConditions.push(`r.course_id = $${paramIndex}`);
      queryParams.push(parseInt(courseId));
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const hasIsActive = await columnExists('resources', 'is_active');
    const isActiveSelect = hasIsActive
      ? `
        COALESCE(r.is_active, true) as is_active,
        CASE WHEN COALESCE(r.is_active, true) = true THEN 'published' ELSE 'draft' END as status,`
      : `
        true as is_active,
        'published' as status,`;

    const resourcesQuery = `
      SELECT 
        r.id, r.title, r.description, r.resource_type, r.file_path, 
        r.file_size, r.access_level, r.download_count, r.created_at,
        ${isActiveSelect}
        r.course_id,
        c.title as course_title,
        COALESCE(s.name, 'General') as sector_name, 
        COALESCE(s.color, 'blue') as sector_color,
        COALESCE(u.first_name || ' ' || u.last_name, 'Admin') as uploaded_by_name
      FROM resources r
      LEFT JOIN sectors s ON r.sector_id = s.id
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN users u ON r.uploaded_by = u.id
      ${whereClause}
      ORDER BY r.created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const resourcesResult = await query(resourcesQuery, queryParams);
    
    const countQuery = `SELECT COUNT(*) as total FROM resources r ${whereClause}`;
    const countParams = whereConditions.length > 0 ? queryParams.slice(0, -2) : [];
    const countResult = await query(countQuery, countParams);

    const totalResources = parseInt(countResult.rows[0]?.total || 0);
    const totalPages = Math.ceil(totalResources / limit);

    return NextResponse.json({
      success: true,
      resources: resourcesResult.rows,
      pagination: { currentPage: page, totalPages, totalResources, hasNext: page < totalPages, hasPrev: page > 1 }
    });

  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch resources: ' + error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, resourceType, filePath, sectorId, courseId, accessLevel, fileSize } = body;

    if (!title || !resourceType) {
      return NextResponse.json({ success: false, message: 'Title and resource type are required' }, { status: 400 });
    }

    const hasIsActive = await columnExists('resources', 'is_active');
    const insertSql = hasIsActive
      ? `
        INSERT INTO resources (title, description, resource_type, file_path, sector_id, course_id, access_level, file_size, uploaded_by, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
        RETURNING id, title, resource_type, access_level, created_at
      `
      : `
        INSERT INTO resources (title, description, resource_type, file_path, sector_id, course_id, access_level, file_size, uploaded_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, title, resource_type, access_level, created_at
      `;

    const newResourceResult = await query(insertSql, [
      title,
      description,
      resourceType,
      filePath || '',
      sectorId ? parseInt(sectorId) : null,
      courseId ? parseInt(courseId) : null,
      accessLevel || 'public',
      fileSize ? parseInt(fileSize) : null,
      decoded.userId,
    ]);

    return NextResponse.json({ success: true, message: 'Resource created successfully', resource: newResourceResult.rows[0] });

  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ success: false, message: 'Failed to create resource: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, description, resourceType, filePath, sectorId, courseId, accessLevel, fileSize, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Resource ID is required' }, { status: 400 });
    }

    const hasIsActive = await columnExists('resources', 'is_active');
    const updateSql = hasIsActive
      ? `
        UPDATE resources
        SET title = $1,
            description = $2,
            resource_type = $3,
            file_path = $4,
            sector_id = $5,
            course_id = $6,
            access_level = $7,
            file_size = $8,
            is_active = $9
        WHERE id = $10
        RETURNING id, title, resource_type, access_level
      `
      : `
        UPDATE resources
        SET title = $1,
            description = $2,
            resource_type = $3,
            file_path = $4,
            sector_id = $5,
            course_id = $6,
            access_level = $7,
            file_size = $8
        WHERE id = $9
        RETURNING id, title, resource_type, access_level
      `;

    const updateParams = [
      title,
      description,
      resourceType,
      filePath,
      sectorId ? parseInt(sectorId) : null,
      courseId ? parseInt(courseId) : null,
      accessLevel,
      fileSize ? parseInt(fileSize) : null,
    ];
    if (hasIsActive) updateParams.push(isActive !== false);
    updateParams.push(id);

    const updateResult = await query(updateSql, updateParams);

    if (updateResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Resource updated successfully', resource: updateResult.rows[0] });

  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json({ success: false, message: 'Failed to update resource: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('id');

    if (!resourceId) {
      return NextResponse.json({ success: false, message: 'Resource ID is required' }, { status: 400 });
    }

    const hasIsActive = await columnExists('resources', 'is_active');
    const deleteSql = hasIsActive
      ? 'UPDATE resources SET is_active = false WHERE id = $1 RETURNING id, title'
      : 'DELETE FROM resources WHERE id = $1 RETURNING id, title';

    const deleteResult = await query(deleteSql, [resourceId]);

    if (deleteResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Resource deleted successfully', resource: deleteResult.rows[0] });

  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete resource: ' + error.message }, { status: 500 });
  }
}
