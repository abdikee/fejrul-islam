'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Bell, Settings, Menu, X, Home, BookOpen, Calendar, Users, LogOut, Shield, Heart, MessageSquare } from 'lucide-react';
import StudentFooter from './StudentFooter';

// Context to share user data across dashboard pages
const DashboardContext = createContext(null);

export function useDashboard() {
  return useContext(DashboardContext);
}

export default function DashboardPageLayout({ 
  children, 
  title, 
  subtitle,
  showBackButton = true,
  rightContent = null 
}) {
  const pathname = usePathname();
  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const genderColors = user?.gender === 'female' ? {
    primary: 'teal',
    secondary: 'purple',
    bgGradient: 'from-teal-50 to-purple-50',
    buttonPrimary: 'bg-teal-600',
    buttonHover: 'hover:bg-teal-700',
    iconColor: 'text-teal-600',
    hoverBg: 'hover:bg-teal-100'
  } : {
    primary: 'emerald',
    secondary: 'blue',
    bgGradient: 'from-emerald-50 to-blue-50',
    buttonPrimary: 'bg-emerald-600',
    buttonHover: 'hover:bg-emerald-700',
    iconColor: 'text-emerald-600',
    hoverBg: 'hover:bg-emerald-100'
  };

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: `${localePrefix}/dashboard/${user?.gender || 'male'}` },
    { icon: BookOpen, label: 'My Courses', href: `${localePrefix}/dashboard/courses` },
    { icon: Calendar, label: 'Schedule', href: `${localePrefix}/dashboard/schedule` },
    { icon: Users, label: 'Study Groups', href: `${localePrefix}/dashboard/study-groups` },
    { icon: Bell, label: 'Announcements', href: `${localePrefix}/dashboard/announcements` },
    { icon: MessageSquare, label: 'Support', href: `${localePrefix}/dashboard/feedback` },
    { icon: Settings, label: 'Settings', href: `${localePrefix}/dashboard/settings` }
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = `${localePrefix}/auth/login`;
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${genderColors.bgGradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-${genderColors.primary}-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{ user, genderColors, loading }}>
      <div className={`min-h-screen bg-gradient-to-br ${genderColors.bgGradient}`}>
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
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${genderColors.buttonPrimary} rounded-lg flex items-center justify-center`}>
                      {user?.gender === 'female' ? (
                        <Heart className="w-5 h-5 text-white" />
                      ) : (
                        <Shield className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-800">HUMSJ</h2>
                      <p className="text-xs text-slate-600">Student Portal</p>
                    </div>
                  </div>
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
                      className={`flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors`}
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
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-slate-600" />
                </button>

                {/* Back Button */}
                {showBackButton && (
                  <Link 
                    href={`${localePrefix}/dashboard/${user?.gender || 'male'}`}
                    className={`p-2 ${genderColors.hoverBg} rounded-lg transition-colors`}
                  >
                    <ArrowLeft className={`w-5 h-5 ${genderColors.iconColor}`} />
                  </Link>
                )}
                
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                  {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
                </div>
              </div>
              
              {/* Right Content (optional buttons, etc.) */}
              <div className="flex items-center gap-4">
                {rightContent}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <StudentFooter user={user} />
      </div>
    </DashboardContext.Provider>
  );
}
