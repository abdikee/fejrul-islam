'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RealtimeProvider } from '@/components/realtime/RealtimeProvider';
import RealtimeNotifications from '@/components/realtime/RealtimeNotifications';
import AmanahHeroSection from '@/components/dashboard/AmanahHeroSection';
import AnnouncementBoard from '@/components/dashboard/AnnouncementBoard';
import SectorNavigationGrid from '@/components/dashboard/SectorNavigationGrid';
import IhsanProgressSection from '@/components/dashboard/IhsanProgressSection';
import IdentitySection from '@/components/dashboard/IdentitySection';
import PrivacyNotification from '@/components/ui/PrivacyNotification';
import { Menu, MessageCircle } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [examMode, setExamMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/dashboard/user');
        
        if (!response.ok) {
          // Redirect to login if unauthorized
          if (response.status === 401) {
            window.location.href = '/auth/login';
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        
        if (data.success) {
          // Redirect admin users to admin dashboard
          if (data.user.role === 'admin') {
            window.location.href = '/admin/dashboard';
            return;
          }
          // Redirect mentor users to mentor dashboard
          if (data.user.role === 'mentor') {
            window.location.href = '/mentor/dashboard';
            return;
          }
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Redirect to login on error
        window.location.href = '/auth/login';
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your Amanah dashboard...</p>
        </div>
      </div>
    );
  }

  // Gender-based color scheme
  const colorScheme = user.gender === 'female' ? {
    primary: 'teal',
    secondary: 'purple',
    accent: 'lavender',
    bgGradient: 'from-teal-50 to-purple-50',
    cardBorder: 'border-teal-200',
    buttonPrimary: 'bg-teal-600 hover:bg-teal-700',
    textPrimary: 'text-teal-700',
    iconColor: 'text-teal-600'
  } : {
    primary: 'emerald',
    secondary: 'green',
    accent: 'emerald',
    bgGradient: 'from-emerald-50 to-green-50',
    cardBorder: 'border-emerald-200',
    buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700',
    textPrimary: 'text-emerald-700',
    iconColor: 'text-emerald-600'
  };

  return (
    <RealtimeProvider userId={user.id}>
      <div className={`min-h-screen bg-gradient-to-br ${colorScheme.bgGradient} ${examMode ? 'exam-mode' : ''}`}>
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/90 backdrop-blur-sm border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-slate-800">Amanah Dashboard</h1>
            <div className={`w-2 h-2 rounded-full ${user.gender === 'female' ? 'bg-teal-500' : 'bg-emerald-500'}`} />
          </div>

          <div className="flex items-center gap-2">
            <RealtimeNotifications />
            <PrivacyNotification />
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex bg-white/90 backdrop-blur-sm border-b border-slate-200 px-6 py-4 items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${colorScheme.buttonPrimary} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Amanah Dashboard</h1>
                <p className="text-sm text-slate-600">
                  {user.gender === 'female' ? 'Sisters' : 'Brothers'} Wing • Fejrul Islam
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <RealtimeNotifications />
            <PrivacyNotification />
          </div>
        </div>

        {/* Main Content */}
        <main className={`${examMode ? 'max-w-4xl mx-auto' : 'container mx-auto'} px-4 lg:px-6 py-6 space-y-8`}>
          {/* 1. Amanah Hero Section */}
          <AmanahHeroSection user={user} colorScheme={colorScheme} examMode={examMode} />

          {!examMode && (
            <>
              {/* 2. Dynamic Announcement Board */}
              <AnnouncementBoard colorScheme={colorScheme} />

              {/* 3. 5-Sector Navigation Grid */}
              <SectorNavigationGrid user={user} colorScheme={colorScheme} />

              {/* 5. Identity Section (History Teaser) */}
              <IdentitySection colorScheme={colorScheme} />
            </>
          )}

          {/* 4. Ihsan Progress & Daily Utility */}
          <IhsanProgressSection 
            user={user} 
            colorScheme={colorScheme} 
            examMode={examMode}
            setExamMode={setExamMode}
          />
        </main>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
              {/* Mobile navigation content would go here */}
              <div className="p-4">
                <h2 className="font-bold text-slate-800 mb-4">Navigation</h2>
                <nav className="space-y-2">
                  <Link href="/dashboard" className="block p-2 text-slate-600 hover:bg-slate-100 rounded">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/home" className="block p-2 text-slate-600 hover:bg-slate-100 rounded">
                    Enhanced Home
                  </Link>
                  <Link href="/sectors" className="block p-2 text-slate-600 hover:bg-slate-100 rounded">
                    Sectors
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </RealtimeProvider>
  );
}