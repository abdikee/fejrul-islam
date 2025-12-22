import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export async function GET(_request, { params }) {
  try {
    const slug = params?.slug;
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug is required' }, { status: 400 });
    }

    const result = await query(
      `SELECT slug, title, content, updated_at
       FROM site_pages
       WHERE slug = $1 AND is_active = true
       LIMIT 1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: true, page: null });
    }

    return NextResponse.json({ success: true, page: result.rows[0] });
  } catch (error) {
    console.error('Error fetching site page:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch site page' }, { status: 500 });
  }
}
