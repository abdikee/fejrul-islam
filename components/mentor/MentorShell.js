'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  GraduationCap, Search, Clock, Bell, Settings, LogOut,
  Users, FileCheck, Plus, Calendar, Filter, BarChart3, Download,
  BookOpen, MessageSquare
} from 'lucide-react';
import MentorFooter from './MentorFooter';

export default function MentorShell({ user, children }) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => pathname === path;

  const navTabs = [
    { label: 'Dashboard', href: '/mentor/dashboard' },
    { label: 'My Students', href: '/mentor/students' },
    { label: 'Assignments', href: '/mentor/assignments' },
    { label: 'Reviews', href: '/mentor/submissions' },
    { label: 'Sessions', href: '/mentor/sessions' },
    { label: 'Sectors', href: '/mentor/sectors' },
    { label: 'Analytics', href: '/mentor/analytics' }
  ];

  return (
    <>
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Top Row */}
          <div className="flex items-center justify-between py-4">
            {/* Logo & Greeting */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    Assalamu Alaikum, Ustadh {user?.firstName || 'Mentor'}
                  </h1>
                  <p className="text-sm text-slate-600">Mentor Dashboard • Fejrul Islam HUMSJ</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students, assignments, submissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-3 mr-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg border border-green-200">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">12 Students</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-lg border border-orange-200">
                  <FileCheck className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">5 Reviews</span>
                </div>
              </div>

              {/* Time */}
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                {currentTime.toLocaleTimeString()}
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-green-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-green-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Settings */}
              <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-green-600" />
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-800">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500">Mentor</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="border-t border-slate-200 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Create Assignment feature coming soon!')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Assignment
                </button>
                <button
                  onClick={() => alert('Schedule Session feature coming soon!')}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Session
                </button>
                <Link
                  href="/mentor/submissions"
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                >
                  <FileCheck className="w-4 h-4" />
                  Review (5)
                </Link>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <BarChart3 className="w-4 h-4" />
                  Reports
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students, assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-green-50 border-b border-green-200 sticky top-[180px] z-40">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-1 overflow-x-auto">
              {navTabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive(tab.href)
                      ? 'text-green-800 bg-green-100'
                      : 'text-slate-600 hover:text-green-700 hover:bg-green-100'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => alert('Resources section coming soon!')}
                className="px-3 py-1 text-xs font-medium text-green-600 border border-green-300 rounded-full hover:bg-green-50 transition-colors"
              >
                Resources
              </button>
              <button
                onClick={() => alert('Training section coming soon!')}
                className="px-3 py-1 text-xs font-medium text-emerald-600 border border-emerald-300 rounded-full hover:bg-emerald-50 transition-colors"
              >
                Training
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-6">
        {children}
      </main>

      {/* Footer */}
      <MentorFooter />
    </>
  );
}
