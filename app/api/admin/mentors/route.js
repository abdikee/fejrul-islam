import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/middleware.js';
import pool from '@/lib/db/connection.js';
import bcrypt from 'bcryptjs';
import { isValidEmail, normalizeAndValidatePhone, normalizeEmail } from '@/lib/validation/contact.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Fetch all mentors
export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const query = `
      SELECT 
        id, email, first_name, last_name, gender, phone,
        specialization, bio, is_active, created_at
      FROM users 
      WHERE role = 'mentor'
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);

    return NextResponse.json({
      success: true,
      mentors: result.rows
    });

  } catch (error) {
    console.error('Fetch mentors error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add new mentor
export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      gender,
      phone,
      specialization,
      bio
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !gender) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    const phoneCheck = normalizeAndValidatePhone(phone, 'ET');
    if (!phoneCheck.ok) {
      return NextResponse.json(
        { success: false, message: phoneCheck.message },
        { status: 400 }
      );
    }

    // Check if email already exists
    const checkQuery = 'SELECT id FROM users WHERE email = $1';
    const checkResult = await pool.query(checkQuery, [normalizedEmail]);
    
    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert mentor
    const insertQuery = `
      INSERT INTO users (
        email, password_hash, first_name, last_name, gender, role,
        phone, specialization, bio, is_active, email_verified
      ) VALUES ($1, $2, $3, $4, $5, 'mentor', $6, $7, $8, true, true)
      RETURNING id, email, first_name, last_name, gender, phone, specialization, bio, is_active, created_at
    `;

    const result = await pool.query(insertQuery, [
      normalizedEmail,
      hashedPassword,
      firstName,
      lastName,
      gender,
      phoneCheck.value,
      specialization || null,
      bio || null
    ]);

    return NextResponse.json({
      success: true,
      message: 'Mentor added successfully',
      mentor: result.rows[0]
    });

  } catch (error) {
    console.error('Add mentor error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
