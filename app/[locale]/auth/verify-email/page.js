'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Mail, BookOpen } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState('verifying'); // verifying, otp, success, error
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [otp, setOtp] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      verifyEmail(token);
      return;
    }

    // OTP flow (requires authenticated session)
    setStatus('otp');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (!data.success) {
        setMessage('Please login first, then verify your email.');
        return;
      }
      setUser(data.user);
      if (data.user?.emailVerified) {
        setStatus('success');
        setMessage('Your email is already verified.');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setMessage('Unable to check your session. Please login again.');
    }
  };

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

  const resendOtp = async () => {
    setIsResending(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/resend-verification', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setMessage(`Verification code sent. ${data.devOTP ? `Dev Code: ${data.devOTP}` : ''}`.trim());
      } else {
        setMessage(data.message || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setMessage('Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setMessage('Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otp.trim() })
      });
      const data = await response.json();
      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setUser(data.user);

        setTimeout(() => {
          const role = data.user?.role;
          const gender = data.user?.gender;
          if (role === 'mentor') router.push('/mentor/dashboard');
          else if (role === 'admin') router.push('/admin/dashboard');
          else router.push(`/dashboard/${gender || 'male'}`);
        }, 1200);
      } else {
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setMessage('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
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

            {/* OTP State */}
            {status === 'otp' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">Verify Your Email</h2>
                <p className="text-slate-600 mb-6">
                  Enter the 6-digit code we sent to{user?.email ? ` ${user.email}` : ' your email'}.
                </p>

                {message && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-emerald-800">{message}</p>
                  </div>
                )}

                <form onSubmit={verifyOtp} className="space-y-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center text-lg font-mono tracking-widest"
                    placeholder="000000"
                  />

                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
                  >
                    {isVerifyingOtp ? 'Verifying…' : 'Verify Code'}
                  </button>

                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={isResending}
                    className="w-full py-3 px-4 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors disabled:opacity-60"
                  >
                    {isResending ? 'Sending…' : 'Resend Code'}
                  </button>

                  <Link
                    href="/auth/login"
                    className="block w-full py-3 px-4 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Back to Login
                  </Link>
                </form>
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
