'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Play, Download, Clock, Users, Star, CheckCircle, 
  ArrowLeft, Filter, Search, Grid, List, Trophy, Target
} from 'lucide-react';
import StudentFooter from '@/components/dashboard/StudentFooter';

export default function StudentCourses() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState({ enrolled: [], available: [] });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data
        const authResponse = await fetch('/api/auth/me');
        const authData = await authResponse.json();
        
        if (authData.success) {
          setUser(authData.user);
          
          // Get enrolled courses from LMS
          const coursesResponse = await fetch('/api/courses/my-courses');
          const coursesData = await coursesResponse.json();
          
          // Get all available courses from admin
          const availableResponse = await fetch('/api/admin/courses');
          const availableData = await availableResponse.json();
          
          if (coursesData.success) {
            const enrolledCourses = coursesData.courses || [];
            const allCourses = availableData.success ? availableData.courses || [] : [];
            
            // Filter out enrolled courses from available courses
            const enrolledIds = new Set(enrolledCourses.map(c => c.id));
            const availableCourses = allCourses.filter(c => !enrolledIds.has(c.id) && c.is_active !== false);
            
            setCourses({
              enrolled: enrolledCourses,
              available: availableCourses
            });
          }
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses({ enrolled: [], available: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Poll for new courses every 10 seconds for real-time updates
    const interval = setInterval(fetchData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleEnrollCourse = async (courseId) => {
    try {
      const response = await fetch('/api/dashboard/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'enroll_course', courseId })
      });
      
      if (response.ok) {
        // Move course from available to enrolled
        const courseToMove = courses.available.find(c => c.id === courseId);
        if (courseToMove) {
          setCourses(prev => ({
            enrolled: [...prev.enrolled, { ...courseToMove, progress_percentage: 0 }],
            available: prev.available.filter(c => c.id !== courseId)
          }));
        }
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const filteredCourses = {
    enrolled: courses.enrolled.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === 'all' || course.sector_name.toLowerCase().includes(filter.toLowerCase()))
    ),
    available: courses.available.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === 'all' || course.sector_name.toLowerCase().includes(filter.toLowerCase()))
    )
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
          <p className="text-slate-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-slate-800">My Courses</h1>
                <p className="text-sm text-slate-600">Manage your Islamic learning journey</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? `bg-${genderColors.primary}-600 text-white` 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? `bg-${genderColors.primary}-600 text-white` 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Sectors</option>
                <option value="tarbiya">Tarbiya & Idad</option>
                <option value="qirat">Qirat & Ilm</option>
                <option value="literature">Literature</option>
                <option value="comparative">Comparative Religion</option>
                <option value="ziyara">Ziyara</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className={`w-6 h-6 text-${genderColors.primary}-600`} />
            <h2 className="text-2xl font-bold text-slate-800">My Enrolled Courses</h2>
            <span className={`px-3 py-1 bg-${genderColors.primary}-100 text-${genderColors.primary}-700 rounded-full text-sm font-medium`}>
              {filteredCourses.enrolled.length}
            </span>
          </div>

          {filteredCourses.enrolled.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-200">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Enrolled Courses</h3>
              <p className="text-slate-600">Start your learning journey by enrolling in courses below.</p>
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {filteredCourses.enrolled.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 bg-${course.sector_color}-100 text-${course.sector_color}-700 rounded-full text-sm font-medium`}>
                      {course.sector_name}
                    </div>
                    <div className={`px-2 py-1 bg-${genderColors.primary}-100 text-${genderColors.primary}-700 rounded text-xs font-medium`}>
                      {course.level}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Progress</span>
                      <span className="text-sm text-slate-600">{course.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`bg-${genderColors.primary}-500 h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${course.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration_weeks} weeks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{course.related_resources} resources</span>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors`}
                  >
                    <Play className="w-4 h-4" />
                    Continue Learning
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Courses */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Target className={`w-6 h-6 text-${genderColors.secondary}-600`} />
            <h2 className="text-2xl font-bold text-slate-800">Available Courses</h2>
            <span className={`px-3 py-1 bg-${genderColors.secondary}-100 text-${genderColors.secondary}-700 rounded-full text-sm font-medium`}>
              {filteredCourses.available.length}
            </span>
          </div>

          {filteredCourses.available.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-200">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Available Courses</h3>
              <p className="text-slate-600">Check back later for new courses or explore sectors.</p>
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {filteredCourses.available.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 bg-${course.sector_color || 'blue'}-100 text-${course.sector_color || 'blue'}-700 rounded-full text-sm font-medium`}>
                      {course.sector_name || 'General'}
                    </div>
                    <div className={`px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium`}>
                      {course.level}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration_weeks} weeks</span>
                    </div>
                    {course.related_resources && (
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{course.related_resources} resources</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleEnrollCourse(course.id)}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-${genderColors.secondary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.secondary}-700 transition-colors`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Enroll Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <StudentFooter user={user} />
    </div>
  );
}