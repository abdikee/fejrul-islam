'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Mail, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  Archive,
  MoreVertical,
  Trash2,
  Reply
} from 'lucide-react';

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, read, replied
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/contact-submissions');
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch('/api/admin/contact-submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      
      if (response.ok) {
        setSubmissions(prev => prev.map(sub => 
          sub.id === id ? { ...sub, status: newStatus } : sub
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesFilter = filter === 'all' || sub.status === filter;
    const matchesSearch = 
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.email.toLowerCase().includes(search.toLowerCase()) ||
      sub.subject?.toLowerCase().includes(search.toLowerCase()) ||
      sub.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'read': return 'bg-gray-100 text-gray-700';
      case 'replied': return 'bg-emerald-100 text-emerald-700';
      case 'archived': return 'bg-slate-100 text-slate-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Mail className="w-6 h-6 text-emerald-600" />
              Contact Submissions
            </h1>
            <p className="text-slate-600 mt-1">Manage inquiries from the contact form</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Messages</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading messages...</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800">No messages found</h3>
              <p className="text-slate-500">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredSubmissions.map((submission) => (
                <div key={submission.id} className={`p-6 hover:bg-slate-50 transition-colors ${submission.status === 'new' ? 'bg-blue-50/30' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {submission.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(submission.created_at).toLocaleDateString()} at {new Date(submission.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">
                        {submission.subject || 'No Subject'}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                        <span className="font-medium">{submission.name}</span>
                        <span className="text-slate-400">&bull;</span>
                        <a href={`mailto:${submission.email}`} className="text-emerald-600 hover:underline">
                          {submission.email}
                        </a>
                      </div>
                      
                      <p className="text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
                        {submission.message}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {submission.status === 'new' && (
                        <button
                          onClick={() => updateStatus(submission.id, 'read')}
                          className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          title="Mark as Read"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <a
                        href={`mailto:${submission.email}?subject=Re: ${submission.subject}`}
                        onClick={() => updateStatus(submission.id, 'replied')}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Reply via Email"
                      >
                        <Reply className="w-5 h-5" />
                      </a>
                      {submission.status !== 'archived' && (
                        <button
                          onClick={() => updateStatus(submission.id, 'archived')}
                          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                          title="Archive"
                        >
                          <Archive className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
