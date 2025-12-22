'use client';

import { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import ContentAnalyticsWidget from './ContentAnalyticsWidget';
import ActivityFeed from './ActivityFeed';

export default function AdminLayout({ children, showAnalytics = false, showActivity = false }) {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch current admin user data
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (data.success) {
          // Check if user is admin
          if (data.user.role !== 'admin') {
            if (data.user.role === 'mentor') {
              window.location.href = '/mentor/dashboard';
            } else {
              window.location.href = `/dashboard/${data.user.gender}`;
            }
            return;
          }
          setUser(data.user);
        } else {
          // Redirect to login if not authenticated
          window.location.href = '/auth/login';
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        // Use mock data for development
        setUser({
          firstName: 'System',
          lastName: 'Admin',
          email: 'admin@humsj.edu.et',
          role: 'admin'
        });
      }
    };
    
    fetchUser();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading admin dashboard...</p>
          <p className="text-slate-500 text-sm mt-2">Initializing system components</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Admin Header */}
      <AdminHeader 
        user={user} 
        onMenuToggle={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex">
        {/* Admin Sidebar */}
        <AdminSidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-64">
          {/* Analytics & Activity Widgets - Only show if requested */}
          {(showAnalytics || showActivity) && (
            <div className="p-6 pb-0">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Content Analytics Widget */}
                {showAnalytics && (
                  <div className="xl:col-span-2">
                    <ContentAnalyticsWidget />
                  </div>
                )}
                
                {/* Activity Feed */}
                {showActivity && (
                  <div className={showAnalytics ? "xl:col-span-1" : "xl:col-span-3"}>
                    <ActivityFeed />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Page Content */}
          <div className={`${(showAnalytics || showActivity) ? '' : 'pt-6'}`}>
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}