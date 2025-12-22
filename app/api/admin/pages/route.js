import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

async function requireAdmin(request) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return { ok: false, response: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }) };
  }

  let decoded;
  try {
    decoded = verifyJwtToken(token);
  } catch {
    return { ok: false, response: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }) };
  }

  const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
  if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
    return { ok: false, response: NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 }) };
  }

  return { ok: true, userId: decoded.userId };
}

export async function GET(request) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const result = await query(
        `SELECT id, slug, title, content, is_active, updated_by, created_at, updated_at
         FROM site_pages
         WHERE slug = $1
         LIMIT 1`,
        [slug]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, page: result.rows[0] });
    }

    const result = await query(
      `SELECT id, slug, title, content, is_active, updated_by, created_at, updated_at
       FROM site_pages
       ORDER BY updated_at DESC`,
      []
    );

    return NextResponse.json({ success: true, pages: result.rows });
  } catch (error) {
    console.error('Error fetching site pages:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch site pages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    const body = await request.json();
    const { slug, title, content, isActive } = body;

    if (!slug || !title) {
      return NextResponse.json({ success: false, message: 'Slug and title are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO site_pages (slug, title, content, is_active, updated_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, slug, title, content, is_active, updated_at`,
      [String(slug).trim(), String(title).trim(), content ?? '', isActive !== false, adminCheck.userId]
    );

    return NextResponse.json({ success: true, message: 'Page created successfully', page: result.rows[0] });
  } catch (error) {
    // 23505 = unique_violation
    if (error?.code === '23505') {
      return NextResponse.json({ success: false, message: 'Slug already exists' }, { status: 409 });
    }

    console.error('Error creating site page:', error);
    return NextResponse.json({ success: false, message: 'Failed to create site page' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    const body = await request.json();
    const { id, slug, title, content, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Page ID is required' }, { status: 400 });
    }

    const result = await query(
      `UPDATE site_pages SET
         slug = COALESCE($1, slug),
         title = COALESCE($2, title),
         content = COALESCE($3, content),
         is_active = COALESCE($4, is_active),
         updated_by = $5
       WHERE id = $6
       RETURNING id, slug, title, content, is_active, updated_at`,
      [slug ?? null, title ?? null, content ?? null, typeof isActive === 'boolean' ? isActive : null, adminCheck.userId, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Page updated successfully', page: result.rows[0] });
  } catch (error) {
    if (error?.code === '23505') {
      return NextResponse.json({ success: false, message: 'Slug already exists' }, { status: 409 });
    }

    console.error('Error updating site page:', error);
    return NextResponse.json({ success: false, message: 'Failed to update site page' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Page ID is required' }, { status: 400 });
    }

    const result = await query(
      `DELETE FROM site_pages
       WHERE id = $1
       RETURNING id, slug, title`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Page deleted successfully', page: result.rows[0] });
  } catch (error) {
    console.error('Error deleting site page:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete site page' }, { status: 500 });
  }
}
