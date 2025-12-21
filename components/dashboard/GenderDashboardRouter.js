'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GenderDashboardRouter({ user }) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (user && user.gender) {
      setIsRedirecting(true);
      
      // Redirect based on gender
      if (user.gender === 'female') {
        router.push('/dashboard/female');
      } else if (user.gender === 'male') {
        router.push('/dashboard/male');
      } else {
        // Default dashboard for unspecified gender
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  if (isRedirecting || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}