import jwt from 'jsonwebtoken';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production' && (!secret || secret.length < 16)) {
    throw new Error('JWT_SECRET must be set (and reasonably long) in production');
  }

  return secret || 'your-secret-key-change-in-production';
}

export function verifyJwtToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function signJwtToken(payload, options) {
  return jwt.sign(payload, getJwtSecret(), options);
}
