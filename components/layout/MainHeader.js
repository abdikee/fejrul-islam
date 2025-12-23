'use client';

import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function MainHeader() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                Fejrul Islam HUMSJ
              </h1>
              <p className="text-xs text-slate-600">Haramaya University Muslim Students Jem'a</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/sectors" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors">
              Sectors
            </Link>
            <Link href="/about" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="px-6 py-2 text-slate-700 hover:text-emerald-600 font-semibold transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
