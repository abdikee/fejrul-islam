import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db/connection.js';
import { verifyAuth } from '@/lib/auth/middleware';
import { signJwtToken } from '@/lib/auth/jwt';

export async function POST(request) {
  try {
    // Verify admin authentication
    const admin = await verifyAuth(request);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { targetUserId, reason } = await request.json();

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, message: 'Target user ID is required' },
        { status: 400 }
      );
    }

    // Get target user details
    const userResult = await pool.query(
      'SELECT id, email, first_name, last_name, role, gender FROM users WHERE id = $1',
      [targetUserId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Target user not found' },
        { status: 404 }
      );
    }

    const targetUser = userResult.rows[0];

    // Log impersonation session
    await pool.query(
      `INSERT INTO impersonation_sessions (admin_id, target_user_id, reason, ip_address)
       VALUES ($1, $2, $3, $4)`,
      [admin.id, targetUserId, reason || 'Admin impersonation', request.headers.get('x-forwarded-for') || 'unknown']
    );

    // Log audit trail
    await pool.query(
      `INSERT INTO audit_logs (user_id, action_type, action_description, target_type, target_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        admin.id,
        'IMPERSONATE_START',
        `Admin ${admin.email} started impersonating ${targetUser.email}`,
        'user',
        targetUserId,
        JSON.stringify({ admin_id: admin.id, target_user_id: targetUserId, reason })
      ]
    );

    // Create impersonation token
    const impersonationToken = signJwtToken({
      id: targetUser.id,
      email: targetUser.email,
      firstName: targetUser.first_name,
      lastName: targetUser.last_name,
      role: targetUser.role,
      gender: targetUser.gender,
      impersonatedBy: admin.id,
      impersonation: true
    });

    // Set impersonation cookie
    cookies().set('impersonation-token', impersonationToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour
    });

    // Determine redirect URL based on target user role
    let redirectUrl = '/dashboard';
    if (targetUser.role === 'mentor') {
      redirectUrl = '/mentor/dashboard';
    } else if (targetUser.role === 'admin') {
      redirectUrl = '/admin/dashboard';
    } else if (targetUser.gender === 'male') {
      redirectUrl = '/dashboard/male';
    } else if (targetUser.gender === 'female') {
      redirectUrl = '/dashboard/female';
    }

    return NextResponse.json({
      success: true,
      message: `Now impersonating ${targetUser.first_name} ${targetUser.last_name}`,
      redirectUrl,
      targetUser: {
        id: targetUser.id,
        email: targetUser.email,
        name: `${targetUser.first_name} ${targetUser.last_name}`,
        role: targetUser.role
      }
    });
  } catch (error) {
    console.error('Impersonation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to start impersonation', error: error.message },
      { status: 500 }
    );
  }
}

// End impersonation
export async function DELETE(request) {
  try {
    const impersonationToken = cookies().get('impersonation-token')?.value;
    
    if (!impersonationToken) {
      return NextResponse.json(
        { success: false, message: 'No active impersonation session' },
        { status: 400 }
      );
    }

    // Clear impersonation cookie
    cookies().delete('impersonation-token');

    // Log end of impersonation
    const admin = await verifyAuth(request);
    if (admin) {
      await pool.query(
        `INSERT INTO audit_logs (user_id, action_type, action_description)
         VALUES ($1, $2, $3)`,
        [admin.id, 'IMPERSONATE_END', `Admin ended impersonation session`]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Impersonation session ended',
      redirectUrl: '/admin/dashboard'
    });
  } catch (error) {
    console.error('End impersonation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to end impersonation' },
      { status: 500 }
    );
  }
}
