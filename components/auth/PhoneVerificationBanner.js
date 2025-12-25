'use client';

import { CheckCircle } from 'lucide-react';

export default function PhoneVerificationBanner({ user, onDismiss }) {
  return null;
}

// Compact version for smaller spaces
export function PhoneVerificationAlert({ user, className = '' }) {
  return null;
}

// Success version when phone is verified
export function PhoneVerifiedBadge({ user, className = '' }) {
  if (!user?.phone_verified) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium ${className}`}>
      <CheckCircle className="w-4 h-4" />
      Phone Verified
    </div>
  );
}