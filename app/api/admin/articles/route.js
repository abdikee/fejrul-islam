import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const sector = searchParams.get('sector') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');

    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    // Add status filter
    if (status !== 'all') {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    // Add sector filter
    if (sector !== 'all') {
      whereConditions.push(`sector = $${paramIndex}`);
      queryParams.push(sector);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

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
        image_url,
        author,
        views,
        likes,
        created_at,
        updated_at
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
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, content, sector, targetAudience, status, imageUrl, author, videoUrl, attachmentUrl } = body;

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
        status, slug, image_url, author, video_url, attachment_url, views, likes, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0, 0, NOW(), NOW())
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
      author || 'Fejrul Islam',
      videoUrl || null,
      attachmentUrl || null
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

export async function PUT(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, description, content, sector, targetAudience, status, imageUrl, author, videoUrl, attachmentUrl } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Article ID is required' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE articles SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        content = COALESCE($3, content),
        sector = COALESCE($4, sector),
        target_audience = COALESCE($5, target_audience),
        status = COALESCE($6, status),
        image_url = COALESCE($7, image_url),
        author = COALESCE($8, author),
        video_url = COALESCE($9, video_url),
        attachment_url = COALESCE($10, attachment_url),
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `;

    const result = await query(updateQuery, [
      title,
      description,
      content,
      sector,
      targetAudience,
      status,
      imageUrl,
      author,
      videoUrl,
      attachmentUrl,
      id
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      article: result.rows[0],
      message: 'Article updated successfully'
    });

  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Article ID is required' },
        { status: 400 }
      );
    }

    const result = await query('DELETE FROM articles WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete article' },
      { status: 500 }
    );
  }
}