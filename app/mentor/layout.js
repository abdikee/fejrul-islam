import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export const metadata = {
  title: 'Mentor Portal - HUMSJ',
  description: 'Mentorship and guidance platform for HUMSJ mentors',
};

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function MentorLayout({ children }) {
  const token = cookies().get('auth-token')?.value;
  if (!token) {
    redirect('/auth/login');
  }

  try {
    const decoded = verifyJwtToken(token);
    if (decoded?.role !== 'mentor' && decoded?.role !== 'admin') {
      redirect('/dashboard');
    }
  } catch {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* No general navbar or footer - mentor has its own interface */}
      {children}
    </div>
  );
}