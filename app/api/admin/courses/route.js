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
    const sectorId = searchParams.get('sectorId');

    const offset = (page - 1) * limit;

    // Build query conditions
    let whereConditions = ['c.is_active = true'];
    let queryParams = [];
    let paramIndex = 1;

    if (sectorId) {
      whereConditions.push(`c.sector_id = $${paramIndex}`);
      queryParams.push(sectorId);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get courses with sector info
    const coursesQuery = `
      SELECT 
        c.id, c.title, c.description, c.level, c.duration_weeks, c.prerequisites,
        c.learning_objectives, c.created_at,
        ls.name as sector_name, ls.color as sector_color
      FROM courses c
      LEFT JOIN learning_sectors ls ON c.sector_id = ls.id
      ${whereClause}
      ORDER BY c.created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const [coursesResult, countResult] = await Promise.all([
      query(coursesQuery, queryParams),
      query(`SELECT COUNT(*) as total FROM courses c ${whereClause}`, queryParams.slice(0, -2))
    ]);

    const totalCourses = parseInt(countResult.rows[0].total);
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
      { success: false, message: 'Failed to fetch courses' },
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
      title, description, sectorId, level, durationWeeks, 
      prerequisites, learningObjectives, instructor 
    } = body;

    // Validate required fields
    if (!title || !description || !sectorId) {
      return NextResponse.json(
        { success: false, message: 'Title, description, and sector are required' },
        { status: 400 }
      );
    }

    // Generate a unique course code
    const courseCode = `COURSE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create course with correct column names
    const newCourseResult = await query(`
      INSERT INTO courses (
        code, title, description, sector_id, difficulty_level, estimated_weeks, 
        prerequisites, learning_objectives, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, code, title, difficulty_level, estimated_weeks, created_at
    `, [
      courseCode,
      title, 
      description, 
      parseInt(sectorId), 
      level || 'Beginner', 
      durationWeeks ? parseInt(durationWeeks) : 8, 
      prerequisites, 
      learningObjectives, 
      true
    ]);

    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      course: newCourseResult.rows[0]
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create course: ' + error.message },
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
      prerequisites, learningObjectives, instructor, isActive 
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Update course
    const updateResult = await query(`
      UPDATE courses SET 
        title = $1, description = $2, sector_id = $3, level = $4, 
        duration_weeks = $5, prerequisites = $6, learning_objectives = $7, 
        is_active = $8
      WHERE id = $9
      RETURNING id, title, level, duration_weeks, is_active
    `, [
      title, description, parseInt(sectorId), level, 
      durationWeeks ? parseInt(durationWeeks) : null, 
      prerequisites, learningObjectives ? [learningObjectives] : null, 
      isActive !== false, id
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
      { success: false, message: 'Failed to update course' },
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