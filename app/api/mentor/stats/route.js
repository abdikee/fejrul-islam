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

    // Mock mentor statistics for development
    // In production, these would come from actual database queries
    const stats = {
      totalStudents: 12,
      pendingSubmissions: 5,
      activeAssignments: 8,
      upcomingSessions: 3,
      messagesUnread: 2,
      completionRate: 94
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching mentor stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch mentor statistics' },
      { status: 500 }
    );
  }
}