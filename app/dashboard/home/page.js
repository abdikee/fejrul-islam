'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Users, 
  Heart, 
  MessageCircle, 
  Shield, 
  ArrowRight,
  Clock,
  Bell,
  Star,
  Trophy,
  Play,
  Download,
  Search,
  Settings,
  CheckCircle,
  Circle,
  Sun,
  Moon,
  Timer,
  Calendar,
  Bookmark,
  Eye,
  Lock,
  Menu,
  LogOut
} from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import PrivacyNotification from '@/components/ui/PrivacyNotification';
import IslamicPattern from '@/components/ui/IslamicPattern';

export default function DashboardHomePage() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dailyHabits, setDailyHabits] = useState({
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    morningAdhkar: false,
    eveningAdhkar: false
  });
  const [examMode, setExamMode] = useState(false);
  const [studyTimer, setStudyTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/dashboard/user');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          }
        } else {
          // Redirect to login if not authenticated
          window.location.href = '/auth/login';
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        window.location.href = '/auth/login';
      }
    };

    fetchUserData();

    // Study timer
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Fetch habits
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch('/api/habits');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Map database habits to dashboard habits
            setDailyHabits(prev => ({
              ...prev,
              morningAdhkar: data.habits.morningAdhkar,
              eveningAdhkar: data.habits.eveningAdhkar
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching habits:', error);
      }
    };

    if (user) {
      fetchHabits();
    }
  }, [user]);

  // Gender-based theming
  const getTheme = () => {
    if (!user) return 'emerald';
    return user.gender === 'female' ? 'teal' : 'emerald';
  };

  const themeColors = {
    emerald: {
      primary: 'emerald-600',
      secondary: 'emerald-50',
      accent: 'emerald-500',
      gradient: 'from-emerald-600 to-emerald-800'
    },
    teal: {
      primary: 'teal-600',
      secondary: 'purple-50',
      accent: 'teal-500',
      gradient: 'from-teal-600 to-purple-600'
    }
  };

  const theme = themeColors[getTheme()];

  const sectors = [
    {
      id: 'qirat-ilm',
      title: 'Qirat & Ilm',
      description: 'Current Quran/Kitab progress',
      icon: BookOpen,
      progress: user?.progress?.irshad || 0,
      action: 'Register for New Course',
      href: '/sectors/qirat-ilm',
      content: 'Continue from Surah Al-Baqarah, Verse 156'
    },
    {
      id: 'literature',
      title: 'Literature & History',
      description: 'Latest Jeme\'a History blog post',
      icon: Users,
      action: 'Explore History',
      href: '/sectors/literature',
      content: 'The Golden Era of HUMSJ (1995-2000)'
    },
    {
      id: 'terbiyetu-duat',
      title: 'Terbiyetu Du\'at',
      description: 'Weekly training materials',
      icon: Heart,
      action: 'Download PDF',
      href: '/sectors/tarbiya-idad',
      content: 'Week 5: Tazkiyat al-Nafs - Purification of the Heart'
    },
    {
      id: 'comparative',
      title: 'Comparative Religion',
      description: 'Book of the week from library',
      icon: MessageCircle,
      action: 'Search Library',
      href: '/sectors/comparative-religion',
      content: 'The Bible, The Quran and Science - Maurice Bucaille'
    },
    {
      id: 'ziyara',
      title: 'Ziyara Leadership',
      description: 'Departmental health statistics',
      icon: Shield,
      action: 'Manage Welfare',
      href: '/sectors/ziyara-enhanced',
      content: 'CS: 85% | Med: 92% | Eng: 78%',
      restricted: true,
      requiredLevel: 3
    }
  ];

  const announcements = [
    {
      id: 1,
      category: 'Academic',
      title: 'Midterm Examinations Schedule Released',
      content: 'Check your department portal for detailed exam timetables.',
      timestamp: '2 hours ago',
      priority: 'high',
      color: 'blue'
    },
    {
      id: 2,
      category: 'Spiritual',
      title: 'Special Ziyara Session - Mental Health Support',
      content: 'Confidential counseling available for all students.',
      timestamp: '5 hours ago',
      priority: 'normal',
      color: 'purple'
    },
    {
      id: 3,
      category: 'Community',
      title: 'HUMSJ History Documentation Project',
      content: 'Contribute your memories and photos to our digital archive.',
      timestamp: '1 day ago',
      priority: 'normal',
      color: 'emerald'
    }
  ];

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getXPProgress = () => {
    if (!user?.progress) return 0;
    const totalProgress = Object.values(user.progress).reduce((sum, val) => sum + val, 0);
    return Math.round(totalProgress / 4);
  };

  const toggleHabit = async (habitId) => {
    const newHabits = {
      ...dailyHabits,
      [habitId]: !dailyHabits[habitId]
    };
    
    setDailyHabits(newHabits);
    
    // Update in database for Tarbiya habits
    if (['morningAdhkar', 'eveningAdhkar'].includes(habitId)) {
      try {
        await fetch('/api/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ habits: { morningAdhkar: newHabits.morningAdhkar, eveningAdhkar: newHabits.eveningAdhkar } }),
        });
      } catch (error) {
        console.error('Error updating habits:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your Islamic learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <DashboardSidebar 
        user={user} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Home</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-slate-600 hover:text-emerald-600 font-medium"
                >
                  Full Dashboard
                </Link>
                <button className="p-2 text-slate-600 hover:text-red-600 rounded-lg transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {examMode ? (
            /* Exam Mode Interface */
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Focus Mode Active</h2>
                  <button
                    onClick={() => {
                      setExamMode(false);
                      setIsTimerRunning(false);
                      setStudyTimer(0);
                    }}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Exit Focus Mode
                  </button>
                </div>
                
                <div className="text-6xl font-mono font-bold text-slate-800 mb-6">
                  {formatTime(studyTimer)}
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`px-6 py-3 ${isTimerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white font-bold rounded-lg transition-colors`}
                  >
                    {isTimerRunning ? 'Pause' : 'Start'} Study Session
                  </button>
                  <button
                    onClick={() => {
                      setStudyTimer(0);
                      setIsTimerRunning(false);
                    }}
                    className="px-6 py-3 bg-slate-500 text-white font-bold rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Reset Timer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Amanah Hero Section */}
              <section className="relative rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 z-0">
                  <div className={`w-full h-full bg-gradient-to-br ${theme.gradient}`}></div>
                  <IslamicPattern className="text-white" opacity={0.15} />
                </div>
                
                <div className="relative z-10 p-8 text-center text-white">
                  <div className="mb-6">
                    <Image
                      src="/images/humsj-logo.svg"
                      alt="HUMSJ Logo"
                      width={60}
                      height={60}
                      className="mx-auto drop-shadow-lg"
                    />
                  </div>

                  <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                    السلام عليكم، {user.gender === 'male' ? 'Brother' : 'Sister'} {user.firstName}
                  </h1>
                  <p className="text-lg md:text-xl mb-6 opacity-90">
                    Welcome to the {user.gender === 'male' ? 'Brothers' : 'Sisters'} Wing
                  </p>

                  <div className={`inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6`}>
                    <Trophy className="w-5 h-5" />
                    <span className="font-bold">{user.level}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(getXPProgress() / 20) ? 'text-yellow-400 fill-current' : 'text-white/50'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <Link 
                    href="/dashboard"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-lg"
                  >
                    <Play className="w-5 h-5" />
                    Continue Learning
                  </Link>
                </div>
              </section>

              {/* Exam Mode Toggle */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-full">
                      <Timer className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Exam Mode</h3>
                      <p className="text-sm text-slate-600">Focus mode with study timer and minimal distractions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setExamMode(true)}
                    className="px-6 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Activate Focus Mode
                  </button>
                </div>
              </div>

              {/* Dynamic Announcement Board */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-slate-800">Jeme'a Updates</h2>
                  <Bell className={`w-6 h-6 text-${theme.primary}`} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className={`bg-${announcement.color}-50 border-l-4 border-${announcement.color}-500 p-6 rounded-lg hover:shadow-md transition-shadow`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 bg-${announcement.color}-100 text-${announcement.color}-700 text-xs font-semibold rounded-full`}>
                          {announcement.category}
                        </span>
                        <span className="text-xs text-slate-500">{announcement.timestamp}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 mb-2">{announcement.title}</h3>
                      <p className="text-sm text-slate-600 mb-4">{announcement.content}</p>
                      <button className={`text-${announcement.color}-600 hover:text-${announcement.color}-700 font-semibold text-sm flex items-center gap-1`}>
                        Read More <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Five-Sector Navigation Grid */}
              <section>
                <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6">
                  Da'ewa & Irshad Ecosystem
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sectors.map((sector) => {
                    const Icon = sector.icon;
                    const isRestricted = sector.restricted && parseInt(user.level.split(' ')[1]) < sector.requiredLevel;
                    
                    return (
                      <div 
                        key={sector.id}
                        className={`group relative ${isRestricted ? 'opacity-60' : ''}`}
                      >
                        <div className="h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200">
                          <div className={`h-2 bg-gradient-to-r ${theme.gradient}`}></div>
                          
                          <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <div className={`p-3 rounded-lg bg-gradient-to-br ${theme.gradient} text-white`}>
                                <Icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">
                                  {sector.title}
                                </h3>
                                <p className="text-sm text-slate-600 mb-3">
                                  {sector.description}
                                </p>
                              </div>
                              {isRestricted && <Lock className="w-5 h-5 text-slate-400" />}
                            </div>
                            
                            {sector.progress !== undefined && (
                              <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-slate-600">Progress</span>
                                  <span className="font-semibold text-slate-800">{sector.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-500`}
                                    style={{ width: `${sector.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            
                            <div className="bg-slate-50 rounded-lg p-3 mb-4">
                              <p className="text-sm text-slate-700 font-medium">
                                {sector.content}
                              </p>
                            </div>
                            
                            {!isRestricted ? (
                              <Link 
                                href={sector.href}
                                className={`flex items-center justify-center gap-2 w-full py-3 bg-${theme.primary} text-white font-semibold rounded-lg hover:bg-${theme.accent} transition-colors`}
                              >
                                {sector.action}
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            ) : (
                              <div className="text-center py-3 bg-slate-200 text-slate-500 font-semibold rounded-lg">
                                Requires Level {sector.requiredLevel}+
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Ihsan Progress & Daily Utility */}
              <section>
                <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6">
                  Daily Ihsan Tracker
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Habit Tracker */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                    <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                      <Sun className="w-5 h-5" />
                      Daily Spiritual Habits
                    </h3>
                    
                    <div className="space-y-3">
                      {[
                        { id: 'fajr', name: 'Fajr Prayer', icon: Sun },
                        { id: 'dhuhr', name: 'Dhuhr Prayer', icon: Sun },
                        { id: 'asr', name: 'Asr Prayer', icon: Sun },
                        { id: 'maghrib', name: 'Maghrib Prayer', icon: Moon },
                        { id: 'isha', name: 'Isha Prayer', icon: Moon },
                        { id: 'morningAdhkar', name: 'Morning Adhkar', icon: BookOpen },
                        { id: 'eveningAdhkar', name: 'Evening Adhkar', icon: BookOpen }
                      ].map((habit) => {
                        const Icon = habit.icon;
                        const isCompleted = dailyHabits[habit.id];
                        
                        return (
                          <div
                            key={habit.id}
                            onClick={() => toggleHabit(habit.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                              isCompleted 
                                ? 'bg-emerald-100 border border-emerald-300' 
                                : 'bg-white border border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400" />
                            )}
                            <Icon className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : 'text-slate-500'}`} />
                            <span className={`font-medium text-sm ${isCompleted ? 'text-emerald-800 line-through' : 'text-slate-700'}`}>
                              {habit.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* XP Progress */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Learning Progress
                    </h3>
                    
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {getXPProgress()}%
                      </div>
                      <p className="text-purple-700 text-sm">Overall Completion</p>
                    </div>
                    
                    <div className="w-full bg-white rounded-full h-3 mb-4 border border-purple-200">
                      <div 
                        className="h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: `${getXPProgress()}%` }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white p-3 rounded-lg border border-purple-200">
                        <div className="text-xl font-bold text-purple-600">
                          {Object.values(dailyHabits).filter(Boolean).length}
                        </div>
                        <div className="text-xs text-purple-700">Today's Habits</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-purple-200">
                        <div className="text-xl font-bold text-purple-600">
                          {Math.floor(getXPProgress() / 20)}
                        </div>
                        <div className="text-xs text-purple-700">Level Stars</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Privacy Notification System */}
      <PrivacyNotification user={user} />
    </div>
  );
}