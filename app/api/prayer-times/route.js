import { NextResponse } from 'next/server';
import { getPrayerTimes } from '@/lib/db/utils';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'Haramaya, Ethiopia';
    const date = searchParams.get('date') || null;

    const prayerTimes = await getPrayerTimes(location, date);

    return NextResponse.json({
      success: true,
      prayerTimes,
      location,
      date: date || new Date().toISOString().split('T')[0]
    });

  } catch (error) {
    console.error('Prayer times API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prayer times' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { location, date, prayerTimes } = await request.json();

    // This would typically be admin-only functionality
    // Update prayer times in database and broadcast to all users
    
    // For now, return success (in production, implement proper admin auth)
    return NextResponse.json({
      success: true,
      message: 'Prayer times updated successfully'
    });

  } catch (error) {
    console.error('Prayer times update error:', error);
    return NextResponse.json(
      { error: 'Failed to update prayer times' },
      { status: 500 }
    );
  }
}