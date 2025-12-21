'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, BookOpen, Calendar, Users, MessageCircle, 
  User, Settings, Bell, Menu, X, LogOut,
  Heart, Shield, Star, Trophy
} from 'lucide-react';

export default function ResponsiveNavigation({ user, colorScheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      href: `/dashboard/${user?.gender}`,
      description: 'Overview & quick actions'
    },
    { 
      icon: BookOpen, 
      label: 'My Courses', 
      href: '/courses',
      description: 'Active learning paths'
    },
    { 
      icon: Calendar, 
      label: 'Schedule', 
      href: '/schedule',
      description: 'Classes & events'
    },
    { 
      icon: Users, 
      label: user?.gender === 'female' ? 'Sisters Circle' : 'Brotherhood', 
      href: '/community',
      description: 'Community & groups'
    },
    { 
      icon: MessageCircle, 
      label: 'Mentorship', 
      href: '/mentorship',
      description: 'Guidance & support'
    },
    { 
      icon: Trophy, 
      label: 'Achievements', 
      href: '/achievements',
      description: 'Progress & badges'
    }
  ];

  const quickStats = [
    { label: 'Current Level', value: user?.level || 'Beginner', icon: Star },
    { label: 'Points', value: user?.points || '0', icon: Trophy },
    { label: 'Streak', value: `${user?.streak || 0} days`, icon: Heart }
  ];

  const isActive = (href) => pathname === href;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white/90 lg:backdrop-blur-sm lg:border-r lg:border-slate-200">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo/Header */}
          <div className="flex items-center gap-3 p-6 border-b border-slate-200">
            <div className={`w-10 h-10 ${colorScheme?.buttonPrimary || 'bg-emerald-600'} rounded-lg flex items-center justify-center`}>
              {user?.gender === 'female' ? (
                <Heart className="w-5 h-5 text-white" />
              ) : (
                <Shield className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-slate-800">HUMSJ</h2>
              <p className="text-xs text-slate-600">
                {user?.gender === 'female' ? 'Sisters' : 'Brothers'} Wing
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 ${colorScheme?.buttonSecondary || 'bg-blue-600'} rounded-full flex items-center justify-center`}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-slate-600">{user?.level} Student</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${colorScheme?.iconColor || 'text-emerald-600'}`} />
                      <span className="text-slate-600">{stat.label}</span>
                    </div>
                    <span className="font-semibold text-slate-800">{stat.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                    active 
                      ? `${colorScheme?.buttonPrimary || 'bg-emerald-600'} text-white shadow-md` 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : colorScheme?.iconColor || 'text-emerald-600'}`} />
                  <div className="flex-1">
                    <div className={`font-medium ${active ? 'text-white' : 'text-slate-800'}`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${active ? 'text-white/80' : 'text-slate-500'}`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 space-y-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-800">Dashboard</h1>
              <div className={`w-2 h-2 rounded-full ${colorScheme?.primary === 'teal' ? 'bg-teal-500' : 'bg-emerald-500'}`} />
            </div>

            <button className={`p-2 hover:${colorScheme?.primary === 'teal' ? 'bg-teal-100' : 'bg-emerald-100'} rounded-lg transition-colors`}>
              <Bell className={`w-5 h-5 ${colorScheme?.iconColor || 'text-emerald-600'}`} />
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl">
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <h2 className="font-bold text-slate-800">Navigation</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 hover:bg-slate-100 rounded"
                  >
                    <X className="w-6 h-6 text-slate-600" />
                  </button>
                </div>

                {/* Mobile User Info */}
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 ${colorScheme?.buttonPrimary || 'bg-emerald-600'} rounded-full flex items-center justify-center`}>
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-sm text-slate-600">{user?.level} Student</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    
                    return (
                      <Link
                        key={index}
                        href={item.href}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          active 
                            ? `${colorScheme?.buttonPrimary || 'bg-emerald-600'} text-white` 
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-slate-200 space-y-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}