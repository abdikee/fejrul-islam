'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/footer/Footer';

export default function VerifyPhonePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10">
                <img
                  src="/logo.svg"
                  alt="Fejrul Islam Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Fejrul Islam</h1>
                <p className="text-xs text-slate-600">Phone Verification</p>
              </div>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-800">Phone verification disabled</h1>
            <p className="text-slate-600 mt-3">
              This system no longer uses SMS OTP verification.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center mt-6 w-full py-3 px-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}