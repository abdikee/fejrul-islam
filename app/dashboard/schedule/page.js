'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, Clock, ArrowLeft, Plus, Filter, ChevronLeft, ChevronRight,
  BookOpen, Users, Video, MapPin, Bell, Star, CheckCircle
} from 'lucide-react';
import StudentFooter from '@/components/dashboard/StudentFooter';

export default function StudentSchedule() {
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('month'); // month, week, day

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authResponse = await fetch('/api/auth/me');
        const authData = await authResponse.json();
        
        if (authData.success) {
          setUser(authData.user);
        }

        // Mock schedule data
        const mockEvents = [
          {
            id: 1,
            title: 'Islamic Finance Class',
            type: 'course',
            date: new Date(2024, 11, 25, 10, 0),
            duration: 90,
            location: 'Room 101',
            instructor: 'Dr. Ahmad Hassan',
            color: 'blue'
          },
          {
            id: 2,
            title: 'Quran Study Circle',
            type: 'study_group',
            date: new Date(2024, 11, 25, 14, 30),
            duration: 60,
            location: 'Masjid',
            instructor: 'Ustadh Omar',
            color: 'teal'
          },
          {
            id: 3,
            title: 'Arabic Language Practice',
            type: 'practice',
            date: new Date(2024, 11, 26, 9, 0),
            duration: 45,
            location: 'Online',
            instructor: 'Sister Fatima',
            color: 'green'
          },
          {
            id: 4,
            title: 'Islamic History Lecture',
            type: 'lecture',
            date: new Date(2024, 11, 27, 15, 0),
            duration: 120,
            location: 'Auditorium',
            instructor: 'Prof. Ibrahim',
            color: 'purple'
          },
          {
            id: 5,
            title: 'Fiqh Discussion',
            type: 'discussion',
            date: new Date(2024, 11, 28, 11, 0),
            duration: 75,
            location: 'Room 205',
            instructor: 'Sheikh Abdullah',
            color: 'orange'
          }
        ];
        
        setEvents(mockEvents);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setUser({ firstName: 'Ahmad', gender: 'male' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const genderColors = user?.gender === 'female' ? {
    primary: 'teal',
    secondary: 'purple',
    bgGradient: 'from-teal-50 to-purple-50'
  } : {
    primary: 'emerald',
    secondary: 'blue',
    bgGradient: 'from-emerald-50 to-blue-50'
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'study_group': return Users;
      case 'lecture': return Video;
      case 'practice': return Star;
      case 'discussion': return Users;
      default: return Calendar;
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${genderColors.bgGradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-${genderColors.primary}-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
          <p className="text-slate-600">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${genderColors.bgGradient}`}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/dashboard/${user?.gender}`}
                className={`p-2 hover:bg-${genderColors.primary}-100 rounded-lg transition-colors`}
              >
                <ArrowLeft className={`w-5 h-5 text-${genderColors.primary}-600`} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">My Schedule</h1>
                <p className="text-sm text-slate-600">Manage your Islamic learning schedule</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className={`inline-flex items-center gap-2 px-4 py-2 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors`}>
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className={`px-4 py-2 text-sm font-medium text-${genderColors.primary}-600 hover:bg-${genderColors.primary}-50 rounded-lg transition-colors`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-slate-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="p-3 h-24"></div>;
                  }

                  const dayEvents = getEventsForDate(day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isSelected = day.toDateString() === selectedDate.toDateString();

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`p-2 h-24 border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors ${
                        isToday ? `bg-${genderColors.primary}-50 border-${genderColors.primary}-200` : ''
                      } ${
                        isSelected ? `bg-${genderColors.primary}-100 border-${genderColors.primary}-300` : ''
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? `text-${genderColors.primary}-700` : 'text-slate-800'
                      }`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 bg-${event.color}-100 text-${event.color}-700 rounded truncate`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Events Sidebar */}
          <div className="space-y-6">
            {/* Today's Events */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Events for {selectedDate.toLocaleDateString()}
              </h3>
              
              {getEventsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">No events scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getEventsForDate(selectedDate).map(event => {
                    const Icon = getEventTypeIcon(event.type);
                    return (
                      <div key={event.id} className={`p-4 border-l-4 border-${event.color}-500 bg-${event.color}-50 rounded-r-lg`}>
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 text-${event.color}-600 mt-0.5`} />
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800">{event.title}</h4>
                            <p className="text-sm text-slate-600 mb-2">{event.instructor}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-600">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(event.date)} ({event.duration}min)
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {events.slice(0, 5).map(event => {
                  const Icon = getEventTypeIcon(event.type);
                  return (
                    <div key={event.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                      <Icon className={`w-4 h-4 text-${event.color}-600`} />
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 text-sm">{event.title}</p>
                        <p className="text-xs text-slate-600">
                          {event.date.toLocaleDateString()} at {formatTime(event.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className={`w-full flex items-center gap-3 p-3 text-left hover:bg-${genderColors.primary}-50 rounded-lg transition-colors`}>
                  <Plus className={`w-4 h-4 text-${genderColors.primary}-600`} />
                  <span className="text-slate-700">Add New Event</span>
                </button>
                <button className={`w-full flex items-center gap-3 p-3 text-left hover:bg-${genderColors.primary}-50 rounded-lg transition-colors`}>
                  <Bell className={`w-4 h-4 text-${genderColors.primary}-600`} />
                  <span className="text-slate-700">Set Reminders</span>
                </button>
                <button className={`w-full flex items-center gap-3 p-3 text-left hover:bg-${genderColors.primary}-50 rounded-lg transition-colors`}>
                  <Calendar className={`w-4 h-4 text-${genderColors.primary}-600`} />
                  <span className="text-slate-700">Export Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StudentFooter user={user} />
    </div>
  );
}