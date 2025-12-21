import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Verify mentor authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'mentor') {
      return NextResponse.json({ success: false, message: 'Mentor access required' }, { status: 403 });
    }

    // Get students assigned to this mentor
    const studentsQuery = `
      SELECT 
        u.id, u.first_name, u.last_name, u.email, u.department, 
        u.academic_year, u.last_login, u.created_at,
        m.usrah_group, m.assigned_date, m.notes,
        COALESCE(AVG(up.progress_percentage), 0) as overall_progress
      FROM mentorship m
      JOIN users u ON m.student_id = u.id
      LEFT JOIN user_progress up ON u.id = up.user_id
      WHERE m.mentor_id = $1 AND m.is_active = true AND u.is_active = true
      GROUP BY u.id, u.first_name, u.last_name, u.email, u.department, 
               u.academic_year, u.last_login, u.created_at, 
               m.usrah_group, m.assigned_date, m.notes
      ORDER BY u.first_name, u.last_name
    `;

    const result = await query(studentsQuery, [decoded.userId]);

    const students = result.rows.map(student => {
      const lastLogin = student.last_login ? new Date(student.last_login) : null;
      const now = new Date();
      
      let lastActivity = 'Never';
      let status = 'needs_attention';
      
      if (lastLogin) {
        const diffInHours = Math.floor((now - lastLogin) / (1000 * 60 * 60));
        if (diffInHours < 24) {
          lastActivity = 'Today';
          status = 'active';
        } else if (diffInHours < 48) {
          lastActivity = 'Yesterday';
          status = 'active';
        } else if (diffInHours < 168) { // 7 days
          lastActivity = `${Math.floor(diffInHours / 24)} days ago`;
          status = 'active';
        } else {
          lastActivity = lastLogin.toLocaleDateString();
          status = 'needs_attention';
        }
      }

      // Determine status based on progress
      const progress = Math.round(student.overall_progress);
      if (progress >= 80) status = 'excellent';
      else if (progress >= 60 && status === 'active') status = 'active';
      else if (progress < 40) status = 'needs_attention';

      return {
        id: student.id,
        name: `${student.first_name} ${student.last_name}`,
        email: student.email,
        department: student.department || 'Not specified',
        academicYear: student.academic_year || 'Not specified',
        usrahGroup: student.usrah_group || 'Not assigned',
        assignedDate: student.assigned_date,
        lastActivity,
        overallProgress: progress,
        status,
        notes: student.notes
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