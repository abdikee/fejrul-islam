import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const [usersTotal, mentorsActive, coursesTotal, onlineNow, counselingTotal, sectorCount] = await Promise.all([
      query("SELECT COUNT(*)::int as count FROM users WHERE role != 'admin'"),
      query(
        "SELECT COUNT(*)::int as count FROM users WHERE role = 'mentor' AND last_login > NOW() - INTERVAL '7 days'"
      ),
      query('SELECT COUNT(*)::int as count FROM courses WHERE COALESCE(is_active, true) = true'),
      query("SELECT COUNT(*)::int as count FROM users WHERE last_login > NOW() - INTERVAL '1 hour'"),
      query('SELECT COUNT(*)::int as count FROM counseling_sessions'),
      query('SELECT COUNT(*)::int as count FROM sectors WHERE COALESCE(is_active, true) = true')
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        peopleReached: usersTotal.rows[0]?.count ?? 0,
        activeDais: mentorsActive.rows[0]?.count ?? 0,
        dawahPrograms: coursesTotal.rows[0]?.count ?? 0,
        onlineNow: onlineNow.rows[0]?.count ?? 0,
        guidanceSessions: counselingTotal.rows[0]?.count ?? 0,
        communities: sectorCount.rows[0]?.count ?? 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch public stats' },
      { status: 500 }
    );
  }
}
