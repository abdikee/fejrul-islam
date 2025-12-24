import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector') || 'all';
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereConditions = ["status = 'published'"];
    let queryParams = [];
    let paramIndex = 1;

    // Add sector filter
    if (sector !== 'all') {
      whereConditions.push(`sector = $${paramIndex}`);
      queryParams.push(sector);
      paramIndex++;
    }

    // Add search filter
    if (search.trim()) {
      whereConditions.push(`(LOWER(title) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex} OR LOWER(content) LIKE $${paramIndex})`);
      queryParams.push(`%${search.toLowerCase()}%`);
      paramIndex++;
    }

    // Build ORDER BY clause
    let orderBy = 'created_at DESC';
    switch (sort) {
      case 'oldest':
        orderBy = 'created_at ASC';
        break;
      case 'popular':
        orderBy = 'views DESC, likes DESC';
        break;
      case 'title':
        orderBy = 'title ASC';
        break;
      default:
        orderBy = 'created_at DESC';
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get articles
    const articlesQuery = `
      SELECT 
        id,
        title,
        description,
        content,
        sector,
        target_audience,
        status,
        slug,
        image_url as image,
        author,
        views,
        likes,
        created_at,
        updated_at
      FROM articles 
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const articlesResult = await query(articlesQuery, queryParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM articles 
      ${whereClause}
    `;

    const countResult = await query(countQuery, queryParams.slice(0, -2)); // Remove limit and offset params

    return NextResponse.json({
      success: true,
      articles: articlesResult.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit,
        offset,
        hasMore: offset + limit < parseInt(countResult.rows[0].total)
      }
    });

  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // This endpoint is for creating articles (admin only)
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role (simplified - you should use proper JWT verification)
    const body = await request.json();
    const { title, description, content, sector, targetAudience, status, imageUrl, author } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Check if slug already exists
    const existingSlug = await query('SELECT id FROM articles WHERE slug = $1', [slug]);
    let finalSlug = slug;
    if (existingSlug.rows.length > 0) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    const insertQuery = `
      INSERT INTO articles (
        title, description, content, sector, target_audience, 
        status, slug, image_url, author, views, likes, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, 0, NOW(), NOW())
      RETURNING *
    `;

    const result = await query(insertQuery, [
      title,
      description,
      content,
      sector || null,
      targetAudience || 'all',
      status || 'draft',
      finalSlug,
      imageUrl || null,
      author || 'Fejrul Islam'
    ]);

    return NextResponse.json({
      success: true,
      article: result.rows[0],
      message: 'Article created successfully'
    });

  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create article' },
      { status: 500 }
    );
  }
}