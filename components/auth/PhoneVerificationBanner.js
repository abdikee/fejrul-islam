'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, X, AlertCircle, CheckCircle, Shield } from 'lucide-react';

export default function PhoneVerificationBanner({ user, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);

  // Don't show if user doesn't have a phone number or it's already verified
  if (!user?.phone || user.phone_verified || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium">Phone Verification Required</p>
              <p className="text-sm text-amber-100">
                Secure your account by verifying your phone number: {user.phone}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/auth/verify-phone"
              className="px-4 py-2 bg-white text-amber-600 rounded-lg font-medium hover:bg-amber-50 transition-colors text-sm"
            >
              Verify Now
            </Link>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact version for smaller spaces
export function PhoneVerificationAlert({ user, className = '' }) {
  if (!user?.phone || user.phone_verified) {
    return null;
  }

  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-amber-800">Phone Verification Pending</h3>
          <p className="text-sm text-amber-700 mt-1">
            Your phone number {user.phone} needs verification for enhanced security.
          </p>
          <Link
            href="/auth/verify-phone"
            className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            <Shield className="w-4 h-4" />
            Verify Phone Number
          </Link>
        </div>
      </div>
    </div>
  );
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