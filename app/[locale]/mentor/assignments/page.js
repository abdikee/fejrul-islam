'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, Search, Filter, Plus, Calendar, 
  Users
} from 'lucide-react';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';
  const mentorBase = `${localePrefix}/mentor`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        const res = await fetch('/api/mentor/assignments', { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok || !data?.success) {
          throw new Error(data?.message || 'Failed to load assignments');
        }

        setAssignments(data.assignments || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error?.message || 'Failed to load assignments');
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  const filteredAssignments = assignments.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (a.title || '').toLowerCase().includes(q) ||
      (a.course || '').toLowerCase().includes(q)
    );
  });

  return (
    <MentorPageTemplate
      title="Assignments"
      description="Create and manage assignments"
      icon={BookOpen}
      actions={
        <Link
          href={`${mentorBase}/assignments/new`}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Assignment
        </Link>
      }
    >
        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 border border-green-200 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-white rounded-2xl p-6 border border-red-200 text-red-700 mb-6">
            {error}
          </div>
        ) : null}

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-800">{assignment.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      assignment.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{assignment.course}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : '—'}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="w-4 h-4" />
                      {assignment.submissions}/{assignment.total} submitted
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-600">
                    Submission Progress:{' '}
                    {assignment.total > 0
                      ? `${Math.round((assignment.submissions / assignment.total) * 100)}%`
                      : '—'}
                  </div>
                  <Link href={`${mentorBase}/assignments/${assignment.id}`} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
    </MentorPageTemplate>
  );
}
