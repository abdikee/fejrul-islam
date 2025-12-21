'use client';

import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Crown, 
  Database,
  Bell,
  Calendar,
  BookOpen,
  MessageSquare,
  LogOut,
  X,
  Moon,
  Sun,
  Clock,
  Compass,
  Star,
  Heart
} from 'lucide-react';

export default function IslamicAdminSidebar({ user, activeTab, setActiveTab, isOpen, onClose, currentTime }) {
  // Get Islamic greeting based on time
  const getIslamicGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { arabic: 'صباح الخير', english: 'Good Morning' };
    if (hour < 18) return { arabic: 'مساء الخير', english: 'Good Afternoon' };
    return { arabic: 'مساء النور', english: 'Good Evening' };
  };

  // Get next prayer time
  const getNextPrayer = () => {
    const hour = currentTime.getHours();
    if (hour < 5) return { name: 'Fajr', time: '05:30', timeLeft: '2h 15m' };
    if (hour < 12) return { name: 'Dhuhr', time: '12:15', timeLeft: '1h 45m' };
    if (hour < 15) return { name: 'Asr', time: '15:45', timeLeft: '3h 20m' };
    if (hour < 18) return { name: 'Maghrib', time: '18:20', timeLeft: '2h 10m' };
    return { name: 'Isha', time: '19:45', timeLeft: '1h 25m' };
  };

  const greeting = getIslamicGreeting();
  const nextPrayer = getNextPrayer();

  const menuItems = [
    {
      id: 'overview',
      name: 'Nizam Overview',
      nameArabic: 'نظرة عامة',
      icon: LayoutDashboard,
      description: 'System governance and key metrics'
    },
    {
      id: 'users',
      name: 'Ummah Management',
      nameArabic: 'إدارة الأمة',
      icon: Users,
      description: 'Manage community members and roles'
    },
    {
      id: 'content',
      name: 'Ilm Management',
      nameArabic: 'إدارة العلم',
      icon: FileText,
      description: 'Manage Islamic knowledge and resources'
    },
    {
      id: 'analytics',
      name: 'Hikmah Analytics',
      nameArabic: 'تحليلات الحكمة',
      icon: BarChart3,
      description: 'Wisdom through data and insights'
    },
    {
      id: 'settings',
      name: 'Tanzeem Settings',
      nameArabic: 'إعدادات التنظيم',
      icon: Settings,
      description: 'Configure system and preferences'
    }
  ];

  const islamicQuickActions = [
    {
      name: 'Backup Amanah',
      nameArabic: 'نسخ الأمانة',
      icon: Database,
      action: () => console.log('Backup system'),
      color: 'text-blue-400 hover:text-blue-300'
    },
    {
      name: 'Send Bayan',
      nameArabic: 'إرسال بيان',
      icon: Bell,
      action: () => console.log('Send announcement'),
      color: 'text-green-400 hover:text-green-300'
    },
    {
      name: 'Salah Times',
      nameArabic: 'أوقات الصلاة',
      icon: Calendar,
      action: () => console.log('Update prayer times'),
      color: 'text-purple-400 hover:text-purple-300'
    },
    {
      name: 'System Logs',
      nameArabic: 'سجلات النظام',
      icon: MessageSquare,
      action: () => console.log('View logs'),
      color: 'text-amber-400 hover:text-amber-300'
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0 bg-gradient-to-b from-slate-900/95 to-indigo-900/95 backdrop-blur-xl border-r border-amber-500/20">
        {/* Islamic Header */}
        <div className="p-6 border-b border-amber-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-amber-100 text-lg">Majlis Al-Idara</h2>
              <p className="text-amber-300/80 text-sm">مجلس الإدارة</p>
              <p className="text-white/60 text-xs">Administrative Council</p>
            </div>
          </div>

          {/* Islamic Greeting */}
          <div className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-lg p-3 border border-amber-400/30">
            <p className="text-amber-200 font-semibold text-sm">{greeting.arabic}</p>
            <p className="text-white/80 text-xs">{greeting.english}</p>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="p-4 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-amber-100 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-amber-300 text-xs font-medium">مدير النظام • System Amir</p>
            </div>
          </div>
        </div>

        {/* Prayer Time Widget */}
        <div className="p-4 border-b border-amber-500/20">
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-3 border border-indigo-400/30">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-indigo-300" />
              <span className="text-indigo-200 text-sm font-medium">Next Salah</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{nextPrayer.name}</p>
                <p className="text-indigo-300 text-xs">{nextPrayer.time}</p>
              </div>
              <div className="text-right">
                <p className="text-amber-300 font-bold text-sm">{nextPrayer.timeLeft}</p>
                <p className="text-white/60 text-xs">remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Star className="w-3 h-3" />
              Main Navigation
            </h3>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/30 to-purple-500/30 text-amber-100 border border-amber-400/50 shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-amber-200'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-amber-300' : 'text-white/60'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-amber-300/80 truncate">{item.nameArabic}</p>
                    <p className="text-xs text-white/50 truncate">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Islamic Quick Actions */}
          <div className="pt-4 border-t border-amber-500/20">
            <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Heart className="w-3 h-3" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {islamicQuickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={action.action}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 text-center border border-white/10 hover:border-amber-400/30"
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-2 ${action.color}`} />
                    <p className="text-xs text-white/80 font-medium mb-1">{action.name}</p>
                    <p className="text-xs text-amber-300/70">{action.nameArabic}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Islamic Footer */}
        <div className="p-4 border-t border-amber-500/20">
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg p-3 border border-red-400/30 mb-3">
            <p className="text-red-200 text-xs font-semibold text-center">
              "وَاتَّقُوا اللَّهَ وَيُعَلِّمُكُمُ اللَّهُ"
            </p>
            <p className="text-white/60 text-xs text-center mt-1">
              "Fear Allah and Allah will teach you" - Quran 2:282
            </p>
          </div>
          
          <Link
            href="/api/auth/logout"
            className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-xl transition-all duration-200 border border-red-500/30"
          >
            <LogOut className="w-5 h-5" />
            <div>
              <span className="font-medium">Logout</span>
              <p className="text-xs text-red-400">تسجيل الخروج</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-slate-900/95 to-indigo-900/95 backdrop-blur-xl border-r border-amber-500/20 overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-amber-100">Majlis Al-Idara</h2>
                <p className="text-amber-300/80 text-xs">مجلس الإدارة</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Mobile Content - Same as desktop but condensed */}
          <div className="p-4">
            {/* Mobile Navigation */}
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
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/30 to-purple-500/30 text-amber-100 border border-amber-400/50'
                        : 'text-white/80 hover:bg-white/10 hover:text-amber-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-amber-300' : 'text-white/60'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-amber-300/80 truncate">{item.nameArabic}</p>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Logout */}
            <div className="mt-6 pt-4 border-t border-amber-500/20">
              <Link
                href="/api/auth/logout"
                className="flex items-center gap-3 px-3 py-3 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-xl transition-all"
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