'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  PenTool, 
  Users, 
  Globe, 
  Heart,
  ChevronRight,
  TrendingUp,
  Download,
  Search,
  BarChart3,
  Lock
} from 'lucide-react';

export default function SectorNavigationGrid({ user, colorScheme }) {
  const [sectorData, setSectorData] = useState({});

  useEffect(() => {
    // Mock sector data - replace with API calls
    const mockData = {
      qirat: {
        progress: 65,
        currentCourse: 'Tajweed Fundamentals',
        nextMilestone: 'Complete Surah Al-Mulk'
      },
      literature: {
        latestPost: 'The Golden Age of Islamic Scholarship',
        readTime: '8 min read',
        author: 'Dr. Ahmad Hassan'
      },
      tarbiya: {
        weeklyTitle: 'Building Character Through Daily Habits',
        downloadCount: 1247,
        category: 'Personal Development'
      },
      comparative: {
        bookOfWeek: 'The Study of Religions: A Comparative Approach',
        author: 'Prof. Sarah Ahmed',
        availability: 'Available in Library'
      },
      ziyara: {
        healthScore: 85,
        activeProjects: 12,
        nextEvent: 'Community Cleanup - Dec 25'
      }
    };
    
    setSectorData(mockData);
  }, []);

  // Check if user can access Ziyara leadership features
  const canAccessZiyaraLeadership = user.role === 'mentor' || user.role === 'admin' || 
    (user.level && (user.level.includes('Level 3') || user.level.includes('Level 4')));

  const sectors = [
    {
      id: 'qirat',
      name: 'Qirat & Ilm',
      description: 'Quran recitation and Islamic knowledge',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      href: '/sectors/qirat-ilm',
      content: sectorData.qirat ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Current Progress</span>
            <span className="text-sm font-bold text-blue-600">{sectorData.qirat.progress}%</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div 
              className="h-2 bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${sectorData.qirat.progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-600">{sectorData.qirat.currentCourse}</p>
        </div>
      ) : null,
      action: 'Register for New Course'
    },
    {
      id: 'literature',
      name: 'Literature',
      description: 'Islamic literature and historical studies',
      icon: PenTool,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      href: '/sectors/literature',
      content: sectorData.literature ? (
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-800 text-sm line-clamp-2">
            {sectorData.literature.latestPost}
          </h4>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>By {sectorData.literature.author}</span>
            <span>{sectorData.literature.readTime}</span>
          </div>
        </div>
      ) : null,
      action: 'Explore History'
    },
    {
      id: 'tarbiya',
      name: 'Terbiyetu Du\'at',
      description: 'Character development and leadership training',
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      href: '/sectors/tarbiya-idad',
      content: sectorData.tarbiya ? (
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-800 text-sm line-clamp-2">
            {sectorData.tarbiya.weeklyTitle}
          </h4>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{sectorData.tarbiya.category}</span>
            <span>{sectorData.tarbiya.downloadCount} downloads</span>
          </div>
        </div>
      ) : null,
      action: 'Download PDF'
    },
    {
      id: 'comparative',
      name: 'Comparative Religion',
      description: 'Interfaith dialogue and religious studies',
      icon: Globe,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      href: '/sectors/comparative-religion',
      content: sectorData.comparative ? (
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-800 text-sm line-clamp-2">
            {sectorData.comparative.bookOfWeek}
          </h4>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>By {sectorData.comparative.author}</span>
            <span className="text-green-600 font-medium">{sectorData.comparative.availability}</span>
          </div>
        </div>
      ) : null,
      action: 'Search Library'
    },
    {
      id: 'ziyara',
      name: 'Ziyara',
      description: 'Community welfare and social services',
      icon: Heart,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-700',
      href: '/sectors/ziyara-enhanced',
      content: canAccessZiyaraLeadership && sectorData.ziyara ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Health Score</span>
            <span className="text-sm font-bold text-rose-600">{sectorData.ziyara.healthScore}%</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{sectorData.ziyara.activeProjects} active projects</span>
            <BarChart3 className="w-3 h-3" />
          </div>
          <p className="text-xs text-slate-600">{sectorData.ziyara.nextEvent}</p>
        </div>
      ) : !canAccessZiyaraLeadership ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-500">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Leadership Access Required</span>
          </div>
          <p className="text-xs text-slate-600">
            Advance to Level 3 or become a mentor to access leadership features
          </p>
        </div>
      ) : null,
      action: canAccessZiyaraLeadership ? 'Manage Welfare' : 'Path to Leadership',
      restricted: !canAccessZiyaraLeadership
    }
  ];

  const getActionIcon = (actionText) => {
    if (actionText.includes('Register')) return BookOpen;
    if (actionText.includes('Explore')) return Search;
    if (actionText.includes('Download')) return Download;
    if (actionText.includes('Search')) return Search;
    if (actionText.includes('Manage')) return BarChart3;
    if (actionText.includes('Path')) return TrendingUp;
    return ChevronRight;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Da'ewa & Irshad Ecosystem
        </h2>
        <p className="text-slate-600">
          Five pillars of comprehensive Islamic education and character development
        </p>
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {sectors.map((sector) => {
          const Icon = sector.icon;
          const ActionIcon = getActionIcon(sector.action);
          
          return (
            <div
              key={sector.id}
              className={`group relative bg-white rounded-2xl shadow-lg border-2 ${sector.borderColor} hover:shadow-xl transition-all duration-300 overflow-hidden ${
                sector.restricted ? 'opacity-75' : 'hover:-translate-y-1'
              }`}
            >
              {/* Background Gradient */}
              <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-br ${sector.color} opacity-10`} />
              
              {/* Content */}
              <div className="relative p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 bg-gradient-to-br ${sector.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {sector.restricted && (
                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">
                    {sector.name}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {sector.description}
                  </p>
                </div>

                {/* Dynamic Content */}
                <div className="min-h-[60px]">
                  {sector.content}
                </div>

                {/* Action Button */}
                <Link
                  href={sector.href}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                    sector.restricted
                      ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                      : `bg-gradient-to-r ${sector.color} text-white hover:shadow-lg group-hover:scale-105`
                  }`}
                  onClick={sector.restricted ? (e) => e.preventDefault() : undefined}
                >
                  <ActionIcon className="w-4 h-4" />
                  {sector.action}
                </Link>
              </div>

              {/* Hover Effect */}
              {!sector.restricted && (
                <div className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className={`bg-gradient-to-r ${colorScheme.bgGradient} rounded-2xl p-6 border-2 ${colorScheme.cardBorder}`}>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Your Learning Journey</h3>
          <p className="text-slate-600 mb-4">
            Progress across all sectors contributes to your overall development
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${colorScheme.textPrimary}`}>65%</div>
              <div className="text-sm text-slate-600">Qirat & Ilm</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${colorScheme.textPrimary}`}>42%</div>
              <div className="text-sm text-slate-600">Literature</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${colorScheme.textPrimary}`}>78%</div>
              <div className="text-sm text-slate-600">Tarbiya</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${colorScheme.textPrimary}`}>
                {canAccessZiyaraLeadership ? '85%' : '--'}
              </div>
              <div className="text-sm text-slate-600">
                {canAccessZiyaraLeadership ? 'Ziyara' : 'Locked'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}