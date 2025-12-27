'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import LanguageSwitcher from '@/components/site/LanguageSwitcher';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const tNav = useTranslations('Navigation');

  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';

  const withLocale = (href) => {
    if (!href || typeof href !== 'string') return href;
    if (!href.startsWith('/')) return href;
    if (localePrefix && href.startsWith(`${localePrefix}/`)) return href;
    return `${localePrefix}${href}`;
  };

  const navigation = [
    { key: 'home', href: '/' },
    { key: 'discoverIslam', href: '/discover-islam' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' }
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md dark:shadow-slate-900/30 sticky top-0 z-50 border-b border-transparent dark:border-slate-800">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={withLocale('/')} className="flex items-center gap-3 text-emerald-600 font-bold text-xl">
            <div className="w-10 h-10">
              <img
                src="/logo.svg"
                alt="Fejrul Islam Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">Fejrul Islam</span>
              <span className="text-xs text-emerald-600 font-semibold">HUMSJ</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={withLocale(item.href)}
                className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
              >
                {tNav(item.key)}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle variant="simple" />
            <Link
              href={withLocale('/auth/login')}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
            >
              <LogIn className="w-4 h-4" />
              {tNav('login')}
            </Link>
            <Link
              href={withLocale('/auth/signup')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors font-medium shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              {tNav('signup')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800">
            {/* Navigation Links */}
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={withLocale(item.href)}
                className="block px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {tNav(item.key)}
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
              <div className="px-4 py-2 flex items-center justify-between">
                <LanguageSwitcher />
                <ThemeToggle variant="simple" />
              </div>
              <Link
                href={withLocale('/auth/login')}
                className="flex items-center gap-2 px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                {tNav('login')}
              </Link>
              <Link
                href={withLocale('/auth/signup')}
                className="flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserPlus className="w-4 h-4" />
                {tNav('signup')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}