import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export async function GET(request) {
  try {
    // Verify admin authentication
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
    const limit = parseInt(searchParams.get('limit') || '10');
    const resourceType = searchParams.get('resourceType');
    const sectorId = searchParams.get('sectorId');

    const offset = (page - 1) * limit;

    // Build query conditions
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

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get resources with sector and uploader info
    const resourcesQuery = `
      SELECT 
        r.id, r.title, r.description, r.resource_type, r.file_path, 
        r.file_size, r.access_level, r.download_count, r.created_at,
        ls.name as sector_name, ls.color as sector_color,
        u.first_name, u.last_name
      FROM resources r
      LEFT JOIN learning_sectors ls ON r.sector_id = ls.id
      LEFT JOIN users u ON r.uploaded_by = u.id
      ${whereClause}
      ORDER BY r.created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const [resourcesResult, countResult] = await Promise.all([
      query(resourcesQuery, queryParams),
      query(`SELECT COUNT(*) as total FROM resources r ${whereClause}`, queryParams.slice(0, -2))
    ]);

    const totalResources = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalResources / limit);

    return NextResponse.json({
      success: true,
      resources: resourcesResult.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalResources,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
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
    // Verify admin authentication
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
    const { 
      title, description, resourceType, filePath, 
      sectorId, accessLevel, fileSize 
    } = body;

    // Validate required fields
    if (!title || !resourceType || !filePath) {
      return NextResponse.json(
        { success: false, message: 'Title, resource type, and file path are required' },
        { status: 400 }
      );
    }

    // Create resource
    const newResourceResult = await query(`
      INSERT INTO resources (
        title, description, resource_type, file_path, 
        sector_id, access_level, file_size, uploaded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, title, resource_type, access_level, created_at
    `, [
      title, description, resourceType, filePath,
      sectorId ? parseInt(sectorId) : null, accessLevel || 'public', 
      fileSize ? parseInt(fileSize) : null, decoded.userId
    ]);

    return NextResponse.json({
      success: true,
      message: 'Resource created successfully',
      resource: newResourceResult.rows[0]
    });

  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create resource' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Verify admin authentication
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
    const { 
      id, title, description, resourceType, filePath, 
      sectorId, accessLevel, fileSize 
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Resource ID is required' },
        { status: 400 }
      );
    }

    // Update resource
    const updateResult = await query(`
      UPDATE resources SET 
        title = $1, description = $2, resource_type = $3, file_path = $4, 
        sector_id = $5, access_level = $6, file_size = $7
      WHERE id = $8
      RETURNING id, title, resource_type, access_level
    `, [
      title, description, resourceType, filePath,
      sectorId ? parseInt(sectorId) : null, accessLevel, 
      fileSize ? parseInt(fileSize) : null, id
    ]);

    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Resource updated successfully',
      resource: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Verify admin authentication
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
      return NextResponse.json(
        { success: false, message: 'Resource ID is required' },
        { status: 400 }
      );
    }

    // Delete resource (hard delete for resources)
    const deleteResult = await query(`
      DELETE FROM resources
      WHERE id = $1
      RETURNING id, title
    `, [resourceId]);

    if (deleteResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully',
      resource: deleteResult.rows[0]
    });

  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}