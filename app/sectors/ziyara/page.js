'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, HeartPulse, GraduationCap, Lock } from 'lucide-react';
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
    name: 'Idad Al-Qadah (Leadership)',
    topics: ['Strategy & Planning', 'Conflict Resolution', 'Public Relations']
  },
  {
    name: 'Idad Al-Du'at (Caller to Islam)',
    topics: ['Psychology of Dawah', 'Digital Dawah', 'Community Outreach']
  },
  {
    name: 'Idad Al-Imam (Religious Leader)',
    topics: ['Fiqh of Worship', 'Tajweed Excellence', 'Community Care']
  },
  {
    name: 'Idad Al-Khutaba (Public Speaker)',
    topics: ['Public Speaking', 'Sermon Structure', 'Modern Student Issues']
  }
];

const colorClasses = {
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
  rose: 'bg-rose-100 text-rose-700 border-rose-300',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300'
};

export default function ZiyaraPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check if already authenticated in session storage
  useEffect(() => {
    const auth = sessionStorage.getItem('ziyara_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check (for MVP - replace with proper auth later)
    if (password === 'humsj2025') {
      setIsAuthenticated(true);
      sessionStorage.setItem('ziyara_auth', 'true');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
              <Shield className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-800 mb-2">Ziyara Access</h1>
            <p className="text-slate-600">Student Welfare & Leadership Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Enter Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Access Ziyara
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-purple-600 hover:text-purple-700">
              ← Back to Home
            </Link>
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 text-center">
              This is a protected area for authorized personnel only. For access requests, 
              contact your student welfare coordinator.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-serif font-bold mb-4">Ziyara</h1>
          <p className="text-2xl font-light">Student Welfare & Leadership Development</p>
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
          <button
            onClick={() => {
              setIsAuthenticated(false);
              sessionStorage.removeItem('ziyara_auth');
            }}
            className="text-sm text-red-600 hover:text-red-700 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Caring for Our Community</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              The Ziyara sector is dedicated to the holistic welfare and leadership development of all 
              HUMSJ students. We provide comprehensive support systems, mentorship programs, and specialized 
              training to ensure every student thrives academically, spiritually, and personally.
            </p>
          </div>
        </div>
      </section>

      {/* Subsections */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Support Systems</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subsections.map((section) => {
              const Icon = section.icon;
              return (
                <div 
                  key={section.title}
                  className={`rounded-xl p-6 border-2 ${colorClasses[section.color]} hover:shadow-lg transition-shadow`}
                >
                  <div className="flex flex-col items-center text-center mb-4">
                    <Icon className="w-10 h-10 mb-3" />
                    <h3 className="text-xl font-bold">{section.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-current rounded-full mt-2"></span>
                        <span className="text-slate-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Idad Programs */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-4">
            Leadership Training Academy
          </h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            Specialized programs to develop the next generation of Islamic leaders, speakers, and community guides
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {idadPrograms.map((program, idx) => (
              <div 
                key={idx}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-purple-900 mb-3">{program.name}</h3>
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

      {/* Call to Action */}
      <section className="py-12 bg-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Need Support or Guidance?</h2>
          <p className="text-xl mb-6 text-purple-100">Our team is here to help you succeed and thrive</p>
          <button className="px-8 py-3 bg-white text-purple-700 font-bold rounded-lg hover:bg-purple-50 transition-colors">
            Contact Welfare Team
          </button>
        </div>
      </section>
    </div>
  );
}