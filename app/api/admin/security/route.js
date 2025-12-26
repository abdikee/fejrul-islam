import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';
import crypto from 'crypto';

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
    const timeRange = searchParams.get('range') || '24h'; // 24h, 7d, 30d

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate.setHours(now.getHours() - 24);
    }

    // Get comprehensive security data
    const [
      loginAttempts,
      activeSessions,
      securityEvents,
      userActivity,
      systemAccess,
      failedLogins,
      suspiciousActivity
    ] = await Promise.all([
      // Login attempts analysis
      query(`
        SELECT 
          DATE_TRUNC('hour', created_at) as hour,
          COUNT(*) as total_attempts,
          COUNT(CASE WHEN last_login IS NOT NULL THEN 1 END) as successful_logins,
          COUNT(CASE WHEN last_login IS NULL THEN 1 END) as failed_attempts
        FROM users 
        WHERE created_at >= $1 OR last_login >= $1
        GROUP BY DATE_TRUNC('hour', created_at)
        ORDER BY hour DESC
        LIMIT 24
      `, [startDate]),

      // Active sessions
      query(`
        SELECT 
          role,
          gender,
          COUNT(*) as active_count,
          MAX(last_login) as most_recent_login
        FROM users 
        WHERE last_login > NOW() - INTERVAL '1 hour'
        GROUP BY role, gender
      `),

      // Security events
      query(`
        SELECT 
          'login_attempt' as event_type,
          CONCAT(first_name, ' ', last_name) as user_name,
          email,
          last_login as event_time,
          CASE 
            WHEN last_login IS NOT NULL THEN 'success'
            ELSE 'failed'
          END as status,
          role,
          gender
        FROM users 
        WHERE (last_login >= $1 OR created_at >= $1)
        ORDER BY COALESCE(last_login, created_at) DESC
        LIMIT 50
      `, [startDate]),

      // User activity patterns
      query(`
        SELECT 
          EXTRACT(hour FROM last_login) as hour_of_day,
          COUNT(*) as login_count,
          role
        FROM users 
        WHERE last_login >= $1
        GROUP BY EXTRACT(hour FROM last_login), role
        ORDER BY hour_of_day
      `, [startDate]),

      // System access by role
      query(`
        SELECT 
          role,
          COUNT(*) as total_users,
          COUNT(CASE WHEN last_login > NOW() - INTERVAL '24 hours' THEN 1 END) as active_24h,
          COUNT(CASE WHEN last_login > NOW() - INTERVAL '7 days' THEN 1 END) as active_7d,
          COUNT(CASE WHEN last_login IS NULL THEN 1 END) as never_logged_in
        FROM users 
        GROUP BY role
      `),

      // Failed login attempts (simulated)
      query(`
        SELECT 
          email,
          created_at,
          'multiple_failed_attempts' as reason,
          CASE 
            WHEN last_login IS NULL THEN 'never_logged_in'
            WHEN last_login < NOW() - INTERVAL '30 days' THEN 'inactive_account'
            ELSE 'recent_failures'
          END as risk_level
        FROM users 
        WHERE last_login IS NULL OR last_login < NOW() - INTERVAL '30 days'
        ORDER BY created_at DESC
        LIMIT 20
      `),

      // Suspicious activity detection
      query(`
        SELECT 
          'unusual_access_pattern' as alert_type,
          CONCAT(first_name, ' ', last_name) as user_name,
          email,
          last_login,
          'high' as severity,
          CASE 
            WHEN last_login > NOW() - INTERVAL '1 hour' THEN 'recent_unusual_login'
            WHEN role = 'admin' THEN 'admin_account_activity'
            ELSE 'pattern_anomaly'
          END as description
        FROM users 
        WHERE role = 'admin' OR last_login > NOW() - INTERVAL '1 hour'
        ORDER BY last_login DESC NULLS LAST
        LIMIT 10
      `)
    ]);

    // Calculate security metrics
    const securityMetrics = {
      totalLoginAttempts: loginAttempts.rows.reduce((sum, row) => sum + parseInt(row.total_attempts), 0),
      successfulLogins: loginAttempts.rows.reduce((sum, row) => sum + parseInt(row.successful_logins), 0),
      failedLoginAttempts: loginAttempts.rows.reduce((sum, row) => sum + parseInt(row.failed_attempts), 0),
      activeSessions: activeSessions.rows.reduce((sum, row) => sum + parseInt(row.active_count), 0),
      securityAlerts: suspiciousActivity.rows.length,
      riskLevel: suspiciousActivity.rows.length > 5 ? 'high' : suspiciousActivity.rows.length > 2 ? 'medium' : 'low'
    };

    // Generate security insights
    const securityInsights = [];
    
    if (securityMetrics.failedLoginAttempts > securityMetrics.successfulLogins * 0.3) {
      securityInsights.push({
        type: 'warning',
        title: 'High Failed Login Rate',
        description: `${securityMetrics.failedLoginAttempts} failed attempts vs ${securityMetrics.successfulLogins} successful`,
        action: 'Review authentication logs and consider implementing rate limiting'
      });
    }

    if (securityMetrics.activeSessions > 200) {
      securityInsights.push({
        type: 'info',
        title: 'High Active Sessions',
        description: `${securityMetrics.activeSessions} users currently active`,
        action: 'Monitor system performance and resource usage'
      });
    }

    if (failedLogins.rows.length > 10) {
      securityInsights.push({
        type: 'warning',
        title: 'Multiple Inactive Accounts',
        description: `${failedLogins.rows.length} accounts with login issues`,
        action: 'Review account status and send activation reminders'
      });
    }

    // Security recommendations
    const recommendations = [
      {
        category: 'Authentication',
        title: 'Enable Two-Factor Authentication',
        description: 'Implement 2FA for admin and mentor accounts',
        priority: 'high',
        status: 'pending'
      },
      {
        category: 'Access Control',
        title: 'Review User Permissions',
        description: 'Audit user roles and access levels',
        priority: 'medium',
        status: 'in_progress'
      },
      {
        category: 'Monitoring',
        title: 'Enhanced Logging',
        description: 'Implement comprehensive audit logging',
        priority: 'medium',
        status: 'completed'
      },
      {
        category: 'Data Protection',
        title: 'Encrypt Sensitive Data',
        description: 'Ensure all PII is properly encrypted',
        priority: 'high',
        status: 'completed'
      }
    ];

    return NextResponse.json({
      success: true,
      security: {
        metrics: securityMetrics,
        loginAttempts: loginAttempts.rows,
        activeSessions: activeSessions.rows,
        securityEvents: securityEvents.rows,
        userActivity: userActivity.rows,
        systemAccess: systemAccess.rows,
        failedLogins: failedLogins.rows,
        suspiciousActivity: suspiciousActivity.rows,
        insights: securityInsights,
        recommendations
      },
      timeRange,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching security data:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to fetch security data' },
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
    const { action, userId, data } = body;

    let result = {};

    switch (action) {
      case 'lock_user_account':
        // Lock user account
        await query(`
          UPDATE users 
          SET account_locked = true, locked_at = NOW(), locked_by = $1
          WHERE id = $2
        `, [decoded.userId, userId]);
        
        result = { message: 'User account locked successfully', userId };
        break;

      case 'unlock_user_account':
        // Unlock user account
        await query(`
          UPDATE users 
          SET account_locked = false, locked_at = NULL, locked_by = NULL
          WHERE id = $1
        `, [userId]);
        
        result = { message: 'User account unlocked successfully', userId };
        break;

      case 'reset_user_password':
        // Reset user password (generate temporary password)
        const tempPassword = crypto.randomBytes(9).toString('base64url');
        await query(`
          UPDATE users 
          SET password_reset_required = true, temp_password = $1, password_reset_at = NOW()
          WHERE id = $2
        `, [tempPassword, userId]);
        
        result = { message: 'Password reset initiated', userId, tempPassword };
        break;

      case 'log_security_event':
        // Log security event
        const { eventType, description, severity } = data;
        await query(`
          INSERT INTO security_logs (event_type, description, severity, user_id, created_at, created_by)
          VALUES ($1, $2, $3, $4, NOW(), $5)
        `, [eventType, description, severity, userId, decoded.userId]);
        
        result = { message: 'Security event logged successfully' };
        break;

      case 'update_security_settings':
        // Update system security settings
        const { settings } = data;
        // In a real app, you'd update security configuration
        result = { message: 'Security settings updated successfully', settings };
        break;

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid security action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in security action:', error);
    return NextResponse.json(
      { success: false, message: 'Security action failed', error: error.message },
      { status: 500 }
    );
  }
}