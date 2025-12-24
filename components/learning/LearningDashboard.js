'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Play, Trophy, Clock, Target, Star, 
  ArrowRight, Calendar, Users, Award, TrendingUp,
  CheckCircle, Circle, Zap, Heart, MessageSquare
} from 'lucide-react';

export default function LearningDashboard({ user }) {
  const [learningStats, setLearningStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageProgress: 0,
    studyStreak: 0,
    totalStudyTime: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gender-based theming
  const genderColors = user?.gender === 'female' ? {
    primary: 'teal',
    secondary: 'purple',
    accent: 'pink',
    gradient: 'from-teal-500 to-purple-600'
  } : {
    primary: 'emerald',
    secondary: 'blue',
    accent: 'green',
    gradient: 'from-emerald-500 to-blue-600'
  };

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        // Fetch learning progress
        const progressResponse = await fetch('/api/learning/progress');
        const progressData = await progressResponse.json();
        
        if (progressData.success) {
          setLearningStats(progressData.progress.statistics);
          setRecentActivity(progressData.progress.recentActivity);
        }

        // Fetch current course
        const contentResponse = await fetch('/api/learning/content');
        const contentData = await contentResponse.json();
        
        if (contentData.success && contentData.currentContent) {
          setCurrentCourse(contentData.currentContent);
        }

        // Mock achievements for now
        setAchievements([
          { id: 1, title: 'First Steps', description: 'Completed your first lesson', icon: '🎯', earned: true },
          { id: 2, title: 'Consistent Learner', description: '7-day study streak', icon: '🔥', earned: true },
          { id: 3, title: 'Knowledge Seeker', description: 'Completed 5 courses', icon: '📚', earned: false },
          { id: 4, title: 'Dawah Champion', description: 'Mastered dawah fundamentals', icon: '🏆', earned: false }
        ]);

      } catch (error) {
        console.error('Error fetching learning data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, []);

  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Resume your current course',
      icon: Play,
      href: currentCourse ? `/dashboard/courses/${currentCourse.course_id}` : '/dashboard/courses',
      color: genderColors.primary,
      highlight: true
    },
    {
      title: 'Browse Courses',
      description: 'Explore new learning opportunities',
      icon: BookOpen,
      href: '/dashboard/courses',
      color: genderColors.secondary
    },
    {
      title: 'Study Schedule',
      description: 'Plan your learning sessions',
      icon: Calendar,
      href: '/dashboard/schedule',
      color: 'purple'
    },
    {
      title: 'Study Groups',
      description: 'Learn with fellow students',
      icon: Users,
      href: '/dashboard/study-groups',
      color: 'orange'
    }
  ];

  const sectors = [
    { name: 'Qirat & Ilm', icon: BookOpen, color: 'emerald', progress: 65 },
    { name: 'Dawah & Comparative Religion', icon: MessageSquare, color: 'blue', progress: 40 },
    { name: 'Tarbiya & Idad', icon: Heart, color: 'rose', progress: 80 },
    { name: 'Literature & History', icon: BookOpen, color: 'amber', progress: 25 },
    { name: 'Ziyara', icon: Heart, color: 'purple', progress: 55 }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className={`bg-gradient-to-r ${genderColors.gradient} text-white rounded-2xl p-8`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.gender === 'male' ? 'Brother' : 'Sister'} {user?.firstName}!
            </h1>
            <p className="text-white/90 text-lg">Continue your Islamic learning journey</p>
            {learningStats.studyStreak > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="font-medium">{learningStats.studyStreak} day study streak!</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{learningStats.totalCourses}</div>
              <div className="text-sm text-white/80">Total Courses</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{learningStats.completedCourses}</div>
              <div className="text-sm text-white/80">Completed</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{learningStats.inProgressCourses}</div>
              <div className="text-sm text-white/80">In Progress</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{learningStats.averageProgress}%</div>
              <div className="text-sm text-white/80">Avg Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Course Spotlight */}
      {currentCourse && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Continue Learning</h2>
                <p className="text-slate-600">Pick up where you left off</p>
              </div>
              <div className={`px-4 py-2 bg-${genderColors.primary}-100 text-${genderColors.primary}-700 rounded-full text-sm font-medium`}>
                {Math.round(currentCourse.progress_percentage || 0)}% Complete
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 bg-${genderColors.primary}-100 rounded-xl flex items-center justify-center`}>
                <BookOpen className={`w-8 h-8 text-${genderColors.primary}-600`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{currentCourse.course_title}</h3>
                <p className="text-slate-600 mb-3">{currentCourse.sector_name}</p>
                
                <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
                  <div 
                    className={`bg-${genderColors.primary}-500 h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${currentCourse.progress_percentage || 0}%` }}
                  ></div>
                </div>
                
                {currentCourse.current_lesson_title && (
                  <p className="text-sm text-slate-600">
                    Current: {currentCourse.current_lesson_title}
                  </p>
                )}
              </div>
              
              <Link
                href={`/dashboard/courses/${currentCourse.course_id}`}
                className={`px-6 py-3 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors flex items-center gap-2`}
              >
                <Play className="w-5 h-5" />
                Continue
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              href={action.href}
              className={`bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all group ${
                action.highlight ? 'ring-2 ring-' + action.color + '-200' : ''
              }`}
            >
              <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 text-${action.color}-600`} />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{action.title}</h3>
              <p className="text-slate-600 text-sm mb-4">{action.description}</p>
              <div className="flex items-center text-sm font-medium text-slate-600 group-hover:text-slate-800">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Learning Progress by Sector */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Learning Progress by Sector</h2>
          <p className="text-slate-600">Track your progress across different areas of Islamic knowledge</p>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <div key={index} className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 bg-${sector.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${sector.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{sector.name}</h3>
                      <p className="text-xs text-slate-600">{sector.progress}% Complete</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`bg-${sector.color}-500 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${sector.progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity & Achievements */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Recent Activity</h2>
            <p className="text-slate-600">Your latest learning milestones</p>
          </div>
          
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                    <div className={`w-10 h-10 bg-${genderColors.primary}-100 rounded-lg flex items-center justify-center`}>
                      <TrendingUp className={`w-5 h-5 text-${genderColors.primary}-600`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{activity.activity_title}</p>
                      <p className="text-sm text-slate-600">{activity.sector_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-800">{Math.round(activity.progress_percentage)}%</p>
                      <p className="text-xs text-slate-500">
                        {new Date(activity.activity_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No recent activity yet</p>
                <p className="text-sm text-slate-500">Start learning to see your progress here</p>
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Achievements</h2>
            <p className="text-slate-600">Your learning milestones</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    achievement.earned 
                      ? 'bg-emerald-50 border border-emerald-200' 
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                    achievement.earned ? 'bg-emerald-100' : 'bg-slate-200'
                  }`}>
                    {achievement.earned ? achievement.icon : '🔒'}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${achievement.earned ? 'text-emerald-800' : 'text-slate-600'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${achievement.earned ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}