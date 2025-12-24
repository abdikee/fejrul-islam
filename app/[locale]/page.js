'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  ArrowRight, BookOpen, Users, Heart, MessageSquare,
  Clock, Compass, CheckCircle, FileText
} from 'lucide-react';
import EnrollmentButton from '@/components/enrollment/EnrollmentButton';

export default function Home() {
  const t = useTranslations('Hero');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    peopleReached: 12847,
    activeDais: 45,
    dawahPrograms: 89,
    onlineNow: 267,
    guidanceSessions: 3421,
    communities: 8
  });
  const [activeFeature, setActiveFeature] = useState(0);

  // Helper function to get correct sector codes
  const getSectorCode = (sectorName) => {
    const sectorCodes = {
      'Qirat & Ilm': 'qirat-ilm',
      'Literature & History': 'literature-history',
      'Dawah & Comparative Religion': 'dawah-comparative-religion',
      'Tarbiya & Idad': 'tarbiya-idad',
      'Ziyara': 'ziyara'
    };
    return sectorCodes[sectorName] || sectorName.toLowerCase().replace(/\s+/g, '-').replace('&', '').replace(/[()]/g, '').replace('--', '-');
  };

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
      title: 'Dawah & Outreach Programs',
      description: 'Comprehensive Islamic outreach initiatives to spread the message of Islam with wisdom and beautiful preaching to communities.',
      icon: MessageSquare,
      color: 'emerald',
      stats: '12,847 People Reached'
    },
    {
      title: 'Irshad & Guidance Services',
      description: 'Connect with qualified Islamic scholars and counselors for spiritual guidance, religious questions, and life direction.',
      icon: Compass,
      color: 'blue',
      stats: '3,421 Guidance Sessions'
    },
    {
      title: 'Community Engagement',
      description: 'Building strong Muslim communities through events, workshops, and interfaith dialogue programs.',
      icon: Users,
      color: 'purple',
      stats: '8 Active Communities'
    },
    {
      title: 'Islamic Resources Hub',
      description: 'Access authentic Islamic materials, books, videos, and resources for personal development and dawah work.',
      icon: BookOpen,
      color: 'orange',
      stats: '89 Programs Available'
    }
  ];

  // The 5 main sectors of HUMSJ
  const sectors = [
    {
      name: 'Qirat & Ilm',
      description: 'Quranic Recitation & Islamic Knowledge',
      icon: BookOpen,
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      programs: 24,
      participants: 2847
    },
    {
      name: 'Literature & History',
      description: 'Islamic Heritage & Creative Expression',
      icon: FileText,
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      programs: 18,
      participants: 1234
    },
    {
      name: 'Dawah & Comparative Religion',
      description: 'Outreach, Dialogue & Intellectual Defense',
      icon: MessageSquare,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      programs: 22,
      participants: 1567
    },
    {
      name: 'Tarbiya & Idad',
      description: 'Character Building & Leadership Training',
      icon: Heart,
      color: 'bg-gradient-to-br from-rose-500 to-pink-600',
      programs: 16,
      participants: 987
    },
    {
      name: 'Ziyara',
      description: 'Student Welfare & Community Support',
      icon: Heart,
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      programs: 12,
      participants: 756
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950">
      {/* Islamic Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 islamic-gradient-dark text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="font-quran text-xl md:text-2xl text-white">
                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
              </p>
              <span className="hidden md:inline text-emerald-200 dark:text-emerald-300">•</span>
              <p className="hidden md:block text-sm opacity-90">In the name of Allah, the Most Gracious, the Most Merciful</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm bg-white/10 dark:bg-white/20 px-3 py-1 rounded-full">
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
              <div className="w-24 h-24">
                <img
                  src="/logo.svg"
                  alt="Fejrul Islam Logo"
                  className="w-full h-full object-contain logo-image"
                />
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('brandName')}</h2>
                <p className="text-xl text-slate-600 dark:text-slate-400">{t('brandSubtitle')}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{t('brandTagline')}</p>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-8 mb-12">
              <h1 className="text-6xl lg:text-8xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {t('headlinePart1')}
                <span className="block">
                  <span className="text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 dark:from-emerald-400 dark:via-teal-400 dark:to-blue-400 bg-clip-text">
                    {t('headlinePart2')}
                  </span>
                </span>
              </h1>
              
              <p className="text-2xl lg:text-3xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-5xl mx-auto">
                {t('subheadline')}
              </p>
            </div>

            {/* Live Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-12">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.peopleReached.toLocaleString()}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">People Reached</div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.activeDais}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Active Dais</div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.dawahPrograms}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Programs</div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.communities}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Communities</div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stats.guidanceSessions.toLocaleString()}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Guidance Sessions</div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.onlineNow}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Online Now</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-600 rounded-2xl font-bold text-xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <Heart className="w-7 h-7 group-hover:scale-110 transition-transform" />
                Join Dawah Mission
                <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sectors"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-2xl font-bold text-xl transition-all shadow-lg hover:shadow-xl"
              >
                <Compass className="w-7 h-7" />
                Explore Programs
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-8 py-4 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold text-lg transition-colors"
              >
                Already a member? Sign in
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Quranic Inspiration */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 rounded-3xl p-12 border-2 border-emerald-300/50 backdrop-blur-sm shadow-xl">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <div className="mb-4">
                  <div className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold shadow-lg">
                    سورة النحل ١٦:١٢٥ • Surah An-Nahl 16:125
                  </div>
                </div>
                <p className="quran-verse text-5xl md:text-6xl lg:text-7xl text-emerald-800">
                  ٱدۡعُ إِلَىٰ سَبِيلِ رَبِّكَ بِٱلۡحِكۡمَةِ وَٱلۡمَوۡعِظَةِ ٱلۡحَسَنَةِۖ
                </p>
                <div className="verse-divider text-emerald-400"></div>
                <p className="quran-translation text-xl md:text-2xl text-slate-700 dark:text-slate-300">
                  "Invite to the way of your Lord with wisdom and good instruction"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Our Dawah & Irshad Services
            </h2>
            <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
              Comprehensive Islamic outreach and guidance programs designed to spread the message of Islam and support the Muslim community.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                emerald: 'from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500',
                blue: 'from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500',
                purple: 'from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500',
                orange: 'from-orange-500 to-red-600 dark:from-orange-400 dark:to-red-500'
              };
              
              return (
                <div 
                  key={index} 
                  className="group cursor-pointer"
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`p-10 rounded-3xl transition-all duration-500 ${
                    activeFeature === index 
                      ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl -translate-y-2' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl'
                  }`}>
                    <div className="flex items-start gap-8 mb-8">
                      <div className={`w-20 h-20 bg-gradient-to-br ${colorClasses[feature.color]} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">{feature.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-4">{feature.description}</p>
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">{feature.stats}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Real-time Updates</span>
                      </div>
                      <ArrowRight className={`w-6 h-6 transition-all ${
                        activeFeature === index ? 'text-emerald-600 dark:text-emerald-400 translate-x-2' : 'text-slate-400 dark:text-slate-500'
                      }`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Five Main Sectors */}
      <section id="sectors-section" className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-emerald-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Our Five Sectors
            </h2>
            <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
              Fejrul Islam operates through five comprehensive sectors, each dedicated to a specific aspect of Islamic development and community service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              
              // Generate href for each sector
              const getHref = (sectorName) => {
                const slug = sectorName.toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace('&', '')
                  .replace(/[()]/g, '')
                  .replace('--', '-');
                return `/sectors/${slug}`;
              };
              
              return (
                <Link key={index} href={getHref(sector.name)} className="group block">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-2xl rounded-3xl p-8 hover:shadow-[0_20px_50px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 ${sector.color} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{sector.programs}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Programs</div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{sector.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">{sector.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>{sector.participants.toLocaleString()} participants</span>
                      </div>
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-semibold group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 transition-colors shadow-lg group-hover:shadow-xl">
                        Explore
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                    
                    {/* Enrollment Button */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                      <EnrollmentButton
                        programType="sector"
                        programId={getSectorCode(sector.name)}
                        programName={sector.name}
                        className="w-full border-2 border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                        variant="outline"
                      >
                        Enroll Now
                      </EnrollmentButton>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>



      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 islamic-gradient-dark text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl lg:text-7xl font-bold mb-8">
              Join the Dawah Mission
            </h2>
            <p className="text-2xl lg:text-3xl text-emerald-100 dark:text-emerald-200 mb-12 leading-relaxed">
              Be part of Fejrul Islam's mission to spread the beautiful message of Islam. 
              Together, we invite humanity to the path of guidance and mercy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-4 px-12 py-6 bg-white text-emerald-600 rounded-2xl font-bold text-2xl hover:bg-emerald-50 dark:hover:bg-slate-100 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                <Heart className="w-8 h-8" />
                Become a Dai
                <ArrowRight className="w-8 h-8" />
              </Link>
              <Link
                href="/sectors"
                className="inline-flex items-center gap-4 px-12 py-6 border-2 border-white text-white rounded-2xl font-bold text-2xl hover:bg-white hover:text-emerald-600 transition-all"
              >
                <MessageSquare className="w-8 h-8" />
                Learn More
              </Link>
            </div>

            <div className="bg-white/10 dark:bg-white/5 rounded-3xl p-12 backdrop-blur-sm border-2 border-white/30 dark:border-white/20 shadow-2xl">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <div className="mb-4">
                  <div className="inline-block px-6 py-2 bg-white/20 dark:bg-white/10 text-white rounded-full text-sm font-semibold shadow-lg">
                    سورة فصلت ٤١:٣٣ • Surah Fussilat 41:33
                  </div>
                </div>
                <p className="quran-verse text-5xl md:text-6xl lg:text-7xl text-white">
                  وَمَنۡ أَحۡسَنُ قَوۡلٗا مِّمَّن دَعَآ إِلَى ٱللَّهِ
                </p>
                <div className="verse-divider text-white/50"></div>
                <p className="quran-translation text-xl md:text-2xl text-emerald-50 dark:text-emerald-100">
                  "And who is better in speech than one who invites to Allah"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}