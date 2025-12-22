'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight, BookOpen, Users, Shield, Heart, Star, Globe, MessageSquare,
  BarChart3, Clock, GraduationCap, Compass, Play, CheckCircle, Rocket,
  FileText, PenTool, Lock, Zap, Trophy, Calendar, Lightbulb, Award,
  Target, Eye, TrendingUp, Bell, Activity, Download, Settings
} from 'lucide-react';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalStudents: 3247,
    activeMentors: 89,
    totalCourses: 178,
    onlineNow: 267,
    completedLessons: 6842,
    sectors: 5
  });
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const statsTimer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        onlineNow: Math.floor(Math.random() * 50) + 220
      }));
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(statsTimer);
    };
  }, []);

  const features = [
    {
      title: 'Smart Learning Dashboards',
      description: 'Gender-specific student portals with AI-powered personalized learning paths and real-time progress tracking.',
      icon: GraduationCap,
      color: 'emerald',
      stats: '2,847 Active Students'
    },
    {
      title: 'Expert Mentor System',
      description: 'Connect with qualified Islamic scholars and mentors for personalized guidance and spiritual development.',
      icon: Users,
      color: 'blue',
      stats: '89 Certified Mentors'
    },
    {
      title: 'Comprehensive Admin Control',
      description: 'Advanced administrative dashboard with real-time analytics, user management, and security monitoring.',
      icon: Shield,
      color: 'purple',
      stats: 'Complete Platform Control'
    },
    {
      title: 'Islamic Learning Sectors',
      description: 'Five specialized learning areas covering Tarbiya, Qirat, Literature, Comparative Religion, and Ziyara.',
      icon: BookOpen,
      color: 'orange',
      stats: '178 Courses Available'
    }
  ];

  const sectors = [
    {
      name: 'Tarbiya & Idad',
      description: 'Character Development & Leadership',
      icon: Heart,
      color: 'bg-gradient-to-br from-red-500 to-pink-600',
      courses: 45,
      students: 1234
    },
    {
      name: 'Qirat & Ilm',
      description: 'Quranic Sciences & Knowledge',
      icon: Star,
      color: 'bg-gradient-to-br from-yellow-500 to-orange-600',
      courses: 38,
      students: 987
    },
    {
      name: 'Literature',
      description: 'Islamic Heritage & Expression',
      icon: PenTool,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      courses: 32,
      students: 756
    },
    {
      name: 'Comparative Religion',
      description: 'Interfaith Dialogue & Dawah',
      icon: Globe,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      courses: 28,
      students: 543
    },
    {
      name: 'Ziyara (Welfare)',
      description: 'Community Care & Support',
      icon: MessageSquare,
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      courses: 35,
      students: 892
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Islamic Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-lg font-arabic">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
              <span className="hidden md:inline text-emerald-200">•</span>
              <p className="hidden md:block text-sm opacity-90">In the name of Allah, the Most Gracious, the Most Merciful</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{stats.onlineNow} online</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-teal-600/5 to-blue-600/5"></div>
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-6">
          <div className="text-center max-w-6xl mx-auto">
            {/* Brand Identity */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-bold text-slate-800">Fejrul Islam HUMSJ</h2>
                <p className="text-xl text-slate-600">Haramaya University Muslim Students Jem'a</p>
                <p className="text-sm text-emerald-600 font-medium">Excellence in Islamic Education</p>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-8 mb-12">
              <h1 className="text-6xl lg:text-8xl font-bold text-slate-900 leading-tight">
                Transform Your
                <span className="block">
                  <span className="text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text">
                    Islamic Journey
                  </span>
                </span>
              </h1>
              
              <p className="text-2xl lg:text-3xl text-slate-600 leading-relaxed max-w-5xl mx-auto">
                Join the most comprehensive Islamic learning platform designed for modern Muslim students. 
                Experience personalized education, expert mentorship, and community growth.
              </p>
            </div>

            {/* Live Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-emerald-600">{stats.totalStudents.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Students</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-blue-600">{stats.activeMentors}</div>
                <div className="text-sm text-slate-600">Mentors</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-purple-600">{stats.totalCourses}</div>
                <div className="text-sm text-slate-600">Courses</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-orange-600">{stats.sectors}</div>
                <div className="text-sm text-slate-600">Sectors</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-teal-600">{stats.completedLessons.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Lessons</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-green-600">{stats.onlineNow}</div>
                <div className="text-sm text-slate-600">Online Now</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <Rocket className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                Start Learning Today
                <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sectors"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-700 rounded-2xl font-bold text-xl border-2 border-slate-200 hover:border-emerald-300 hover:text-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Compass className="w-7 h-7" />
                Explore Sectors
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-8 py-4 text-slate-600 hover:text-emerald-600 font-semibold text-lg transition-colors"
              >
                Already a member? Sign in
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Quranic Inspiration */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 rounded-3xl p-10 border border-emerald-200/50 backdrop-blur-sm">
              <p className="text-4xl font-arabic text-emerald-700 mb-4">وَقُل رَّبِّ زِدْنِي عِلْمًا</p>
              <p className="text-slate-600 italic text-xl">"And say: My Lord, increase me in knowledge" - Quran 20:114</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto">
              Experience the future of Islamic education with cutting-edge technology and authentic Islamic values.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                emerald: 'from-emerald-500 to-teal-600',
                blue: 'from-blue-500 to-indigo-600',
                purple: 'from-purple-500 to-pink-600',
                orange: 'from-orange-500 to-red-600'
              };
              
              return (
                <div 
                  key={index} 
                  className="group cursor-pointer"
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`p-10 rounded-3xl transition-all duration-500 ${
                    activeFeature === index 
                      ? 'bg-gradient-to-br from-white to-slate-50 shadow-2xl -translate-y-2' 
                      : 'bg-gradient-to-br from-slate-50 to-white shadow-lg hover:shadow-xl'
                  }`}>
                    <div className="flex items-start gap-8 mb-8">
                      <div className={`w-20 h-20 bg-gradient-to-br ${colorClasses[feature.color]} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                        <p className="text-slate-600 text-lg leading-relaxed mb-4">{feature.description}</p>
                        <div className="text-emerald-600 font-semibold text-lg">{feature.stats}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                        <span className="text-slate-700 font-medium">Real-time Updates</span>
                      </div>
                      <ArrowRight className={`w-6 h-6 transition-all ${
                        activeFeature === index ? 'text-emerald-600 translate-x-2' : 'text-slate-400'
                      }`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Islamic Learning Sectors */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Five Learning Sectors
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto">
              Comprehensive Islamic education organized into specialized learning areas for holistic development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              
              // Define which sectors should go to general sectors page vs specific pages
              const getHref = (sectorName) => {
                if (sectorName === 'Tarbiya & Idad' || sectorName === 'Ziyara (Welfare)' || sectorName === 'Qirat & Ilm') {
                  return '/sectors';
                }
                return `/sectors/${sectorName.toLowerCase().replace(/\s+/g, '-').replace('&', '').replace(/[()]/g, '')}`;
              };
              
              return (
                <div key={index} className="group">
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 ${sector.color} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{sector.courses}</div>
                        <div className="text-sm text-slate-600">Courses</div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{sector.name}</h3>
                    <p className="text-slate-600 mb-6">{sector.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="w-4 h-4" />
                        <span>{sector.students.toLocaleString()} students</span>
                      </div>
                      <Link
                        href={getHref(sector.name)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
                      >
                        Explore
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl lg:text-7xl font-bold mb-8">
              Begin Your Journey
            </h2>
            <p className="text-2xl lg:text-3xl text-emerald-100 mb-12 leading-relaxed">
              Join thousands of students on the path of Islamic knowledge and spiritual growth. 
              Your transformation starts today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-4 px-12 py-6 bg-white text-emerald-600 rounded-2xl font-bold text-2xl hover:bg-emerald-50 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                <Rocket className="w-8 h-8" />
                Create Account
                <ArrowRight className="w-8 h-8" />
              </Link>
              <Link
                href="/sectors"
                className="inline-flex items-center gap-4 px-12 py-6 border-2 border-white text-white rounded-2xl font-bold text-2xl hover:bg-white hover:text-emerald-600 transition-all"
              >
                <Play className="w-8 h-8" />
                Watch Demo
              </Link>
            </div>

            <div className="bg-white/10 rounded-3xl p-10 backdrop-blur-sm border border-white/20">
              <p className="text-4xl font-arabic text-emerald-200 mb-4">وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا</p>
              <p className="text-emerald-100 italic text-2xl">"And whoever fears Allah - He will make for him a way out" - Quran 65:2</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}