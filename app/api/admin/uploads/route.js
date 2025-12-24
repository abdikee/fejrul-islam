import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function sanitizeFilename(name) {
  return String(name || 'file')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

export async function POST(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);

    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            'File upload is not configured. Set BLOB_READ_WRITE_TOKEN (Vercel Blob) to enable uploads.',
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, message: 'Missing file' }, { status: 400 });
    }

    // In Next.js route handlers, uploaded files are provided as a File (Blob-like).
    const originalName = sanitizeFilename(file.name);
    const pathname = `uploads/${Date.now()}-${originalName || 'file'}`;

    const result = await put(pathname, file, {
      access: 'public',
      token: blobToken,
      addRandomSuffix: false,
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      pathname: result.pathname,
      contentType: result.contentType,
      size: result.size,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Admin upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file: ' + error.message },
      { status: 500 }
    );
  }
}
