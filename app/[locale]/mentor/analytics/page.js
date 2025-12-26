'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, BookOpen, Award, Activity } from 'lucide-react';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, studentsRes] = await Promise.all([
          fetch('/api/mentor/stats', { credentials: 'include' }),
          fetch('/api/mentor/students', { credentials: 'include' }),
        ]);
        const statsData = await statsRes.json();
        const studentsData = await studentsRes.json();

        if (!statsData.success) throw new Error(statsData.message || 'Failed to fetch stats');
        if (!studentsData.success) throw new Error(studentsData.message || 'Failed to fetch students');

        const students = studentsData.students || [];
        const totalStudents = students.length;
        const activeStudents = students.filter((s) => s.status === 'active').length;
        const avgProgress = totalStudents
          ? Math.round(students.reduce((sum, s) => sum + (Number(s.progress) || 0), 0) / totalStudents)
          : 0;

        const engagement = totalStudents ? Math.round((activeStudents / totalStudents) * 100) : 0;
        const completionRate = Number(statsData.stats?.completionRate || 0);

        // These are derived from real backend numbers; they will be 0 when the related data doesn't exist.
        const pendingSubmissions = Number(statsData.stats?.pendingSubmissions || 0);
        const activeAssignments = Number(statsData.stats?.activeAssignments || 0);
        const assignmentCompletion = activeAssignments > 0
          ? Math.max(0, Math.min(100, Math.round(100 - (pendingSubmissions / activeAssignments) * 100)))
          : 0;

        const upcomingSessions = Number(statsData.stats?.upcomingSessions || 0);
        const sessionAttendance = upcomingSessions > 0 ? 100 : 0;

        setAnalytics({
          overview: {
            totalStudents,
            activeStudents,
            avgProgress,
            completionRate,
          },
          performance: [
            { metric: 'Student Engagement', value: engagement, color: 'bg-green-500' },
            { metric: 'Assignment Completion', value: assignmentCompletion, color: 'bg-emerald-500' },
            { metric: 'Session Readiness', value: sessionAttendance, color: 'bg-teal-500' },
            { metric: 'Overall Progress', value: avgProgress, color: 'bg-blue-500' }
          ]
        });
      } catch (e) {
        console.error('Mentor analytics error:', e);
        setError(e?.message || 'Failed to load analytics');
        setAnalytics({
          overview: { totalStudents: 0, activeStudents: 0, avgProgress: 0, completionRate: 0 },
          performance: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <MentorPageTemplate
      title="Analytics"
      description="Track your mentorship performance and student progress"
      icon={BarChart3}
      loading={loading}
      error={error}
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
    </MentorPageTemplate>
  );
}
