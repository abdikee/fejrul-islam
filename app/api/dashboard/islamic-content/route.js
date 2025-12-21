import { NextResponse } from 'next/server';
import { getDailyVerse, getDailyHadith, getPrayerTimes } from '@/lib/db/utils';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'Addis Ababa, Ethiopia';

    // Get daily Islamic content
    const [dailyVerse, dailyHadith, prayerTimes] = await Promise.all([
      getDailyVerse(),
      getDailyHadith(),
      getPrayerTimes(location)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        verse: dailyVerse,
        hadith: dailyHadith,
        prayerTimes: prayerTimes
      }
    });

  } catch (error) {
    console.error('Islamic content API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}