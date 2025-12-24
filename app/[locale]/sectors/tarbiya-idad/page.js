'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Users, GraduationCap, BookOpen, Download, Award, ChevronRight, Calendar, User, Clock, CheckCircle } from 'lucide-react';
import TrainingMaterials from '@/components/ui/TrainingMaterials';
import DuatVettingForm from '@/components/forms/DuatVettingForm';
import EnrollmentGate from '@/components/enrollment/EnrollmentGate';
import { idadPrograms } from '@/data/training';

const subsections = [
  {
    title: 'Tazkiyat al-Nafs',
    icon: Heart,
    color: 'rose',
    items: ['Heart Purification', 'Spiritual Diseases', 'Self-Accountability']
  },
  {
    title: 'Usrah Circles',
    icon: Users,
    color: 'purple',
    items: ['Peer Mentorship', 'Accountability Groups', 'Brotherhood & Sisterhood']
  },
  {
    title: 'Family Tarbiya',
    icon: BookOpen,
    color: 'blue',
    items: ['Marriage (Sakinah)', 'Parenting as Amanah', 'Adab of Divorce']
  }
];

const weeklySchedule = [
  {
    id: 1,
    day: 'Monday',
    time: '7:00 PM',
    topic: 'Tazkiyat al-Nafs',
    description: 'Heart purification and spiritual development',
    instructor: 'Ustadh Ahmad',
    participants: 45
  },
  {
    id: 2,
    day: 'Wednesday',
    time: '6:30 PM',
    topic: 'Usrah Circle',
    description: 'Brotherhood building and accountability',
    instructor: 'Ustadh Omar',
    participants: 32
  },
  {
    id: 3,
    day: 'Friday',
    time: '8:00 PM',
    topic: 'Family Tarbiya',
    description: 'Islamic family values and relationships',
    instructor: 'Ustadha Fatima',
    participants: 38
  }
];

const achievements = [
  { label: 'Students Trained', value: '2,156', icon: Users },
  { label: 'Programs Completed', value: '89', icon: GraduationCap },
  { label: 'Active Mentors', value: '67', icon: Heart },
  { label: 'Success Rate', value: '94%', icon: Award }
];

const colorClasses = {
  rose: 'bg-rose-100 text-rose-700 border-rose-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
  blue: 'bg-blue-100 text-blue-700 border-blue-300'
};

export default function TarbiyaIdadPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1543525238-54e3d131f7ca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxwcmF5ZXJ8ZW58MHx8fHwxNzY2MDM5MjYwfDA&ixlib=rb-4.1.0&q=85"
            alt="Spiritual Growth" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 to-purple-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-serif font-bold mb-4">Tarbiya & Idad Academy</h1>
          <p className="text-2xl font-light">Character Development, Spiritual Growth & Leadership Training</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <span>/</span>
            <span className="text-rose-600 font-semibold">Tarbiya & Idad</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="container mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'training', label: 'Weekly Training', icon: Download },
              { id: 'idad', label: 'Idad Programs', icon: GraduationCap },
              { id: 'apply', label: 'Apply Now', icon: Award }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-rose-600 text-rose-600'
                      : 'border-transparent text-slate-600 hover:text-rose-600'
                  }`}
                >
                  <TabIcon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-6 py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Introduction */}
            <section className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Nurturing the Soul & Training Leaders</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                The Tarbiya & Idad sector focuses on holistic character development through systematic self-purification, 
                peer support, spiritual practices, and specialized leadership training. We cultivate individuals who embody 
                Islamic values and serve as beacons of guidance for the Ummah.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-rose-50 p-6 rounded-lg border border-rose-200">
                  <h3 className="font-bold text-rose-900 mb-3 text-xl">Tarbiya Focus</h3>
                  <p className="text-slate-700">
                    Character purification, spiritual discipline, and family ethics rooted in Quran and Sunnah
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-3 text-xl">Idad Focus</h3>
                  <p className="text-slate-700">
                    Specialized training for leaders, callers, imams, and public speakers serving the Muslim community
                  </p>
                </div>
              </div>
            </section>

            {/* Tarbiya Tracks */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-slate-800 mb-8 text-center">
                Spiritual Development Tracks
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subsections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div 
                      key={section.title}
                      className={`rounded-xl p-6 border-2 ${colorClasses[section.color]} hover:shadow-lg transition-shadow`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="w-8 h-8" />
                        <h3 className="text-2xl font-bold">{section.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {section.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-current rounded-full mt-2"></span>
                            <span className="text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Quranic Inspiration */}
            <section className="bg-gradient-to-r from-rose-600 to-purple-800 text-white p-12 rounded-xl shadow-lg">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-3xl font-serif italic mb-4">
                  "Indeed, he succeeds who purifies his soul, and he fails who corrupts it."
                </p>
                <p className="text-rose-200 text-lg">Surah Ash-Shams (91:9-10)</p>
              </div>
            </section>

            {/* Achievements Section */}
            <section className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-3xl font-serif font-bold text-slate-800 mb-8 text-center">Our Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {achievements.map((achievement, idx) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={idx} className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <Icon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                      <p className="text-2xl font-bold text-slate-800">{achievement.value}</p>
                      <p className="text-sm text-slate-600">{achievement.label}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* Weekly Training Tab */}
        {activeTab === 'training' && (
          <EnrollmentGate
            programType="sector"
            programId="tarbiya-idad"
            programName="Tarbiya & Idad Academy"
            requiresForm={true}
            formFields={[
              {
                name: 'level',
                label: 'Current Islamic Knowledge Level',
                type: 'select',
                required: true,
                options: [
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' }
                ]
              },
              {
                name: 'goals',
                label: 'What are your spiritual development goals?',
                type: 'textarea',
                required: true,
                placeholder: 'Describe your goals for character development and spiritual growth...'
              },
              {
                name: 'commitment',
                label: 'Weekly Time Commitment',
                type: 'select',
                required: true,
                options: [
                  { value: '2-4', label: '2-4 hours per week' },
                  { value: '4-6', label: '4-6 hours per week' },
                  { value: '6+', label: '6+ hours per week' }
                ]
              }
            ]}
            redirectAfterEnroll="/dashboard/sectors/tarbiya-idad"
          >
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex items-center gap-4 mb-6">
                  <Download className="w-10 h-10 text-emerald-600" />
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-800">Weekly Training Materials</h2>
                    <p className="text-slate-600">Downloadable resources for systematic Islamic development</p>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Our weekly training program covers essential topics in Tarbiya, Dawah, Irshad, and Idad. 
                  Each week includes comprehensive materials with study guides, discussion questions, and practical applications.
                </p>
              </div>

              {/* Weekly Schedule */}
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Weekly Schedule</h3>
                <div className="space-y-4">
                  {weeklySchedule.map((session) => (
                    <div 
                      key={session.id}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedSession(session)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <span className="font-bold text-emerald-600">{session.day}</span>
                            <span className="text-slate-600">{session.time}</span>
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                              {session.participants} participants
                            </span>
                          </div>
                          <h4 className="font-semibold text-slate-800">{session.topic}</h4>
                          <p className="text-sm text-slate-600">{session.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">Instructor:</p>
                          <p className="font-semibold text-slate-800">{session.instructor}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <TrainingMaterials />
            </div>
          </EnrollmentGate>
        )}

        {/* Idad Programs Tab */}
        {activeTab === 'idad' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <GraduationCap className="w-12 h-12" />
                <div>
                  <h2 className="text-3xl font-serif font-bold">Idad Leadership Academy</h2>
                  <p className="text-purple-100">Specialized Training for Community Service</p>
                </div>
              </div>
              <p className="text-purple-100">
                The Idad programs are intensive, specialized training tracks designed to develop the next generation 
                of Islamic leaders, speakers, and community guides. Each program combines Islamic sciences with practical 
                skills for effective service.
              </p>
            </div>

            {/* Programs Grid */}
            {idadPrograms.map((program, idx) => (
              <div 
                key={program.id} 
                className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setSelectedProgram(program)}
              >
                {/* Program Header */}
                <div className={`bg-gradient-to-r ${
                  idx === 0 ? 'from-emerald-500 to-emerald-700' :
                  idx === 1 ? 'from-blue-500 to-blue-700' :
                  idx === 2 ? 'from-purple-500 to-purple-700' :
                  'from-amber-500 to-amber-700'
                } p-6 text-white`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{program.name}</h3>
                      <p className="text-lg opacity-90">{program.title}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-white/20 px-4 py-2 rounded-lg">
                        <p className="text-sm font-semibold">Duration</p>
                        <p className="text-lg font-bold">{program.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Program Content */}
                <div className="p-6">
                  <p className="text-slate-600 mb-6 text-lg">{program.description}</p>

                  {/* Modules Preview */}
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Curriculum Modules ({program.modules.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {program.modules.slice(0, 2).map((module, mIdx) => (
                        <div key={mIdx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <h5 className="font-bold text-slate-800 mb-2">{module.name}</h5>
                          <p className="text-xs text-slate-500">{module.topics.length} topics covered</p>
                        </div>
                      ))}
                    </div>
                    {program.modules.length > 2 && (
                      <p className="text-sm text-slate-500 mt-2">
                        +{program.modules.length - 2} more modules...
                      </p>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Requirements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {program.requirements.slice(0, 3).map((req, rIdx) => (
                        <span key={rIdx} className="text-sm px-3 py-1 bg-white text-amber-800 rounded-full border border-amber-200">
                          {req}
                        </span>
                      ))}
                      {program.requirements.length > 3 && (
                        <span className="text-sm px-3 py-1 bg-amber-200 text-amber-800 rounded-full">
                          +{program.requirements.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Apply Now Tab */}
        {activeTab === 'apply' && (
          <div className="space-y-8">
            <DuatVettingForm />
          </div>
        )}
      </div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedProgram.name}</h2>
                  <p className="text-lg text-slate-600">{selectedProgram.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedProgram.duration}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-slate-700 leading-relaxed mb-6">
                  {selectedProgram.description}
                </p>
                
                <h4 className="text-xl font-bold text-slate-800 mb-4">Complete Curriculum</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {selectedProgram.modules.map((module, mIdx) => (
                    <div key={mIdx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <h5 className="font-bold text-slate-800 mb-2">{module.name}</h5>
                      <ul className="space-y-1">
                        {module.topics.map((topic, tIdx) => (
                          <li key={tIdx} className="text-sm text-slate-600 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <h4 className="text-xl font-bold text-slate-800 mb-4">Requirements & Prerequisites</h4>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedProgram.requirements.map((req, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-800">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Comprehensive {selectedProgram.duration} program with certification
                </div>
                <button 
                  onClick={() => {
                    setSelectedProgram(null);
                    setActiveTab('apply');
                  }}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedSession.topic}</h2>
                  <div className="flex items-center gap-4 mt-2 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedSession.day}s at {selectedSession.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedSession.instructor}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  {selectedSession.description}
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  This weekly session is designed to provide systematic spiritual development through 
                  interactive discussions, practical exercises, and peer accountability. Each session 
                  builds upon previous lessons to create a comprehensive learning experience.
                </p>
                
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 mb-4">
                  <h4 className="font-semibold text-emerald-900 mb-2">What to Expect:</h4>
                  <ul className="text-sm text-emerald-800 space-y-1">
                    <li>• Interactive discussions and Q&A sessions</li>
                    <li>• Practical exercises for spiritual development</li>
                    <li>• Small group activities and peer support</li>
                    <li>• Take-home materials and reflection guides</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>{selectedSession.participants} regular participants</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    Open to all
                  </span>
                </div>
                <button 
                  onClick={() => alert('Registration for weekly sessions coming soon!')}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Join Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {activeTab === 'overview' && (
        <section className="bg-gradient-to-r from-rose-600 to-purple-700 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Ready to Transform Your Character?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-rose-100">
              Join our Tarbiya programs and leadership academy to develop spiritually and serve the Ummah
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => setActiveTab('training')}
                className="px-8 py-4 bg-white text-rose-700 font-bold rounded-lg hover:bg-rose-50 transition-colors shadow-lg"
              >
                View Training Materials
              </button>
              <button 
                onClick={() => setActiveTab('apply')}
                className="px-8 py-4 bg-purple-800 text-white font-bold rounded-lg hover:bg-purple-900 transition-colors shadow-lg border-2 border-white"
              >
                Apply to Idad Programs
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
