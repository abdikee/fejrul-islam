import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/middleware.js';
import pool from '@/lib/db/connection.js';
import bcrypt from 'bcryptjs';
import { isValidEmail, normalizeAndValidatePhone, normalizeEmail } from '@/lib/validation/contact.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// PUT - Update mentor
export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
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

    // Build update query dynamically
    let updateFields = [];
    let values = [];
    let paramCount = 1;

    if (firstName) {
      updateFields.push(`first_name = $${paramCount++}`);
      values.push(firstName);
    }
    if (lastName) {
      updateFields.push(`last_name = $${paramCount++}`);
      values.push(lastName);
    }
    if (email) {
      const normalizedEmail = normalizeEmail(email);
      if (!isValidEmail(normalizedEmail)) {
        return NextResponse.json(
          { success: false, message: 'Invalid email format' },
          { status: 400 }
        );
      }
      updateFields.push(`email = $${paramCount++}`);
      values.push(normalizedEmail);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push(`password_hash = $${paramCount++}`);
      values.push(hashedPassword);
    }
    if (gender) {
      updateFields.push(`gender = $${paramCount++}`);
      values.push(gender);
    }
    if (phone !== undefined) {
      const phoneCheck = normalizeAndValidatePhone(phone, 'ET');
      if (!phoneCheck.ok) {
        return NextResponse.json(
          { success: false, message: phoneCheck.message },
          { status: 400 }
        );
      }
      updateFields.push(`phone = $${paramCount++}`);
      values.push(phoneCheck.value);
    }
    if (specialization !== undefined) {
      updateFields.push(`specialization = $${paramCount++}`);
      values.push(specialization || null);
    }
    if (bio !== undefined) {
      updateFields.push(`bio = $${paramCount++}`);
      values.push(bio || null);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(id);
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount} AND role = 'mentor'
      RETURNING id, email, first_name, last_name, gender, phone, specialization, bio
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Mentor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mentor updated successfully',
      mentor: result.rows[0]
    });

  } catch (error) {
    console.error('Update mentor error:', error);
    
    if (error.message.includes('duplicate key')) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete mentor
export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const query = 'DELETE FROM users WHERE id = $1 AND role = \'mentor\' RETURNING id';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Mentor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mentor deleted successfully'
    });

  } catch (error) {
    console.error('Delete mentor error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
