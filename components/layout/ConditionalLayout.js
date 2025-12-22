'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isMentorRoute = pathname?.startsWith('/mentor');
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  const isAuthRoute = pathname?.startsWith('/auth');

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