'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import LanguageSwitcher from '@/components/site/LanguageSwitcher';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Discover Islam', href: '/discover-islam' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-emerald-600 font-bold text-xl">
            <div className="w-10 h-10">
              <img
                src="/logo.svg"
                alt="Fejrul Islam Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold text-slate-800">Fejrul Islam</span>
              <span className="text-xs text-emerald-600 font-semibold">HUMSJ</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors font-medium shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-700 hover:text-emerald-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            {/* Navigation Links */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
              <div className="px-4 py-2">
                <LanguageSwitcher />
              </div>
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-3 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}