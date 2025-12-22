'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Users, ArrowRight, BookOpen, Heart } from 'lucide-react';
import AuthHeader from '@/components/auth/AuthHeader';
import Footer from '@/components/footer/Footer';

export default function LoginGenderSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <AuthHeader />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-800 mb-4">
              Welcome to Islamic Learning
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Please select your login portal to access gender-appropriate Islamic education resources
            </p>
          </div>

          {/* Gender Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Male Students Portal */}
            <Link href="/auth/login/male">
              <div className="group bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="text-center">
                  {/* Islamic Pattern Background */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    {/* Decorative Islamic Pattern */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 border-4 border-blue-200 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 border-4 border-blue-300 rounded-full opacity-30"></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    Brothers Portal
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Access male-specific Islamic education programs, brotherhood circles, and leadership development
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6 text-sm text-slate-600">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Brotherhood Development</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Leadership Training</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Imam Development</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                    <span>Enter Brothers Portal</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Female Students Portal */}
            <Link href="/auth/login/female">
              <div className="group bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="text-center">
                  {/* Islamic Pattern Background */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-rose-600 to-rose-700 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="w-12 h-12 text-white" />
                    </div>
                    {/* Decorative Islamic Pattern */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 border-4 border-rose-200 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 border-4 border-rose-300 rounded-full opacity-30"></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    Sisters Portal
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Access female-specific Islamic education programs, sisterhood circles, and spiritual development
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6 text-sm text-slate-600">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      <span>Sisterhood Development</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      <span>Spiritual Growth</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      <span>Community Leadership</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-rose-600 font-semibold group-hover:gap-3 transition-all">
                    <span>Enter Sisters Portal</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Islamic Quote */}
          <div className="text-center mt-12 p-6 bg-white/50 rounded-xl border border-slate-200">
            <p className="text-lg text-slate-700 font-medium mb-2">
              "وَقُل رَّبِّ زِدْنِي عِلْمًا"
            </p>
            <p className="text-slate-600 italic">
              "And say: My Lord, increase me in knowledge" - Quran 20:114
            </p>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-8">
            <p className="text-slate-600 mb-4">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Register here
              </Link>
            </p>
            <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}