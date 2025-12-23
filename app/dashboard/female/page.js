'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Calendar, Users, Heart, MessageCircle, 
  Star, Clock, Award, Bell, Settings, User, Moon, Flower2,
  Sparkles, Target, CheckCircle, LogOut, GraduationCap
} from 'lucide-react';

import StudentFooter from '@/components/dashboard/StudentFooter';

export default function FemaleDashboard() {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Fetch current user data
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (data.success) {
          // Check if user is female
          if (data.user.gender !== 'female') {
            window.location.href = '/dashboard/male';
            return;
          }
          setUser(data.user);
        } else {
          // Redirect to login if not authenticated
          window.location.href = '/auth/login';
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        // Use mock data for development
        setUser({
          firstName: 'Aisha',
          lastName: 'Rahman',
          email: 'aisha.rahman@example.com',
          gender: 'female',
          level: 'Intermediate',
          points: 1250,
          streak: 15,
          completedCourses: 8,
          currentCourses: 3
        });
      }
    };
    
    fetchUser();
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const femaleColorScheme = {
    primary: 'teal',
    secondary: 'purple',
    accent: 'rose',
    bgGradient: 'from-teal-50 via-purple-50 to-rose-50',
    cardBg: 'bg-white/80',
    cardBorder: 'border-teal-200',
    buttonPrimary: 'bg-teal-600 hover:bg-teal-700',
    buttonSecondary: 'bg-purple-600 hover:bg-purple-700',
    textPrimary: 'text-teal-700',
    textSecondary: 'text-purple-700',
    iconColor: 'text-teal-600'
  };

  const quickActions = [
    { icon: BookOpen, label: 'My Courses', href: '/courses', color: 'teal' },
    { icon: Calendar, label: 'Schedule', href: '/schedule', color: 'purple' },
    { icon: Users, label: 'Study Groups', href: '/study-groups', color: 'rose' },
    { icon: MessageCircle, label: 'Mentorship', href: '/mentorship', color: 'indigo' }
  ];

  const recentActivities = [
    { type: 'course', title: 'Completed: Quranic Arabic Basics', time: '2 hours ago', icon: CheckCircle, color: 'text-green-600' },
    { type: 'achievement', title: 'Earned: Consistent Learner Badge', time: '1 day ago', icon: Award, color: 'text-yellow-600' },
    { type: 'discussion', title: 'Joined: Tafseer Study Circle', time: '2 days ago', icon: Users, color: 'text-purple-600' },
    { type: 'reminder', title: 'Upcoming: Fiqh Workshop Tomorrow', time: '3 days ago', icon: Bell, color: 'text-blue-600' }
  ];

  const upcomingEvents = [
    { title: 'Sisters Halaqah', date: 'Today, 7:00 PM', type: 'Study Circle', color: 'bg-teal-100 text-teal-800' },
    { title: 'Islamic History Lecture', date: 'Tomorrow, 2:00 PM', type: 'Course', color: 'bg-purple-100 text-purple-800' },
    { title: 'Quran Memorization Session', date: 'Friday, 6:00 PM', type: 'Practice', color: 'bg-rose-100 text-rose-800' }
  ];

  const progressData = [
    { subject: 'Quranic Studies', progress: 85, color: 'bg-teal-500' },
    { subject: 'Islamic History', progress: 70, color: 'bg-purple-500' },
    { subject: 'Fiqh & Jurisprudence', progress: 60, color: 'bg-rose-500' },
    { subject: 'Arabic Language', progress: 45, color: 'bg-indigo-500' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${femaleColorScheme.bgGradient}`}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-teal-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-purple-500 rounded-full flex items-center justify-center">
                <Flower2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Assalamu Alaikum, Sister {user.firstName}
                </h1>
                <p className="text-sm text-slate-600">Sisters Wing • Fejrul Islam HUMSJ</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                {currentTime.toLocaleTimeString()}
              </div>
              <button className="p-2 hover:bg-teal-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-teal-600" />
              </button>
              <button className="p-2 hover:bg-teal-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-teal-600" />
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
      <nav className="bg-teal-50 border-b border-teal-200 sticky top-16 z-30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-1 overflow-x-auto">
              <Link
                href="/dashboard/female"
                className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-100 rounded-lg hover:bg-teal-200 transition-colors whitespace-nowrap"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/courses"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-100 rounded-lg transition-colors whitespace-nowrap"
              >
                My Courses
              </Link>
              <Link
                href="/dashboard/sectors"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-100 rounded-lg transition-colors whitespace-nowrap"
              >
                All Sectors
              </Link>
              <Link
                href="/dashboard/qirat"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Qirat & Ilm
              </Link>
              <Link
                href="/dashboard/schedule"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Schedule
              </Link>
              <Link
                href="/dashboard/resources"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Resources
              </Link>
              <Link
                href="/dashboard/study-plan"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Study Plan
              </Link>
              <Link
                href="/dashboard/announcements"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Announcements
              </Link>
              <Link
                href="/dashboard/settings"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Settings
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/mentorship"
                className="px-3 py-1 text-xs font-medium text-teal-600 border border-teal-300 rounded-full hover:bg-teal-50 transition-colors"
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
            <div className="bg-gradient-to-r from-teal-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Welcome Back, Sister!</h2>
                  <p className="text-teal-100 mb-4">
                    Continue your journey of Islamic learning and spiritual growth
                  </p>
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>{user.points} Points</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>{user.streak} Day Streak</span>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/sectors"
                    className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors shadow-lg"
                  >
                    <GraduationCap className="w-5 h-5" />
                    Enroll in Sectors
                  </Link>
                </div>
                <div className="hidden md:block">
                  <Sparkles className="w-16 h-16 text-teal-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-teal-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/dashboard/courses"
                  className="p-4 rounded-xl border-2 border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-600 transition-all duration-200 text-center group"
                >
                  <BookOpen className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">My Courses</p>
                </Link>
                <Link
                  href="/dashboard/schedule"
                  className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-600 transition-all duration-200 text-center group"
                >
                  <Calendar className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">Schedule</p>
                </Link>
                <Link
                  href="/dashboard/resources"
                  className="p-4 rounded-xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all duration-200 text-center group"
                >
                  <Users className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">Resources</p>
                </Link>
                <Link
                  href="/dashboard/study-plan"
                  className="p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-all duration-200 text-center group"
                >
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">Study Plan</p>
                </Link>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-teal-200">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-teal-200">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-teal-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-slate-600 mb-4">{user.level} Student</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-teal-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-teal-700">{user.completedCourses}</div>
                    <div className="text-xs text-teal-600">Completed</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-purple-700">{user.currentCourses}</div>
                    <div className="text-xs text-purple-600">In Progress</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-teal-200">
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
            <div className="bg-gradient-to-br from-purple-500 to-rose-500 rounded-2xl p-6 text-white">
              <div className="text-center">
                <Moon className="w-8 h-8 mx-auto mb-3 text-purple-200" />
                <h3 className="font-bold mb-2">Daily Reminder</h3>
                <p className="text-sm text-purple-100 mb-3 font-arabic">
                  رَبِّ زِدْنِي عِلْمًا
                </p>
                <p className="text-xs text-purple-200">
                  "My Lord, increase me in knowledge" - Quran 20:114
                </p>
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