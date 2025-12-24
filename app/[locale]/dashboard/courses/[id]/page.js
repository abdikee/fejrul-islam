'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, Play, Download, Clock, Users, CheckCircle, 
  ArrowLeft, FileText, ChevronRight, Lock
} from 'lucide-react';
import DashboardPageLayout, { useDashboard } from '@/components/dashboard/DashboardPageLayout';

function CourseDetailContent() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;
  const { user, genderColors } = useDashboard();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [courseResources, setCourseResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get course details
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        const courseData = await courseResponse.json();
        
        if (courseData.success) {
          setCourse(courseData.course);
        } else {
          // Try admin endpoint as fallback
          const adminResponse = await fetch('/api/admin/courses');
          const adminData = await adminResponse.json();
          if (adminData.success) {
            const foundCourse = adminData.courses.find(c => c.id == courseId);
            if (foundCourse) {
              setCourse(foundCourse);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  useEffect(() => {
    const fetchCourseResources = async () => {
      if (!courseId) return;
      setResourcesLoading(true);
      try {
        const res = await fetch(`/api/resources?courseId=${courseId}&limit=50`);
        const data = await res.json();
        if (data?.success && Array.isArray(data.resources)) {
          setCourseResources(data.resources);
        } else {
          setCourseResources([]);
        }
      } catch (error) {
        console.error('Error fetching course resources:', error);
        setCourseResources([]);
      } finally {
        setResourcesLoading(false);
      }
    };

    fetchCourseResources();
  }, [courseId]);

  const handleDownloadResource = async (resource) => {
    try {
      await fetch(`/api/resources?download=${resource.id}`, { method: 'POST' });
    } catch {
      // ignore download tracking errors
    }
    if (resource?.file_path) {
      window.open(resource.file_path, '_blank', 'noopener,noreferrer');
    }
  };

  const getResourceIcon = (type) => {
    switch (String(type || '').toLowerCase()) {
      case 'pdf':
        return FileText;
      case 'video':
        return Play;
      case 'audio':
        return Play;
      case 'image':
        return FileText;
      case 'archive':
        return FileText;
      default:
        return FileText;
    }
  };

  // Mock modules for the course
  const modules = [
    { id: 1, title: 'Introduction & Foundations', lessons: 4, duration: '2 hours', completed: true, locked: false },
    { id: 2, title: 'Core Concepts', lessons: 6, duration: '3 hours', completed: true, locked: false },
    { id: 3, title: 'Practical Applications', lessons: 5, duration: '2.5 hours', completed: false, locked: false },
    { id: 4, title: 'Advanced Topics', lessons: 4, duration: '2 hours', completed: false, locked: true },
    { id: 5, title: 'Final Assessment', lessons: 2, duration: '1 hour', completed: false, locked: true },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-12 text-center">
        <div className={`w-16 h-16 border-4 border-${genderColors.primary}-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
        <p className="text-slate-600">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Course Not Found</h2>
          <p className="text-slate-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/dashboard/courses"
            className={`inline-flex items-center gap-2 px-6 py-3 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const progress = course.progress_percentage || 40;

  return (
    <>
      {/* Course Hero */}
      <div className={`bg-gradient-to-r from-${genderColors.primary}-600 to-${genderColors.secondary}-600 text-white py-12`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
                <Link href="/dashboard/courses" className="hover:text-white">Courses</Link>
                <ChevronRight className="w-4 h-4" />
                <span>{course.title}</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {course.sector_name || 'General'}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {course.level || 'Beginner'}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-white/90 text-lg mb-6">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration_weeks || 8} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{modules.length} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.enrolled_students || 0} enrolled</span>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="lg:w-80">
              <div className="bg-white rounded-2xl p-6 text-slate-800">
                <h3 className="font-bold text-lg mb-4">Your Progress</h3>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Course Completion</span>
                    <span className="text-sm text-slate-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className={`bg-${genderColors.primary}-500 h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Modules Completed</span>
                    <span className="font-medium">2 / {modules.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Time Spent</span>
                    <span className="font-medium">5h 30m</span>
                  </div>
                </div>

                <button className={`w-full py-3 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors flex items-center justify-center gap-2`}>
                  <Play className="w-5 h-5" />
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex gap-8">
            {['overview', 'curriculum', 'resources'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? `border-${genderColors.primary}-600 text-${genderColors.primary}-600`
                    : 'border-transparent text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4">About This Course</h2>
                <p className="text-slate-600 leading-relaxed">
                  {course.description || 'This comprehensive course covers essential topics to help you grow in your Islamic knowledge and practice. Through structured lessons and practical exercises, you will gain a deeper understanding of the subject matter.'}
                </p>
              </div>

              {/* Learning Objectives */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4">What You'll Learn</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Understand core principles and foundations',
                    'Apply knowledge in practical situations',
                    'Develop critical thinking skills',
                    'Connect theory with real-world applications'
                  ].map((objective, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 text-${genderColors.primary}-600 mt-0.5 flex-shrink-0`} />
                      <span className="text-slate-700">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Course Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Level</span>
                    <span className="font-medium text-slate-800">{course.level || 'Beginner'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Duration</span>
                    <span className="font-medium text-slate-800">{course.duration_weeks || 8} weeks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Modules</span>
                    <span className="font-medium text-slate-800">{modules.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Certificate</span>
                    <span className="font-medium text-emerald-600">Yes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="max-w-3xl">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Course Curriculum</h2>
                <p className="text-slate-600 mt-1">{modules.length} modules • {modules.reduce((acc, m) => acc + m.lessons, 0)} lessons</p>
              </div>
              
              <div className="divide-y divide-slate-200">
                {modules.map((module, index) => (
                  <div key={module.id} className={`p-6 ${module.locked ? 'bg-slate-50' : 'hover:bg-slate-50'} transition-colors`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        module.completed 
                          ? `bg-${genderColors.primary}-100 text-${genderColors.primary}-600`
                          : module.locked
                          ? 'bg-slate-200 text-slate-400'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {module.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : module.locked ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          <span className="font-bold">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`font-semibold ${module.locked ? 'text-slate-400' : 'text-slate-800'}`}>
                          {module.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {module.lessons} lessons • {module.duration}
                        </p>
                      </div>

                      {!module.locked && (
                        <button className={`px-4 py-2 ${
                          module.completed 
                            ? 'bg-slate-100 text-slate-600'
                            : `bg-${genderColors.primary}-600 text-white`
                        } rounded-lg font-medium text-sm hover:opacity-90 transition-opacity`}>
                          {module.completed ? 'Review' : 'Start'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="max-w-3xl">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Course Resources</h2>

              {resourcesLoading ? (
                <div className="py-10 text-center text-slate-600">Loading resources...</div>
              ) : courseResources.length === 0 ? (
                <div className="py-10 text-center text-slate-600">
                  No resources have been attached to this course yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {courseResources.map((resource) => {
                    const Icon = getResourceIcon(resource.resource_type);
                    return (
                      <div key={resource.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800">{resource.title}</h4>
                            <p className="text-sm text-slate-500">
                              {resource.resource_type || 'File'}
                              {resource.file_size ? ` • ${resource.file_size} bytes` : ''}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadResource(resource)}
                          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-5 h-5 text-slate-600" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function CourseDetailPage() {
  return (
    <DashboardPageLayout 
      title="" 
      subtitle=""
      showBackButton={true}
    >
      <CourseDetailContent />
    </DashboardPageLayout>
  );
}
