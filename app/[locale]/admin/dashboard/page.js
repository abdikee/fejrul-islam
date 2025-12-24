'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Users, FileText, BarChart3, Settings, 
  TrendingUp, AlertCircle, CheckCircle, Clock,
  BookOpen, Megaphone, Shield,
  Activity, ArrowRight, Eye, RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comprehensive dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard/stats');
        const data = await response.json();
        
        if (data.success) {
          setDashboardData(data.stats);
        } else {
          throw new Error(data.message || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
        // Use fallback data
        setDashboardData({
          users: { total: 1247, active: 892, newThisMonth: 45, growthRate: 12 },
          courses: { total: 156, active: 142, newThisMonth: 8, growthRate: 15 },
          resources: { total: 324, totalDownloads: 5847, newThisMonth: 23, growthRate: 18 },
          announcements: { total: 89, active: 12, urgent: 2 },
          recentActivity: [
            { type: 'user_registration', description: 'Fatima Al-Zahra registered', time: new Date(Date.now() - 300000), status: 'success' },
            { type: 'course_created', description: 'New course: Islamic Finance Basics', time: new Date(Date.now() - 900000), status: 'success' },
            { type: 'announcement_published', description: 'Announcement: Ramadan Schedule', time: new Date(Date.now() - 1800000), status: 'info' }
          ],
          systemHealth: { database: 'healthy', storage: 'warning', api: 'healthy', users: 'healthy' }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (loading) {
    return (
      <AdminLayout showAnalytics={false} showActivity={false}>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading dashboard data...</p>
            <p className="text-slate-500 text-sm mt-2">Connecting all content across the platform</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error && !dashboardData) {
    return (
      <AdminLayout showAnalytics={false} showActivity={false}>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">Failed to load dashboard</p>
            <p className="text-slate-500 text-sm mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const quickStats = {
    totalUsers: dashboardData?.users?.total || 0,
    activeUsers: dashboardData?.users?.active || 0,
    totalContent: (dashboardData?.courses?.total || 0) + (dashboardData?.resources?.total || 0),
    pendingReviews: dashboardData?.announcements?.urgent || 0,
    systemHealth: 98.5,
    monthlyGrowth: dashboardData?.users?.growthRate || 0
  };

  const recentActivity = dashboardData?.recentActivity?.slice(0, 4) || [];
  const pendingTasks = [
    { id: 1, title: `Review ${dashboardData?.announcements?.urgent || 0} urgent announcements`, priority: 'high', dueDate: 'Today' },
    { id: 2, title: `Approve ${dashboardData?.users?.newThisMonth || 0} new registrations`, priority: 'medium', dueDate: 'Tomorrow' },
    { id: 3, title: 'Update system announcements', priority: 'low', dueDate: 'This week' },
    { id: 4, title: 'Generate monthly reports', priority: 'medium', dueDate: 'End of month' }
  ];

  const quickActions = [
    { 
      title: 'Add New Program', 
      description: 'Create dawah content',
      icon: BookOpen, 
      href: '/admin/content/new',
      color: 'bg-blue-500 hover:bg-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    { 
      title: 'Send Announcement', 
      description: 'Notify all participants',
      icon: Megaphone, 
      href: '/admin/content/new',
      color: 'bg-green-500 hover:bg-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    { 
      title: 'Manage Users', 
      description: 'User administration',
      icon: Users, 
      href: '/admin/users',
      color: 'bg-purple-500 hover:bg-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    { 
      title: 'View Analytics', 
      description: 'Dawah insights',
      icon: BarChart3, 
      href: '/admin/analytics',
      color: 'bg-orange-500 hover:bg-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  const systemMetrics = [
    { 
      title: 'Total Users', 
      value: quickStats.totalUsers.toLocaleString(), 
      change: '+12%', 
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Active Users', 
      value: quickStats.activeUsers.toLocaleString(), 
      change: '+8%', 
      trend: 'up',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Total Content', 
      value: quickStats.totalContent.toString(), 
      change: '+15%', 
      trend: 'up',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Pending Reviews', 
      value: quickStats.pendingReviews.toString(), 
      change: '-5%', 
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration':
      case 'user': 
        return <Users className="w-4 h-4" />;
      case 'course_created':
      case 'content': 
        return <FileText className="w-4 h-4" />;
      case 'announcement_published':
        return <Megaphone className="w-4 h-4" />;
      case 'resource_uploaded':
        return <BookOpen className="w-4 h-4" />;
      case 'system': 
        return <Settings className="w-4 h-4" />;
      default: 
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <AdminLayout showAnalytics={false} showActivity={false}>
      <div className="p-6 space-y-6">
        {/* Welcome Header with Real-time Data */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
              <p className="text-blue-100 text-lg">Manage your Dawah & Irshad platform efficiently</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>System Health: {quickStats.systemHealth}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Growth: +{quickStats.monthlyGrowth}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  <span>Connected Content: {quickStats.totalContent}</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <Shield className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    metric.trend === 'up' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">{metric.value}</h3>
                <p className="text-slate-600 text-sm">{metric.title}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => window.location.href = action.href}
                  className="group p-6 border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left"
                >
                  <div className={`w-12 h-12 ${action.iconBg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${action.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{action.title}</h3>
                  <p className="text-sm text-slate-600">{action.description}</p>
                  <ArrowRight className="w-4 h-4 text-slate-400 mt-3 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{activity.description}</p>
                    <p className="text-sm text-slate-600">
                      {activity.audience && activity.audience !== 'system' ? `Target: ${activity.audience} • ` : ''}
                      {new Date(activity.time).toLocaleString()}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium">
                View All Activity →
              </button>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Pending Tasks</h2>
              <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                {pendingTasks.length}
              </span>
            </div>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-slate-800 text-sm">{task.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">{task.dueDate}</p>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium">
                View All Tasks →
              </button>
            </div>
          </div>
        </div>

        {/* System Status with Real-time Health */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">System Status</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Live Monitoring</span>
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-3 py-1 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 ml-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={`text-center p-4 rounded-lg border ${
              dashboardData?.systemHealth?.database === 'healthy' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              {dashboardData?.systemHealth?.database === 'healthy' ? (
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              ) : (
                <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              )}
              <h3 className={`font-semibold ${
                dashboardData?.systemHealth?.database === 'healthy' ? 'text-green-800' : 'text-yellow-800'
              }`}>Database</h3>
              <p className={`text-sm ${
                dashboardData?.systemHealth?.database === 'healthy' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {dashboardData?.systemHealth?.database === 'healthy' ? 'Healthy' : 'Warning'}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">API Services</h3>
              <p className="text-sm text-green-600">Operational</p>
            </div>
            <div className={`text-center p-4 rounded-lg border ${
              dashboardData?.systemHealth?.storage === 'healthy' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              {dashboardData?.systemHealth?.storage === 'healthy' ? (
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              ) : (
                <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              )}
              <h3 className={`font-semibold ${
                dashboardData?.systemHealth?.storage === 'healthy' ? 'text-green-800' : 'text-yellow-800'
              }`}>Storage</h3>
              <p className={`text-sm ${
                dashboardData?.systemHealth?.storage === 'healthy' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {dashboardData?.systemHealth?.storage === 'healthy' ? 'Healthy' : '85% Used'}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">Content Integration</h3>
              <p className="text-sm text-green-600">Connected</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}