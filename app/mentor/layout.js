import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJwtToken } from '@/lib/auth/jwt.js';
import MentorShell from '@/components/mentor/MentorShell';

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

  let user = null;
  try {
    const decoded = verifyJwtToken(token);
    if (decoded?.role !== 'mentor' && decoded?.role !== 'admin') {
      redirect('/dashboard');
    }
    user = decoded;
  } catch {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <MentorShell user={user}>
        {children}
      </MentorShell>
    </div>
  );
}
