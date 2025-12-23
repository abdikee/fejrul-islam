'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Search, Filter, Plus, Calendar, 
  Users, Clock, ArrowLeft, Edit, Trash2
} from 'lucide-react';
import MentorFooter from '@/components/mentor/MentorFooter';

export default function Assignments() {
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authResponse = await fetch('/api/auth/me');
        const authData = await authResponse.json();
        
        if (authData.success) {
          setUser(authData.user);
        }

        // Mock data for development
        setAssignments([
          { id: 1, title: 'Tafseer Analysis', course: 'Quranic Studies', dueDate: '2025-01-15', submissions: 8, total: 12, status: 'active' },
          { id: 2, title: 'Hadith Research', course: 'Hadith Studies', dueDate: '2025-01-20', submissions: 10, total: 10, status: 'completed' },
          { id: 3, title: 'Islamic Leadership Essay', course: 'Leadership', dueDate: '2025-01-25', submissions: 3, total: 15, status: 'active' },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setUser({ firstName: 'Ahmad', lastName: 'Ibrahim', role: 'mentor' });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/mentor/dashboard" className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-green-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Assignments</h1>
                <p className="text-sm text-slate-600">Create and manage assignments</p>
              </div>
            </div>
            <button 
              onClick={() => alert('Create Assignment feature coming soon!')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Assignment
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
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
                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg whitespace-nowrap"
              >
                Assignments
              </Link>
              <Link
                href="/mentor/submissions"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
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

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-6">
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

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.map((assignment) => (
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
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="w-4 h-4" />
                      {assignment.submissions}/{assignment.total} submitted
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/mentor/assignments/${assignment.id}/edit`} className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-green-600" />
                  </Link>
                  <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-600">
                    Submission Progress: {Math.round((assignment.submissions / assignment.total) * 100)}%
                  </div>
                  <Link href={`/mentor/assignments/${assignment.id}`} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    View Details
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
