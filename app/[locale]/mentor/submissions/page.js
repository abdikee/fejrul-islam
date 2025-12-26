'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileCheck, Clock, Eye
} from 'lucide-react';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [error, setError] = useState('');
  const pathname = usePathname();
  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';
  const mentorBase = `${localePrefix}/mentor`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        const res = await fetch(`/api/mentor/submissions?status=${encodeURIComponent(filterStatus)}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || 'Failed to load submissions');
        }
        setSubmissions(data.submissions || []);
      } catch (error) {
        console.error('Error:', error);
        setError(error?.message || 'Failed to load submissions');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <MentorPageTemplate
      title="Reviews & Submissions"
      description="Review student submissions"
      icon={FileCheck}
    >
        {error ? (
          <div className="bg-white rounded-2xl p-6 border border-red-200 text-red-700 mb-6">{error}</div>
        ) : null}

        <div className="bg-white rounded-2xl p-6 border border-green-200 mb-6">
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Submissions</option>
              <option value="pending">Pending Review</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{submission.assignment}</h3>
                  <p className="text-sm text-slate-600 mb-3">Submitted by {submission.student}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : '—'}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      submission.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`${mentorBase}/submissions/${submission.id}`} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Review
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
    </MentorPageTemplate>
  );
}
