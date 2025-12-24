'use client';

import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function MainHeader() {
  return (
    <header className="header-light header-dark sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow p-1 bg-white dark:bg-slate-800">
              <img 
                src="/logo.svg" 
                alt="Fejrul Islam Logo" 
                className="w-full h-full object-contain logo-image"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-light text-primary-dark group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Fejrul Islam
              </h1>
              <p className="text-xs text-secondary-light text-secondary-dark">Dawah & Irshad Sector - HUMSJ</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/articles" className="nav-link">
              Articles
            </Link>
            <Link href="/discover-islam" className="nav-link">
              Discover Islam
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <ThemeToggle variant="simple" />
            <Link
              href="/auth/login"
              className="px-6 py-2 text-secondary-light text-secondary-dark hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 btn-primary rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
