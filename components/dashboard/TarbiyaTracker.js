'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Sun, BookOpen, Moon, Heart, RotateCcw } from 'lucide-react';
import { useRealtimeContext } from '@/components/realtime/RealtimeProvider';

const TarbiyaTracker = ({ habits: initialHabits, userId }) => {
  const { emitHabitUpdate, isConnected } = useRealtimeContext();
  const [dailyHabits, setDailyHabits] = useState(initialHabits || {
    morningAdhkar: false,
    quranReading: false,
    eveningAdhkar: false,
    sadaqah: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Listen for real-time habit updates
  useEffect(() => {
    const handleHabitUpdate = (event) => {
      const updatedHabits = event.detail;
      setDailyHabits(updatedHabits);
    };

    window.addEventListener('habit-updated', handleHabitUpdate);
    return () => window.removeEventListener('habit-updated', handleHabitUpdate);
  }, []);

  // Fetch habits on component mount
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch('/api/habits');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setDailyHabits(data.habits);
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
      ...dailyHabits,
      [habitId]: !dailyHabits[habitId]
    };
    
    setDailyHabits(newHabits);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ habits: newHabits }),
      });

      if (!response.ok) {
        // Revert on error
        setDailyHabits(dailyHabits);
        throw new Error('Failed to update habits');
      }

      const data = await response.json();
      if (data.success) {
        setDailyHabits(data.habits);
        
        // Emit real-time update
        if (isConnected) {
          emitHabitUpdate(data.habits);
        }
      }
    } catch (error) {
      console.error('Error updating habits:', error);
      // Revert on error
      setDailyHabits(dailyHabits);
    } finally {
      setIsLoading(false);
    }
  };

  const resetHabits = async () => {
    const resetHabitsData = {
      morningAdhkar: false,
      quranReading: false,
      eveningAdhkar: false,
      sadaqah: false
    };
    
    setDailyHabits(resetHabitsData);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ habits: resetHabitsData }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDailyHabits(data.habits);
          
          // Emit real-time update
          if (isConnected) {
            emitHabitUpdate(data.habits);
          }
        }
      }
    } catch (error) {
      console.error('Error resetting habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const habitItems = [
    {
      id: 'morningAdhkar',
      name: 'Morning Adhkar',
      icon: Sun,
      description: 'Recite morning remembrance of Allah',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      id: 'quranReading',
      name: '15 Minutes of Quran Reading',
      icon: BookOpen,
      description: 'Daily Quran recitation and reflection',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      id: 'eveningAdhkar',
      name: 'Evening Adhkar',
      icon: Moon,
      description: 'Recite evening remembrance of Allah',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      id: 'sadaqah',
      name: 'One Act of Kindness (Sadaqah)',
      icon: Heart,
      description: 'Perform a charitable act or good deed',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200'
    }
  ];

  const completedCount = Object.values(dailyHabits).filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / habitItems.length) * 100);

  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-600" />
          Tarbiya Habit Tracker
          {/* Real-time connection indicator */}
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
               title={isConnected ? 'Real-time updates active' : 'Offline mode'} />
        </h3>
        <button
          onClick={resetHabits}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Reset all habits"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Overview */}
      <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-emerald-800 font-semibold">Today's Progress</span>
          <span className="text-2xl font-bold text-emerald-600">
            {completedCount}/{habitItems.length}
          </span>
        </div>
        
        <div className="w-full bg-white rounded-full h-3 border border-emerald-300 mb-2">
          <div
            className="h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-700">
            {completionPercentage}% Complete
          </span>
          <span className="text-emerald-600">
            Resets in {getTimeUntilReset()}
          </span>
        </div>
      </div>

      {/* Habit Checklist */}
      <div className="space-y-3 mb-6">
        {habitItems.map((habit) => {
          const Icon = habit.icon;
          const isCompleted = dailyHabits[habit.id];
          
          return (
            <div
              key={habit.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                isCompleted 
                  ? `${habit.bgColor} ${habit.borderColor} opacity-75` 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => toggleHabit(habit.id)}
            >
              <div className="flex items-start gap-3">
                <button className="mt-1">
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-400" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-5 h-5 ${habit.color}`} />
                    <h4 className={`font-semibold ${
                      isCompleted ? 'text-slate-600 line-through' : 'text-slate-800'
                    }`}>
                      {habit.name}
                    </h4>
                  </div>
                  <p className={`text-sm ${
                    isCompleted ? 'text-slate-500' : 'text-slate-600'
                  }`}>
                    {habit.description}
                  </p>
                </div>
                
                {isCompleted && (
                  <div className="text-emerald-600 text-sm font-semibold">
                    ✓ Done
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Message */}
      {completedCount === habitItems.length ? (
        <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-center">
          <div className="text-lg font-bold mb-1">🎉 Excellent Work!</div>
          <div className="text-sm text-emerald-100">
            You've completed all your daily Tarbiya habits. May Allah accept your efforts!
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <div className="text-slate-700 font-semibold mb-1">
            Keep Going! 💪
          </div>
          <div className="text-sm text-slate-600">
            {habitItems.length - completedCount} more habit{habitItems.length - completedCount !== 1 ? 's' : ''} to complete today
          </div>
        </div>
      )}

      {/* Islamic Reminder */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 font-semibold text-center">
          "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ"
        </p>
        <p className="text-xs text-blue-600 text-center mt-1">
          "Indeed, Allah will not change the condition of a people until they change what is in themselves" - Quran 13:11
        </p>
      </div>
    </div>
  );
};

export default TarbiyaTracker;