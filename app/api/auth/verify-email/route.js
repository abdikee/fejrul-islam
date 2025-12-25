import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  return NextResponse.json(
    { success: false, message: 'Email verification is disabled in this system.' },
    { status: 410 }
  );
}
