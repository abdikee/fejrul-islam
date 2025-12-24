'use client';

import { useEffect, useState } from 'react';
import { Calendar, Bell } from 'lucide-react';

export default function AnnouncementsBoard() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcements?audience=public&limit=5');
        const data = await res.json();
        if (data?.success && Array.isArray(data.announcements)) {
          setAnnouncements(
            data.announcements.map((a) => ({
              id: a.id,
              title: a.title,
              description: a.content,
              date: new Date(a.publish_date || a.created_at).toLocaleDateString(),
              priority: a.priority === 'urgent' || a.priority === 'high' ? 'high' : 'normal'
            }))
          );
        }
      } catch (e) {
        console.error('Public announcements fetch error:', e);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-slate-800">Announcements</h2>
      </div>
      
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div 
            key={announcement.id} 
            className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className={`w-1 h-full rounded-full ${announcement.priority === 'high' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 mb-1">{announcement.title}</h3>
                <p className="text-slate-600 text-sm mb-2">{announcement.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {announcement.date}
                  </span>
                  <span className={`px-2 py-1 rounded-full ${announcement.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {announcement.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}