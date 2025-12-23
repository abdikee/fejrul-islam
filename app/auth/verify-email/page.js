'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Mail, BookOpen } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    // Verify the email
    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setUser(data.user);

        // Redirect to appropriate dashboard after 3 seconds
        setTimeout(() => {
          if (data.user.role === 'mentor') {
            router.push('/mentor/dashboard');
          } else if (data.user.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            // Student - redirect based on gender
            router.push(`/dashboard/${data.user.gender}`);
          }
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('An error occurred during verification. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-slate-800">Fejrul Islam</h1>
              <p className="text-xs text-slate-600">Haramaya University</p>
            </div>
          </Link>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8">
            {/* Verifying State */}
            {status === 'verifying' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">
                  Verifying Your Email
                </h2>
                <p className="text-slate-600">
                  Please wait while we verify your email address...
                </p>
              </div>
            )}

            {/* Success State */}
            {status === 'success' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">
                  Email Verified Successfully!
                </h2>
                <p className="text-slate-600 mb-6">
                  {message}
                </p>
                
                {user && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-emerald-800">
                      <strong>Welcome, {user.firstName}!</strong>
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Redirecting you to your dashboard...
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Redirecting in 3 seconds...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">
                  Verification Failed
                </h2>
                <p className="text-slate-600 mb-6">
                  {message}
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800 mb-2">
                    <strong>Common reasons:</strong>
                  </p>
                  <ul className="text-xs text-red-600 text-left space-y-1">
                    <li>• The verification link has expired (valid for 24 hours)</li>
                    <li>• The link has already been used</li>
                    <li>• The link is invalid or corrupted</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    className="block w-full py-3 px-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Go to Login
                  </Link>
                  <Link
                    href="/"
                    className="block w-full py-3 px-4 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Islamic Quote */}
          <div className="bg-emerald-50 border-t border-emerald-200 p-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-emerald-800 font-medium mb-1">
                  "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ"
                </p>
                <p className="text-xs text-emerald-600 italic">
                  "Indeed, Allah loves those who are constantly repentant and loves those who purify themselves" - Quran 2:222
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">
            Need help?{' '}
            <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
