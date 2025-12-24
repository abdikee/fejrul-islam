'use client';

import { useState, useEffect } from 'react';
import { Menu, Search, Crown, AlertTriangle, CheckCircle, Clock, Compass, Moon, Sun } from 'lucide-react';
import RealtimeNotifications from '@/components/realtime/RealtimeNotifications';

export default function IslamicAdminHeader({ user, onMenuClick, currentTime }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hijriDate, setHijriDate] = useState('');

  const displayName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Admin';
  const roleLabel = user?.role === 'admin' ? 'Administrator' : (user?.role ? String(user.role) : 'Admin');

  useEffect(() => {
    // Calculate approximate Hijri date (simplified)
    const getHijriDate = () => {
      const hijriMonths = [
        'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
        'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
        'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
      ];
      
      // Simplified calculation - in production use proper Islamic calendar library
      const hijriYear = 1446;
      const hijriMonth = hijriMonths[5]; // Jumada al-Thani
      const hijriDay = 22;
      
      return `${hijriDay} ${hijriMonth} ${hijriYear}`;
    };

    setHijriDate(getHijriDate());
  }, [currentTime]);

  // System status indicators with Islamic names
  const systemStatus = {
    qaidah: 'healthy', // Database (Base/Foundation)
    wasl: 'healthy',   // Real-time (Connection)
    khidmat: 'healthy', // API Services
    khazana: 'warning'  // Storage (Treasury)
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-300 bg-green-500/20 border-green-400/30';
      case 'warning':
        return 'text-amber-300 bg-amber-500/20 border-amber-400/30';
      case 'error':
        return 'text-red-300 bg-red-500/20 border-red-400/30';
      default:
        return 'text-slate-300 bg-slate-500/20 border-slate-400/30';
    }
  };

  const getIslamicTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return { icon: Moon, text: 'Fajr Time', color: 'text-indigo-300' };
    if (hour < 12) return { icon: Sun, text: 'Duha Time', color: 'text-amber-300' };
    if (hour < 15) return { icon: Sun, text: 'Dhuhr Time', color: 'text-yellow-300' };
    if (hour < 18) return { icon: Sun, text: 'Asr Time', color: 'text-orange-300' };
    if (hour < 20) return { icon: Moon, text: 'Maghrib Time', color: 'text-purple-300' };
    return { icon: Moon, text: 'Isha Time', color: 'text-indigo-300' };
  };

  const timeGreeting = getIslamicTimeGreeting();
  const TimeIcon = timeGreeting.icon;

  return (
    <header className="bg-gradient-to-r from-slate-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-amber-500/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-white/80" />
          </button>

          {/* Islamic Admin Badge & Welcome */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-500/30 to-purple-500/30 rounded-full border border-amber-400/50">
              <Crown className="w-5 h-5 text-amber-300" />
              <span className="text-amber-100 font-semibold text-sm">Amir Al-Nizam</span>
              <span className="text-amber-300/80 text-xs">أمير النظام</span>
            </div>
            
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <span>أهلاً وسهلاً، {user?.firstName ?? 'Admin'}</span>
                <TimeIcon className={`w-5 h-5 ${timeGreeting.color}`} />
              </h1>
              <p className="text-white/70 text-sm">
                {roleLabel} • {timeGreeting.text} • Fejrul Islam
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Islamic Time & Date */}
        <div className="hidden lg:flex flex-col items-center">
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg px-4 py-2 border border-indigo-400/30">
            <div className="flex items-center gap-3">
              <Compass className="w-4 h-4 text-indigo-300" />
              <div className="text-center">
                <p className="text-white font-semibold text-sm">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-indigo-300 text-xs">{hijriDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* System Status Indicators with Islamic Names */}
          <div className="hidden xl:flex items-center gap-2">
            <span className="text-sm text-amber-300 font-medium">Nizam Status:</span>
            <div className="flex items-center gap-1">
              {Object.entries(systemStatus).map(([service, status]) => (
                <div
                  key={service}
                  className={`flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${getStatusColor(status)}`}
                  title={`${service}: ${status}`}
                >
                  {getStatusIcon(status)}
                  <span className="capitalize">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search users, content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors text-white placeholder-white/50 text-sm"
            />
          </div>

          {/* Real-time Notifications */}
          <RealtimeNotifications />

          {/* Admin Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-amber-500/30">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-amber-100 font-semibold text-sm">
                {displayName}
              </p>
              <p className="text-amber-300/80 text-xs">مدير النظام • Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search & Time */}
      <div className="lg:hidden mt-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors text-white placeholder-white/50"
          />
        </div>

        {/* Mobile Time & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <TimeIcon className={`w-4 h-4 ${timeGreeting.color}`} />
            <span className="text-white/80">{timeGreeting.text}</span>
            <span className="text-amber-300">•</span>
            <span className="text-indigo-300">{hijriDate}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {Object.entries(systemStatus).map(([service, status]) => (
              <div
                key={service}
                className={`flex items-center gap-1 px-2 py-1 rounded border text-xs ${getStatusColor(status)}`}
              >
                {getStatusIcon(status)}
                <span className="capitalize">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Islamic Blessing */}
      <div className="mt-3 text-center">
        <p className="text-amber-200/80 text-xs font-medium">
          بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ • In the name of Allah, the Most Gracious, the Most Merciful
        </p>
      </div>
    </header>
  );
}