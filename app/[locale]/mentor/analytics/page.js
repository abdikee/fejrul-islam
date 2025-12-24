'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, BookOpen, Award, Activity } from 'lucide-react';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setAnalytics({
      overview: {
        totalStudents: 45,
        activeStudents: 38,
        avgProgress: 78,
        completionRate: 85
      },
      performance: [
        { metric: 'Student Engagement', value: 88, color: 'bg-green-500' },
        { metric: 'Assignment Completion', value: 94, color: 'bg-emerald-500' },
        { metric: 'Session Attendance', value: 92, color: 'bg-teal-500' },
        { metric: 'Feedback Quality', value: 96, color: 'bg-blue-500' }
      ]
    });
    setLoading(false);
  }, []);

  return (
    <MentorPageTemplate
      title="Analytics"
      description="Track your mentorship performance and student progress"
      icon={BarChart3}
      loading={loading}
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{analytics?.overview.totalStudents}</h3>
          <p className="text-slate-600 text-sm">Total Students</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{analytics?.overview.activeStudents}</h3>
          <p className="text-slate-600 text-sm">Active Students</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+5%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{analytics?.overview.avgProgress}%</h3>
          <p className="text-slate-600 text-sm">Avg Progress</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+3%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{analytics?.overview.completionRate}%</h3>
          <p className="text-slate-600 text-sm">Completion Rate</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-2xl p-6 border border-green-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Mentorship Performance</h2>
        <div className="space-y-6">
          {analytics?.performance.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">{item.metric}</span>
                <span className="text-sm font-bold text-slate-800">{item.value}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className={`${item.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Analytics Placeholder */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-green-200" />
        <h3 className="text-xl font-bold mb-2">Advanced Analytics Coming Soon</h3>
        <p className="text-green-100">Detailed charts, trends, and insights will be available here</p>
      </div>
    </MentorPageTemplate>
  );
}
