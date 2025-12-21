'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserPlus, Users, ArrowRight, BookOpen, Heart, Star } from 'lucide-react';

export default function SignupGenderSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Fejrul Islam</h1>
              <p className="text-xs text-slate-600">HUMSJ</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-800 mb-4">
              Join Our Islamic Community
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Begin your journey of Islamic learning and spiritual growth. Choose your registration portal for a personalized experience.
            </p>
          </div>

          {/* Gender Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Male Students Registration */}
            <Link href="/auth/signup/male">
              <div className="group bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="text-center">
                  {/* Islamic Pattern Background */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                    {/* Decorative Islamic Pattern */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 border-4 border-blue-200 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 border-4 border-blue-300 rounded-full opacity-30"></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    Brothers Registration
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Join the brotherhood of Islamic learners. Access specialized programs for male students and leadership development.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6 text-sm text-slate-600">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-blue-500" />
                      <span>Brotherhood Networks</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-blue-500" />
                      <span>Leadership Programs</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-blue-500" />
                      <span>Imam Training Track</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-blue-500" />
                      <span>Male-Only Study Circles</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                    <span>Register as Brother</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Female Students Registration */}
            <Link href="/auth/signup/female">
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
                    Sisters Registration
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Join the sisterhood of Islamic learners. Access specialized programs for female students and spiritual development.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6 text-sm text-slate-600">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-rose-500" />
                      <span>Sisterhood Networks</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-rose-500" />
                      <span>Spiritual Growth Programs</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-rose-500" />
                      <span>Female Scholar Track</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-rose-500" />
                      <span>Female-Only Study Circles</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-rose-600 font-semibold group-hover:gap-3 transition-all">
                    <span>Register as Sister</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Islamic Quote */}
          <div className="text-center mt-12 p-6 bg-white/50 rounded-xl border border-slate-200">
            <p className="text-lg text-slate-700 font-medium mb-2">
              "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ"
            </p>
            <p className="text-slate-600 italic">
              "Seeking knowledge is an obligation upon every Muslim" - Hadith
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mt-12 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-200">
            <h3 className="text-2xl font-bold text-center text-slate-800 mb-6">
              Why Join HUMSJ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Comprehensive Education</h4>
                <p className="text-sm text-slate-600">Five-sector Islamic education covering all aspects of Muslim life</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Strong Community</h4>
                <p className="text-sm text-slate-600">Connect with like-minded Muslims in your learning journey</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Spiritual Growth</h4>
                <p className="text-sm text-slate-600">Develop both knowledge and character through Islamic guidance</p>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-8">
            <p className="text-slate-600 mb-4">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Sign in here
              </Link>
            </p>
            <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}