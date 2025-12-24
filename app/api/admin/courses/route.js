import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
    const limit = parseInt(searchParams.get('limit') || '50');
    const sectorId = searchParams.get('sectorId');

    const offset = (page - 1) * limit;

    // Build query - fetch ALL courses including inactive ones for admin view
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (sectorId) {
      whereConditions.push(`c.sector_id = $${paramIndex}`);
      queryParams.push(sectorId);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get courses with sector info - handle both schema variations
    const coursesQuery = `
      SELECT 
        c.id, c.title, c.description, c.sector_id,
        COALESCE(c.difficulty_level, c.level, 'Beginner') as level, 
        COALESCE(c.estimated_weeks, c.duration_weeks, 8) as duration_weeks, 
        c.prerequisites, c.learning_objectives, c.created_at, 
        COALESCE(c.is_active, true) as is_active,
        CASE WHEN COALESCE(c.is_active, true) = true THEN 'published' ELSE 'draft' END as status,
        COALESCE(s.name, 'General') as sector_name, 
        COALESCE(s.color, 'blue') as sector_color,
        0 as enrolled_students
      FROM courses c
      LEFT JOIN sectors s ON c.sector_id = s.id
      ${whereClause}
      ORDER BY c.created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const coursesResult = await query(coursesQuery, queryParams);
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM courses c ${whereClause}`;
    const countParams = whereConditions.length > 0 ? queryParams.slice(0, -2) : [];
    const countResult = await query(countQuery, countParams);

    const totalCourses = parseInt(countResult.rows[0]?.total || 0);
    const totalPages = Math.ceil(totalCourses / limit);

    return NextResponse.json({
      success: true,
      courses: coursesResult.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalCourses,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses: ' + error.message },
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
    console.log('Received course data:', body);
    
    const { 
      title, description, sectorId, level, durationWeeks, 
      prerequisites, learningObjectives, isActive 
    } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Generate a unique course code
    const courseCode = `PRG-${Date.now().toString(36).toUpperCase()}`;

    // Insert course - use schema column names (difficulty_level, estimated_weeks)
    const newCourseResult = await query(`
      INSERT INTO courses (
        code, title, description, sector_id, difficulty_level, estimated_weeks, 
        prerequisites, learning_objectives, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, code, title, difficulty_level as level, estimated_weeks as duration_weeks, is_active, created_at
    `, [
      courseCode,
      title, 
      description, 
      sectorId ? parseInt(sectorId) : null, 
      level || 'Beginner', 
      durationWeeks ? parseInt(durationWeeks) : 8, 
      prerequisites || null, 
      learningObjectives || null, 
      isActive !== false
    ]);

    console.log('Course created:', newCourseResult.rows[0]);

    return NextResponse.json({
      success: true,
      message: 'Program created successfully',
      course: newCourseResult.rows[0]
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create program: ' + error.message },
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
      id, title, description, sectorId, level, durationWeeks, 
      prerequisites, learningObjectives, isActive 
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Update course using correct column names
    const updateResult = await query(`
      UPDATE courses SET 
        title = $1, 
        description = $2, 
        sector_id = $3, 
        difficulty_level = $4, 
        estimated_weeks = $5, 
        prerequisites = $6, 
        learning_objectives = $7, 
        is_active = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING id, title, difficulty_level as level, estimated_weeks as duration_weeks, is_active
    `, [
      title, 
      description, 
      sectorId ? parseInt(sectorId) : null, 
      level || 'Beginner', 
      durationWeeks ? parseInt(durationWeeks) : null, 
      prerequisites || null, 
      learningObjectives || null, 
      isActive !== false, 
      id
    ]);

    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Course updated successfully',
      course: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update course: ' + error.message },
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
    const courseId = searchParams.get('id');

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Soft delete course
    const deleteResult = await query(`
      UPDATE courses SET is_active = false
      WHERE id = $1
      RETURNING id, title
    `, [courseId]);

    if (deleteResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
      course: deleteResult.rows[0]
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete course' },
      { status: 500 }
    );
  }
}