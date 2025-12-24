import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    // Get the article
    const articleQuery = `
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
      WHERE slug = $1 AND status = 'published'
    `;

    const articleResult = await query(articleQuery, [slug]);

    if (articleResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    const article = articleResult.rows[0];

    // Increment view count
    await query('UPDATE articles SET views = views + 1 WHERE id = $1', [article.id]);
    article.views = (article.views || 0) + 1;

    // Get related articles (same sector, excluding current article)
    const relatedQuery = `
      SELECT 
        id,
        title,
        description,
        content,
        sector,
        slug,
        image_url as image,
        author,
        views,
        likes,
        created_at
      FROM articles 
      WHERE sector = $1 AND id != $2 AND status = 'published'
      ORDER BY created_at DESC
      LIMIT 3
    `;

    const relatedResult = await query(relatedQuery, [article.sector, article.id]);

    return NextResponse.json({
      success: true,
      article,
      relatedArticles: relatedResult.rows
    });

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // Update article (admin only)
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = params;
    const body = await request.json();
    const { title, description, content, sector, targetAudience, status, imageUrl, author } = body;

    // Check if article exists
    const existingArticle = await query('SELECT id FROM articles WHERE slug = $1', [slug]);
    if (existingArticle.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
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
        updated_at = NOW()
      WHERE slug = $9
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
      slug
    ]);

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

export async function DELETE(request, { params }) {
  try {
    // Delete article (admin only)
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = params;

    // Check if article exists
    const existingArticle = await query('SELECT id FROM articles WHERE slug = $1', [slug]);
    if (existingArticle.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    await query('DELETE FROM articles WHERE slug = $1', [slug]);

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