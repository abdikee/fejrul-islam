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
  Lock
} from 'lucide-react';
import AnnouncementsBoard from '@/components/announcements/AnnouncementsBoard';
import PrivacyNotification from '@/components/ui/PrivacyNotification';
import IslamicPattern from '@/components/ui/IslamicPattern';

export default function EnhancedHomePage() {
  const [user, setUser] = useState(null);
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
          // Mock user for demo if not authenticated
          setUser({
            id: 1,
            firstName: 'Ahmed',
            lastName: 'Hassan',
            gender: 'male',
            level: 'Level 2: Learner',
            role: 'student',
            progress: { dawah: 60, irshad: 80, tarbiya: 40, idad: 20 },
            lastActive: { sector: 'Qirat & Ilm', content: 'Surah Al-Baqarah, Verse 156' }
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
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
      content: user?.lastActive?.content || 'Continue from Surah Al-Baqarah'
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

  const toggleHabit = (habitId) => {
    setDailyHabits(prev => ({
      ...prev,
      [habitId]: !prev[habitId]
    }));
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
    <div className={`min-h-screen ${examMode ? 'bg-slate-100' : 'bg-slate-50'}`}>
      {/* Amanah Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          {/* Islamic Geometric Pattern Overlay */}
          <IslamicPattern className="text-white" opacity={0.15} />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/images/humsj-logo.svg"
              alt="HUMSJ Logo"
              width={80}
              height={80}
              className="mx-auto drop-shadow-lg"
            />
          </div>

          {/* Dynamic Greeting */}
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            السلام عليكم، {user.gender === 'male' ? 'Brother' : 'Sister'} {user.firstName}
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-slate-200">
            Welcome to the {user.gender === 'male' ? 'Brothers' : 'Sisters'} Wing
          </p>

          {/* Level Badge */}
          <div className={`inline-flex items-center gap-3 px-6 py-3 bg-${theme.primary} rounded-full mb-8 shadow-lg`}>
            <Trophy className="w-6 h-6" />
            <span className="text-lg font-bold">{user.level}</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(getXPProgress() / 20) ? 'text-yellow-400 fill-current' : 'text-slate-400'}`} 
                />
              ))}
            </div>
          </div>

          {/* Quick Action */}
          <Link 
            href="/dashboard"
            className={`inline-flex items-center gap-3 px-8 py-4 bg-white text-${theme.primary} font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-lg text-lg`}
          >
            <Play className="w-6 h-6" />
            Continue Learning
            <ArrowRight className="w-6 h-6" />
          </Link>

          <p className="mt-4 text-slate-300">
            Last active: {user.lastActive?.content}
          </p>
        </div>
      </section>

      {/* Exam Mode Toggle */}
      {!examMode && (
        <div className="container mx-auto px-6 -mt-8 relative z-20">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
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
        </div>
      )}

      {/* Exam Mode Interface */}
      {examMode && (
        <div className="container mx-auto px-6 py-8">
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
      )}

      {!examMode && (
        <>
          {/* Dynamic Announcement Board */}
          <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-bold text-slate-800">Jeme'a Updates</h2>
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
            </div>
          </section>

          {/* 5-Sector Navigation Grid */}
          <section className="py-12 bg-slate-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-4">
                Da'ewa & Irshad Ecosystem
              </h2>
              <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
                Five integrated pillars for comprehensive Islamic development
              </p>
              
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
                              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
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
            </div>
          </section>

          {/* Ihsan Progress & Daily Utility */}
          <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">
                Daily Ihsan Tracker
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Habit Tracker */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                  <h3 className="text-xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
                    <Sun className="w-6 h-6" />
                    Daily Spiritual Habits
                  </h3>
                  
                  <div className="space-y-4">
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
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-400" />
                          )}
                          <Icon className={`w-5 h-5 ${isCompleted ? 'text-emerald-600' : 'text-slate-500'}`} />
                          <span className={`font-medium ${isCompleted ? 'text-emerald-800 line-through' : 'text-slate-700'}`}>
                            {habit.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* XP Progress */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-xl font-bold text-purple-800 mb-6 flex items-center gap-2">
                    <Trophy className="w-6 h-6" />
                    Learning Progress
                  </h3>
                  
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {getXPProgress()}%
                    </div>
                    <p className="text-purple-700">Overall Completion</p>
                  </div>
                  
                  <div className="w-full bg-white rounded-full h-4 mb-6 border border-purple-200">
                    <div 
                      className="h-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000"
                      style={{ width: `${getXPProgress()}%` }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600">
                        {Object.values(dailyHabits).filter(Boolean).length}
                      </div>
                      <div className="text-sm text-purple-700">Today's Habits</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.floor(getXPProgress() / 20)}
                      </div>
                      <div className="text-sm text-purple-700">Level Stars</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Identity Section (History Teaser) */}
          <section className="py-12 bg-slate-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">
                Our Islamic Heritage
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Timeline Snippet */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-amber-600" />
                    HUMSJ Timeline
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { year: '1995', event: 'Foundation of HUMSJ Islamic Society' },
                      { year: '2000', event: 'First Dawah Conference held' },
                      { year: '2010', event: 'Digital Learning Platform launched' },
                      { year: '2020', event: 'Comprehensive Tarbiya Program established' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm">
                          {item.year.slice(-2)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">{item.year}</div>
                          <div className="text-sm text-slate-600">{item.event}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Link 
                    href="/sectors/literature"
                    className="mt-6 flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    <Eye className="w-4 h-4" />
                    Explore Full History
                  </Link>
                </div>

                {/* Student Spotlight */}
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
                  <h3 className="text-xl font-bold text-rose-800 mb-4 flex items-center gap-2">
                    <Bookmark className="w-6 h-6" />
                    Student Spotlight
                  </h3>
                  
                  <div className="bg-white p-4 rounded-lg border border-rose-200 mb-4">
                    <h4 className="font-bold text-rose-800 mb-2">Poem of the Week</h4>
                    <div className="text-sm text-slate-700 italic leading-relaxed">
                      "In the garden of knowledge, we plant our seeds,<br/>
                      With Quran and Sunnah, fulfilling our needs.<br/>
                      Brothers and sisters, united we stand,<br/>
                      Building tomorrow with Allah's guiding hand."
                    </div>
                    <div className="text-xs text-rose-600 mt-2">
                      - Fatima Al-Zahra, Literature Sector
                    </div>
                  </div>
                  
                  <Link 
                    href="/sectors/literature"
                    className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    <BookOpen className="w-4 h-4" />
                    Submit Your Work
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className={`py-16 bg-gradient-to-r ${theme.gradient} text-white`}>
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Continue Your Islamic Journey
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Join thousands of students in comprehensive Islamic education and character development
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href="/dashboard" 
                  className="px-8 py-4 bg-white text-emerald-700 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-lg"
                >
                  Access Dashboard
                </Link>
                <Link 
                  href="/sectors/qirat-ilm" 
                  className="px-8 py-4 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-900 transition-colors shadow-lg border-2 border-white"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Privacy Notification System */}
      <PrivacyNotification user={user} />
    </div>
  );
}