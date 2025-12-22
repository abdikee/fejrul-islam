import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/middleware.js';

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

    // Mock students data for development
    // In production, this would come from actual database queries
    const students = [
      {
        id: 1,
        name: 'Fatima Ahmed',
        email: 'fatima.ahmed@example.com',
        department: 'Computer Science',
        academicYear: '3rd Year',
        usrahGroup: 'Tarbiya Circle A',
        assignedDate: '2024-01-15',
        lastActivity: 'Today',
        overallProgress: 85,
        status: 'excellent',
        notes: 'Very dedicated student, excellent in Quran memorization'
      },
      {
        id: 2,
        name: 'Omar Hassan',
        email: 'omar.hassan@example.com',
        department: 'Engineering',
        academicYear: '2nd Year',
        usrahGroup: 'Tarbiya Circle B',
        assignedDate: '2024-02-01',
        lastActivity: 'Yesterday',
        overallProgress: 72,
        status: 'active',
        notes: 'Good progress in Islamic studies, needs encouragement in Arabic'
      },
      {
        id: 3,
        name: 'Aisha Rahman',
        email: 'aisha.rahman@example.com',
        department: 'Medicine',
        academicYear: '4th Year',
        usrahGroup: 'Tarbiya Circle A',
        assignedDate: '2024-01-20',
        lastActivity: '2 days ago',
        overallProgress: 91,
        status: 'excellent',
        notes: 'Outstanding student, potential future mentor'
      },
      {
        id: 4,
        name: 'Yusuf Ali',
        email: 'yusuf.ali@example.com',
        department: 'Business',
        academicYear: '1st Year',
        usrahGroup: 'Tarbiya Circle C',
        assignedDate: '2024-03-01',
        lastActivity: '1 week ago',
        overallProgress: 45,
        status: 'needs_attention',
        notes: 'New student, needs more guidance and support'
      }
    ];

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