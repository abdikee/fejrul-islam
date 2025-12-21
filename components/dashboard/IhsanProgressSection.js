'use client';

import { useState, useEffect } from 'react';
import { 
  Sun, 
  BookOpen, 
  Moon, 
  Heart, 
  CheckCircle, 
  Circle,
  Clock,
  Target,
  Zap,
  Timer,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useRealtimeContext } from '@/components/realtime/RealtimeProvider';

export default function IhsanProgressSection({ user, colorScheme, examMode, setExamMode }) {
  const { emitHabitUpdate, isConnected } = useRealtimeContext();
  const [habits, setHabits] = useState({
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    morningAdhkar: false,
    eveningAdhkar: false
  });
  
  const [xpProgress, setXpProgress] = useState(65);
  const [studyTimer, setStudyTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Study timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && examMode) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, examMode]);

  // Load habits from API
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch('/api/habits');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setHabits(prev => ({ ...prev, ...data.habits }));
          }
        }
      } catch (error) {
        console.error('Error fetching habits:', error);
      }
    };

    fetchHabits();
  }, []);

  const toggleHabit = async (habitId) => {
    const newHabits = {
      ...habits,
      [habitId]: !habits[habitId]
    };
    
    setHabits(newHabits);
    
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habits: newHabits }),
      });

      if (response.ok && isConnected) {
        emitHabitUpdate(newHabits);
      }
    } catch (error) {
      console.error('Error updating habits:', error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const prayerHabits = [
    { id: 'fajr', name: 'Fajr', icon: Sun, time: '05:30' },
    { id: 'dhuhr', name: 'Dhuhr', icon: Sun, time: '12:15' },
    { id: 'asr', name: 'Asr', icon: Sun, time: '15:45' },
    { id: 'maghrib', name: 'Maghrib', icon: Moon, time: '18:20' },
    { id: 'isha', name: 'Isha', icon: Moon, time: '19:45' }
  ];

  const adhkarHabits = [
    { id: 'morningAdhkar', name: 'Morning Adhkar', icon: Sun },
    { id: 'eveningAdhkar', name: 'Evening Adhkar', icon: Moon }
  ];

  const completedPrayers = prayerHabits.filter(prayer => habits[prayer.id]).length;
  const completedAdhkar = adhkarHabits.filter(adhkar => habits[adhkar.id]).length;
  const totalCompleted = completedPrayers + completedAdhkar;
  const totalHabits = prayerHabits.length + adhkarHabits.length;
  const completionPercentage = Math.round((totalCompleted / totalHabits) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ihsan Progress & Daily Utility</h2>
          <p className="text-slate-600">Your daily spiritual practices and study tools</p>
        </div>

        {/* Exam Mode Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">Exam Mode</span>
          <button
            onClick={() => setExamMode(!examMode)}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
              examMode ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
              examMode ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
          {examMode && (
            <div className="flex items-center gap-1 text-amber-600">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-bold">Active</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit Tracker */}
        <div className={`lg:col-span-2 bg-white rounded-2xl shadow-lg border-2 ${colorScheme.cardBorder} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Target className={`w-6 h-6 ${colorScheme.iconColor}`} />
              Daily Spiritual Practices
            </h3>
            <div className="text-right">
              <div className={`text-2xl font-bold ${colorScheme.textPrimary}`}>
                {totalCompleted}/{totalHabits}
              </div>
              <div className="text-sm text-slate-600">{completionPercentage}% Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className={`h-3 bg-gradient-to-r ${colorScheme.primary === 'teal' ? 'from-teal-500 to-purple-500' : 'from-emerald-500 to-green-500'} rounded-full transition-all duration-500`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* 5 Daily Prayers */}
          <div className="mb-6">
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              Five Daily Prayers ({completedPrayers}/5)
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {prayerHabits.map(prayer => {
                const Icon = prayer.icon;
                const isCompleted = habits[prayer.id];
                
                return (
                  <button
                    key={prayer.id}
                    onClick={() => toggleHabit(prayer.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isCompleted
                        ? `${colorScheme.cardBorder} bg-gradient-to-br ${colorScheme.bgGradient}`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-center">
                      {isCompleted ? (
                        <CheckCircle className={`w-6 h-6 ${colorScheme.iconColor} mx-auto mb-1`} />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      )}
                      <div className={`text-xs font-medium ${isCompleted ? colorScheme.textPrimary : 'text-slate-600'}`}>
                        {prayer.name}
                      </div>
                      <div className="text-xs text-slate-500">{prayer.time}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Adhkar */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              Daily Adhkar ({completedAdhkar}/2)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {adhkarHabits.map(adhkar => {
                const Icon = adhkar.icon;
                const isCompleted = habits[adhkar.id];
                
                return (
                  <button
                    key={adhkar.id}
                    onClick={() => toggleHabit(adhkar.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCompleted
                        ? `${colorScheme.cardBorder} bg-gradient-to-br ${colorScheme.bgGradient}`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle className={`w-6 h-6 ${colorScheme.iconColor}`} />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-400" />
                      )}
                      <div className="text-left">
                        <div className={`font-medium ${isCompleted ? colorScheme.textPrimary : 'text-slate-800'}`}>
                          {adhkar.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {isCompleted ? 'Completed ✓' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* XP Progress & Study Timer */}
        <div className="space-y-6">
          {/* XP Progress */}
          <div className={`bg-white rounded-2xl shadow-lg border-2 ${colorScheme.cardBorder} p-6`}>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              XP Progress
            </h3>
            
            <div className="text-center mb-4">
              <div className={`text-3xl font-bold ${colorScheme.textPrimary} mb-1`}>
                Level {user.level?.includes('2') ? '2' : user.level?.includes('3') ? '3' : user.level?.includes('4') ? '4' : '1'}
              </div>
              <div className="text-sm text-slate-600">
                {user.level || 'Beginner'}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Progress to Next Level</span>
                <span className="text-sm font-bold text-slate-800">{xpProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className={`h-3 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500`}
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            <div className="text-center text-sm text-slate-600">
              Complete daily habits to earn XP and advance your level
            </div>
          </div>

          {/* Study Timer (Exam Mode) */}
          {examMode && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Study Timer
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-4xl font-mono font-bold text-amber-800 mb-2">
                  {formatTime(studyTimer)}
                </div>
                <div className="text-sm text-amber-600">
                  Focus time today
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isTimerRunning
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                
                <button
                  onClick={() => {
                    setStudyTimer(0);
                    setIsTimerRunning(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                <p className="text-sm text-amber-800 text-center">
                  May Allah grant you success in your studies. Stay focused and make du'a.
                </p>
              </div>
            </div>
          )}

          {/* Motivational Quote */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-800 mb-2">
                "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا"
              </p>
              <p className="text-sm text-slate-600 mb-3">
                "And whoever fears Allah, He will make for him a way out"
              </p>
              <p className="text-xs text-slate-500">Quran 65:2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}