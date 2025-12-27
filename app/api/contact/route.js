import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Very lightweight email sanity check
    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Insert into database
    const query = `
      INSERT INTO contact_submissions (name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at
    `;
    
    const values = [name, email, subject || null, message];
    const result = await pool.query(query, values);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully',
        id: result.rows[0].id 
      },
      { status: 201 }
    );

  } catch (error) {
    // Common Neon / DB setup failures:
    // - 42P01: relation does not exist (table missing)
    // - 42883: undefined function (e.g. uuid_generate_v4 without uuid-ossp)
    console.error('Error submitting contact form:', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail
    });

    if (error?.code === '42P01') {
      return NextResponse.json(
        {
          error:
            'Contact form database table is missing. Run scripts/add-contact-submissions.sql on your Neon database, then try again.'
        },
        { status: 503 }
      );
    }

    if (error?.code === '42883') {
      return NextResponse.json(
        {
          error:
            'Database is missing required functions/extensions (uuid_generate_v4). Run the base schema (lib/db/schema.sql) or enable the uuid-ossp extension, then try again.'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
