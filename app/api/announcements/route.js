import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function computeAllowedAudiences({ role, gender, requestedAudience }) {
  const requested = (requestedAudience || '').toLowerCase().trim();

  // Explicit audience override (used by public pages, testing, etc.)
  if (requested) {
    if (requested === 'public') return ['all', 'public'];
    if (requested === 'mentors') return ['all', 'public', 'mentors'];
    if (requested === 'students') return ['all', 'public', 'students'];
    if (requested === 'male') return ['all', 'public', 'students', 'male'];
    if (requested === 'female') return ['all', 'public', 'students', 'female'];
    if (requested === 'all') return ['all', 'public', 'students', 'mentors', 'male', 'female'];
    return ['all', 'public', requested];
  }

  // Infer from authenticated user (cookie)
  if (role === 'admin') return ['all', 'public', 'students', 'mentors', 'male', 'female'];
  if (role === 'mentor') return ['all', 'public', 'mentors'];
  if (role === 'student') return ['all', 'public', 'students', gender].filter(Boolean);

  // Not logged in
  return ['all', 'public'];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const type = searchParams.get('type');

    // Determine viewer (if logged in) to filter announcements appropriately.
    const token = request.cookies.get('auth-token')?.value;
    let role;
    let gender;
    if (token) {
      try {
        const decoded = verifyJwtToken(token);
        role = decoded?.role;
        gender = decoded?.gender;
      } catch {
        // ignore invalid cookie
      }
    }

    const requestedAudience = searchParams.get('audience');
    const allowedAudiences = computeAllowedAudiences({ role, gender, requestedAudience });

    // Build query conditions
    let whereConditions = [
      'is_active = true',
      '(expire_date IS NULL OR expire_date > NOW())',
      'publish_date <= NOW()'
    ];
    let queryParams = [];
    let paramIndex = 1;

    if (type) {
      whereConditions.push(`announcement_type = $${paramIndex}`);
      queryParams.push(type);
      paramIndex++;
    }

    // Filter by target audience. Treat NULL as 'all' for backwards compatibility.
    whereConditions.push(`(COALESCE(target_audience, 'all') = ANY($${paramIndex}))`);
    queryParams.push(allowedAudiences);
    paramIndex++;

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    // Get recent announcements
    const announcementsQuery = `
      SELECT 
        id, title, content, announcement_type, priority, 
        publish_date, created_at, target_audience
      FROM announcements
      ${whereClause}
      ORDER BY 
        CASE priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'normal' THEN 3 
          WHEN 'low' THEN 4 
        END,
        created_at DESC 
      LIMIT $${paramIndex}
    `;

    queryParams.push(limit);

    const result = await query(announcementsQuery, queryParams);

    return NextResponse.json({
      success: true,
      announcements: result.rows
    });

  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}