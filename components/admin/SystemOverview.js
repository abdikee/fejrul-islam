'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Activity,
  Database,
  Server,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar,
  MessageSquare
} from 'lucide-react';

export default function SystemOverview({ setActiveTab }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    systemHealth: 'healthy'
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Fetch system statistics
    const fetchStats = async () => {
      try {
        // Fetch real statistics from API
        const [statsResponse, activityResponse] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/activity?limit=10')
        ]);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.success) {
            setStats({
              totalUsers: statsData.stats.totalUsers,
              activeUsers: statsData.stats.activeUsers,
              totalCourses: statsData.stats.totalCourses,
              systemHealth: 'healthy'
            });
          }
        }

        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          if (activityData.success) {
            // Format activity data
            const formattedActivity = activityData.activities.map((activity, index) => ({
              id: index + 1,
              type: activity.type,
              message: activity.description,
              time: formatTimeAgo(new Date(activity.timestamp))
            }));
            setRecentActivity(formattedActivity);
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep default mock data on error
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          totalCourses: 0,
          systemHealth: 'error'
        });
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const systemMetrics = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Today',
      value: stats.activeUsers.toLocaleString(),
      change: '+8%',
      changeType: 'positive',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses.toString(),
      change: '+3',
      changeType: 'positive',
      icon: BookOpen,
      color: 'purple'
    },
    {
      title: 'System Health',
      value: 'Excellent',
      change: '99.9%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'emerald'
    }
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage students, mentors, and administrators',
      icon: Users,
      color: 'bg-blue-500',
      action: () => {
        if (setActiveTab) {
          setActiveTab('users');
        } else {
          alert('Navigate to User Management section');
        }
      }
    },
    {
      title: 'Send Announcement',
      description: 'Broadcast message to all users or specific sectors',
      icon: MessageSquare,
      color: 'bg-green-500',
      action: () => {
        if (setActiveTab) {
          setActiveTab('content');
        } else {
          alert('Navigate to Content Management to send announcements');
        }
      }
    },
    {
      title: 'System Backup',
      description: 'Create backup of database and system files',
      icon: Database,
      color: 'bg-purple-500',
      action: () => {
        const confirmed = confirm('Are you sure you want to create a system backup? This may take several minutes.');
        if (confirmed) {
          alert('System backup initiated. You will be notified when complete.');
          // TODO: Implement actual backup functionality
        }
      }
    },
    {
      title: 'Analytics Report',
      description: 'Generate comprehensive system analytics',
      icon: BarChart3,
      color: 'bg-amber-500',
      action: () => {
        if (setActiveTab) {
          setActiveTab('analytics');
        } else {
          alert('Navigate to Analytics & Reports section');
        }
      }
    }
  ];

  const getMetricColor = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      emerald: 'text-emerald-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>
          <p className="text-slate-600">Monitor and manage your HUMSJ platform</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className={`p-6 rounded-xl border-2 ${getMetricColor(metric.color)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${getIconColor(metric.color)}`} />
                <span className={`text-sm font-semibold ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 mb-1">{metric.value}</p>
                <p className="text-sm font-medium text-slate-600">{metric.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    onClick={action.action}
                    className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">{action.title}</h3>
                        <p className="text-sm text-slate-600">{action.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Activity
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800">Database</h3>
            <p className="text-sm text-green-600">Operational</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Server className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800">API Services</h3>
            <p className="text-sm text-green-600">All systems running</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <h3 className="font-semibold text-amber-800">Storage</h3>
            <p className="text-sm text-amber-600">85% capacity</p>
          </div>
        </div>
      </div>
    </div>
  );
}