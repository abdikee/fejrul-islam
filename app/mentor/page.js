'use client';

import { useEffect } from 'react';

export default function MentorPage() {
  useEffect(() => {
    // Redirect to mentor dashboard
    window.location.href = '/mentor/dashboard';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to mentor dashboard...</p>
      </div>
    </div>
  );
}