'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  User, 
  BookOpen, 
  MessageCircle, 
  Heart, 
  GraduationCap,
  Download,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Home
} from 'lucide-react';

const DashboardSidebar = ({ user, isOpen, onClose }) => {
  const navigationItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      color: 'text-slate-600'
    },
    {
      title: 'Learning Sectors',
      items: [
        {
          name: 'Dawah & Comparative Religion',
          icon: MessageCircle,
          href: '/sectors/comparative-religion',
          color: 'text-blue-600',
          progress: user?.progress?.dawah || 0
        },
        {
          name: 'Irshad (Qirat & Ilm)',
          icon: BookOpen,
          href: '/sectors/qirat-ilm',
          color: 'text-emerald-600',
          progress: user?.progress?.irshad || 0
        },
        {
          name: 'Tarbiya & Character',
          icon: Heart,
          href: '/sectors/tarbiya-idad',
          color: 'text-rose-600',
          progress: user?.progress?.tarbiya || 0
        },
        {
          name: 'Idad Leadership',
          icon: GraduationCap,
          href: '/sectors/tarbiya-idad',
          color: 'text-purple-600',
          progress: user?.progress?.idad || 0
        }
      ]
    },
    {
      title: 'Resources',
      items: [
        {
          name: 'Resource Library',
          icon: Download,
          href: '/resources',
          color: 'text-amber-600'
        },
        {
          name: 'Literature & History',
          icon: BookOpen,
          href: '/sectors/literature',
          color: 'text-indigo-600'
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          name: 'Confidential Counseling',
          icon: MessageSquare,
          href: '/counseling',
          color: 'text-green-600',
          private: true
        },
        {
          name: 'Student Welfare',
          icon: Shield,
          href: '/sectors/ziyara-enhanced',
          color: 'text-purple-600',
          protected: true
        }
      ]
    }
  ];

  const getProgressBar = (progress) => {
    const circles = Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < Math.floor(progress / 20) ? 'bg-orange-500' : 'bg-slate-300'
        }`}
      />
    ));
    return <div className="flex gap-1">{circles}</div>;
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/images/humsj-logo.svg"
              alt="HUMSJ Logo"
              width={32}
              height={32}
            />
            <span className="font-bold text-slate-800">HUMSJ Dashboard</span>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-800 truncate">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-sm text-emerald-600 font-medium">
                {user?.level}
              </div>
            </div>
          </div>
          
          {user?.bio && (
            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navigationItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {section.title && (
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
              )}
              
              {section.href ? (
                <Link
                  href={section.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors ${section.color}`}
                  onClick={onClose}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.title}</span>
                </Link>
              ) : (
                <div className="space-y-1">
                  {section.items?.map((item, itemIdx) => (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group"
                      onClick={onClose}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-700 text-sm truncate">
                          {item.name}
                        </div>
                        {typeof item.progress === 'number' && (
                          <div className="flex items-center gap-2 mt-1">
                            {getProgressBar(item.progress)}
                            <span className="text-xs text-slate-500">
                              {item.progress}%
                            </span>
                          </div>
                        )}
                      </div>
                      {item.private && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      {item.protected && (
                        <Shield className="w-3 h-3 text-purple-500" />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
            onClick={onClose}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600 w-full text-left">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;