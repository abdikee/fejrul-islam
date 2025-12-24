'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileCheck, Search, Filter, Clock, CheckCircle, 
  XCircle, ArrowLeft, Eye, Download
} from 'lucide-react';
import MentorFooter from '@/components/mentor/MentorFooter';

export default function Submissions() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/mentor/dashboard" className="p-2 hover:bg-green-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-green-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Reviews & Submissions</h1>
              <p className="text-sm text-slate-600">Review student submissions</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-green-50 border-b border-green-200 sticky top-16 z-30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-1 overflow-x-auto">
              <Link
                href="/mentor/dashboard"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Dashboard
              </Link>
              <Link
                href="/mentor/students"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
              >
                My Students
              </Link>
              <Link
                href="/mentor/assignments"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Assignments
              </Link>
              <Link
                href="/mentor/submissions"
                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg whitespace-nowrap"
              >
                Reviews
              </Link>
              <Link
                href="/mentor/sessions"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Sessions
              </Link>
              <Link
                href="/mentor/sectors"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Sectors
              </Link>
              <Link
                href="/mentor/analytics"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 lg:px-6 py-6">
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
                  <Link href={`/mentor/submissions/${submission.id}`} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Review
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <MentorFooter user={user} />
    </div>
  );
}
