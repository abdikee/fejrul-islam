'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, FileCheck, BookOpen, Calendar, MessageSquare, 
  CheckCircle, Trophy, Heart, Shield, 
  GraduationCap, Sun, Clock, Bell, Settings, LogOut,
  Search, Plus, Filter, Download, BarChart3
} from 'lucide-react';

import MentorFooter from '@/components/mentor/MentorFooter';



export default function MentorDashboard() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

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

        // Check if user is mentor
        if (authData.user.role !== 'mentor') {
          if (authData.user.role === 'admin') {
            window.location.href = '/admin/dashboard';
          } else {
            window.location.href = `/dashboard/${authData.user.gender}`;
          }
          return;
        }

        setUser(authData.user);

        // Get comprehensive mentor dashboard data
        const dashboardResponse = await fetch('/api/dashboard/mentor');
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
          firstName: 'Ahmad',
          lastName: 'Ibrahim',
          email: 'ahmad.ibrahim@example.com',
          role: 'mentor',
          gender: 'male'
        });
        setDashboardData({
          stats: {
            totalStudents: 12,
            activeStudents: 8,
            managedCourses: 5,
            uploadedResources: 15,
            averageProgress: 72
          },
          dashboard: {
            assignedStudents: [],
            managedCourses: [],
            mentorResources: [],
            studentProgress: [],
            recentActivity: [],
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
  const handleUpdateStudentProgress = async (studentId, courseId, progressPercentage, notes) => {
    try {
      const response = await fetch('/api/dashboard/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'update_student_progress', 
          studentId, 
          courseId, 
          data: { progressPercentage, notes } 
        })
      });
      
      const result = await response.json();
      if (result.success) {
        // Refresh dashboard data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating student progress:', error);
    }
  };

  const handleSendMessage = async (studentId, message, priority = 'normal') => {
    try {
      const response = await fetch('/api/dashboard/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'send_student_message', 
          studentId, 
          data: { message, priority } 
        })
      });
      
      const result = await response.json();
      if (result.success) {
        console.log('Message sent successfully');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateAnnouncement = async (title, content, targetAudience) => {
    try {
      const response = await fetch('/api/dashboard/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create_announcement', 
          data: { title, content, targetAudience } 
        })
      });
      
      const result = await response.json();
      if (result.success) {
        console.log('Announcement created successfully');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
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

  const mentorColorScheme = {
    primary: 'green',
    secondary: 'emerald',
    accent: 'teal',
    bgGradient: 'from-green-50 via-emerald-50 to-teal-50',
    cardBg: 'bg-white/80',
    cardBorder: 'border-green-200',
    buttonPrimary: 'bg-green-600 hover:bg-green-700',
    buttonSecondary: 'bg-emerald-600 hover:bg-emerald-700',
    textPrimary: 'text-green-700',
    textSecondary: 'text-emerald-700',
    iconColor: 'text-green-600'
  };

  const quickActions = [
    { icon: Users, label: 'My Students', href: '/mentor/students', color: 'green' },
    { icon: FileCheck, label: 'Review Submissions', href: '/mentor/submissions', color: 'emerald' },
    { icon: BookOpen, label: 'Assignments', href: '/mentor/assignments', color: 'teal' },
    { icon: Calendar, label: 'Schedule Session', href: '/mentor/sessions', color: 'blue' }
  ];

  const recentActivities = [
    { type: 'review', title: 'Reviewed: Tafseer Assignment by Fatima', time: '30 minutes ago', icon: CheckCircle, color: 'text-green-600' },
    { type: 'message', title: 'New message from Omar about Hadith studies', time: '1 hour ago', icon: MessageSquare, color: 'text-blue-600' },
    { type: 'assignment', title: 'Created: Islamic Leadership Essay Assignment', time: '2 hours ago', icon: BookOpen, color: 'text-emerald-600' },
    { type: 'session', title: 'Completed counseling session with Aisha', time: '1 day ago', icon: Heart, color: 'text-purple-600' }
  ];

  const upcomingEvents = [
    { title: 'Usrah Circle Meeting', date: 'Today, 6:00 PM', type: 'Group Session', color: 'bg-green-100 text-green-800' },
    { title: 'Individual Counseling - Omar', date: 'Tomorrow, 3:00 PM', type: 'One-on-One', color: 'bg-blue-100 text-blue-800' },
    { title: 'Assignment Review Session', date: 'Wednesday, 7:00 PM', type: 'Academic', color: 'bg-emerald-100 text-emerald-800' }
  ];

  const mentorStats = [
    { subject: 'Student Progress', progress: 88, color: 'bg-green-500' },
    { subject: 'Assignment Completion', progress: 94, color: 'bg-emerald-500' },
    { subject: 'Session Attendance', progress: 92, color: 'bg-teal-500' },
    { subject: 'Feedback Quality', progress: 96, color: 'bg-blue-500' }
  ];

  const performanceStats = [
    { label: 'Total Students', value: user?.totalStudents || '12', icon: Users, color: 'text-green-600' },
    { label: 'Active Assignments', value: user?.activeAssignments || '8', icon: BookOpen, color: 'text-emerald-600' },
    { label: 'Pending Reviews', value: user?.pendingReviews || '5', icon: FileCheck, color: 'text-teal-600' },
    { label: 'Completion Rate', value: `${user?.completionRate || 94}%`, icon: Trophy, color: 'text-blue-600' }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading mentor dashboard...</p>
          <p className="text-slate-500 text-sm mt-2">Connecting to real-time data...</p>
        </div>
      </div>
    );
  }

  if (!user || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading mentor dashboard...</p>
        </div>
      </div>
    );
  }

  // Real-time data
  const stats = dashboardData.stats || {};
  const assignedStudents = dashboardData.dashboard?.assignedStudents || [];
  const managedCourses = dashboardData.dashboard?.managedCourses || [];
  const mentorResources = dashboardData.dashboard?.mentorResources || [];
  const studentProgress = dashboardData.dashboard?.studentProgress || [];
  const recentActivity = dashboardData.dashboard?.recentActivity || [];
  const sectors = dashboardData.dashboard?.sectors || [];

  // Calculate dynamic stats
  const level = stats.averageProgress > 80 ? 'Senior Mentor' : stats.averageProgress > 60 ? 'Mentor' : 'Junior Mentor';
  const completionRate = Math.round(stats.averageProgress || 0);
  const totalStudents = stats.totalStudents || 0;
  const activeAssignments = stats.managedCourses || 0;
  const pendingReviews = Math.floor(totalStudents * 0.4); // Estimate pending reviews

  return (
    <div className={`min-h-screen bg-gradient-to-br ${mentorColorScheme.bgGradient}`}>
      {/* Mentor-Specific Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Top Header Row */}
          <div className="flex items-center justify-between py-4">
            {/* Left Section - Logo & Greeting */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    Assalamu Alaikum, Ustadh {user.firstName}
                  </h1>
                  <p className="text-sm text-slate-600">Mentor Dashboard • Fejrul Islam HUMSJ</p>
                </div>
              </div>
            </div>

            {/* Center Section - Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students, assignments, submissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80"
                />
              </div>
            </div>

            {/* Right Section - Actions & Profile */}
            <div className="flex items-center gap-3">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-3 mr-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg border border-green-200">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{user.totalStudents} Students</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-lg border border-orange-200">
                  <FileCheck className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">{user.pendingReviews} Reviews</span>
                </div>
              </div>

              {/* Time */}
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                {currentTime.toLocaleTimeString()}
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-green-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-green-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Settings */}
              <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-green-600" />
              </button>

              {/* Profile Dropdown */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{user.level}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Header Row - Quick Actions */}
          <div className="border-t border-slate-200 py-3">
            <div className="flex items-center justify-between">
              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2">
                <Link
                  href="/mentor/assignments/new"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Assignment
                </Link>
                <Link
                  href="/mentor/sessions/schedule"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Session
                </Link>
                <Link
                  href="/mentor/submissions"
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                >
                  <FileCheck className="w-4 h-4" />
                  Review ({user.pendingReviews})
                </Link>
              </div>

              {/* Filter & Export */}
              <div className="hidden md:flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <BarChart3 className="w-4 h-4" />
                  Reports
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students, assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mentor Quick Navigation Bar */}
      <nav className="bg-green-50 border-b border-green-200 sticky top-16 z-30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-1 overflow-x-auto">
              <Link
                href="/mentor/dashboard"
                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors whitespace-nowrap"
              >
                Dashboard
              </Link>
              <Link
                href="/mentor/students"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
              >
                My Students
              </Link>
              <Link
                href="/mentor/assignments"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Assignments
              </Link>
              <Link
                href="/mentor/submissions"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Reviews
              </Link>
              <Link
                href="/mentor/sessions"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Sessions
              </Link>
              <Link
                href="/mentor/sectors"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Sectors
              </Link>
              <Link
                href="/mentor/analytics"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Analytics
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/mentor/resources"
                className="px-3 py-1 text-xs font-medium text-green-600 border border-green-300 rounded-full hover:bg-green-50 transition-colors"
              >
                Resources
              </Link>
              <Link
                href="/mentor/training"
                className="px-3 py-1 text-xs font-medium text-emerald-600 border border-emerald-300 rounded-full hover:bg-emerald-50 transition-colors"
              >
                Training
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
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome Back, Ustadh!</h2>
                  <p className="text-green-100 mb-4">
                    Continue guiding and nurturing the next generation of Muslim leaders
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{user.totalStudents} Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>{user.completionRate}% Success Rate</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Shield className="w-16 h-16 text-green-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  const colorClasses = {
                    green: 'border-green-200 bg-green-50 hover:bg-green-100 text-green-600',
                    emerald: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600',
                    teal: 'border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-600',
                    blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600'
                  };
                  
                  return (
                    <Link
                      key={index}
                      href={action.href}
                      className={`p-4 rounded-xl border-2 ${colorClasses[action.color]} transition-all duration-200 text-center group`}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-medium">{action.label}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Mentorship Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {performanceStats.map((stat, index) => {
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Mentorship Metrics</h3>
              <div className="space-y-4">
                {mentorStats.map((item, index) => (
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-slate-600 mb-4">{user.level}</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-700">{user.totalStudents}</div>
                    <div className="text-xs text-green-600">Students</div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-emerald-700">{user.activeAssignments}</div>
                    <div className="text-xs text-emerald-600">Assignments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Sessions</h3>
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
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
              <div className="text-center">
                <Sun className="w-8 h-8 mx-auto mb-3 text-green-200" />
                <h3 className="font-bold mb-2">Daily Reminder</h3>
                <p className="text-sm text-green-100 mb-3 font-arabic">
                  خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ
                </p>
                <p className="text-xs text-green-200">
                  "The best of people are those who benefit others" - Hadith
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Sessions Conducted</span>
                  <span className="font-bold text-green-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Assignments Reviewed</span>
                  <span className="font-bold text-emerald-600">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Messages Sent</span>
                  <span className="font-bold text-teal-600">23</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mentor Footer */}
      <MentorFooter user={user} />
    </div>
  );
}