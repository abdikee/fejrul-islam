'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  BookOpen, 
  Heart, 
  ChevronRight,
  Calendar,
  Award,
  Sparkles
} from 'lucide-react';

export default function IdentitySection({ colorScheme }) {
  const [currentSpotlight, setCurrentSpotlight] = useState(0);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [studentArt, setStudentArt] = useState([]);

  useEffect(() => {
    // Mock timeline data
    const mockTimeline = [
      {
        year: '2010',
        title: 'HUMSJ Foundation',
        description: 'Established as a student organization dedicated to Islamic education',
        icon: Users,
        color: 'bg-blue-500'
      },
      {
        year: '2015',
        title: 'Four Sectors Launch',
        description: 'Introduced comprehensive educational framework with Qirat, Literature, Tarbiya, and Dawah',
        icon: BookOpen,
        color: 'bg-emerald-500'
      },
      {
        year: '2020',
        title: 'Digital Transformation',
        description: 'Launched online platform and digital learning resources',
        icon: Sparkles,
        color: 'bg-purple-500'
      },
      {
        year: '2024',
        title: 'Amanah Platform',
        description: 'Introduced advanced dashboard with real-time features and personalized learning',
        icon: Award,
        color: 'bg-amber-500'
      }
    ];

    // Mock student art/literature
    const mockArt = [
      {
        id: 1,
        type: 'poem',
        title: 'The Light of Knowledge',
        author: 'Amina Hassan',
        department: 'Literature Sector',
        content: 'In the garden of wisdom, we plant our seeds,\nWith patience and prayer, fulfilling our needs...',
        date: '2024-12-20'
      },
      {
        id: 2,
        type: 'recitation',
        title: 'Surah Al-Fatiha Reflection',
        author: 'Omar Abdullah',
        department: 'Qirat & Ilm',
        content: 'A beautiful reflection on the opening chapter of the Quran and its significance in daily prayer...',
        date: '2024-12-19'
      },
      {
        id: 3,
        type: 'essay',
        title: 'Building Character Through Service',
        author: 'Fatima Ahmed',
        department: 'Tarbiya Sector',
        content: 'How community service shapes our character and brings us closer to the ideals of Islam...',
        date: '2024-12-18'
      }
    ];

    setTimelineEvents(mockTimeline);
    setStudentArt(mockArt);
  }, []);

  // Auto-rotate spotlight every 10 seconds
  useEffect(() => {
    if (studentArt.length > 0) {
      const interval = setInterval(() => {
        setCurrentSpotlight(prev => (prev + 1) % studentArt.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [studentArt.length]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'poem':
        return Heart;
      case 'recitation':
        return BookOpen;
      case 'essay':
        return Users;
      default:
        return BookOpen;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'poem':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'recitation':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'essay':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Our Identity & Heritage
        </h2>
        <p className="text-slate-600">
          Celebrating our journey and showcasing student creativity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HUMSJ History Timeline */}
        <div className={`bg-white rounded-2xl shadow-lg border-2 ${colorScheme.cardBorder} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Clock className={`w-6 h-6 ${colorScheme.iconColor}`} />
              HUMSJ Timeline
            </h3>
            <button className={`text-sm ${colorScheme.textPrimary} hover:${colorScheme.iconColor} font-medium flex items-center gap-1`}>
              View Full History
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              
              return (
                <div key={index} className="flex items-start gap-4 group">
                  {/* Timeline Icon */}
                  <div className={`w-10 h-10 ${event.color} rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 ${event.color} text-white text-xs font-bold rounded`}>
                        {event.year}
                      </span>
                      <h4 className="font-semibold text-slate-800">{event.title}</h4>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Element */}
          <div className={`mt-6 p-4 bg-gradient-to-r ${colorScheme.bgGradient} rounded-xl border ${colorScheme.cardBorder}`}>
            <div className="text-center">
              <p className="font-semibold text-slate-800 mb-1">Be Part of Our Story</p>
              <p className="text-sm text-slate-600">
                Your journey contributes to the continuing legacy of HUMSJ
              </p>
            </div>
          </div>
        </div>

        {/* Student Art Spotlight */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              Student Spotlight
            </h3>
            <div className="flex items-center gap-2">
              {studentArt.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSpotlight(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSpotlight ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {studentArt.length > 0 && (
            <div className="space-y-4">
              {/* Current Spotlight */}
              <div className="relative">
                {studentArt.map((art, index) => {
                  const TypeIcon = getTypeIcon(art.type);
                  
                  return (
                    <div
                      key={art.id}
                      className={`transition-all duration-500 ${
                        index === currentSpotlight 
                          ? 'opacity-100 transform translate-x-0' 
                          : 'opacity-0 transform translate-x-4 absolute inset-0'
                      }`}
                    >
                      {/* Art Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${getTypeColor(art.type)}`}>
                          <TypeIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 mb-1">{art.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>By {art.author}</span>
                            <span>•</span>
                            <span>{art.department}</span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(art.date).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Art Content */}
                      <div className="bg-slate-50 rounded-lg p-4 mb-4">
                        <p className="text-slate-700 leading-relaxed text-sm">
                          {art.content}
                        </p>
                      </div>

                      {/* Art Footer */}
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(art.type)}`}>
                          {art.type.charAt(0).toUpperCase() + art.type.slice(1)}
                        </span>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                          Read Full Piece
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setCurrentSpotlight(prev => prev === 0 ? studentArt.length - 1 : prev - 1)}
                  className="text-sm text-slate-600 hover:text-slate-800 font-medium"
                >
                  ← Previous
                </button>
                <span className="text-sm text-slate-500">
                  {currentSpotlight + 1} of {studentArt.length}
                </span>
                <button
                  onClick={() => setCurrentSpotlight(prev => (prev + 1) % studentArt.length)}
                  className="text-sm text-slate-600 hover:text-slate-800 font-medium"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Contribute Section */}
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <div className="text-center">
              <h4 className="font-semibold text-amber-800 mb-2">Share Your Creativity</h4>
              <p className="text-sm text-amber-700 mb-3">
                Submit your poems, essays, or reflections to be featured in our spotlight
              </p>
              <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors">
                Submit Your Work
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className={`bg-gradient-to-r ${colorScheme.bgGradient} rounded-2xl p-6 border-2 ${colorScheme.cardBorder}`}>
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Our Growing Community</h3>
          <p className="text-slate-600">Building a legacy of knowledge, character, and service</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${colorScheme.textPrimary}`}>1,247</div>
            <div className="text-sm text-slate-600">Active Members</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${colorScheme.textPrimary}`}>156</div>
            <div className="text-sm text-slate-600">Alumni</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${colorScheme.textPrimary}`}>89</div>
            <div className="text-sm text-slate-600">Student Works</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${colorScheme.textPrimary}`}>14</div>
            <div className="text-sm text-slate-600">Years of Service</div>
          </div>
        </div>
      </div>
    </div>
  );
}