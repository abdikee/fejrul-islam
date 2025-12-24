import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request, { params }) {
  try {
    const { slug } = params;
    
    // Get user from token (optional - can like without being logged in)
    let userId = null;
    const token = request.cookies.get('auth-token')?.value;
    
    if (token) {
      try {
        const decoded = verifyJwtToken(token);
        userId = decoded.userId;
      } catch (error) {
        // Continue without user ID if token is invalid
      }
    }

    // Check if article exists
    const articleResult = await query('SELECT id, likes FROM articles WHERE slug = $1', [slug]);
    if (articleResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    const article = articleResult.rows[0];

    // If user is logged in, check if they already liked this article
    let hasLiked = false;
    if (userId) {
      const likeCheck = await query(
        'SELECT id FROM article_likes WHERE article_id = $1 AND user_id = $2',
        [article.id, userId]
      );
      hasLiked = likeCheck.rows.length > 0;
    }

    if (hasLiked) {
      // Unlike the article
      await query('DELETE FROM article_likes WHERE article_id = $1 AND user_id = $2', [article.id, userId]);
      await query('UPDATE articles SET likes = likes - 1 WHERE id = $1', [article.id]);
      
      return NextResponse.json({
        success: true,
        liked: false,
        likes: (article.likes || 0) - 1,
        message: 'Article unliked'
      });
    } else {
      // Like the article
      if (userId) {
        await query(
          'INSERT INTO article_likes (article_id, user_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
          [article.id, userId]
        );
      }
      await query('UPDATE articles SET likes = likes + 1 WHERE id = $1', [article.id]);
      
      return NextResponse.json({
        success: true,
        liked: true,
        likes: (article.likes || 0) + 1,
        message: 'Article liked'
      });
    }

  } catch (error) {
    console.error('Error liking article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to like article' },
      { status: 500 }
    );
  }
}