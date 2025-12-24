import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection';

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
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
