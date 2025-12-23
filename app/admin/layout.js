import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJwtToken } from '@/lib/auth/jwt.js';
import '../globals.css';

export const metadata = {
  title: 'Admin Portal - HUMSJ',
  description: 'Administrative dashboard for HUMSJ system management',
};

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function AdminLayout({ children }) {
  // Verify authentication and admin role
  const token = cookies().get('auth-token')?.value;
  
  if (!token) {
    redirect('/auth/login');
  }

  try {
    const decoded = verifyJwtToken(token);
    
    // Only admins can access this area
    if (decoded?.role !== 'admin') {
      // Redirect based on actual role
      if (decoded?.role === 'mentor') {
        redirect('/mentor/dashboard');
      } else if (decoded?.gender === 'male') {
        redirect('/dashboard/male');
      } else if (decoded?.gender === 'female') {
        redirect('/dashboard/female');
      } else {
        redirect('/dashboard');
      }
    }
  } catch (error) {
    console.error('Admin auth error:', error);
    redirect('/auth/login');
  }

  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-50">
        {children}
      </body>
    </html>
  );
}
