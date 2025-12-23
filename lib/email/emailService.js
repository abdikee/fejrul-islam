// Email Service for sending verification emails
// This is a basic implementation. In production, use services like:
// - SendGrid
// - AWS SES
// - Nodemailer with SMTP
// - Resend

import crypto from 'crypto';

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP verification email
 * In production, replace this with actual email service
 */
export async function sendOTPEmail(email, otp, firstName) {
  // For development: Log to console
  console.log('\n=================================');
  console.log('📧 EMAIL VERIFICATION OTP');
  console.log('=================================');
  console.log(`To: ${email}`);
  console.log(`Name: ${firstName}`);
  console.log(`OTP Code: ${otp}`);
  console.log(`Valid for: 10 minutes`);
  console.log('=================================\n');

  // TODO: In production, implement actual email sending
  // Example with SendGrid:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: email,
    from: 'noreply@fejrulislam.edu',
    subject: 'Your Verification Code - Fejrul Islam',
    html: getOTPEmailTemplate(firstName, otp),
  };
  
  await sgMail.send(msg);
  */

  // For now, return success
  return {
    success: true,
    message: 'Verification OTP sent (check console in development)',
    devOTP: process.env.NODE_ENV === 'development' ? otp : undefined
  };
}

/**
 * Email template for OTP verification
 */
export function getOTPEmailTemplate(firstName, otp) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Verification Code</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Fejrul Islam</h1>
        <p style="color: #d1fae5; margin: 10px 0 0 0;">Haramaya University Muslim Students Jem'a</p>
      </div>
      
      <div style="background: #f9fafb; padding: 40px 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937; margin-top: 0;">Assalamu Alaikum, ${firstName}!</h2>
        
        <p style="font-size: 16px; color: #4b5563;">
          Thank you for registering with Fejrul Islam. To complete your registration and verify your email address, 
          please enter the following verification code:
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <div style="background: white; border: 3px dashed #10b981; border-radius: 12px; padding: 20px; display: inline-block;">
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
            <p style="font-size: 42px; font-weight: bold; color: #059669; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${otp}
            </p>
          </div>
        </div>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 30px 0;">
          <p style="font-size: 14px; color: #92400e; margin: 0;">
            <strong>⏰ Important:</strong> This code will expire in <strong>10 minutes</strong>
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 14px; color: #6b7280; margin: 5px 0;">
            <strong>Security Tips:</strong>
          </p>
          <ul style="font-size: 14px; color: #6b7280; margin: 10px 0; padding-left: 20px;">
            <li>Never share this code with anyone</li>
            <li>Fejrul Islam staff will never ask for your verification code</li>
            <li>If you didn't request this code, please ignore this email</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; text-align: center; padding: 20px; background: #ecfdf5; border-radius: 8px;">
          <p style="color: #059669; font-style: italic; margin: 0; font-size: 14px;">
            "وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ"
          </p>
          <p style="color: #047857; font-size: 12px; margin: 5px 0 0 0;">
            "And say: Work, for Allah will see your work" - Quran 9:105
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
        <p>© 2024 Fejrul Islam - Haramaya University Muslim Students Jem'a</p>
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email, resetUrl, firstName) {
  console.log('\n=================================');
  console.log('🔐 PASSWORD RESET');
  console.log('=================================');
  console.log(`To: ${email}`);
  console.log(`Name: ${firstName}`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log('=================================\n');

  return {
    success: true,
    message: 'Password reset email sent (check console in development)'
  };
}
