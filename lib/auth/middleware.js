import { getUserById } from '@/lib/db/utils.js';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export async function verifyAuth(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = verifyJwtToken(token);
    const user = await getUserById(decoded.userId);
    
    return user;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export function createAuthResponse(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    gender: user.gender,
    role: user.role,
    level: user.level,
    department: user.department,
    academicYear: user.academic_year,
    emailVerified: user.email_verified || false,
    profilePhoto: user.profile_photo || null
  };
}
