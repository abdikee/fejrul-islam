'use client';

import { useState } from 'react';
import { 
  CheckCircle, Circle, Lock, Play, FileText, Video, 
  Headphones, Award, Clock, ChevronDown, ChevronRight 
} from 'lucide-react';

export default function LessonProgress({ 
  modules, 
  currentLesson, 
  onLessonSelect,
  completedLessons = new Set() 
}) {
  const [expandedModules, setExpandedModules] = useState(new Set([0])); // First module expanded by default

  const toggleModule = (moduleIndex) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleIndex)) {
      newExpanded.delete(moduleIndex);
    } else {
      newExpanded.add(moduleIndex);
    }
    setExpandedModules(newExpanded);
  };

  const getLessonIcon = (lesson) => {
    switch (lesson.content_type) {
      case 'video':
        return Video;
      case 'audio':
        return Headphones;
      case 'interactive':
        return Play;
      case 'reading':
        return FileText;
      default:
        return FileText;
    }
  };

  const getLessonStatus = (lesson) => {
    if (completedLessons.has(lesson.id)) {
      return 'completed';
    }
    if (lesson.is_locked) {
      return 'locked';
    }
    if (currentLesson?.id === lesson.id) {
      return 'current';
    }
    return 'available';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-slate-400" />;
      case 'current':
        return <Play className="w-5 h-5 text-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColors = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'locked':
        return 'bg-slate-50 border-slate-200 text-slate-400';
      case 'current':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-white border-slate-200 text-slate-800 hover:border-slate-300';
    }
  };

  const calculateModuleProgress = (module) => {
    if (!module.lessons || module.lessons.length === 0) return 0;
    
    const completedCount = module.lessons.filter(lesson => 
      completedLessons.has(lesson.id)
    ).length;
    
    return Math.round((completedCount / module.lessons.length) * 100);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Course Progress</h3>
        <p className="text-slate-600">Track your learning journey</p>
      </div>

      <div className="divide-y divide-slate-200">
        {modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(moduleIndex);
          const progress = calculateModuleProgress(module);
          const Icon = isExpanded ? ChevronDown : ChevronRight;

          return (
            <div key={module.id} className="p-6">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(moduleIndex)}
                className="w-full flex items-center justify-between text-left hover:bg-slate-50 -m-2 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-slate-600">{moduleIndex + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{module.title}</h4>
                    <p className="text-sm text-slate-600">
                      {module.lesson_count} lessons • {Math.round(module.total_duration / 60)} hours
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-800">{progress}%</div>
                    <div className="w-20 h-2 bg-slate-200 rounded-full">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
              </button>

              {/* Module Description */}
              {module.description && (
                <p className="text-slate-600 mt-3 ml-14">{module.description}</p>
              )}

              {/* Lessons List */}
              {isExpanded && module.lessons && (
                <div className="mt-4 ml-14 space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const LessonIcon = getLessonIcon(lesson);
                    const status = getLessonStatus(lesson);
                    const statusColors = getStatusColors(status);
                    const isClickable = status !== 'locked';

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => isClickable && onLessonSelect?.(lesson)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${statusColors} ${
                          isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                        }`}
                      >
                        {getStatusIcon(status)}
                        
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <LessonIcon className="w-4 h-4 text-slate-600" />
                        </div>
                        
                        <div className="flex-1">
                          <h5 className="font-medium">{lesson.title}</h5>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{lesson.duration_minutes} min</span>
                            </div>
                            <span className="capitalize">{lesson.content_type}</span>
                          </div>
                        </div>

                        {status === 'completed' && (
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Award className="w-4 h-4 text-emerald-600" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Progress Summary */}
      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-slate-800">Overall Progress</span>
          <span className="text-sm text-slate-600">
            {completedLessons.size} / {modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} lessons
          </span>
        </div>
        
        <div className="w-full h-3 bg-slate-200 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
            style={{ 
              width: `${modules.reduce((total, module) => total + (module.lessons?.length || 0), 0) > 0 
                ? (completedLessons.size / modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)) * 100 
                : 0}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
}