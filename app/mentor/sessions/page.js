'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Video, Users, Clock } from 'lucide-react';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setSessions([
      { id: 1, title: 'Usrah Circle Meeting', date: '2025-01-15T18:00', type: 'Group', students: 8, status: 'upcoming' },
      { id: 2, title: 'Individual Counseling - Omar', date: '2025-01-16T15:00', type: 'One-on-One', students: 1, status: 'upcoming' },
      { id: 3, title: 'Assignment Review Session', date: '2025-01-17T19:00', type: 'Academic', students: 12, status: 'upcoming' },
    ]);
    setLoading(false);
  }, []);

  return (
    <MentorPageTemplate
      title="Sessions"
      description="Schedule and manage mentoring sessions"
      icon={Calendar}
      loading={loading}
      actions={
        <button
          onClick={() => alert('Schedule Session feature coming soon!')}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Session
        </button>
      }
    >
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
                {new Date(session.date).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {session.students} {session.students === 1 ? 'student' : 'students'}
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Video className="w-4 h-4" />
              Join Session
            </button>
          </div>
        ))}
      </div>
    </MentorPageTemplate>
  );
}
