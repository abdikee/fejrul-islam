'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, HeartPulse, GraduationCap, Lock, LogOut } from 'lucide-react';
import Link from 'next/link';
import WelfareDashboard from '@/components/ui/WelfareDashboard';
import CounselingBoard from '@/components/ui/CounselingBoard';
import { idadPrograms } from '@/data/training';

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

const colorClasses = {
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
  rose: 'bg-rose-100 text-rose-700 border-rose-300',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300'
};

export default function ZiyaraEnhancedPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const auth = sessionStorage.getItem('ziyara_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'humsj2025') {
      setIsAuthenticated(true);
      sessionStorage.setItem('ziyara_auth', 'true');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ziyara_auth');
    setActiveTab('overview');
  };

  // Login Screen
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
            <p className="text-xs text-center mt-2 text-slate-400">
              Demo password: <span className="font-mono bg-slate-200 px-2 py-1 rounded">humsj2025</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Content
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

      {/* Breadcrumb with Logout */}
      <div className="bg-white py-4 border-b border-slate-200">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-purple-600">Home</Link>
            <span>/</span>
            <span className="text-purple-600 font-semibold">Ziyara</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="container mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Shield },
              { id: 'welfare', label: 'Student Welfare', icon: Users },
              { id: 'counseling', label: 'Counseling Services', icon: HeartPulse },
              { id: 'idad', label: 'Leadership Academy', icon: GraduationCap }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-slate-600 hover:text-purple-600'
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
              <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Caring for Our Community</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                The Ziyara sector is dedicated to the holistic welfare and leadership development of all 
                HUMSJ students. We provide comprehensive support systems, mentorship programs, and specialized 
                training to ensure every student thrives academically, spiritually, and personally.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 text-center">
                  <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-bold text-purple-900 mb-2">1200+</h3>
                  <p className="text-slate-700 text-sm">Students Under Care</p>
                </div>
                <div className="bg-rose-50 p-6 rounded-lg border border-rose-200 text-center">
                  <HeartPulse className="w-12 h-12 text-rose-600 mx-auto mb-3" />
                  <h3 className="font-bold text-rose-900 mb-2">24/7</h3>
                  <p className="text-slate-700 text-sm">Support Available</p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200 text-center">
                  <GraduationCap className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-bold text-emerald-900 mb-2">4</h3>
                  <p className="text-slate-700 text-sm">Leadership Programs</p>
                </div>
              </div>
            </section>

            {/* Support Systems */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-slate-800 mb-8 text-center">Support Systems</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </section>
          </div>
        )}

        {/* Student Welfare Tab */}
        {activeTab === 'welfare' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <Users className="w-10 h-10 text-purple-600" />
                <div>
                  <h2 className="text-3xl font-serif font-bold text-slate-800">Student Welfare Dashboard</h2>
                  <p className="text-slate-600">Real-time monitoring and support tracking</p>
                </div>
              </div>
              <p className="text-slate-600">
                Track student attendance, wellbeing status, and engagement across all departments. 
                Green indicators show students in good standing, yellow for those needing check-in, 
                and red for urgent care.
              </p>
            </div>

            <WelfareDashboard />
          </div>
        )}

        {/* Counseling Tab */}
        {activeTab === 'counseling' && (
          <div className="space-y-8">
            <CounselingBoard />
          </div>
        )}

        {/* Idad Programs Tab */}
        {activeTab === 'idad' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <GraduationCap className="w-12 h-12" />
                <div>
                  <h2 className="text-3xl font-serif font-bold">Leadership Training Academy</h2>
                  <p className="text-emerald-100">Developing Tomorrow's Islamic Leaders</p>
                </div>
              </div>
              <p className="text-emerald-100">
                Access to all four Idad training programs for qualified students. Each program 
                combines Islamic sciences with practical leadership and service skills.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {idadPrograms.map((program, idx) => (
                <div key={program.id} className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{program.name}</h3>
                  <p className="text-emerald-600 font-semibold mb-4">{program.title}</p>
                  <p className="text-slate-600 mb-4">{program.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Duration: <strong>{program.duration}</strong></span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                      {program.sector}
                    </span>
                  </div>

                  <Link 
                    href="/sectors/tarbiya-idad"
                    className="mt-4 block w-full text-center py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    View Full Program
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      {activeTab === 'overview' && (
        <section className="bg-purple-600 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Need Support or Guidance?
            </h2>
            <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
              Our dedicated welfare team is here to help you succeed and thrive in all aspects of student life
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => setActiveTab('welfare')}
                className="px-8 py-4 bg-white text-purple-700 font-bold rounded-lg hover:bg-purple-50 transition-colors shadow-lg"
              >
                View Welfare Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('counseling')}
                className="px-8 py-4 bg-purple-800 text-white font-bold rounded-lg hover:bg-purple-900 transition-colors shadow-lg border-2 border-white"
              >
                Book Counseling Session
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
