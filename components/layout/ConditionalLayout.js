'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  // Remove locale prefix (e.g. /en, /ar, /om, /am)
  const pathWithoutLocale = pathname.replace(/^\/(en|ar|om|am)/, '') || '/';

  const isAdminRoute = pathWithoutLocale.startsWith('/admin');
  const isMentorRoute = pathWithoutLocale.startsWith('/mentor');
  const isDashboardRoute = pathWithoutLocale.startsWith('/dashboard');
  const isAuthRoute = pathWithoutLocale.startsWith('/auth');

  if (isAdminRoute || isMentorRoute || isDashboardRoute || isAuthRoute) {
    // Admin, mentor, student dashboard, and auth routes: no navbar/footer, full screen
    return children;
  }

  // Regular routes: with navbar and footer
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}