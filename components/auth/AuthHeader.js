'use client';

import Link from 'next/link';
import { GraduationCap, Home, ArrowLeft } from 'lucide-react';

export default function AuthHeader() {
  return (
    <div className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left Side */}
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg p-1">
              <img 
                src="/logo.svg" 
                alt="Fejrul Islam Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Fejrul Islam</h1>
              <p className="text-sm text-slate-600">Dawah & Irshad Sector - HUMSJ</p>
            </div>
          </Link>

          {/* Back to Home Button - Right Side */}
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}