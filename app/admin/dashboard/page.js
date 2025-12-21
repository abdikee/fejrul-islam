'use client';

import { useState, useEffect } from 'react';
import { RealtimeProvider } from '@/components/realtime/RealtimeProvider';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import SystemOverview from '@/components/admin/SystemOverview';
import UserManagement from '@/components/admin/UserManagement';
import ContentManagement from '@/components/admin/ContentManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch admin user data
    const fetchAdminData = async () => {
      try {
        const response = await fetch('/api/dashboard/user');
        
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/auth/login';
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        
        if (data.success) {
          // Check if user is admin
          if (data.user.role !== 'admin') {
            // Redirect non-admin users to regular dashboard
            window.location.href = '/dashboard';
            return;
          }
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        window.location.href = '/auth/login';
      }
    };

    fetchAdminData();
  }, []);

  if (!user) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SystemOverview setActiveTab={setActiveTab} />;
      case 'users':
        return <UserManagement />;
      case 'content':
        return <ContentManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <SystemOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <RealtimeProvider userId={user.id}>
        {/* Admin Sidebar */}
        <AdminSidebar 
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Admin Header */}
          <AdminHeader 
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