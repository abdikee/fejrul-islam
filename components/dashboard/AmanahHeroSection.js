'use client';

import { useState, useEffect } from 'react';
import { Star, BookOpen, Play, Award, ChevronRight } from 'lucide-react';
import IslamicPattern from '@/components/ui/IslamicPattern';

export default function AmanahHeroSection({ user, colorScheme, examMode }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get Islamic greeting based on time
  const getIslamicGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'صباح الخير'; // Good morning
    if (hour < 18) return 'مساء الخير'; // Good afternoon
    return 'مساء النور'; // Good evening
  };

  // Get level information
  const getLevelInfo = (level) => {
    const levels = {
      'Level 1: Seeker': { name: 'Beginner', color: 'bg-blue-500', progress: 25 },
      'Level 2: Learner': { name: 'Intermediate', color: 'bg-purple-500', progress: 50 },
      'Level 3: Scholar': { name: 'Advanced', color: 'bg-amber-500', progress: 75 },
      'Level 4: Leader': { name: 'Leadership', color: 'bg-emerald-500', progress: 100 }
    };
    return levels[level] || levels['Level 1: Seeker'];
  };

  const levelInfo = getLevelInfo(user.level);
  const genderTitle = user.gender === 'female' ? 'Sister' : 'Brother';
  const wingTitle = user.gender === 'female' ? 'Sisters' : 'Brothers';

  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <IslamicPattern />
      </div>

      {/* Hero Content */}
      <div className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 ${colorScheme.cardBorder} p-8 lg:p-12`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Left: Greeting & Identity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Islamic Greeting */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${colorScheme.buttonPrimary} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    السلام عليكم، {genderTitle} {user.firstName}
                  </p>
                  <p className={`text-lg ${colorScheme.textPrimary} font-semibold`}>
                    {getIslamicGreeting()} — Welcome to the {wingTitle} Wing
                  </p>
                </div>
              </div>
              
              {/* Subtitle */}
              <p className="text-slate-600 text-lg">
                May Allah bless your journey of knowledge and character development
              </p>
            </div>

            {/* Level Badge & Progress */}
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 ${levelInfo.color} text-white rounded-full flex items-center gap-2`}>
                <Award className="w-5 h-5" />
                <span className="font-bold">{levelInfo.name}</span>
              </div>
              
              <div className="flex-1 max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600">Progress to Next Level</span>
                  <span className="text-sm font-bold text-slate-800">{levelInfo.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 ${levelInfo.color} rounded-full transition-all duration-500`}
                    style={{ width: `${levelInfo.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            {!examMode && (
              <div className="flex items-center gap-4">
                <button className={`${colorScheme.buttonPrimary} text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all`}>
                  <Play className="w-5 h-5" />
                  Continue Learning
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <div className="text-sm text-slate-600">
                  <p className="font-medium">Last studied:</p>
                  <p>Surah Al-Baqarah, Verse 255</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Stats & Quick Info */}
          <div className="space-y-4">
            {/* Today's Stats */}
            <div className={`bg-gradient-to-br ${colorScheme.bgGradient} p-6 rounded-xl border ${colorScheme.cardBorder}`}>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Star className={`w-5 h-5 ${colorScheme.iconColor}`} />
                Today's Progress
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${colorScheme.textPrimary}`}>4/5</div>
                  <div className="text-xs text-slate-600">Daily Salah</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${colorScheme.textPrimary}`}>15m</div>
                  <div className="text-xs text-slate-600">Quran Reading</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${colorScheme.textPrimary}`}>3/4</div>
                  <div className="text-xs text-slate-600">Habits Done</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${colorScheme.textPrimary}`}>85%</div>
                  <div className="text-xs text-slate-600">Week Progress</div>
                </div>
              </div>
            </div>

            {/* Current Time & Next Prayer */}
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-800">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-sm text-slate-600">
                  Next: Maghrib in 2h 15m
                </div>
              </div>
            </div>

            {/* Islamic Quote */}
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200 text-center">
              <p className="text-sm font-semibold text-slate-800 mb-1">
                "وَقُل رَّبِّ زِدْنِي عِلْمًا"
              </p>
              <p className="text-xs text-slate-600">
                "And say: My Lord, increase me in knowledge" - Quran 20:114
              </p>
            </div>
          </div>
        </div>

        {/* Exam Mode Indicator */}
        {examMode && (
          <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
              <span className="font-bold text-amber-800">Exam Mode Active</span>
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
            </div>
            <p className="text-center text-sm text-amber-700 mt-2">
              Distractions minimized. Focus on your studies. May Allah grant you success.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}