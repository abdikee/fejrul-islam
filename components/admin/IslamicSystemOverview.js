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
  MessageSquare,
  Crown,
  Star,
  Heart,
  Compass,
  Moon,
  Sun
} from 'lucide-react';

export default function IslamicSystemOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    systemHealth: 'healthy'
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch system statistics
    const fetchStats = async () => {
      try {
        setStats({
          totalUsers: 1247,
          activeUsers: 892,
          totalCourses: 45,
          systemHealth: 'healthy'
        });

        setRecentActivity([
          { id: 1, type: 'user_registration', message: 'New brother joined: Ahmed Ali from Qirat & Ilm', time: '2 minutes ago', icon: Users, color: 'text-green-400' },
          { id: 2, type: 'course_completion', message: 'Sister Fatima completed Tajweed Level 2', time: '5 minutes ago', icon: BookOpen, color: 'text-blue-400' },
          { id: 3, type: 'system_backup', message: 'Amanah backup completed successfully - Alhamdulillah', time: '1 hour ago', icon: Database, color: 'text-purple-400' },
          { id: 4, type: 'announcement', message: 'Jumu\'ah announcement sent to all sectors', time: '2 hours ago', icon: MessageSquare, color: 'text-amber-400' }
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const islamicMetrics = [
    {
      title: 'Ummah Members',
      titleArabic: 'أعضاء الأمة',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30'
    },
    {
      title: 'Active Today',
      titleArabic: 'النشطون اليوم',
      value: stats.activeUsers.toLocaleString(),
      change: '+8%',
      changeType: 'positive',
      icon: Activity,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-400/30'
    },
    {
      title: 'Ilm Courses',
      titleArabic: 'دورات العلم',
      value: stats.totalCourses.toString(),
      change: '+3',
      changeType: 'positive',
      icon: BookOpen,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-400/30'
    },
    {
      title: 'Nizam Health',
      titleArabic: 'صحة النظام',
      value: 'Excellent',
      change: '99.9%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-400/30'
    }
  ];

  const islamicQuickActions = [
    {
      title: 'Ummah Management',
      titleArabic: 'إدارة الأمة',
      description: 'Manage brothers, sisters, and mentors with Islamic principles',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      action: () => console.log('Navigate to users')
    },
    {
      title: 'Send Bayan',
      titleArabic: 'إرسال بيان',
      description: 'Broadcast Islamic guidance to community members',
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-600',
      action: () => console.log('Send announcement')
    },
    {
      title: 'Backup Amanah',
      titleArabic: 'نسخ الأمانة',
      description: 'Protect the trust - backup system and data',
      icon: Database,
      color: 'from-purple-500 to-violet-600',
      action: () => console.log('Create backup')
    },
    {
      title: 'Hikmah Analytics',
      titleArabic: 'تحليلات الحكمة',
      description: 'Gain wisdom through data and community insights',
      icon: BarChart3,
      color: 'from-amber-500 to-orange-600',
      action: () => console.log('Generate report')
    }
  ];

  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    return hour >= 6 && hour < 18 ? Sun : Moon;
  };

  const TimeIcon = getTimeIcon();

  return (
    <div className="space-y-8">
      {/* Islamic Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold text-white">Nizam Overview</h1>
          <Crown className="w-8 h-8 text-amber-400" />
        </div>
        <p className="text-xl text-amber-200 font-semibold mb-2">نظرة عامة على النظام</p>
        <p className="text-white/80">Monitor and guide your Islamic educational platform with wisdom</p>
        
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/60">
          <TimeIcon className="w-4 h-4" />
          <span>Last updated: {currentTime.toLocaleTimeString()}</span>
          <Compass className="w-4 h-4 ml-2" />
          <span>Guided by Islamic principles</span>
        </div>
      </div>

      {/* Islamic System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {islamicMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className={`p-6 rounded-2xl border-2 ${metric.borderColor} ${metric.bgColor} backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-bold ${
                  metric.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                <p className="text-sm font-medium text-white/80 mb-1">{metric.title}</p>
                <p className="text-xs text-amber-300/80">{metric.titleArabic}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Islamic Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              <span className="text-amber-300 text-sm">الإجراءات السريعة</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {islamicQuickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    onClick={action.action}
                    className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 rounded-xl transition-all duration-200 text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">{action.title}</h3>
                        <p className="text-xs text-amber-300/80 mb-2">{action.titleArabic}</p>
                        <p className="text-sm text-white/70">{action.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity with Islamic Theme */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <Icon className={`w-5 h-5 ${activity.color} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{activity.message}</p>
                    <p className="text-xs text-white/60 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-amber-300 hover:text-amber-200 font-medium transition-colors">
            View All Activity • عرض جميع الأنشطة
          </button>
        </div>
      </div>

      {/* Islamic System Status */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-bold text-white">Nizam Status</h2>
          <span className="text-amber-300 text-sm">حالة النظام</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-green-500/20 rounded-xl border border-green-400/30">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <h3 className="font-bold text-green-300 mb-1">Qaidah (Database)</h3>
            <p className="text-xs text-green-400/80 mb-1">القاعدة</p>
            <p className="text-sm text-green-200">Operational</p>
          </div>
          
          <div className="text-center p-6 bg-blue-500/20 rounded-xl border border-blue-400/30">
            <Server className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="font-bold text-blue-300 mb-1">Khidmat (Services)</h3>
            <p className="text-xs text-blue-400/80 mb-1">الخدمات</p>
            <p className="text-sm text-blue-200">All running</p>
          </div>
          
          <div className="text-center p-6 bg-purple-500/20 rounded-xl border border-purple-400/30">
            <Activity className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h3 className="font-bold text-purple-300 mb-1">Wasl (Connection)</h3>
            <p className="text-xs text-purple-400/80 mb-1">الوصل</p>
            <p className="text-sm text-purple-200">Real-time active</p>
          </div>
          
          <div className="text-center p-6 bg-amber-500/20 rounded-xl border border-amber-400/30">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="font-bold text-amber-300 mb-1">Khazana (Storage)</h3>
            <p className="text-xs text-amber-400/80 mb-1">الخزانة</p>
            <p className="text-sm text-amber-200">85% capacity</p>
          </div>
        </div>
      </div>

      {/* Islamic Blessing Footer */}
      <div className="text-center p-6 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-2xl border border-amber-400/30">
        <p className="text-amber-200 font-semibold mb-2">
          "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ"
        </p>
        <p className="text-white/80 text-sm">
          "And my success is not but through Allah. Upon Him I have relied, and to Him I return." - Quran 11:88
        </p>
      </div>
    </div>
  );
}