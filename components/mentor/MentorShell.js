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
  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';
  const mentorBase = `${localePrefix}/mentor`;
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

  const isActive = (path) => pathname === path || pathname?.startsWith(`${path}/`);

  const sidebarItems = [
    { label: 'Dashboard', href: `${mentorBase}/dashboard` },
    { label: 'Announcements', href: `${mentorBase}/announcements` },
    { label: 'Students', href: `${mentorBase}/students` },
    { label: 'Messages', href: `${mentorBase}/messages` },
    { label: 'Assignments', href: `${mentorBase}/assignments` },
    { label: 'Reviews', href: `${mentorBase}/submissions` },
    { label: 'Sessions', href: `${mentorBase}/sessions` },
    { label: 'Sectors', href: `${mentorBase}/sectors` },
    { label: 'Analytics', href: `${mentorBase}/analytics` },
    { label: 'Resources', href: `${mentorBase}/resources` }
  ];

  return (
    <>
      {/* Top Header */}
      <header className="bg-white border-b border-green-200 sticky top-0 z-50 shadow-sm">
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
                    Assalamu Alaikum, {user?.firstName || 'Mentor'}
                  </h1>
                  <p className="text-sm text-slate-600">Mentor Dashboard • HUMSJ</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search participants, programs..."
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
                  <span className="text-sm font-medium text-green-700">12 Participants</span>
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
              <Link
                href={`${mentorBase}/settings`}
                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-green-600" />
              </Link>

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
                <Link
                  href={`${mentorBase}/assignments/new`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Assignment
                </Link>
                <Link
                  href={`${mentorBase}/sessions/schedule`}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Session
                </Link>
                <Link
                  href={`${mentorBase}/submissions`}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                >
                  <FileCheck className="w-4 h-4" />
                  Guidance (5)
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

      {/* Content + Sidebar */}
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white border border-green-200 rounded-2xl p-3 sticky top-[180px]">
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-green-100 text-green-800'
                        : 'text-slate-700 hover:bg-green-50 hover:text-green-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <MentorFooter user={user} />
    </>
  );
}
