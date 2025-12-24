import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection.js';
import { verifyAuth } from '@/lib/auth/middleware';

export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ isEnrolled: false });
    }

    const userId = user.id;
    const sectorId = params.id;

    const query = `
      SELECT id, sector_status, enrolled_at 
      FROM student_sector_enrollments 
      WHERE user_id = $1 AND sector_id = $2
    `;
    const result = await pool.query(query, [userId, sectorId]);

    if (result.rows.length > 0) {
      return NextResponse.json({
        isEnrolled: true,
        enrollment: result.rows[0]
      });
    }

    return NextResponse.json({ isEnrolled: false });

  } catch (error) {
    console.error('Enrollment status check error:', error);
    return NextResponse.json({ isEnrolled: false });
  }
}
