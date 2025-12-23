'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Lock, Eye, EyeOff, BookOpen, ArrowLeft, Heart, Flower } from 'lucide-react';
import Alert from '@/components/ui/Alert';

export default function FemaleLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null); // Clear any existing alerts
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Check if user gender matches the portal
        if (data.user.gender !== 'female' && data.user.role === 'student') {
          setAlert({
            type: 'warning',
            title: 'Wrong Portal',
            message: 'This is the Sisters Portal. Please use the Brothers Portal for male accounts.'
          });
          return;
        }
        
        // Redirect based on role and redirect URL
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          window.location.href = '/dashboard/female';
        }
      } else {
        setAlert({
          type: 'error',
          title: 'Login Failed',
          message: data.message || 'Invalid email or password. Please try again.'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'An error occurred during login. Please try again.'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Fejrul Islam</h1>
                <p className="text-xs text-slate-600">Sisters Portal</p>
              </div>
            </Link>
            <Link 
              href="/auth/login" 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Selection</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header with Islamic Pattern */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-8 text-white text-center relative">
              {/* Decorative Islamic Floral Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="floral-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                    <circle cx="12.5" cy="12.5" r="8" fill="none" stroke="white" strokeWidth="0.5" />
                    <path d="M12.5,4.5 Q16.5,8.5 12.5,12.5 Q8.5,8.5 12.5,4.5" fill="white" opacity="0.3" />
                    <path d="M20.5,12.5 Q16.5,16.5 12.5,12.5 Q16.5,8.5 20.5,12.5" fill="white" opacity="0.3" />
                    <path d="M12.5,20.5 Q8.5,16.5 12.5,12.5 Q16.5,16.5 12.5,20.5" fill="white" opacity="0.3" />
                    <path d="M4.5,12.5 Q8.5,8.5 12.5,12.5 Q8.5,16.5 4.5,12.5" fill="white" opacity="0.3" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#floral-pattern)" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Sisters Portal</h2>
                <p className="text-rose-100">Welcome back, Ukhti</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-8">
              {/* Alert Display */}
              {alert && (
                <Alert
                  type={alert.type}
                  title={alert.title}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                  className="mb-6"
                />
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
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
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
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
                      className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-slate-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-700">
                      Remember me
                    </label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-sm text-rose-600 hover:text-rose-700">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-rose-700 hover:to-rose-800 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Login Sisters Portal
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-center text-sm text-slate-600 mb-4">
                  Don't have an account?
                </p>
                <Link
                  href="/auth/signup/female"
                  className="w-full block text-center py-3 px-4 border border-rose-600 text-rose-600 rounded-lg font-semibold hover:bg-rose-50 transition-colors"
                >
                  Register as Sister
                </Link>
              </div>

              {/* Islamic Quote */}
              <div className="mt-6 p-4 bg-rose-50 rounded-lg border border-rose-200">
                <p className="text-sm text-rose-800 text-center font-medium mb-1">
                  "وَالْمُؤْمِنَاتُ بَعْضُهُنَّ أَوْلِيَاءُ بَعْضٍ"
                </p>
                <p className="text-xs text-rose-600 text-center italic">
                  "And the believing women are allies of one another" - Quran 9:71
                </p>
              </div>

              {/* Decorative Element */}
              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-2 text-rose-300">
                  <Flower className="w-4 h-4" />
                  <div className="w-8 h-px bg-rose-200"></div>
                  <Flower className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Links */}
          <div className="text-center mt-6 space-y-2">
            <Link href="/auth/login/male" className="block text-sm text-slate-600 hover:text-slate-800">
              Switch to Brothers Portal
            </Link>
            <Link href="/" className="block text-sm text-slate-500 hover:text-slate-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}