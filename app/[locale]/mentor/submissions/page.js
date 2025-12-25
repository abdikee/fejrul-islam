'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileCheck, Search, Filter, Clock, CheckCircle, 
  XCircle, ArrowLeft, Eye, Download
} from 'lucide-react';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';

export default function Submissions() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const pathname = usePathname();
  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';
  const mentorBase = `${localePrefix}/mentor`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authResponse = await fetch('/api/auth/me');
        const authData = await authResponse.json();
        
        if (authData.success) {
          setUser(authData.user);
        }

        // Mock data
        setSubmissions([
          { id: 1, student: 'Fatima Hassan', assignment: 'Tafseer Analysis', submittedAt: '2025-01-10', status: 'pending' },
          { id: 2, student: 'Omar Abdullah', assignment: 'Hadith Research', submittedAt: '2025-01-09', status: 'pending' },
          { id: 3, student: 'Aisha Mohamed', assignment: 'Islamic Leadership Essay', submittedAt: '2025-01-08', status: 'reviewed' },
        ]);
      } catch (error) {
        console.error('Error:', error);
        setUser({ firstName: 'Ahmad', role: 'mentor' });
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
          <p className="text-slate-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  const filteredSubmissions = submissions.filter(s => filterStatus === 'all' || s.status === filterStatus);

  return (
    <MentorPageTemplate
      title="Reviews & Submissions"
      description="Review student submissions"
      icon={FileCheck}
    >
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
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{submission.assignment}</h3>
                  <p className="text-sm text-slate-600 mb-3">Submitted by {submission.student}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(submission.submittedAt).toLocaleDateString()}
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
