'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { 
  Search, Bell, Settings, Shield, Database, 
  Activity, AlertCircle, CheckCircle, Clock, LogOut,
  Menu, X, Download, Plus, RefreshCw
} from 'lucide-react';

export default function AdminHeader({ user, onMenuToggle, isSidebarOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(5);
  const [showNotifications, setShowNotifications] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    database: 'healthy',
    api: 'healthy',
    storage: 'warning',
    users: 'healthy'
  });
  const [bulkAction, setBulkAction] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Read filter from URL on mount and when URL changes
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setActiveFilter(filterParam);
    } else {
      setActiveFilter('all');
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      // You can redirect to search results page or show search modal
      window.location.href = `/admin/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleAddContent = () => {
    // Navigate to content creation page
    window.location.href = '/admin/content/new';
  };

  const handleExportData = () => {
    // Implement data export functionality
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `admin-export-${currentDate}.csv`;
    
    // Create sample CSV data (replace with actual data)
    const csvData = [
      ['Type', 'Name', 'Status', 'Created', 'Updated'],
      ['Course', 'Islamic Finance Basics', 'Published', '2024-01-15', '2024-01-20'],
      ['User', 'Ahmad Ibrahim', 'Active', '2024-01-10', '2024-01-18'],
      ['Announcement', 'System Maintenance', 'Published', '2024-01-22', '2024-01-22']
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkAction = () => {
    if (!bulkAction) {
      alert('Please select a bulk action first');
      return;
    }
    
    // Get selected items (this would normally come from a selection state)
    const selectedItems = document.querySelectorAll('input[type="checkbox"]:checked').length;
    
    if (selectedItems === 0) {
      alert('Please select items to perform bulk action');
      return;
    }
    
    const confirmMessage = `Are you sure you want to ${bulkAction.toLowerCase()} ${selectedItems} selected item(s)?`;
    
    if (confirm(confirmMessage)) {
      console.log(`Performing ${bulkAction} on ${selectedItems} items`);
      // Implement actual bulk action logic here
      alert(`${bulkAction} completed for ${selectedItems} items`);
      setBulkAction('');
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleRefreshStatus = () => {
    // Refresh system status
    setSystemStatus({
      database: Math.random() > 0.8 ? 'warning' : 'healthy',
      api: Math.random() > 0.9 ? 'error' : 'healthy',
      storage: Math.random() > 0.7 ? 'warning' : 'healthy',
      users: 'healthy'
    });
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // Update URL with filter parameter
    const params = new URLSearchParams(searchParams.toString());
    if (filter === 'all') {
      params.delete('filter');
    } else {
      params.set('filter', filter);
    }
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const mockNotifications = [
    { id: 1, title: 'New user registration', message: 'Fatima Al-Zahra registered', time: '5 min ago', type: 'user' },
    { id: 2, title: 'Content pending review', message: '3 courses awaiting approval', time: '15 min ago', type: 'content' },
    { id: 3, title: 'System backup completed', message: 'Daily backup successful', time: '1 hour ago', type: 'system' },
    { id: 4, title: 'High server load detected', message: 'CPU usage at 85%', time: '2 hours ago', type: 'warning' },
    { id: 5, title: 'New announcement posted', message: 'Ramadan schedule updated', time: '3 hours ago', type: 'content' }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="px-4 lg:px-6">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Menu & Brand */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-slate-600" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Admin Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Portal
                </h1>
                <p className="text-xs text-slate-600">Fejrul Islam HUMSJ</p>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users, content, logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 transition-all"
              />
            </form>
          </div>

          {/* Right Section - Status & Profile */}
          <div className="flex items-center gap-3">
            {/* System Status */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <button onClick={handleRefreshStatus} className="flex items-center gap-1 hover:bg-slate-200 p-1 rounded-lg" title="Refresh Status">
                <Database className="w-3 h-3 text-slate-500" />
                {getStatusIcon(systemStatus.database)}
              </button>
              <div className="flex items-center gap-1" title="API Status">
                <Activity className="w-3 h-3 text-slate-500" />
                {getStatusIcon(systemStatus.api)}
              </div>
              <RefreshCw className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" onClick={handleRefreshStatus} />
            </div>

            {/* Quick Actions */}
            <div className="hidden md:flex items-center gap-1">
              <button 
                onClick={handleAddContent}
                className="p-2.5 hover:bg-blue-100 rounded-xl transition-colors group" 
                title="Add Content"
              >
                <Plus className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={handleExportData}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors group" 
                title="Export Data"
              >
                <Download className="w-4 h-4 text-slate-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={handleNotificationClick}
                className="relative p-2.5 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <Bell className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                    <p className="text-xs text-slate-600">You have {notifications} unread notifications</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {mockNotifications.map((notification) => (
                      <div key={notification.id} className="p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-slate-500 mt-2">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-200 bg-slate-50">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <Link
              href="/admin/settings"
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors group"
            >
              <Settings className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
            </Link>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">System Admin</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-100 rounded-xl transition-colors group"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-600 group-hover:scale-110 transition-all" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
            />
          </form>
        </div>
      </div>

      {/* Content Management Toolbar */}
      <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30">
        <div className="px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Content Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  activeFilter === 'all'
                    ? 'text-blue-600 bg-blue-100'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                All Content
              </button>
              <button 
                onClick={() => handleFilterChange('pending')}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  activeFilter === 'pending'
                    ? 'text-blue-600 bg-blue-100'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Pending Review
              </button>
              <button 
                onClick={() => handleFilterChange('published')}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  activeFilter === 'published'
                    ? 'text-blue-600 bg-blue-100'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Published
              </button>
              <button 
                onClick={() => handleFilterChange('archived')}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  activeFilter === 'archived'
                    ? 'text-blue-600 bg-blue-100'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Archived
              </button>
            </div>

            {/* Bulk Actions */}
            <div className="hidden md:flex items-center gap-2">
              <select 
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Bulk Actions</option>
                <option value="Approve">Approve Selected</option>
                <option value="Archive">Archive Selected</option>
                <option value="Delete">Delete Selected</option>
                <option value="Export">Export Selected</option>
              </select>
              <button 
                onClick={handleBulkAction}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
}