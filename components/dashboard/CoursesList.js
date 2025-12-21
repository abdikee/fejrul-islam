'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, User, ChevronRight } from 'lucide-react';

export default function CoursesList({ sectorId = null, limit = 6 }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [sectorId, limit]);

  const fetchCourses = async () => {
    try {
      const params = new URLSearchParams();
      if (sectorId) params.append('sectorId', sectorId);
      params.append('limit', limit.toString());

      const response = await fetch(`/api/courses?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSectorColor = (color) => {
    return color || '#3B82F6'; // Default blue
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-6">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-300 rounded w-16"></div>
                <div className="h-6 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">No Courses Available</h3>
        <p>Check back later for new courses in this sector.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group"
        >
          {/* Course Header */}
          <div 
            className="h-2"
            style={{ backgroundColor: getSectorColor(course.sector_color) }}
          ></div>
          
          <div className="p-6">
            {/* Sector Badge */}
            {course.sector_name && (
              <div className="flex items-center gap-2 mb-3">
                <span 
                  className="px-3 py-1 text-xs font-medium rounded-full text-white"
                  style={{ backgroundColor: getSectorColor(course.sector_color) }}
                >
                  {course.sector_name}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </div>
            )}

            {/* Course Title */}
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {course.title}
            </h3>

            {/* Course Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {course.description}
            </p>

            {/* Course Meta */}
            <div className="space-y-2 mb-4">
              {course.duration_weeks && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration_weeks} weeks</span>
                </div>
              )}
            </div>

            {/* Learning Objectives */}
            {course.learning_objectives && course.learning_objectives.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Learning Objectives:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {course.learning_objectives.slice(0, 2).map((objective, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                  {course.learning_objectives.length > 2 && (
                    <li className="text-gray-400">
                      +{course.learning_objectives.length - 2} more...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Action Button */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg transition-colors group">
              <span className="text-sm font-medium">View Course</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}