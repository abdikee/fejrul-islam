'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, Eye, Users, BookOpen, 
  Calendar, Award, BarChart3, Activity
} from 'lucide-react';

export default function ContentAnalyticsWidget() {
  const [analytics, setAnalytics] = useState({
    totalViews: 15420,
    activeUsers: 342,
    completionRate: 87,
    newContent: 23,
    popularContent: [
      { title: 'Introduction to Islamic Finance', views: 1250, type: 'Course' },
      { title: 'Quranic Arabic Basics', views: 980, type: 'Course' },
      { title: 'Hadith Study Methods', views: 756, type: 'Resource' }
    ],
    recentActivity: [
      { action: 'New course published', user: 'Dr. Ahmad', time: '2 hours ago' },
      { action: 'Resource updated', user: 'Ustadh Omar', time: '4 hours ago' },
      { action: 'Announcement posted', user: 'Admin', time: '6 hours ago' }
    ]
  });

  const metrics = [
    {
      label: 'Total Views',
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%'
    },
    {
      label: 'Active Users',
      value: analytics.activeUsers.toLocaleString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%'
    },
    {
      label: 'Completion Rate',
      value: `${analytics.completionRate}%`,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+5%'
    },
    {
      label: 'New Content',
      value: analytics.newContent.toString(),
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+15%'
    }
  ];

  const handleViewFullReport = () => {
    // Navigate to full analytics page
    window.location.href = '/admin/analytics/full-report';
  };

  const handleExportData = () => {
    // Export analytics data
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `content-analytics-${currentDate}.csv`;
    
    const csvData = [
      ['Metric', 'Value', 'Change', 'Date'],
      ['Total Views', analytics.totalViews.toString(), '+12%', currentDate],
      ['Active Users', analytics.activeUsers.toString(), '+8%', currentDate],
      ['Completion Rate', `${analytics.completionRate}%`, '+5%', currentDate],
      ['New Content', analytics.newContent.toString(), '+15%', currentDate]
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

  const handleRefreshData = () => {
    // Refresh analytics data
    setAnalytics(prev => ({
      ...prev,
      totalViews: prev.totalViews + Math.floor(Math.random() * 100),
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 10),
      completionRate: Math.min(100, prev.completionRate + Math.floor(Math.random() * 3)),
      newContent: prev.newContent + Math.floor(Math.random() * 5)
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Content Analytics</h3>
              <p className="text-sm text-slate-600">Real-time content performance metrics</p>
            </div>
          </div>
          <button 
            onClick={handleViewFullReport}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View Full Report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                  </div>
                  <span className="text-xs font-medium text-green-600">{metric.change}</span>
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1">{metric.value}</div>
                <div className="text-sm text-slate-600">{metric.label}</div>
              </div>
            );
          })}
        </div>

        {/* Popular Content & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Content */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Popular Content
            </h4>
            <div className="space-y-3">
              {analytics.popularContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{content.title}</p>
                    <p className="text-xs text-slate-600">{content.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">{content.views}</p>
                    <p className="text-xs text-slate-500">views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              Recent Activity
            </h4>
            <div className="space-y-3">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                    <p className="text-xs text-slate-600">by {activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportData}
              className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition-colors"
            >
              Export Data
            </button>
            <button 
              onClick={handleRefreshData}
              className="px-3 py-1 text-xs font-medium text-slate-600 border border-slate-300 rounded-full hover:bg-slate-50 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}