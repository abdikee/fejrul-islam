'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Lock, Eye, EyeOff, BookOpen, ArrowLeft } from 'lucide-react';
import AuthHeader from '@/components/auth/AuthHeader';
import Footer from '@/components/footer/Footer';
import notify from '@/lib/notify';

function safeInternalPath(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    // Accept either a path (/dashboard/...) or a full URL to same origin
    if (value.startsWith('/')) return value;
    const url = new URL(value);
    return url.pathname + url.search + url.hash;
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const [returnUrl, setReturnUrl] = useState(null);
  const [enrollTarget, setEnrollTarget] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const signupHref = `/auth/signup?redirect=${encodeURIComponent(returnUrl || '/')}${
    enrollTarget ? `&enroll=${encodeURIComponent(enrollTarget)}` : ''
  }`;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReturnUrl(safeInternalPath(params.get('returnUrl')));
    const enroll = params.get('enroll');
    if (enroll && typeof enroll === 'string') {
      setEnrollTarget(enroll);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!data.success) {
        notify.error(data.message || 'Invalid email or password. Please try again.');
        return;
      }

      // If user came from a program click, auto-enroll after login.
      if (enrollTarget && enrollTarget.includes(':')) {
        const [programType, programId] = enrollTarget.split(':');
        try {
          await fetch('/api/enrollment/enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              programType,
              programId,
              enrollmentData: { source: 'auth_login_auto_enroll', auto_enrolled: true }
            })
          });
        } catch (err) {
          // best-effort (still allow login)
        }
      }

      const redirectUrl = data.redirectUrl;

      // If a returnUrl is provided, honor it (internal only).
      if (!data.requiresVerification && returnUrl) {
        window.location.href = returnUrl;
        return;
      }

      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      // Fallback role-based routing
      const role = data.user?.role;
      const gender = data.user?.gender;
      if (role === 'admin') window.location.href = '/admin/dashboard';
      else if (role === 'mentor') window.location.href = '/mentor/dashboard';
      else window.location.href = `/dashboard/${gender || 'male'}`;
    } catch (error) {
      console.error('Login error:', error);
      notify.error('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <AuthHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 text-white text-center relative">
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="login-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <polygon points="10,0 20,10 10,20 0,10" fill="white" />
                    <circle cx="10" cy="10" r="3" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#login-pattern)" />
                </svg>
              </div>

              <div className="relative z-10">
                {/* Jem'a Logo */}
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30 p-2">
                  <img 
                    src="/logo.svg" 
                    alt="Fejrul Islam Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Welcome Message */}
                <h1 className="text-2xl font-bold mb-2 font-arabic">أهلاً وسهلاً</h1>
                <h2 className="text-xl font-semibold mb-3">Welcome Back</h2>
                <p className="text-emerald-100 mb-2">Dawah & Irshad Sector - HUMSJ</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {returnUrl && (
                <div className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <ArrowLeft className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">You’ll be returned after login</p>
                    <p className="text-xs text-emerald-700 break-all">{returnUrl}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-primary block w-full pl-10 pr-3 py-3 rounded-lg focus:ring-2 transition-colors"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input-primary block w-full pl-10 pr-10 py-3 rounded-lg focus:ring-2 transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-200">
                {/* Islamic Greeting */}
                <div className="text-center mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-emerald-800 font-medium mb-1 text-lg font-arabic">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p className="text-emerald-700 text-sm italic">
                    "In the name of Allah, the Most Gracious, the Most Merciful"
                  </p>
                </div>

                <p className="text-sm text-slate-600 mb-4 text-center">
                  Don't have an account?{' '}
                  <Link href={signupHref} className="text-emerald-600 hover:text-emerald-700 font-semibold">
                    Register here
                  </Link>
                </p>
                <div className="text-center">
                  <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm">
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}