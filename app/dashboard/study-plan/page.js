'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Target, ArrowLeft, Plus, CheckCircle, Clock, BookOpen, Star, 
  Calendar, Trophy, Play, Edit, Trash2, BarChart3, TrendingUp
} from 'lucide-react';
import StudentFooter from '@/components/dashboard/StudentFooter';

export default function StudentStudyPlan() {
  const [user, setUser] = useState(null);
  const [studyPlan, setStudyPlan] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plan');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authResponse = await fetch('/api/auth/me');
        const authData = await authResponse.json();
        
        if (authData.success) {
          setUser(authData.user);
        }

        // Mock study plan data
        const mockStudyPlan = [
          {
            id: 1,
            title: 'Islamic Finance Fundamentals',
            sector: 'Tarbiya & Idad',
            sector_color: 'blue',
            status: 'in_progress',
            progress: 65,
            target_completion: '2024-12-30',
            weekly_hours: 4,
            priority: 'high',
            difficulty: 'Beginner'
          },
          {
            id: 2,
            title: 'Quranic Arabic Mastery',
            sector: 'Qirat & Ilm',
            sector_color: 'teal',
            status: 'planned',
            progress: 0,
            target_completion: '2025-02-15',
            weekly_hours: 6,
            priority: 'high',
            difficulty: 'Intermediate'
          },
          {
            id: 3,
            title: 'Islamic History Deep Dive',
            sector: 'Literature',
            sector_color: 'green',
            status: 'completed',
            progress: 100,
            target_completion: '2024-11-30',
            weekly_hours: 3,
            priority: 'medium',
            difficulty: 'Beginner'
          },
          {
            id: 4,
            title: 'Comparative Religion Studies',
            sector: 'Comparative Religion',
            sector_color: 'purple',
            status: 'planned',
            progress: 0,
            target_completion: '2025-03-20',
            weekly_hours: 5,
            priority: 'medium',
            difficulty: 'Advanced'
          }
        ];

        const mockGoals = [
          {
            id: 1,
            title: 'Complete 5 Courses This Semester',
            description: 'Finish all enrolled courses with at least 85% score',
            target_date: '2025-01-15',
            progress: 60,
            status: 'in_progress',
            category: 'academic'
          },
          {
            id: 2,
            title: 'Master Arabic Grammar',
            description: 'Achieve fluency in Arabic grammar fundamentals',
            target_date: '2025-02-28',
            progress: 30,
            status: 'in_progress',
            category: 'skill'
          },
          {
            id: 3,
            title: 'Lead Study Group',
            description: 'Organize and lead weekly Islamic study sessions',
            target_date: '2024-12-31',
            progress: 80,
            status: 'in_progress',
            category: 'leadership'
          }
        ];
        
        setStudyPlan(mockStudyPlan);
        setGoals(mockGoals);
      } catch (error) {
        console.error('Error fetching study plan:', error);
        setUser({ firstName: 'Ahmad', gender: 'male' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateProgress = (id, newProgress) => {
    setStudyPlan(prev => prev.map(item => 
      item.id === id ? { ...item, progress: newProgress } : item
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'planned': return 'gray';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const genderColors = user?.gender === 'female' ? {
    primary: 'teal',
    secondary: 'purple',
    bgGradient: 'from-teal-50 to-purple-50'
  } : {
    primary: 'emerald',
    secondary: 'blue',
    bgGradient: 'from-emerald-50 to-blue-50'
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${genderColors.bgGradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-${genderColors.primary}-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
          <p className="text-slate-600">Loading your study plan...</p>
        </div>
      </div>
    );
  }

  const completedCourses = studyPlan.filter(item => item.status === 'completed').length;
  const inProgressCourses = studyPlan.filter(item => item.status === 'in_progress').length;
  const plannedCourses = studyPlan.filter(item => item.status === 'planned').length;
  const totalWeeklyHours = studyPlan.reduce((sum, item) => sum + item.weekly_hours, 0);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${genderColors.bgGradient}`}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/dashboard/${user?.gender}`}
                className={`p-2 hover:bg-${genderColors.primary}-100 rounded-lg transition-colors`}
              >
                <ArrowLeft className={`w-5 h-5 text-${genderColors.primary}-600`} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">My Study Plan</h1>
                <p className="text-sm text-slate-600">Plan and track your Islamic learning journey</p>
              </div>
            </div>
            
            <button className={`inline-flex items-center gap-2 px-4 py-2 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors`}>
              <Plus className="w-4 h-4" />
              Add Course
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-6 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-slate-600">Completed</span>
            </div>
            <div className="text-3xl font-bold text-slate-800">{completedCourses}</div>
            <div className="text-sm text-green-600">Courses finished</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Play className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-slate-600">In Progress</span>
            </div>
            <div className="text-3xl font-bold text-slate-800">{inProgressCourses}</div>
            <div className="text-sm text-blue-600">Active courses</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-slate-600">Planned</span>
            </div>
            <div className="text-3xl font-bold text-slate-800">{plannedCourses}</div>
            <div className="text-sm text-purple-600">Future courses</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium text-slate-600">Weekly Hours</span>
            </div>
            <div className="text-3xl font-bold text-slate-800">{totalWeeklyHours}</div>
            <div className="text-sm text-orange-600">Study time</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'plan'
                  ? `text-${genderColors.primary}-600 border-b-2 border-${genderColors.primary}-600`
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Study Plan
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'goals'
                  ? `text-${genderColors.primary}-600 border-b-2 border-${genderColors.primary}-600`
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Goals & Targets
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'analytics'
                  ? `text-${genderColors.primary}-600 border-b-2 border-${genderColors.primary}-600`
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Progress Analytics
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'plan' && (
              <div className="space-y-6">
                {studyPlan.map((course) => (
                  <div key={course.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-800">{course.title}</h3>
                          <span className={`px-2 py-1 bg-${course.sector_color}-100 text-${course.sector_color}-700 rounded-full text-xs font-medium`}>
                            {course.sector}
                          </span>
                          <span className={`px-2 py-1 bg-${getPriorityColor(course.priority)}-100 text-${getPriorityColor(course.priority)}-700 rounded-full text-xs font-medium`}>
                            {course.priority} priority
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-slate-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>Target: {new Date(course.target_completion).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.weekly_hours}h/week</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            <span>{course.difficulty}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-700">Progress</span>
                            <span className="text-sm text-slate-600">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className={`bg-${getStatusColor(course.status)}-500 h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <span className={`px-3 py-1 bg-${getStatusColor(course.status)}-100 text-${getStatusColor(course.status)}-700 rounded-full text-sm font-medium`}>
                          {course.status.replace('_', ' ')}
                        </span>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {course.status === 'in_progress' && (
                      <div className="flex gap-3">
                        <Link
                          href={`/dashboard/courses/${course.id}`}
                          className={`flex items-center gap-2 px-4 py-2 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors`}
                        >
                          <Play className="w-4 h-4" />
                          Continue Learning
                        </Link>
                        <button
                          onClick={() => updateProgress(course.id, Math.min(course.progress + 10, 100))}
                          className={`flex items-center gap-2 px-4 py-2 border border-${genderColors.primary}-300 text-${genderColors.primary}-600 rounded-xl font-semibold hover:bg-${genderColors.primary}-50 transition-colors`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark Progress
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="space-y-6">
                {goals.map((goal) => (
                  <div key={goal.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{goal.title}</h3>
                        <p className="text-slate-600 mb-4">{goal.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-slate-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {new Date(goal.target_date).toLocaleDateString()}</span>
                          </div>
                          <span className={`px-2 py-1 bg-${genderColors.secondary}-100 text-${genderColors.secondary}-700 rounded-full text-xs font-medium`}>
                            {goal.category}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-700">Progress</span>
                            <span className="text-sm text-slate-600">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className={`bg-${genderColors.primary}-500 h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <span className={`px-3 py-1 bg-${getStatusColor(goal.status)}-100 text-${getStatusColor(goal.status)}-700 rounded-full text-sm font-medium`}>
                          {goal.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <BarChart3 className={`w-6 h-6 text-${genderColors.primary}-600`} />
                      <h3 className="text-lg font-bold text-slate-800">Learning Progress</h3>
                    </div>
                    <div className="space-y-4">
                      {studyPlan.map((course) => (
                        <div key={course.id} className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">{course.title}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-200 rounded-full h-2">
                              <div 
                                className={`bg-${course.sector_color}-500 h-2 rounded-full`}
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-600 w-12">{course.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className={`w-6 h-6 text-${genderColors.secondary}-600`} />
                      <h3 className="text-lg font-bold text-slate-800">Weekly Study Time</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-800 mb-2">{totalWeeklyHours}h</div>
                      <div className="text-sm text-slate-600">Total weekly commitment</div>
                      <div className="mt-4 text-sm text-slate-600">
                        Average: {Math.round(totalWeeklyHours / 7 * 10) / 10}h per day
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <StudentFooter user={user} />
    </div>
  );
}