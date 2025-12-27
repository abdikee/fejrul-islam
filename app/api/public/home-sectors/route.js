import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const sectorsResult = await query(
      `
      SELECT
        s.id,
        s.code,
        s.name,
        s.description,
        s.icon,
        s.color,
        COALESCE(pc.program_count, 0)::int AS program_count,
        COALESCE(ec.participants_count, 0)::int AS participants_count
      FROM sectors s
      LEFT JOIN (
        SELECT sector_id, COUNT(*)::int AS program_count
        FROM courses
        WHERE COALESCE(is_active, true) = true
        GROUP BY sector_id
      ) pc ON pc.sector_id = s.id
      LEFT JOIN (
        SELECT sector_id, COUNT(DISTINCT user_id)::int AS participants_count
        FROM student_sector_enrollments
        GROUP BY sector_id
      ) ec ON ec.sector_id = s.id
      WHERE COALESCE(s.is_active, true) = true
      ORDER BY COALESCE(s.display_order, 999999), s.name ASC
      `
    );

    const coursesResult = await query(
      `
      SELECT
        c.id,
        c.sector_id,
        c.title,
        c.description,
        COALESCE(c.difficulty_level, c.level, 'Beginner') AS level,
        COALESCE(c.estimated_weeks, c.duration_weeks, 8)::int AS duration_weeks
      FROM courses c
      WHERE COALESCE(c.is_active, true) = true
      ORDER BY COALESCE(c.display_order, 999999), c.created_at DESC
      `
    );

    const programsBySectorId = new Map();
    for (const row of coursesResult.rows || []) {
      const sectorId = row.sector_id;
      if (!sectorId) continue;
      if (!programsBySectorId.has(sectorId)) programsBySectorId.set(sectorId, []);
      programsBySectorId.get(sectorId).push({
        id: row.id,
        title: row.title,
        description: row.description,
        level: row.level,
        duration_weeks: row.duration_weeks
      });
    }

    const sectors = (sectorsResult.rows || []).map((s) => ({
      id: s.id,
      code: s.code,
      name: s.name,
      description: s.description,
      icon: s.icon,
      color: s.color,
      program_count: s.program_count,
      participants_count: s.participants_count,
      programs: programsBySectorId.get(s.id) || []
    }));

    return NextResponse.json({ success: true, sectors });
  } catch (error) {
    console.error('Error fetching public home sectors:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sectors' },
      { status: 500 }
    );
  }
}
