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

    // Mock recent activities for development
    // In production, these would come from actual database queries
    const activities = [
      {
        type: 'submission',
        description: 'Fatima Ahmed submitted: Tafseer Assignment',
        timestamp: '2 hours ago'
      },
      {
        type: 'message',
        description: 'New message from Omar Hassan about Hadith studies',
        timestamp: '4 hours ago'
      },
      {
        type: 'assignment',
        description: 'Created assignment: Islamic Leadership Essay',
        timestamp: '1 day ago'
      },
      {
        type: 'session',
        description: 'Completed counseling session with Aisha Rahman',
        timestamp: '1 day ago'
      },
      {
        type: 'review',
        description: 'Reviewed and graded 5 submissions',
        timestamp: '2 days ago'
      }
    ];

    return NextResponse.json({
      success: true,
      activities
    });

  } catch (error) {
    console.error('Error fetching mentor activity:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch mentor activity' },
      { status: 500 }
    );
  }
}