'use client';

import { useState, useEffect } from 'react';
import { RealtimeProvider } from '@/components/realtime/RealtimeProvider';
import MentorSidebar from '@/components/mentor/MentorSidebar';
import MentorHeader from '@/components/mentor/MentorHeader';
import MentorOverview from '@/components/mentor/MentorOverview';
import StudentManagement from '@/components/mentor/StudentManagement';
import SubmissionReview from '@/components/mentor/SubmissionReview';
import AssignmentManagement from '@/components/mentor/AssignmentManagement';
import CounselingManagement from '@/components/mentor/CounselingManagement';
import MentorMessages from '@/components/mentor/MentorMessages';

export default function MentorDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch mentor user data
    const fetchMentorData = async () => {
      try {
        const response = await fetch('/api/dashboard/user', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/auth/login';
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        
        if (data.success) {
          // Check if user is mentor
          if (data.user.role !== 'mentor') {
            // Redirect non-mentor users to appropriate dashboard
            if (data.user.role === 'admin') {
              window.location.href = '/admin/dashboard';
            } else {
              window.location.href = '/dashboard';
            }
            return;
          }
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        window.location.href = '/auth/login';
      }
    };

    fetchMentorData();
  }, []);

  if (!user) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading mentor dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <MentorOverview user={user} />;
      case 'students':
        return <StudentManagement user={user} />;
      case 'submissions':
        return <SubmissionReview user={user} />;
      case 'assignments':
        return <AssignmentManagement user={user} />;
      case 'counseling':
        return <CounselingManagement user={user} />;
      case 'messages':
        return <MentorMessages user={user} />;
      default:
        return <MentorOverview user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <RealtimeProvider userId={user.id}>
        {/* Mentor Sidebar */}
        <MentorSidebar 
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Mentor Header */}
          <MentorHeader 
            user={user}
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/* Dashboard Content - Scrollable */}
          <main className="flex-1 p-6">
            <div>
              {renderContent()}
            </div>
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </RealtimeProvider>
    </div>
  );
}