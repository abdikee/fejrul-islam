'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, Clock, User, FileText, MessageSquare, 
  CheckCircle, AlertCircle, Plus, Edit, Trash2,
  Eye, Download, Upload, Settings
} from 'lucide-react';
import notify from '@/lib/notify';

export default function ActivityFeed() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'content_created',
      title: 'New course "Advanced Tafseer" created',
      user: 'Dr. Ahmad Ibrahim',
      time: '2 minutes ago',
      icon: Plus,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 2,
      type: 'content_approved',
      title: 'Resource "Hadith Collection" approved',
      user: 'Admin System',
      time: '15 minutes ago',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      type: 'user_registered',
      title: 'New student registration: Fatima Al-Zahra',
      user: 'Registration System',
      time: '32 minutes ago',
      icon: User,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 4,
      type: 'content_edited',
      title: 'Course "Islamic Finance Basics" updated',
      user: 'Ustadh Omar Hassan',
      time: '1 hour ago',
      icon: Edit,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 5,
      type: 'announcement',
      title: 'System maintenance scheduled for tonight',
      user: 'System Admin',
      time: '2 hours ago',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 6,
      type: 'content_viewed',
      title: 'High engagement on "Quranic Arabic" course',
      user: 'Analytics System',
      time: '3 hours ago',
      icon: Eye,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [pendingReviews, setPendingReviews] = useState(8);

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type.includes(filter);
  });

  const filterOptions = [
    { value: 'all', label: 'All Activity' },
    { value: 'content', label: 'Content' },
    { value: 'user', label: 'Users' },
    { value: 'system', label: 'System' }
  ];

  const handleReviewNow = () => {
    // Navigate to pending reviews
    window.location.href = '/admin/content?status=pending';
  };

  const handleViewActivity = (activityId) => {
    // View specific activity details
    console.log('Viewing activity:', activityId);
    // You could open a modal or navigate to details page
    notify.info(`Viewing details for activity ${activityId}`);
  };

  const handleExportLog = () => {
    // Export activity log
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `activity-log-${currentDate}.csv`;
    
    const csvData = [
      ['ID', 'Type', 'Title', 'User', 'Time'],
      ...filteredActivities.map(activity => [
        activity.id,
        activity.type,
        activity.title,
        activity.user,
        activity.time
      ])
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

  const handleViewAll = () => {
    // Navigate to full activity log
    window.location.href = '/admin/analytics/activity';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Real-time Activity</h3>
              <p className="text-sm text-slate-600">Live system events and user actions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                filter === option.value
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pending Reviews Alert */}
      {pendingReviews > 0 && (
        <div className="mx-6 mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">
                  {pendingReviews} items pending review
                </p>
                <p className="text-xs text-orange-600">
                  Content awaiting admin approval
                </p>
              </div>
            </div>
            <button 
              onClick={handleReviewNow}
              className="px-3 py-1 text-sm font-medium text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors"
            >
              Review Now
            </button>
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className={`w-8 h-8 ${activity.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-slate-600">by {activity.user}</p>
                    <span className="text-xs text-slate-400">•</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleViewActivity(activity.id)}
                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                >
                  <Eye className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>System Status: Healthy</span>
            </div>
            <div className="text-sm text-slate-500">
              Last update: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportLog}
              className="px-3 py-1 text-xs font-medium text-slate-600 border border-slate-300 rounded-full hover:bg-slate-100 transition-colors"
            >
              Export Log
            </button>
            <button 
              onClick={handleViewAll}
              className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition-colors"
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}