'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Bell } from 'lucide-react';
import DashboardPageLayout from '@/components/dashboard/DashboardPageLayout';

export default function DashboardEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock events data
    setEvents([
      { id: 1, title: 'Weekly Halaqah', date: '2025-12-25', time: '19:00', location: 'Main Hall', type: 'Regular', attendees: 45 },
      { id: 2, title: 'Dawah Training Workshop', date: '2025-12-27', time: '14:00', location: 'Room 201', type: 'Workshop', attendees: 25 },
      { id: 3, title: 'Quran Competition', date: '2025-12-30', time: '09:00', location: 'Auditorium', type: 'Competition', attendees: 100 },
      { id: 4, title: 'New Year Islamic Reflection', date: '2026-01-01', time: '20:00', location: 'Online', type: 'Special', attendees: 200 },
    ]);
    setLoading(false);
  }, []);

  const getTypeColor = (type) => {
    const colors = {
      'Regular': 'bg-blue-100 text-blue-700',
      'Workshop': 'bg-purple-100 text-purple-700',
      'Competition': 'bg-amber-100 text-amber-700',
      'Special': 'bg-emerald-100 text-emerald-700'
    };
    return colors[type] || 'bg-slate-100 text-slate-700';
  };

  return (
    <DashboardPageLayout title="Events" subtitle="Upcoming Islamic events and activities">
      <div className="container mx-auto px-4 lg:px-6 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading events...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{event.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.attendees} attending
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      RSVP
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
}
