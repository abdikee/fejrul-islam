import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const sector = searchParams.get('sector');

    let whereConditions = ["status = 'published'"];
    let queryParams = [];
    let paramIndex = 1;

    if (sector) {
      whereConditions.push(`sector = $${paramIndex}`);
      queryParams.push(sector);
      paramIndex++;
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const articlesQuery = `
      SELECT 
        id,
        title,
        description,
        sector,
        slug,
        image_url,
        author,
        video_url,
        attachment_url,
        views,
        likes,
        created_at
      FROM articles 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex}
    `;

    queryParams.push(limit);

    const result = await query(articlesQuery, queryParams);

    return NextResponse.json({
      success: true,
      articles: result.rows
    });

  } catch (error) {
    console.error('Error fetching public articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
