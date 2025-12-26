import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/middleware.js';
import { query } from '@/lib/db/connection';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Verify mentor authentication
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'mentor') {
      return NextResponse.json({ success: false, message: 'Mentor access required' }, { status: 403 });
    }

    const result = await query(
      `SELECT
        u.id,
        CONCAT(u.first_name, ' ', u.last_name) as name,
        u.email,
        u.department,
        u.academic_year,
        m.usrah_group,
        m.assigned_date,
        m.notes,
        COUNT(DISTINCT up.course_id) as courses,
        COALESCE(ROUND(AVG(up.progress_percentage)), 0)::int as progress,
        MAX(up.last_accessed) as last_activity
      FROM mentorship m
      JOIN users u ON u.id = m.student_id
      LEFT JOIN user_progress up ON up.user_id = u.id
      WHERE m.mentor_id = $1
        AND m.is_active = true
        AND u.role = 'student'
      GROUP BY u.id, u.first_name, u.last_name, u.email, u.department, u.academic_year,
               m.usrah_group, m.assigned_date, m.notes
      ORDER BY COALESCE(MAX(up.last_accessed), u.last_login, m.assigned_date::timestamp, u.created_at) DESC NULLS LAST`,
      [user.id]
    );

    const students = (result.rows || []).map((row) => {
      const lastActivity = row.last_activity ? new Date(row.last_activity) : null;
      const isActive = lastActivity ? lastActivity.getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 : false;
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        department: row.department || null,
        academicYear: row.academic_year || null,
        usrahGroup: row.usrah_group || null,
        assignedDate: row.assigned_date ? new Date(row.assigned_date).toISOString().slice(0, 10) : null,
        notes: row.notes || null,
        progress: Number(row.progress || 0),
        courses: Number(row.courses || 0),
        status: isActive ? 'active' : 'inactive'
      };
    });

    return NextResponse.json({
      success: true,
      students
    });

  } catch (error) {
    console.error('Error fetching mentor students:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'mentor') {
      return NextResponse.json({ success: false, message: 'Mentor access required' }, { status: 403 });
    }

    const body = await request.json();
    const { studentEmail, studentId, usrahGroup, notes } = body || {};

    if (!studentEmail && !studentId) {
      return NextResponse.json(
        { success: false, message: 'studentEmail or studentId is required' },
        { status: 400 }
      );
    }

    const studentLookup = studentId
      ? await query('SELECT id, role FROM users WHERE id = $1', [studentId])
      : await query('SELECT id, role FROM users WHERE lower(email) = lower($1)', [studentEmail]);

    const student = studentLookup.rows?.[0];
    if (!student || student.role !== 'student') {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }

    const existing = await query(
      `SELECT id, is_active FROM mentorship WHERE mentor_id = $1 AND student_id = $2 ORDER BY created_at DESC LIMIT 1`,
      [user.id, student.id]
    );
    if (existing.rows?.length) {
      if (existing.rows[0].is_active) {
        return NextResponse.json(
          { success: false, message: 'Student is already assigned to you' },
          { status: 409 }
        );
      }

      await query(
        `UPDATE mentorship SET is_active = true, assigned_date = CURRENT_DATE, usrah_group = $3, notes = $4
         WHERE id = $1`,
        [existing.rows[0].id, user.id, usrahGroup || null, notes || null]
      );
    } else {
      await query(
        `INSERT INTO mentorship (mentor_id, student_id, usrah_group, assigned_date, is_active, notes)
         VALUES ($1, $2, $3, CURRENT_DATE, true, $4)`,
        [user.id, student.id, usrahGroup || null, notes || null]
      );
    }

    return NextResponse.json({ success: true, message: 'Student assigned successfully' });
  } catch (error) {
    console.error('Error assigning mentor student:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to assign student' },
      { status: 500 }
    );
  }
}