'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { GraduationCap } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function MainHeader() {
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

  return (
    <header className="header-light header-dark sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href={withLocale('/')} className="flex items-center gap-3 group">
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
            <Link href={withLocale('/')} className="nav-link">{tNav('home')}</Link>
            <Link href={withLocale('/articles')} className="nav-link">{tNav('articles')}</Link>
            <Link href={withLocale('/discover-islam')} className="nav-link">{tNav('discoverIslam')}</Link>
            <Link href={withLocale('/about')} className="nav-link">{tNav('about')}</Link>
            <Link href={withLocale('/contact')} className="nav-link">{tNav('contact')}</Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <ThemeToggle variant="simple" />
            <Link
              href={withLocale('/auth/login')}
              className="px-6 py-2 text-secondary-light text-secondary-dark hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors"
            >
              {tNav('login')}
            </Link>
            <Link
              href={withLocale('/auth/signup')}
              className="px-6 py-2 btn-primary rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              {tNav('signup')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
