'use client';

import { useState } from 'react';
import { Menu, Bell, Search, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import RealtimeNotifications from '@/components/realtime/RealtimeNotifications';

export default function AdminHeader({ user, onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState('');

  // System status indicators
  const systemStatus = {
    database: 'healthy',
    realtime: 'healthy',
    api: 'healthy',
    storage: 'warning'
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-amber-600 bg-amber-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>

          {/* Admin Badge & Welcome */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Admin</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-slate-800">
                Welcome back, {user.firstName}
              </h1>
              <p className="text-sm text-slate-600">
                System Administrator • HUMSJ Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users, content, logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* System Status Indicators */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm text-slate-600 font-medium">System Status:</span>
            <div className="flex items-center gap-1">
              {Object.entries(systemStatus).map(([service, status]) => (
                <div
                  key={service}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}
                  title={`${service}: ${status}`}
                >
                  {getStatusIcon(status)}
                  <span className="capitalize">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Notifications */}
          <RealtimeNotifications />

          {/* Admin Profile Dropdown */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-slate-800">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Mobile System Status */}
      <div className="lg:hidden mt-3 flex items-center gap-2 overflow-x-auto">
        <span className="text-sm text-slate-600 font-medium whitespace-nowrap">Status:</span>
        {Object.entries(systemStatus).map(([service, status]) => (
          <div
            key={service}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(status)}`}
          >
            {getStatusIcon(status)}
            <span className="capitalize">{service}</span>
          </div>
        ))}
      </div>
    </header>
  );
}