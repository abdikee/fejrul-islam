'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Target, CheckCircle, Calendar, Star, Award, ArrowRight } from 'lucide-react';

const studyTracks = [
  {
    id: 1,
    title: 'Foundation Track',
    duration: '6 months',
    level: 'Beginner',
    description: 'Essential Islamic knowledge for new students',
    color: 'emerald',
    modules: [
      {
        name: 'Aqeedah (Islamic Creed)',
        weeks: 4,
        topics: ['Tawheed (Monotheism)', 'Prophethood', 'Day of Judgment', 'Divine Decree']
      },
      {
        name: 'Basic Fiqh (Jurisprudence)',
        weeks: 6,
        topics: ['Purification (Taharah)', 'Prayer (Salah)', 'Fasting (Sawm)', 'Charity (Zakah)']
      },
      {
        name: 'Seerah (Prophet\'s Biography)',
        weeks: 8,
        topics: ['Makkah Period', 'Hijra & Madinah', 'Major Battles', 'Final Years']
      },
      {
        name: 'Quran Basics',
        weeks: 6,
        topics: ['Arabic Alphabet', 'Basic Tajweed', 'Short Surahs', 'Daily Recitation']
      }
    ]
  },
  {
    id: 2,
    title: 'Intermediate Track',
    duration: '8 months',
    level: 'Intermediate',
    description: 'Deeper Islamic studies for advancing students',
    color: 'blue',
    modules: [
      {
        name: 'Advanced Fiqh',
        weeks: 8,
        topics: ['Marriage & Family', 'Business Ethics', 'Criminal Law', 'Comparative Madhabs']
      },
      {
        name: 'Hadith Sciences',
        weeks: 6,
        topics: ['Hadith Classification', 'Major Collections', 'Narrator Criticism', 'Practical Application']
      },
      {
        name: 'Tafseer (Quranic Exegesis)',
        weeks: 10,
        topics: ['Methodology', 'Classical Commentaries', 'Contemporary Issues', 'Thematic Studies']
      },
      {
        name: 'Islamic History',
        weeks: 8,
        topics: ['Rightly-Guided Caliphs', 'Umayyad & Abbasid', 'Islamic Civilization', 'Modern Era']
      }
    ]
  },
  {
    id: 3,
    title: 'Advanced Track',
    duration: '12 months',
    level: 'Advanced',
    description: 'Specialized studies for serious students',
    color: 'purple',
    modules: [
      {
        name: 'Usul al-Fiqh (Principles of Jurisprudence)',
        weeks: 12,
        topics: ['Sources of Law', 'Methodology', 'Ijtihad', 'Contemporary Applications']
      },
      {
        name: 'Arabic Language Mastery',
        weeks: 16,
        topics: ['Advanced Grammar', 'Classical Texts', 'Poetry Analysis', 'Linguistic Sciences']
      },
      {
        name: 'Islamic Philosophy',
        weeks: 10,
        topics: ['Classical Philosophers', 'Theology (Kalam)', 'Sufism', 'Modern Thought']
      },
      {
        name: 'Research Methodology',
        weeks: 10,
        topics: ['Academic Writing', 'Source Criticism', 'Thesis Preparation', 'Publication']
      }
    ]
  }
];

const learningPaths = [
  {
    title: 'Imam Preparation Path',
    description: 'Complete preparation for community leadership',
    tracks: ['Foundation Track', 'Intermediate Track', 'Advanced Track'],
    specializations: ['Khutbah Preparation', 'Community Counseling', 'Interfaith Relations'],
    duration: '26 months',
    certification: 'Imam Certification'
  },
  {
    title: 'Scholar Development Path',
    description: 'Academic and research-focused Islamic studies',
    tracks: ['Foundation Track', 'Intermediate Track', 'Advanced Track'],
    specializations: ['Research Methods', 'Academic Writing', 'Teaching Methodology'],
    duration: '26 months',
    certification: 'Islamic Studies Diploma'
  },
  {
    title: 'Community Educator Path',
    description: 'Training for Islamic education and dawah',
    tracks: ['Foundation Track', 'Intermediate Track'],
    specializations: ['Pedagogy', 'Curriculum Design', 'Youth Engagement'],
    duration: '14 months',
    certification: 'Education Certificate'
  },
  {
    title: 'Personal Development Path',
    description: 'Self-paced learning for personal growth',
    tracks: ['Foundation Track'],
    specializations: ['Spiritual Development', 'Family Life', 'Professional Ethics'],
    duration: '6 months',
    certification: 'Completion Certificate'
  }
];

const colorMap = {
  emerald: 'from-emerald-500 to-emerald-700',
  blue: 'from-blue-500 to-blue-700',
  purple: 'from-purple-500 to-purple-700'
};

export default function StudyPlanPage() {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxzdHVkeXxlbnwwfHx8fDE3NjYwNTEwMjd8MA&ixlib=rb-4.1.0&q=85"
            alt="Islamic Study Plan" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-serif font-bold mb-4">Islamic Study Plan</h1>
          <p className="text-2xl font-light">Structured Learning Paths for Islamic Knowledge</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-emerald-600">Home</Link>
            <span>/</span>
            <span className="text-emerald-600 font-semibold">Study Plan</span>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Comprehensive Islamic Education</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our structured study plans provide systematic Islamic education from foundational knowledge 
              to advanced scholarship. Each track is carefully designed to build upon previous learning 
              while maintaining practical application and spiritual development.
            </p>
          </div>
        </div>
      </section>

      {/* Study Tracks */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Study Tracks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studyTracks.map((track) => (
              <div 
                key={track.id}
                className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedTrack(track)}
              >
                <div className={`h-2 bg-gradient-to-r ${colorMap[track.color]}`}></div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800">{track.title}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      track.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      track.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {track.level}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 mb-4">{track.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {track.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {track.modules.length} modules
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {track.modules.slice(0, 2).map((module, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-semibold text-slate-700">{module.name}</span>
                        <span className="text-slate-500"> ({module.weeks} weeks)</span>
                      </div>
                    ))}
                    {track.modules.length > 2 && (
                      <div className="text-sm text-slate-500">
                        +{track.modules.length - 2} more modules...
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center text-emerald-600 font-semibold hover:gap-3 gap-2 transition-all">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-4">Learning Paths</h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            Choose a specialized learning path that aligns with your goals and career aspirations
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {learningPaths.map((path, idx) => (
              <div 
                key={idx}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPath(path)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{path.title}</h3>
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                
                <p className="text-slate-600 mb-4">{path.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-sm font-semibold text-slate-700">Duration: </span>
                    <span className="text-sm text-slate-600">{path.duration}</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-700">Certification: </span>
                    <span className="text-sm text-slate-600">{path.certification}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {path.specializations.slice(0, 2).map((spec, specIdx) => (
                    <span key={specIdx} className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                      {spec}
                    </span>
                  ))}
                  {path.specializations.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-slate-200 text-slate-600 rounded-full">
                      +{path.specializations.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Detail Modal */}
      {selectedTrack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedTrack.title}</h2>
                  <p className="text-slate-600">{selectedTrack.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span>Duration: {selectedTrack.duration}</span>
                    <span>Level: {selectedTrack.level}</span>
                    <span>Modules: {selectedTrack.modules.length}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTrack(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800">Curriculum Modules</h3>
                {selectedTrack.modules.map((module, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-800">{module.name}</h4>
                      <span className="text-sm text-slate-500">{module.weeks} weeks</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {module.topics.map((topic, topicIdx) => (
                        <div key={topicIdx} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                <button 
                  onClick={() => alert('Enrollment system coming soon!')}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                >
                  Enroll in {selectedTrack.title}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Path Detail Modal */}
      {selectedPath && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedPath.title}</h2>
                  <p className="text-slate-600">{selectedPath.description}</p>
                </div>
                <button
                  onClick={() => setSelectedPath(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Required Tracks</h3>
                  <div className="space-y-2">
                    {selectedPath.tracks.map((track, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {track}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Specializations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedPath.specializations.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-700">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h4 className="font-bold text-emerald-900 mb-2">Path Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-emerald-800">Duration:</span>
                      <p className="text-emerald-700">{selectedPath.duration}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-800">Certification:</span>
                      <p className="text-emerald-700">{selectedPath.certification}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                <button 
                  onClick={() => alert('Path enrollment coming soon!')}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                >
                  Start {selectedPath.title}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-12 bg-emerald-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Ready to Begin Your Islamic Studies?</h2>
          <p className="text-xl mb-6 text-emerald-100">Choose your learning path and start your journey today</p>
          <Link 
            href="/auth/login" 
            className="inline-block px-8 py-3 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}