'use client';

import { useState, useEffect } from 'react';
import { Heart, Users, HeartPulse, GraduationCap, ArrowRight, Calendar, User, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const subsections = [
  {
    title: 'Student Welfare Dashboard',
    icon: Users,
    color: 'purple',
    items: ['Department-based Grouping', 'Attendance Tracking', 'Wellbeing Status (Green/Red)']
  },
  {
    title: 'Social & Mental Health',
    icon: HeartPulse,
    color: 'rose',
    items: ['Anxiety Support', 'Confidential Guidance', 'Peer Support Networks']
  },
  {
    title: 'Leadership Academy',
    icon: GraduationCap,
    color: 'emerald',
    items: ['Idad Al-Qadah', 'Idad Al-Duat', 'Idad Al-Imam', 'Idad Al-Khutaba']
  }
];

const idadPrograms = [
  {
    id: 1,
    name: 'Idad Al-Qadah (Leadership)',
    duration: '6 months',
    participants: 15,
    topics: ['Strategy & Planning', 'Conflict Resolution', 'Public Relations'],
    status: 'active',
    nextSession: 'Jan 28, 2025'
  },
  {
    id: 2,
    name: 'Idad Al-Duat (Caller to Islam)',
    duration: '4 months',
    participants: 22,
    topics: ['Psychology of Dawah', 'Digital Dawah', 'Community Outreach'],
    status: 'recruiting',
    nextSession: 'Feb 5, 2025'
  },
  {
    id: 3,
    name: 'Idad Al-Imam (Religious Leader)',
    duration: '8 months',
    participants: 12,
    topics: ['Fiqh of Worship', 'Tajweed Excellence', 'Community Care'],
    status: 'active',
    nextSession: 'Jan 30, 2025'
  },
  {
    id: 4,
    name: 'Idad Al-Khutaba (Public Speaker)',
    duration: '5 months',
    participants: 18,
    topics: ['Public Speaking', 'Sermon Structure', 'Modern Student Issues'],
    status: 'active',
    nextSession: 'Feb 2, 2025'
  }
];

const studentStats = [
  { label: 'Total Students', value: '1,247', change: '+12%', status: 'positive' },
  { label: 'Active Mentees', value: '892', change: '+8%', status: 'positive' },
  { label: 'Support Cases', value: '23', change: '-15%', status: 'positive' },
  { label: 'Leadership Trainees', value: '67', change: '+25%', status: 'positive' }
];

const recentActivities = [
  {
    id: 1,
    type: 'support',
    title: 'Mental Health Workshop',
    description: 'Stress management session for final year students',
    date: 'Jan 20, 2025',
    participants: 45,
    status: 'completed'
  },
  {
    id: 2,
    type: 'leadership',
    title: 'Leadership Skills Training',
    description: 'Communication and team management workshop',
    date: 'Jan 22, 2025',
    participants: 28,
    status: 'upcoming'
  },
  {
    id: 3,
    type: 'welfare',
    title: 'Student Welfare Check-in',
    description: 'Monthly wellbeing assessment and support',
    date: 'Jan 25, 2025',
    participants: 156,
    status: 'upcoming'
  }
];

const colorClasses = {
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
  rose: 'bg-rose-100 text-rose-700 border-rose-300',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300'
};

export default function ZiyaraPage() {
  const [activeSection, setActiveSection] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleSectionClick = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'welfare':
        return (
          <div className="mt-6 p-6 bg-white rounded-lg border border-purple-200">
            <h4 className="text-xl font-bold text-purple-800 mb-4">Student Welfare Dashboard</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentStats.map((stat, index) => (
                <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-2xl font-bold text-purple-800">{stat.value}</p>
                      <p className="text-sm text-purple-600">{stat.label}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600 font-semibold">{stat.change}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'health':
        return (
          <div className="mt-6 p-6 bg-white rounded-lg border border-rose-200">
            <h4 className="text-xl font-bold text-rose-800 mb-4">Mental Health Support</h4>
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                <h5 className="font-semibold text-rose-900 mb-2">Confidential Counseling</h5>
                <p className="text-sm text-slate-600 mb-2">One-on-one support sessions with trained counselors</p>
                <button className="text-sm px-3 py-1 bg-rose-600 text-white rounded hover:bg-rose-700">
                  Request Session
                </button>
              </div>
              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                <h5 className="font-semibold text-rose-900 mb-2">Peer Support Groups</h5>
                <p className="text-sm text-slate-600 mb-2">Connect with fellow students facing similar challenges</p>
                <button className="text-sm px-3 py-1 bg-rose-600 text-white rounded hover:bg-rose-700">
                  Join Group
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'leadership':
        return (
          <div className="mt-6 p-6 bg-white rounded-lg border border-emerald-200">
            <h4 className="text-xl font-bold text-emerald-800 mb-4">Active Leadership Programs</h4>
            <div className="space-y-3">
              {idadPrograms.map((program) => (
                <div key={program.id} className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 hover:border-emerald-300 cursor-pointer transition-colors"
                     onClick={() => setSelectedProgram(program)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-800">{program.name}</h5>
                      <p className="text-sm text-slate-600">{program.participants} participants • {program.duration}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      program.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {program.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Direct access - no authentication needed for student welfare
  // Removed authentication barrier to make student welfare services accessible

  // Authenticated content
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/5306430/pexels-photo-5306430.jpeg"
            alt="Student Leadership" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-purple-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <Heart className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-serif font-bold mb-4">Ziyara</h1>
          <p className="text-2xl font-light">Student Welfare & Community Support</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-slate-200">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-purple-600">Home</Link>
            <span>/</span>
            <span className="text-purple-600 font-semibold">Ziyara</span>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Supporting Our Student Community</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              The Ziyara sector is dedicated to the holistic welfare and community support of all 
              Fejrul Islam students. We provide comprehensive support systems, mentorship programs, and 
              leadership development opportunities to ensure every student thrives academically, 
              spiritually, and personally while building strong community bonds.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Subsections */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Support Systems</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subsections.map((section) => {
              const Icon = section.icon;
              const sectionId = section.title.toLowerCase().includes('welfare') ? 'welfare' : 
                               section.title.toLowerCase().includes('health') ? 'health' : 'leadership';
              const isActive = activeSection === sectionId;
              
              return (
                <div key={section.title} className="space-y-4">
                  <button
                    onClick={() => handleSectionClick(sectionId)}
                    className={`w-full rounded-xl p-6 border-2 ${colorClasses[section.color]} hover:shadow-lg transition-all text-left`}
                  >
                    <div className="flex flex-col items-center text-center mb-4">
                      <Icon className="w-10 h-10 mb-3" />
                      <h3 className="text-xl font-bold">{section.title}</h3>
                      <ArrowRight className={`w-5 h-5 mt-2 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                    </div>
                    <ul className="space-y-2">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-current rounded-full mt-2"></span>
                          <span className="text-slate-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                  
                  {isActive && renderSectionContent(sectionId)}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Recent Activities</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id}
                className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{activity.title}</h3>
                    <p className="text-slate-600 mb-3">{activity.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {activity.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {activity.participants} participants
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Idad Programs */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-4">
            Leadership Training Academy
          </h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            Specialized programs to develop the next generation of Islamic leaders, speakers, and community guides
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {idadPrograms.map((program) => (
              <div 
                key={program.id}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedProgram(program)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-purple-900">{program.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    program.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {program.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>{program.participants} participants</span>
                    <span>{program.duration}</span>
                  </div>
                  <div className="text-sm text-slate-600">
                    Next session: {program.nextSession}
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {program.topics.map((topic, topicIdx) => (
                    <li key={topicIdx} className="flex items-start gap-2 text-slate-700">
                      <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedProgram.name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-slate-600">
                    <span>{selectedProgram.duration}</span>
                    <span>{selectedProgram.participants} participants</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      selectedProgram.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {selectedProgram.status}
                    </span>
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
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Program Overview</h4>
                <p className="text-slate-700 leading-relaxed mb-4">
                  This comprehensive leadership program is designed to develop essential skills for Islamic leadership 
                  in the modern world. Participants will engage in practical exercises, case studies, and mentorship 
                  opportunities.
                </p>
                
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Curriculum Topics</h4>
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {selectedProgram.topics.map((topic, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      <span className="text-slate-700">{topic}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-slate-800 mb-2">Next Session Details:</h5>
                  <p className="text-slate-600">Date: {selectedProgram.nextSession}</p>
                  <p className="text-slate-600">Format: Interactive workshop with group activities</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {selectedProgram.status === 'recruiting' ? 'Currently accepting applications' : 'Program in progress'}
                </div>
                <button 
                  onClick={() => alert(selectedProgram.status === 'recruiting' ? 'Application process coming soon!' : 'Program is currently active')}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    selectedProgram.status === 'recruiting' 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-slate-300 text-slate-600'
                  }`}
                >
                  {selectedProgram.status === 'recruiting' ? 'Apply Now' : 'View Progress'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedActivity.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedActivity.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedActivity.participants} participants
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  {selectedActivity.description}
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  This {selectedActivity.type} activity is part of our comprehensive student support program. 
                  We focus on creating a safe, supportive environment where students can develop both personally 
                  and academically while maintaining their Islamic values.
                </p>
                
                {selectedActivity.status === 'upcoming' && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">What to Expect:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Interactive sessions with experienced facilitators</li>
                      <li>• Practical tools and resources for personal development</li>
                      <li>• Opportunity to connect with fellow students</li>
                      <li>• Follow-up support and resources</li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedActivity.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {selectedActivity.status}
                </span>
                <button 
                  onClick={() => alert(selectedActivity.status === 'upcoming' ? 'Registration coming soon!' : 'Activity completed')}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    selectedActivity.status === 'upcoming' 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-slate-300 text-slate-600'
                  }`}
                >
                  {selectedActivity.status === 'upcoming' ? 'Register' : 'View Summary'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-12 bg-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Need Support or Guidance?</h2>
          <p className="text-xl mb-6 text-purple-100">Our team is here to help you succeed and thrive</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => alert('Contact form coming soon!')}
              className="px-8 py-3 bg-white text-purple-700 font-bold rounded-lg hover:bg-purple-50 transition-colors"
            >
              Contact Welfare Team
            </button>
            <button 
              onClick={() => alert('Emergency support coming soon!')}
              className="px-8 py-3 bg-purple-800 text-white font-bold rounded-lg hover:bg-purple-900 transition-colors border-2 border-white"
            >
              Emergency Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}