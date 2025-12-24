import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';
import bcrypt from 'bcryptjs';
import { isValidEmail, normalizeAndValidatePhone, normalizeEmail } from '@/lib/validation/contact.js';

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
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(`(first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (role) {
      whereConditions.push(`role = $${paramIndex}`);
      queryParams.push(role);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const usersQuery = `
      SELECT 
        id, email, first_name, last_name, gender, department, 
        academic_year, role, level, phone, enrollment_date, 
        last_login, created_at, COALESCE(is_active, true) as is_active
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const usersResult = await query(usersQuery, queryParams);
    
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const countParams = whereConditions.length > 0 ? queryParams.slice(0, -2) : [];
    const countResult = await query(countQuery, countParams);

    const totalUsers = parseInt(countResult.rows[0]?.total || 0);
    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      success: true,
      users: usersResult.rows,
      pagination: { currentPage: page, totalPages, totalUsers, hasNext: page < totalPages, hasPrev: page > 1 }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch users: ' + error.message }, { status: 500 });
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
    const { email, password, firstName, lastName, gender, department, academicYear, role, phone } = body;

    if (!email || !password || !firstName || !lastName || !gender || !role) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 });
    }

    const phoneCheck = normalizeAndValidatePhone(phone, 'ET');
    if (!phoneCheck.ok) {
      return NextResponse.json({ success: false, message: phoneCheck.message }, { status: 400 });
    }

    const existingUser = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ success: false, message: 'User with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUserResult = await query(`
      INSERT INTO users (email, password_hash, first_name, last_name, gender, department, academic_year, role, phone, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      RETURNING id, email, first_name, last_name, role, created_at
    `, [normalizedEmail, hashedPassword, firstName, lastName, gender, department, academicYear, role, phoneCheck.value]);

    return NextResponse.json({ success: true, message: 'User created successfully', user: newUserResult.rows[0] });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, message: 'Failed to create user: ' + error.message }, { status: 500 });
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
    const { userId, firstName, lastName, gender, department, academicYear, role, phone, isActive } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    const phoneCheck = normalizeAndValidatePhone(phone, 'ET');
    if (!phoneCheck.ok) {
      return NextResponse.json({ success: false, message: phoneCheck.message }, { status: 400 });
    }

    const updateResult = await query(`
      UPDATE users SET first_name = $1, last_name = $2, gender = $3, department = $4, academic_year = $5, role = $6, phone = $7, is_active = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING id, email, first_name, last_name, role, is_active
    `, [firstName, lastName, gender, department, academicYear, role, phoneCheck.value, isActive !== false, userId]);

    if (updateResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User updated successfully', user: updateResult.rows[0] });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ success: false, message: 'Failed to update user: ' + error.message }, { status: 500 });
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
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'soft' (default) or 'permanent'

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    let result;
    if (type === 'permanent') {
      // Hard delete
      result = await query(`DELETE FROM users WHERE id = $1 RETURNING id, email`, [userId]);
    } else {
      // Soft delete (deactivate)
      result = await query(`UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, email, first_name, last_name`, [userId]);
    }

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: type === 'permanent' ? 'User permanently deleted' : 'User deactivated successfully', 
      user: result.rows[0] 
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete user: ' + error.message }, { status: 500 });
  }
}
