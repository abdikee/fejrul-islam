'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

/**
 * Simple enrollment button that handles authentication and enrollment flow
 * Automatically enrolls users and redirects to appropriate dashboard
 */
export default function EnrollmentButton({ 
  programType, 
  programId, 
  programName,
  className = '',
  children = 'Enroll Now',
  variant = 'primary'
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);

  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50';
  const variants = {
    primary: 'bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
    success: 'bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600',
    outline: 'border-2 border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
  };

  const handleClick = async () => {
    if (loading) return;

    // If not authenticated, redirect to login with return URL
    if (!user) {
      const currentUrl = encodeURIComponent(window.location.pathname);
      router.push(`/auth/login?returnUrl=${currentUrl}&enroll=${programType}:${programId}`);
      return;
    }

    // Auto-enroll and redirect to dashboard
    setEnrolling(true);
    try {
      // Check enrollment status first
      const statusResponse = await fetch(`/api/enrollment/status?type=${programType}&id=${programId}`);
      const statusData = await statusResponse.json();

      if (statusData.enrolled) {
        // Already enrolled - redirect to dashboard
        const dashboardUrl = getDashboardUrl(user, programType, programId);
        router.push(dashboardUrl);
        return;
      }

      // Create enrollment automatically
      const enrollResponse = await fetch('/api/enrollment/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programType,
          programId,
          enrollmentData: {
            source: 'homepage_quick_enroll',
            auto_enrolled: true
          }
        })
      });

      const enrollData = await enrollResponse.json();
      
      console.log('Enrollment response:', enrollData); // Debug log
      
      if (enrollData.success) {
        // Successfully enrolled - redirect to dashboard
        const dashboardUrl = getDashboardUrl(user, programType, programId);
        router.push(dashboardUrl);
      } else {
        console.error('Enrollment failed:', enrollData);
        alert(`Enrollment failed: ${enrollData.message}\n\nProgram: ${programName}\nID: ${programId}\nType: ${programType}`);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const getDashboardUrl = (user, programType, programId) => {
    if (user.role === 'mentor') {
      return '/mentor/dashboard';
    } else if (user.role === 'admin') {
      return '/admin/dashboard';
    } else {
      // Student - redirect to appropriate dashboard based on program type
      const genderPath = user.gender; // 'male' or 'female'
      
      switch (programType) {
        case 'sector':
          // For sectors, redirect to the sectors page in their dashboard
          return `/dashboard/${genderPath}?enrolled=${programId}`;
        case 'course':
          return `/dashboard/${genderPath}/courses/${programId}`;
        case 'qirat':
          return `/dashboard/${genderPath}/qirat`;
        default:
          return `/dashboard/${genderPath}`;
      }
    }
  };

  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </>
      );
    }
    
    if (enrolling) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Enrolling...
        </>
      );
    }
    
    if (!user) {
      return (
        <>
          <LogIn className="w-4 h-4" />
          Sign In to Enroll
        </>
      );
    }
    
    return (
      <>
        <UserPlus className="w-4 h-4" />
        {children}
      </>
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || enrolling}
      className={`${baseClasses} ${variants[variant]} ${className} flex items-center justify-center gap-2`}
    >
      {getButtonContent()}
    </button>
  );
}