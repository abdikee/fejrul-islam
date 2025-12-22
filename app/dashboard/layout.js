import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export const metadata = {
  title: 'Student Dashboard - HUMSJ',
  description: 'Islamic learning platform for HUMSJ students',
};

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function DashboardLayout({ children }) {
  const token = cookies().get('auth-token')?.value;
  if (!token) {
    redirect('/auth/login');
  }

  try {
    const decoded = verifyJwtToken(token);
    if (decoded?.role === 'mentor') {
      redirect('/mentor/dashboard');
    }
    // allow: student + admin
  } catch {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* No general navbar or footer - students have their own interface */}
      {children}
    </div>
  );
}