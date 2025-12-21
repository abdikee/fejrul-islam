'use client';

import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Shield, 
  Database,
  Bell,
  Calendar,
  MessageSquare,
  LogOut,
  X
} from 'lucide-react';

export default function AdminSidebar({ user, activeTab, setActiveTab, isOpen, onClose }) {
  const menuItems = [
    {
      id: 'overview',
      name: 'System Overview',
      icon: LayoutDashboard,
      description: 'Dashboard overview and key metrics'
    },
    {
      id: 'users',
      name: 'User Management',
      icon: Users,
      description: 'Manage students, mentors, and admins'
    },
    {
      id: 'content',
      name: 'Content Management',
      icon: FileText,
      description: 'Manage courses, announcements, and resources'
    },
    {
      id: 'analytics',
      name: 'Analytics & Reports',
      icon: BarChart3,
      description: 'System analytics and performance reports'
    },
    {
      id: 'settings',
      name: 'System Settings',
      icon: Settings,
      description: 'Configure system preferences and security'
    }
  ];

  const quickActions = [
    {
      name: 'Database Backup',
      icon: Database,
      action: () => {
        alert('Database backup feature coming soon!');
        // TODO: Implement actual backup functionality
      },
      color: 'text-blue-600'
    },
    {
      name: 'Send Announcement',
      icon: Bell,
      action: () => {
        setActiveTab('content');
        // Focus on announcements tab in content management
      },
      color: 'text-green-600'
    },
    {
      name: 'Prayer Times',
      icon: Calendar,
      action: () => {
        window.open('https://www.islamicfinder.org/world/ethiopia/addis-ababa/', '_blank');
      },
      color: 'text-purple-600'
    },
    {
      name: 'System Logs',
      icon: MessageSquare,
      action: () => {
        setActiveTab('analytics');
        // Navigate to analytics for system monitoring
      },
      color: 'text-amber-600'
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gradient-to-b from-emerald-800 to-emerald-900 border-r border-emerald-700">
        {/* Logo & Admin Badge */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">Admin Panel</h2>
              <p className="text-xs text-emerald-200">HUMSJ System</p>
            </div>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="p-4 border-b border-emerald-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-emerald-300 font-medium">System Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
              Main Navigation
            </h3>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className={`text-xs truncate ${isActive ? 'text-emerald-100' : 'text-emerald-400'}`}>{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-emerald-700">
            <h3 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={action.action}
                    className="p-2 bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors text-center"
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1 text-emerald-200" />
                    <p className="text-xs text-emerald-100 font-medium">{action.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-emerald-700">
          <Link
            href="/api/auth/logout"
            className="flex items-center gap-3 px-3 py-2 text-emerald-200 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 border-r border-emerald-700 overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-emerald-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white">Admin Panel</h2>
                <p className="text-xs text-emerald-200">HUMSJ System</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-emerald-700 rounded">
              <X className="w-5 h-5 text-emerald-200" />
            </button>
          </div>

          {/* Mobile Navigation - Same as desktop */}
          <div className="p-4">
            {/* Admin Profile */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-emerald-700 rounded-lg">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-emerald-300 font-medium">System Administrator</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className={`text-xs truncate ${isActive ? 'text-emerald-100' : 'text-emerald-400'}`}>{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Logout */}
            <div className="mt-6 pt-4 border-t border-emerald-700">
              <Link
                href="/api/auth/logout"
                className="flex items-center gap-3 px-3 py-2 text-emerald-200 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}