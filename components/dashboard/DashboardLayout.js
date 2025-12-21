'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, Settings, Menu, X, Home, BookOpen, 
  Calendar, Users, MessageCircle, User, LogOut,
  Shield, Heart
} from 'lucide-react';

export default function DashboardLayout({ children, user, colorScheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: `/dashboard/${user?.gender}` },
    { icon: BookOpen, label: 'My Courses', href: '/courses' },
    { icon: Calendar, label: 'Schedule', href: '/schedule' },
    { icon: Users, label: user?.gender === 'female' ? 'Sisters Circle' : 'Brotherhood', href: '/community' },
    { icon: MessageCircle, label: 'Mentorship', href: '/mentorship' },
    { icon: User, label: 'Profile', href: '/profile' }
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-800">Navigation</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
            
            <nav className="p-4 space-y-2">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${colorScheme?.buttonPrimary || 'bg-emerald-600'} rounded-lg flex items-center justify-center`}>
                  {user?.gender === 'female' ? (
                    <Heart className="w-5 h-5 text-white" />
                  ) : (
                    <Shield className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800">
                    {user?.gender === 'female' ? 'Sisters Dashboard' : 'Brothers Dashboard'}
                  </h1>
                  <p className="text-sm text-slate-600">Fejrul Islam HUMSJ</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
              
              <button className={`p-2 hover:${colorScheme?.primary === 'teal' ? 'bg-teal-100' : 'bg-emerald-100'} rounded-lg transition-colors`}>
                <Bell className={`w-5 h-5 ${colorScheme?.iconColor || 'text-emerald-600'}`} />
              </button>
              
              <button className={`p-2 hover:${colorScheme?.primary === 'teal' ? 'bg-teal-100' : 'bg-emerald-100'} rounded-lg transition-colors`}>
                <Settings className={`w-5 h-5 ${colorScheme?.iconColor || 'text-emerald-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}