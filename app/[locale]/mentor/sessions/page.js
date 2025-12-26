'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Plus, Video, Users, Clock } from 'lucide-react';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pathname = usePathname();
  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';
  const mentorBase = `${localePrefix}/mentor`;

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const res = await fetch('/api/mentor/sessions', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.message || 'Failed to load sessions');
        setSessions(data.sessions || []);
      } catch (e) {
        console.error(e);
        setError(e?.message || 'Failed to load sessions');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <MentorPageTemplate
      title="Sessions"
      description="Schedule and manage mentoring sessions"
      icon={Calendar}
      loading={loading}
      actions={
        <Link
          href={`${mentorBase}/sessions/schedule`}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Session
        </Link>
      }
    >
      {error ? (
        <div className="bg-white rounded-2xl p-6 border border-red-200 text-red-700 mb-6">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 mb-2">{session.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  session.type === 'Group' ? 'bg-blue-100 text-blue-700' :
                  session.type === 'One-on-One' ? 'bg-purple-100 text-purple-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {session.type}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-slate-600 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {session.date ? new Date(session.date).toLocaleString() : '—'}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {session.students} {session.students === 1 ? 'student' : 'students'}
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" disabled>
              <Video className="w-4 h-4" />
              Join Session
            </button>
          </div>
        ))}
      </div>
    </MentorPageTemplate>
  );
}
