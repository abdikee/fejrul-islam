import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Generate a 6-digit SMS OTP code
 */
export function generateSMSOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validate and format phone number for SMS
 */
export function validatePhoneForSMS(phoneNumber) {
  try {
    const parsed = parsePhoneNumberFromString(phoneNumber);
    if (!parsed || !parsed.isValid()) {
      return { valid: false, error: 'Invalid phone number format' };
    }
    
    return {
      valid: true,
      formatted: parsed.number,
      country: parsed.country,
      nationalNumber: parsed.nationalNumber
    };
  } catch (error) {
    return { valid: false, error: 'Failed to parse phone number' };
  }
}

/**
 * Send SMS OTP code
 * In production, integrate with SMS service like Twilio, AWS SNS, or local Ethiopian SMS provider
 */
export async function sendSMSOTP(phoneNumber, otp, firstName) {
  const phoneValidation = validatePhoneForSMS(phoneNumber);
  
  if (!phoneValidation.valid) {
    throw new Error(phoneValidation.error);
  }

  // For development: Log to console
  console.log('\n=================================');
  console.log('📱 SMS VERIFICATION OTP');
  console.log('=================================');
  console.log(`To: ${phoneValidation.formatted}`);
  console.log(`Country: ${phoneValidation.country}`);
  console.log(`Name: ${firstName}`);
  console.log(`OTP Code: ${otp}`);
  console.log(`Valid for: 5 minutes`);
  console.log('=================================\n');

  // TODO: In production, replace with actual SMS service
  // Example integrations:
  
  // 1. Twilio (International)
  // const client = twilio(accountSid, authToken);
  // await client.messages.create({
  //   body: `Your Fejrul Islam verification code is: ${otp}. Valid for 5 minutes.`,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: phoneValidation.formatted
  // });

  // 2. AWS SNS (International)
  // const sns = new AWS.SNS();
  // await sns.publish({
  //   Message: `Your Fejrul Islam verification code is: ${otp}. Valid for 5 minutes.`,
  //   PhoneNumber: phoneValidation.formatted
  // }).promise();

  // 3. Ethiopian SMS Gateway (Local)
  // const response = await fetch('https://sms.ethiotelecom.et/api/send', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     username: process.env.ET_SMS_USERNAME,
  //     password: process.env.ET_SMS_PASSWORD,
  //     to: phoneValidation.nationalNumber,
  //     message: `Your Fejrul Islam verification code is: ${otp}. Valid for 5 minutes.`
  //   })
  // });

  return {
    success: true,
    message: 'SMS OTP sent successfully (check console in development)',
    phoneNumber: phoneValidation.formatted,
    devOTP: process.env.NODE_ENV === 'development' ? otp : undefined
  };
}

/**
 * Get SMS template for OTP
 */
export function getSMSTemplate(firstName, otp) {
  return `السلام عليكم ${firstName}! Your Fejrul Islam verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`;
}

/**
 * Rate limiting for SMS sending
 */
const smsRateLimit = new Map();

export function checkSMSRateLimit(phoneNumber, maxAttempts = 3, windowMinutes = 15) {
  const key = phoneNumber;
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  
  if (!smsRateLimit.has(key)) {
    smsRateLimit.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  const data = smsRateLimit.get(key);
  
  // Reset if window has passed
  if (now - data.firstAttempt > windowMs) {
    smsRateLimit.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  // Check if limit exceeded
  if (data.count >= maxAttempts) {
    const timeLeft = Math.ceil((windowMs - (now - data.firstAttempt)) / 60000);
    return { 
      allowed: false, 
      remaining: 0, 
      timeLeft,
      message: `Too many SMS attempts. Try again in ${timeLeft} minutes.`
    };
  }
  
  // Increment count
  data.count++;
  smsRateLimit.set(key, data);
  
  return { allowed: true, remaining: maxAttempts - data.count };
}