'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, Calendar, Clock, AlertTriangle, Star, Info, RefreshCw } from 'lucide-react';

export default function MentorAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await fetch('/api/announcements?audience=mentors&limit=25');
      const data = await response.json();

      if (!data?.success) {
        throw new Error(data?.message || 'Failed to fetch announcements');
      }

      setAnnouncements(Array.isArray(data.announcements) ? data.announcements : []);
    } catch (err) {
      console.error('Mentor announcements fetch error:', err);
      setErrorMessage(err?.message || 'Failed to load announcements');
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 300000);
    return () => clearInterval(interval);
  }, []);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return AlertTriangle;
      case 'high':
        return Star;
      default:
        return Info;
    }
  };

  const sortedAnnouncements = useMemo(() => {
    const priorityOrder = { urgent: 3, high: 2, normal: 1, low: 0 };
    return [...announcements].sort((a, b) => {
      const pa = priorityOrder[a.priority] ?? 0;
      const pb = priorityOrder[b.priority] ?? 0;
      if (pb !== pa) return pb - pa;
      return new Date(b.publish_date || b.created_at) - new Date(a.publish_date || a.created_at);
    });
  }, [announcements]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-green-200 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>
              <p className="text-slate-600">Updates for mentors and public notices</p>
            </div>
          </div>

          <button
            onClick={fetchAnnouncements}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading announcements…</p>
        </div>
      ) : errorMessage ? (
        <div className="bg-white rounded-2xl border border-red-200 p-10 text-center">
          <p className="text-red-700 font-medium">{errorMessage}</p>
          <button
            onClick={fetchAnnouncements}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try again
          </button>
        </div>
      ) : sortedAnnouncements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedAnnouncements.map((a) => {
            const PriorityIcon = getPriorityIcon(a.priority);
            const date = new Date(a.publish_date || a.created_at);

            return (
              <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-100">
                    <PriorityIcon className="w-6 h-6 text-green-700" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-800">{a.title}</h3>
                      {a.priority && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {a.priority}
                        </span>
                      )}
                      {a.announcement_type && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {a.announcement_type}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {date.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {date.toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-slate-700 whitespace-pre-line">{a.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
