'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, Filter, ChevronLeft, ChevronRight, BookOpen, Heart, MessageCircle, Shield } from 'lucide-react';

const weeklySchedule = [
  {
    id: 1,
    day: 'Monday',
    events: [
      {
        time: '6:00 AM',
        title: 'Fajr Prayer & Morning Dhikr',
        type: 'prayer',
        location: 'Main Prayer Hall',
        instructor: 'Imam Abdullah',
        duration: '45 min',
        sector: 'tarbiya'
      },
      {
        time: 'Maghrib - Isha',
        title: 'Tafsir (Afaan Oromo)',
        type: 'class',
        location: 'Main Hall',
        instructor: 'Sheikh Nuru',
        duration: 'Maghrib to Isha',
        sector: 'qirat'
      }
    ]
  },
  {
    id: 2,
    day: 'Tuesday',
    events: [
      {
        time: 'Maghrib - Isha',
        title: 'Tafsir (Afaan Oromo)',
        type: 'class',
        location: 'Main Hall',
        instructor: 'Sheikh Nuru',
        duration: 'Maghrib to Isha',
        sector: 'qirat'
      }
    ]
  },
  {
    id: 3,
    day: 'Wednesday',
    events: [
      {
        time: '6:00 AM',
        title: 'Fajr Prayer & Reflection',
        type: 'prayer',
        location: 'Main Prayer Hall',
        instructor: 'Imam Abdullah',
        duration: '45 min',
        sector: 'tarbiya'
      },
      {
        time: 'Maghrib - Isha',
        title: 'Tafsir (Amharic)',
        type: 'class',
        location: 'Main Hall',
        instructor: 'Sheikh Nuru',
        duration: 'Maghrib to Isha',
        sector: 'qirat'
      }
    ]
  },
  {
    id: 4,
    day: 'Thursday',
    events: [
      {
        time: '6:00 AM',
        title: 'Fajr Prayer & Dua',
        type: 'prayer',
        location: 'Main Prayer Hall',
        instructor: 'Imam Abdullah',
        duration: '45 min',
        sector: 'tarbiya'
      },
      {
        time: 'Maghrib - Isha',
        title: 'Tafsir (Amharic)',
        type: 'class',
        location: 'Main Hall',
        instructor: 'Sheikh Nuru',
        duration: 'Maghrib to Isha',
        sector: 'qirat'
      }
    ]
  },
  {
    id: 5,
    day: 'Friday',
    events: [
      {
        time: '1:00 PM',
        title: 'Jummah Prayer & Khutbah',
        type: 'jummah',
        location: 'Main Prayer Hall',
        instructor: 'Imam Abdullah',
        duration: '60 min',
        sector: 'tarbiya'
      },
      {
        time: '7:00 PM',
        title: 'Majlisu al-Dhikr',
        type: 'circle',
        location: 'Main Hall',
        instructor: 'Community Leaders',
        duration: '90 min',
        sector: 'tarbiya'
      }
    ]
  },
  {
    id: 6,
    day: 'Saturday',
    events: [
      {
        time: '9:00 AM',
        title: 'Morning Prayer & Preparation',
        type: 'prayer',
        location: 'Main Prayer Hall',
        instructor: 'Imam Abdullah',
        duration: '30 min',
        sector: 'tarbiya'
      },
      {
        time: '10:00 AM',
        title: 'Community Study Circle',
        type: 'circle',
        location: 'Main Hall',
        instructor: 'Community Leaders',
        duration: '120 min',
        sector: 'tarbiya'
      }
    ]
  },
  {
    id: 7,
    day: 'Sunday',
    events: [
      {
        time: '9:00 AM',
        title: 'Morning Prayer & Preparation',
        type: 'prayer',
        location: 'Main Prayer Hall',
        instructor: 'Imam Abdullah',
        duration: '30 min',
        sector: 'tarbiya'
      },
      {
        time: '10:00 AM',
        title: 'Islamic Studies Discussion',
        type: 'circle',
        location: 'Main Hall',
        instructor: 'Community Leaders',
        duration: '120 min',
        sector: 'qirat'
      }
    ]
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Annual Islamic Conference',
    date: '2025-02-15',
    time: '9:00 AM - 6:00 PM',
    location: 'Main Auditorium',
    description: 'Comprehensive Islamic knowledge sharing with renowned scholars',
    speakers: ['Dr. Abdullah Al-Mahmud', 'Sheikh Fatima Bint Omar', 'Prof. Hassan Ali'],
    type: 'conference',
    registration: 'Required'
  },
  {
    id: 2,
    title: 'Ramadan Preparation Workshop',
    date: '2025-02-28',
    time: '7:00 PM - 9:00 PM',
    location: 'Community Hall',
    description: 'Spiritual and practical preparation for the holy month',
    speakers: ['Imam Abdullah', 'Ustadha Maryam'],
    type: 'workshop',
    registration: 'Open'
  },
  {
    id: 3,
    title: 'Interfaith Dialogue Symposium',
    date: '2025-03-10',
    time: '2:00 PM - 5:00 PM',
    location: 'Conference Center',
    description: 'Building bridges through respectful dialogue',
    speakers: ['Multi-faith Panel', 'Community Leaders'],
    type: 'symposium',
    registration: 'Required'
  },
  {
    id: 4,
    title: 'Student Research Presentation',
    date: '2025-03-22',
    time: '10:00 AM - 4:00 PM',
    location: 'Academic Hall',
    description: 'Students present their Islamic studies research projects',
    speakers: ['Student Researchers', 'Faculty Reviewers'],
    type: 'presentation',
    registration: 'Open'
  }
];

const sectorColors = {
  qirat: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  literature: 'bg-amber-100 text-amber-700 border-amber-300',
  tarbiya: 'bg-rose-100 text-rose-700 border-rose-300',
  dawah: 'bg-blue-100 text-blue-700 border-blue-300',
  ziyara: 'bg-purple-100 text-purple-700 border-purple-300'
};

const typeIcons = {
  prayer: '🕌',
  class: '📚',
  circle: '⭕',
  workshop: '🛠️',
  seminar: '🎓',
  meeting: '👥',
  training: '💪',
  jummah: '🕌'
};

export default function SchedulePage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0);

  const filteredSchedule = weeklySchedule.map(day => ({
    ...day,
    events: selectedFilter === 'all' 
      ? day.events 
      : day.events.filter(event => event.sector === selectedFilter)
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxjYWxlbmRhcnxlbnwwfHx8fDE3NjYwNTEwMjd8MA&ixlib=rb-4.1.0&q=85"
            alt="Islamic Schedule" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-serif font-bold mb-4">Islamic Learning Schedule</h1>
          <p className="text-2xl font-light">Weekly Classes, Events & Community Programs</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-blue-600 font-semibold">Schedule</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <section className="py-6 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Weekly Schedule</h2>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sectors</option>
                <option value="qirat">Qirat & Ilm</option>
                <option value="literature">Literature & History</option>
                <option value="tarbiya">Tarbiya & Idad</option>
                <option value="dawah">Dawah & Comparative Religion</option>
                <option value="ziyara">Ziyara (Student Welfare)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule Grid */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            {filteredSchedule.map((day) => (
              <div key={day.id} className="bg-white rounded-lg shadow-md border border-slate-200">
                <div className="p-4 bg-blue-600 text-white rounded-t-lg">
                  <h3 className="font-bold text-center">{day.day}</h3>
                </div>
                
                <div className="p-4 space-y-3">
                  {day.events.length > 0 ? (
                    day.events.map((event, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${sectorColors[event.sector]}`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{typeIcons[event.type]}</span>
                          <span className="text-xs font-semibold">{event.time}</span>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                        <p className="text-xs opacity-75">{event.instructor}</p>
                        <p className="text-xs opacity-75">{event.duration}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm text-center py-4">No events for selected filter</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Special Events */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Upcoming Special Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    {event.type}
                  </span>
                </div>
                
                <p className="text-slate-600 mb-4">{event.description}</p>
                
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Registration: {event.registration}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 mb-2">Speakers:</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.speakers.map((speaker, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                        {speaker}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => alert('Event registration coming soon!')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Register for Event
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedEvent.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedEvent.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedEvent.location}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Instructor:</h3>
                  <p className="text-slate-600">{selectedEvent.instructor}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Duration:</h3>
                  <p className="text-slate-600">{selectedEvent.duration}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Event Type:</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${sectorColors[selectedEvent.sector]}`}>
                    {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                  </span>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">About this Event:</h4>
                  <p className="text-slate-600 text-sm">
                    This {selectedEvent.type} is part of our comprehensive Islamic education program. 
                    Join us for an enriching experience that combines traditional Islamic knowledge 
                    with practical application for modern Muslim life.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                <button 
                  onClick={() => alert('Event registration coming soon!')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Join This Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Join Our Learning Community</h2>
          <p className="text-xl mb-6 text-blue-100">Participate in our comprehensive Islamic education programs</p>
          <Link 
            href="/auth/login" 
            className="inline-block px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
}