'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Play, Download, Clock, Users, Star, CheckCircle, 
  Filter, Search, Grid, List, Trophy, Target, ArrowRight,
  PlayCircle, PauseCircle, Volume2, VolumeX, RotateCcw,
  FileText, Video, Headphones, Award, Calendar, Eye,
  ChevronRight, ChevronDown, Lock, Unlock, BarChart3,
  Heart, MessageSquare, Shield, Compass, Lightbulb
} from 'lucide-react';
import DashboardPageLayout, { useDashboard } from '@/components/dashboard/DashboardPageLayout';
import LearningDashboard from '@/components/learning/LearningDashboard';
import VideoPlayer from '@/components/learning/VideoPlayer';
import InteractiveLesson from '@/components/learning/InteractiveLesson';
import LessonProgress from '@/components/learning/LessonProgress';

function LearningContent() {
  const { user, genderColors } = useDashboard();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState({ enrolled: [], available: [] });
  const [learningStats, setLearningStats] = useState({});
  const [currentLesson, setCurrentLesson] = useState(null);
  const [courseContent, setCourseContent] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonDetails, setLessonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [expandedModule, setExpandedModule] = useState(null);

  // Learning progress state
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get enrolled courses
        const coursesResponse = await fetch('/api/courses/my-courses');
        const coursesData = await coursesResponse.json();
        
        // Get available courses
        const availableResponse = await fetch('/api/admin/courses');
        const availableData = await availableResponse.json();
        
        if (coursesData.success) {
          const enrolledCourses = coursesData.courses || [];
          const allCourses = availableData.success ? availableData.courses || [] : [];
          
          // Filter out enrolled courses from available
          const enrolledIds = new Set(enrolledCourses.map(c => c.id));
          const availableCourses = allCourses.filter(c => !enrolledIds.has(c.id) && c.is_active !== false);
          
          setCourses({
            enrolled: enrolledCourses,
            available: availableCourses
          });

          // Set learning stats
          setLearningStats(coursesData.stats || {});

          // Set current lesson to first in-progress course
          const inProgressCourse = enrolledCourses.find(c => c.course_status === 'in_progress');
          if (inProgressCourse) {
            setCurrentLesson(inProgressCourse);
          }
        }
      } catch (error) {
        console.error('Error fetching learning data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch course structure + first lesson when switching to Continue
  useEffect(() => {
    if (activeTab !== 'continue') return;
    if (!currentLesson?.id) return;

    const loadCourse = async () => {
      try {
        const res = await fetch(`/api/learning/content?courseId=${currentLesson.id}`, { cache: 'no-store' });
        const data = await res.json();
        if (!data?.success || !data?.course) {
          setCourseContent(null);
          setSelectedLesson(null);
          setLessonDetails(null);
          return;
        }

        setCourseContent(data.course);

        const allLessons = (data.course.modules || []).flatMap(m => m.lessons || []);
        const firstUnlocked = allLessons.find(l => !l.is_locked) || allLessons[0] || null;
        setSelectedLesson(firstUnlocked);
      } catch (e) {
        setCourseContent(null);
        setSelectedLesson(null);
        setLessonDetails(null);
      }
    };

    loadCourse();
  }, [activeTab, currentLesson?.id]);

  useEffect(() => {
    if (!currentLesson?.id || !selectedLesson?.id) {
      setLessonDetails(null);
      return;
    }

    const loadLesson = async () => {
      try {
        const res = await fetch(
          `/api/learning/content?courseId=${currentLesson.id}&lessonId=${selectedLesson.id}`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        if (data?.success && data?.lesson) {
          setLessonDetails(data.lesson);
        } else {
          setLessonDetails(null);
        }
      } catch (e) {
        setLessonDetails(null);
      }
    };

    loadLesson();
  }, [currentLesson?.id, selectedLesson?.id]);

  const sectors = [
    { id: 'qirat-ilm', name: 'Qirat & Ilm', icon: BookOpen, color: 'emerald' },
    { id: 'literature', name: 'Literature & History', icon: FileText, color: 'amber' },
    { id: 'dawah', name: 'Dawah & Comparative Religion', icon: MessageSquare, color: 'blue' },
    { id: 'tarbiya', name: 'Tarbiya & Idad', icon: Heart, color: 'rose' },
    { id: 'ziyara', name: 'Ziyara', icon: Shield, color: 'purple' }
  ];

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
            enrolled: [...prev.enrolled, { ...courseToMove, progress_percentage: 0, course_status: 'not_started' }],
            available: prev.available.filter(c => c.id !== courseId)
          }));
        }
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const markLessonComplete = (lessonId) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const filteredCourses = {
    enrolled: courses.enrolled.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSector === 'all' || course.sector_code === selectedSector)
    ),
    available: courses.available.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSector === 'all' || course.sector_code === selectedSector)
    )
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-12 text-center">
        <div className={`w-16 h-16 border-4 border-${genderColors.primary}-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
        <p className="text-slate-600">Loading your learning journey...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-6">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-lg border border-slate-200 mb-8">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'dashboard', label: 'Learning Dashboard', icon: BarChart3 },
            { id: 'continue', label: 'Continue Learning', icon: Play },
            { id: 'courses', label: 'My Courses', icon: BookOpen },
            { id: 'explore', label: 'Explore', icon: Compass }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? `bg-${genderColors.primary}-600 text-white shadow-lg`
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <LearningDashboard user={user} />
      )}

      {activeTab === 'continue' && (
        <div className="space-y-8">
          {/* Current Lesson Player */}
          {currentLesson && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{currentLesson.title}</h2>
                    <p className="text-slate-600">{currentLesson.sector_name}</p>
                  </div>
                  <div className={`px-4 py-2 bg-${genderColors.primary}-100 text-${genderColors.primary}-700 rounded-full text-sm font-medium`}>
                    {Math.round(currentLesson.progress_percentage || 0)}% Complete
                  </div>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`bg-${genderColors.primary}-500 h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${currentLesson.progress_percentage || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="p-6">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Video/Content Player */}
                  <div className="lg:col-span-2">
                    {selectedLesson?.content_type === 'video' && lessonDetails?.content_url ? (
                      <VideoPlayer
                        videoUrl={lessonDetails.content_url}
                        title={lessonDetails.title}
                        onProgress={(progress) => setVideoProgress(progress)}
                        onComplete={() => markLessonComplete(selectedLesson.id)}
                        initialProgress={videoProgress}
                      />
                    ) : selectedLesson?.content_type === 'link' && lessonDetails?.content_url ? (
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">{lessonDetails.title}</h3>
                        <p className="text-slate-600 mb-4">This lesson is hosted as an external link.</p>
                        <a
                          className={`inline-flex items-center gap-2 px-4 py-2 bg-${genderColors.primary}-600 text-white rounded-lg hover:bg-${genderColors.primary}-700 transition-colors`}
                          href={lessonDetails.content_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open Lesson <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                          {selectedLesson?.title || 'Lesson'}
                        </h3>
                        <p className="text-slate-600">
                          Lesson content is not available yet.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Lesson Resources */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-800 mb-4">Lesson Resources</h3>
                      <div className="space-y-3">
                        {(lessonDetails?.resources || []).length === 0 ? (
                          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600">
                            No resources for this lesson.
                          </div>
                        ) : (
                          (lessonDetails.resources || []).map((resource) => (
                            <div key={resource.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-slate-600" />
                                <span className="text-sm font-medium text-slate-800">{resource.title}</span>
                              </div>
                              {resource.file_path ? (
                                <a
                                  className="p-1 text-slate-600 hover:text-slate-800"
                                  href={resource.file_path}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Open resource"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              ) : null}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <LessonProgress
                      modules={courseContent?.modules || []}
                      currentLesson={selectedLesson}
                      completedLessons={completedLessons}
                      onLessonSelect={(lesson) => setSelectedLesson(lesson)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/dashboard/courses" className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all group">
              <div className={`w-12 h-12 bg-${genderColors.primary}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <BookOpen className={`w-6 h-6 text-${genderColors.primary}-600`} />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Browse All Courses</h3>
              <p className="text-slate-600 text-sm mb-4">Explore all available courses across different sectors</p>
              <div className="flex items-center text-sm font-medium text-slate-600 group-hover:text-slate-800">
                View Courses <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link href="/dashboard/schedule" className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all group">
              <div className={`w-12 h-12 bg-${genderColors.secondary}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Calendar className={`w-6 h-6 text-${genderColors.secondary}-600`} />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Study Schedule</h3>
              <p className="text-slate-600 text-sm mb-4">Plan your learning sessions and track your progress</p>
              <div className="flex items-center text-sm font-medium text-slate-600 group-hover:text-slate-800">
                View Schedule <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link href="/dashboard/study-groups" className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Study Groups</h3>
              <p className="text-slate-600 text-sm mb-4">Join study groups and learn with fellow students</p>
              <div className="flex items-center text-sm font-medium text-slate-600 group-hover:text-slate-800">
                Join Groups <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="space-y-8">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search your courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Sectors</option>
                  {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>{sector.name}</option>
                  ))}
                </select>
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

          {/* Enrolled Courses */}
          <div>
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
                <p className="text-slate-600 mb-6">Start your learning journey by exploring available courses.</p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`px-6 py-3 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors`}
                >
                  Explore Courses
                </button>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {filteredCourses.enrolled.map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`px-3 py-1 bg-${course.sector_color || genderColors.primary}-100 text-${course.sector_color || genderColors.primary}-700 rounded-full text-sm font-medium`}>
                        {course.sector_name || 'General'}
                      </div>
                      <div className={`px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium`}>
                        {course.difficulty_level || 'Beginner'}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
                    <p className="text-slate-600 mb-4 line-clamp-2">{course.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">Progress</span>
                        <span className="text-sm text-slate-600">{Math.round(course.progress_percentage || 0)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`bg-${genderColors.primary}-500 h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${course.progress_percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.estimated_weeks || 8} weeks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{course.course_status || 'Not Started'}</span>
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
        </div>
      )}

      {activeTab === 'explore' && (
        <div className="space-y-8">
          {/* Sector Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <button
                  key={sector.id}
                  onClick={() => setSelectedSector(sector.id === selectedSector ? 'all' : sector.id)}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedSector === sector.id
                      ? `border-${sector.color}-500 bg-${sector.color}-50`
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${
                    selectedSector === sector.id ? `text-${sector.color}-600` : 'text-slate-600'
                  }`} />
                  <h3 className={`font-bold text-sm text-center ${
                    selectedSector === sector.id ? `text-${sector.color}-800` : 'text-slate-800'
                  }`}>
                    {sector.name}
                  </h3>
                </button>
              );
            })}
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
                <Lightbulb className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No Available Courses</h3>
                <p className="text-slate-600">Check back later for new courses or try a different sector.</p>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {filteredCourses.available.map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`px-3 py-1 bg-${course.sector_color || 'blue'}-100 text-${course.sector_color || 'blue'}-700 rounded-full text-sm font-medium`}>
                        {course.sector_name || 'General'}
                      </div>
                      <div className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                        {course.difficulty_level || 'Beginner'}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
                    <p className="text-slate-600 mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.estimated_weeks || 8} weeks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrolled_students ?? 0} enrolled</span>
                      </div>
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
      )}
    </div>
  );
}

export default function LearningPage() {
  return (
    <DashboardPageLayout 
      title="Learning Center" 
      subtitle="Your comprehensive Islamic learning platform"
    >
      <LearningContent />
    </DashboardPageLayout>
  );
}