'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Calendar, Users, Sword, 
  Star, Clock, Bell, Settings, User, Sun, Shield, Zap,
  Target, CheckCircle, Trophy, Activity, Compass, LogOut
} from 'lucide-react';

import StudentFooter from '@/components/dashboard/StudentFooter';

export default function MaleDashboard() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Fetch current user and dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // First get user authentication
        const authResponse = await fetch('/api/auth/me');
        const authData = await authResponse.json();
        
        if (!authData.success) {
          window.location.href = '/auth/login';
          return;
        }

        // Check if user is male student
        if (authData.user.gender !== 'male' || authData.user.role !== 'student') {
          if (authData.user.gender === 'female') {
            window.location.href = '/dashboard/female';
          } else if (authData.user.role === 'mentor') {
            window.location.href = '/mentor/dashboard';
          } else if (authData.user.role === 'admin') {
            window.location.href = '/admin/dashboard';
          }
          return;
        }

        setUser(authData.user);

        // Get comprehensive dashboard data
        const dashboardResponse = await fetch('/api/dashboard/student?progress=true');
        const dashboardResult = await dashboardResponse.json();
        
        if (dashboardResult.success) {
          setDashboardData(dashboardResult);
        } else {
          throw new Error(dashboardResult.message || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Use fallback data for development
        setUser({
          firstName: 'Omar',
          lastName: 'Hassan',
          email: 'omar.hassan@example.com',
          gender: 'male',
          role: 'student'
        });
        setDashboardData({
          stats: {
            totalEnrolled: 4,
            completedCourses: 1,
            averageProgress: 65,
            totalResources: 15,
            activeAnnouncements: 3
          },
          dashboard: {
            enrolledCourses: [],
            availableCourses: [],
            resources: [],
            announcements: [],
            sectors: []
          }
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const dataRefreshInterval = setInterval(fetchDashboardData, 300000);
    
    return () => {
      clearInterval(timer);
      clearInterval(dataRefreshInterval);
    };
  }, []);

  // Real-time action handlers
  const handleEnrollCourse = async (courseId) => {
    try {
      const response = await fetch('/api/dashboard/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'enroll_course', courseId })
      });
      
      const result = await response.json();
      if (result.success) {
        // Refresh dashboard data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleUpdateProgress = async (courseId, progressPercentage) => {
    try {
      const response = await fetch('/api/dashboard/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'update_progress', 
          courseId, 
          data: { progressPercentage } 
        })
      });
      
      const result = await response.json();
      if (result.success) {
        // Update local state or refresh
        setDashboardData(prev => ({
          ...prev,
          dashboard: {
            ...prev.dashboard,
            enrolledCourses: prev.dashboard.enrolledCourses.map(course =>
              course.id === courseId 
                ? { ...course, progress_percentage: progressPercentage }
                : course
            )
          }
        }));
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleDownloadResource = async (resourceId) => {
    try {
      const response = await fetch('/api/dashboard/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'download_resource', resourceId })
      });
      
      if (response.ok) {
        // Track download and update UI
        console.log('Resource download tracked');
      }
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const maleColorScheme = {
    primary: 'emerald',
    secondary: 'blue',
    accent: 'slate',
    bgGradient: 'from-emerald-50 via-blue-50 to-slate-50',
    cardBg: 'bg-white/80',
    cardBorder: 'border-emerald-200',
    buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700',
    buttonSecondary: 'bg-blue-600 hover:bg-blue-700',
    textPrimary: 'text-emerald-700',
    textSecondary: 'text-blue-700',
    iconColor: 'text-emerald-600'
  };

  const quickActions = [
    { icon: BookOpen, label: 'My Courses', href: '/courses', color: 'emerald' },
    { icon: Calendar, label: 'Schedule', href: '/schedule', color: 'blue' },
    { icon: Users, label: 'Brotherhood', href: '/brotherhood', color: 'slate' },
    { icon: Sword, label: 'Leadership', href: '/leadership', color: 'amber' }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
          <p className="text-slate-500 text-sm mt-2">Connecting to real-time data...</p>
        </div>
      </div>
    );
  }

  if (!user || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Real-time data - moved after loading checks
  const stats = dashboardData.stats || {};
  const enrolledCourses = dashboardData.dashboard?.enrolledCourses || [];
  const availableCourses = dashboardData.dashboard?.availableCourses || [];
  const resources = dashboardData.dashboard?.resources || [];
  const announcements = dashboardData.dashboard?.announcements || [];
  const sectors = dashboardData.dashboard?.sectors || [];
  const recentActivity = dashboardData.dashboard?.recentActivity || [];

  const recentActivities = recentActivity.length > 0 ? recentActivity.map((activity, index) => ({
    type: activity.activity_type,
    title: activity.description,
    time: new Date(activity.activity_time).toLocaleString(),
    icon: activity.activity_type === 'course_progress' ? CheckCircle : BookOpen,
    color: activity.activity_type === 'course_progress' ? 'text-green-600' : 'text-blue-600'
  })) : [
    { type: 'course', title: 'Completed: Islamic Leadership Principles', time: '1 hour ago', icon: CheckCircle, color: 'text-green-600' },
    { type: 'achievement', title: 'Earned: Knowledge Seeker Badge', time: '6 hours ago', icon: Trophy, color: 'text-yellow-600' },
    { type: 'discussion', title: 'Led: Fiqh Discussion Group', time: '1 day ago', icon: Users, color: 'text-blue-600' },
    { type: 'reminder', title: 'Upcoming: Dawah Training Session', time: '2 days ago', icon: Bell, color: 'text-emerald-600' }
  ];

  const upcomingEvents = announcements.slice(0, 3).map(announcement => ({
    title: announcement.title,
    date: new Date(announcement.publish_date).toLocaleDateString(),
    type: announcement.announcement_type || 'Announcement',
    color: announcement.priority === 'urgent' ? 'bg-red-100 text-red-800' : 
           announcement.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
           'bg-emerald-100 text-emerald-800'
  }));

  const progressData = enrolledCourses.slice(0, 4).map(course => ({
    subject: course.title,
    progress: course.progress_percentage || 0,
    color: course.sector_color === 'blue' ? 'bg-blue-500' : 
           course.sector_color === 'green' ? 'bg-green-500' :
           course.sector_color === 'purple' ? 'bg-purple-500' :
           'bg-emerald-500'
  }));

  const leadershipStats = [
    { label: 'Enrolled', value: stats.totalEnrolled?.toString() || '0', icon: Users, color: 'text-emerald-600' },
    { label: 'Completed', value: stats.completedCourses?.toString() || '0', icon: Target, color: 'text-blue-600' },
    { label: 'Progress', value: `${stats.averageProgress || 0}%`, icon: Activity, color: 'text-slate-600' },
    { label: 'Resources', value: stats.totalResources?.toString() || '0', icon: Trophy, color: 'text-amber-600' }
  ];

  // Calculate dynamic stats
  const userLevel = stats.averageProgress > 80 ? 'Advanced' : stats.averageProgress > 50 ? 'Intermediate' : 'Beginner';
  const points = Math.floor(stats.averageProgress * 10 + stats.completedCourses * 100);
  const streak = Math.floor(Math.random() * 30) + 1; // Mock streak for now

  return (
    <div className={`min-h-screen bg-gradient-to-br ${maleColorScheme.bgGradient}`}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-emerald-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Assalamu Alaikum, Brother {user.firstName}
                </h1>
                <p className="text-sm text-slate-600">Brothers Wing • Fejrul Islam HUMSJ</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                {currentTime.toLocaleTimeString()}
              </div>
              <button className="p-2 hover:bg-emerald-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-emerald-600" />
              </button>
              <button className="p-2 hover:bg-emerald-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-emerald-600" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Navigation Bar */}
      <nav className="bg-emerald-50 border-b border-emerald-200 sticky top-16 z-30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-1 overflow-x-auto">
              <Link
                href="/dashboard/male"
                className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors whitespace-nowrap"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/courses"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
              >
                My Courses
              </Link>
              <Link
                href="/dashboard/schedule"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Schedule
              </Link>
              <Link
                href="/dashboard/resources"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Resources
              </Link>
              <Link
                href="/dashboard/study-plan"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Study Plan
              </Link>
              <Link
                href="/dashboard/announcements"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Announcements
              </Link>
              <Link
                href="/dashboard/settings"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Settings
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/mentorship"
                className="px-3 py-1 text-xs font-medium text-emerald-600 border border-emerald-300 rounded-full hover:bg-emerald-50 transition-colors"
              >
                Find Mentor
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome Back, Brother!</h2>
                  <p className="text-emerald-100 mb-4">
                    Continue your path of knowledge, leadership, and service to the Ummah
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>{points} Points</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span>{streak} Day Streak</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span>Live Data</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Compass className="w-16 h-16 text-emerald-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/dashboard/courses"
                  className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-all duration-200 text-center group"
                >
                  <BookOpen className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">My Courses</p>
                </Link>
                <Link
                  href="/dashboard/schedule"
                  className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 text-center group"
                >
                  <Calendar className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">Schedule</p>
                </Link>
                <Link
                  href="/dashboard/resources"
                  className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all duration-200 text-center group"
                >
                  <Users className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">Resources</p>
                </Link>
                <Link
                  href="/dashboard/study-plan"
                  className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-600 transition-all duration-200 text-center group"
                >
                  <Sword className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">Study Plan</p>
                </Link>
              </div>
            </div>

            {/* Leadership Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Leadership Dashboard</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {leadershipStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center p-4 bg-slate-50 rounded-xl">
                      <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                      <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Learning Progress</h3>
              <div className="space-y-4">
                {progressData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">{item.subject}</span>
                      <span className="text-sm text-slate-600">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                      <Icon className={`w-5 h-5 ${activity.color} mt-0.5`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                        <p className="text-xs text-slate-600">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-slate-600 mb-4">{userLevel} Student</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-emerald-700">{stats.completedCourses || 0}</div>
                    <div className="text-xs text-emerald-600">Completed</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-blue-700">{stats.totalEnrolled || 0}</div>
                    <div className="text-xs text-blue-600">Enrolled</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-800 text-sm">{event.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${event.color}`}>
                        {event.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{event.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Islamic Reminder */}
            <div className="bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl p-6 text-white">
              <div className="text-center">
                <Sun className="w-8 h-8 mx-auto mb-3 text-emerald-200" />
                <h3 className="font-bold mb-2">Daily Reminder</h3>
                <p className="text-sm text-emerald-100 mb-3 font-arabic">
                  إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ
                </p>
                <p className="text-xs text-emerald-200">
                  "The believers are but brothers" - Quran 49:10
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Avg Progress</span>
                  <span className="font-bold text-emerald-600">{stats.averageProgress || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Active Courses</span>
                  <span className="font-bold text-blue-600">{stats.totalEnrolled || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Resources Available</span>
                  <span className="font-bold text-slate-600">{stats.totalResources || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Announcements</span>
                  <span className="font-bold text-amber-600">{stats.activeAnnouncements || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Student Footer */}
      <StudentFooter user={user} />
    </div>
  );
}