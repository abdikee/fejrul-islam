'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, FileCheck, BookOpen, Calendar, MessageSquare, 
  CheckCircle, Trophy, Heart, Shield, 
  Sun
} from 'lucide-react';

export default function MentorDashboard() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
                  <span>{totalStudents} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>{completionRate}% Success Rate</span>
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
            <p className="text-sm text-slate-600 mb-4">{level}</p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-lg font-bold text-green-700">{totalStudents}</div>
                <div className="text-xs text-green-600">Students</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <div className="text-lg font-bold text-emerald-700">{activeAssignments}</div>
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
  );
}