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
          description: 'Main dashboard and key metrics',
          enabled: true
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
          description: 'Manage all system users',
          enabled: true
        },
        {
          name: 'Students',
          href: '/admin/students',
          icon: GraduationCap,
          description: 'Student management',
          enabled: true
        },
        {
          name: 'Mentors',
          href: '/admin/mentors',
          icon: UserCheck,
          description: 'Mentor management',
          enabled: true
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
          description: 'Manage all content',
          enabled: true
        },
        {
          name: 'Courses',
          href: '/admin/courses',
          icon: BookOpen,
          description: 'Course management',
          enabled: true
        },
        {
          name: 'Announcements',
          href: '/admin/announcements',
          icon: Megaphone,
          description: 'System announcements',
          enabled: true
        },
        {
          name: 'Resources',
          href: '/admin/resources',
          icon: Upload,
          description: 'Learning resources',
          enabled: true
        },
        {
          name: 'Sectors',
          href: '/admin/sectors',
          icon: Compass,
          description: 'Educational sectors',
          enabled: true
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
          description: 'System analytics',
          enabled: true
        },
        {
          name: 'User Activity',
          href: '/admin/analytics',
          icon: Activity,
          description: 'User engagement (Coming Soon)',
          enabled: false
        },
        {
          name: 'Performance Reports',
          href: '/admin/analytics',
          icon: TrendingUp,
          description: 'System performance (Coming Soon)',
          enabled: false
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
          description: 'System configuration',
          enabled: true
        },
        {
          name: 'Audit Logs',
          href: '/admin/audit-logs',
          icon: Activity,
          description: 'System activity logs',
          enabled: true
        },
        {
          name: 'Impersonate User',
          href: '/admin/impersonate',
          icon: Shield,
          description: 'View as another user',
          enabled: true
        },
        {
          name: 'Content Manager',
          href: '/admin/content-manager',
          icon: FileText,
          description: 'Manage global content',
          enabled: true
        },
        {
          name: 'Database',
          href: '/admin/settings',
          icon: Database,
          description: 'Database management (Coming Soon)',
          enabled: false
        }
      ]
    }
  ];

  const quickActions = [
    {
      name: 'Search',
      href: '/admin/search?q=',
      icon: MessageSquare,
      color: 'text-purple-600',
      enabled: true
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
                const isActive = pathname === item.href && item.enabled;
                
                if (!item.enabled) {
                  // Disabled item - show but not clickable
                  return (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg opacity-50 cursor-not-allowed"
                    >
                      <Icon className="w-5 h-5 text-blue-400" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-blue-200">{item.name}</p>
                        <p className="text-xs truncate text-blue-400">{item.description}</p>
                      </div>
                    </div>
                  );
                }
                
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