
'use client';

import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Email verification disabled</h1>
        <p className="text-slate-600 mt-3">
          This system no longer uses email OTP verification. You can continue by logging in.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center mt-6 w-full py-3 px-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
