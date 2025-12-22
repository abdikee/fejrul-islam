'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, FileText, BarChart3, Settings, 
  Shield, Database, Bell, Calendar, MessageSquare, LogOut, 
  X, BookOpen, Megaphone, Upload, Compass, GraduationCap,
  UserCheck, Activity, TrendingUp, Cog
} from 'lucide-react';

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuSections = [
    {
      title: 'Dashboard',
      items: [
        {
          name: 'System Overview',
          href: '/admin/dashboard',
          icon: LayoutDashboard,
          description: 'Main dashboard and key metrics'
        }
      ]
    },
    {
      title: 'User Management',
      items: [
        {
          name: 'All Users',
          href: '/admin/users',
          icon: Users,
          description: 'Manage all system users'
        },
        {
          name: 'Students',
          href: '/admin/users/students',
          icon: GraduationCap,
          description: 'Student management'
        },
        {
          name: 'Mentors',
          href: '/admin/users/mentors',
          icon: UserCheck,
          description: 'Mentor management'
        }
      ]
    },
    {
      title: 'Content Management',
      items: [
        {
          name: 'All Content',
          href: '/admin/content',
          icon: FileText,
          description: 'Manage all content'
        },
        {
          name: 'Courses',
          href: '/admin/content/courses',
          icon: BookOpen,
          description: 'Course management'
        },
        {
          name: 'Announcements',
          href: '/admin/content/announcements',
          icon: Megaphone,
          description: 'System announcements'
        },
        {
          name: 'Resources',
          href: '/admin/content/resources',
          icon: Upload,
          description: 'Learning resources'
        },
        {
          name: 'Sectors',
          href: '/admin/content/sectors',
          icon: Compass,
          description: 'Educational sectors'
        }
      ]
    },
    {
      title: 'Analytics & Reports',
      items: [
        {
          name: 'Analytics Dashboard',
          href: '/admin/analytics',
          icon: BarChart3,
          description: 'System analytics'
        },
        {
          name: 'User Activity',
          href: '/admin/analytics/activity',
          icon: Activity,
          description: 'User engagement metrics'
        },
        {
          name: 'Performance Reports',
          href: '/admin/analytics/performance',
          icon: TrendingUp,
          description: 'System performance'
        }
      ]
    },
    {
      title: 'System',
      items: [
        {
          name: 'Settings',
          href: '/admin/settings',
          icon: Settings,
          description: 'System configuration'
        },
        {
          name: 'Security',
          href: '/admin/settings/security',
          icon: Shield,
          description: 'Security settings'
        },
        {
          name: 'Database',
          href: '/admin/settings/database',
          icon: Database,
          description: 'Database management'
        }
      ]
    }
  ];

  const quickActions = [
    {
      name: 'New Course',
      href: '/admin/content/courses/new',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      name: 'Send Alert',
      href: '/admin/content/announcements/new',
      icon: Bell,
      color: 'text-red-600'
    },
    {
      name: 'User Report',
      href: '/admin/analytics/users',
      icon: Users,
      color: 'text-green-600'
    },
    {
      name: 'System Log',
      href: '/admin/analytics/logs',
      icon: MessageSquare,
      color: 'text-purple-600'
    }
  ];

  const SidebarContent = () => (
    <>
      {/* Logo & Admin Badge */}
      <div className="flex items-center justify-between p-6 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white">Admin Portal</h2>
            <p className="text-xs text-blue-200">HUMSJ System</p>
          </div>
        </div>
        {isOpen && (
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-blue-700 rounded">
            <X className="w-5 h-5 text-blue-200" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => isOpen && onClose && onClose()}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-blue-400'}`}>
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        <div className="pt-4 border-t border-blue-700">
          <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  onClick={() => isOpen && onClose && onClose()}
                  className="p-3 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors text-center"
                >
                  <Icon className="w-4 h-4 mx-auto mb-1 text-blue-200" />
                  <p className="text-xs text-blue-100 font-medium">{action.name}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-700">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-blue-200 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-16 bg-gradient-to-b from-blue-800 to-blue-900 border-r border-blue-700 z-30">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-blue-800 to-blue-900 border-r border-blue-700 overflow-y-auto">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}