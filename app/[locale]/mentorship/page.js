'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, BookOpen, Calendar, Clock, Star, Search, Filter,
  ArrowRight, MessageCircle, Award, GraduationCap, Heart,
  CheckCircle, Globe, Video
} from 'lucide-react';

export default function MentorshipPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const mentors = [
    {
      id: 1,
      name: 'Sheikh Ahmad Al-Farsi',
      title: 'Senior Islamic Scholar',
      specialty: 'Quran & Tajweed',
      experience: '15+ years',
      students: 120,
      rating: 4.9,
      reviews: 89,
      languages: ['Arabic', 'English'],
      availability: 'Mon, Wed, Fri',
      bio: 'Specialized in Quranic sciences and tajweed with ijazah in multiple qiraat.',
      image: null
    },
    {
      id: 2,
      name: 'Ustadh Ibrahim Hassan',
      title: 'Fiqh Instructor',
      specialty: 'Islamic Jurisprudence',
      experience: '10+ years',
      students: 85,
      rating: 4.8,
      reviews: 67,
      languages: ['Arabic', 'English', 'Amharic'],
      availability: 'Tue, Thu, Sat',
      bio: 'Expert in comparative fiqh with focus on contemporary issues.',
      image: null
    },
    {
      id: 3,
      name: 'Dr. Fatima Abdullah',
      title: 'Islamic Studies Professor',
      specialty: 'Islamic History',
      experience: '12+ years',
      students: 95,
      rating: 4.9,
      reviews: 78,
      languages: ['Arabic', 'English'],
      availability: 'Mon, Tue, Wed',
      bio: 'PhD in Islamic History with specialization in early Islamic civilization.',
      image: null
    },
    {
      id: 4,
      name: 'Sheikh Yusuf Al-Qari',
      title: 'Hadith Scholar',
      specialty: 'Hadith Sciences',
      experience: '20+ years',
      students: 150,
      rating: 5.0,
      reviews: 112,
      languages: ['Arabic', 'English'],
      availability: 'Daily',
      bio: 'Renowned hadith scholar with ijazah in major hadith collections.',
      image: null
    },
    {
      id: 5,
      name: 'Ustadha Maryam Osman',
      title: 'Arabic Language Expert',
      specialty: 'Arabic Language',
      experience: '8+ years',
      students: 70,
      rating: 4.7,
      reviews: 54,
      languages: ['Arabic', 'English', 'Amharic'],
      availability: 'Mon, Wed, Fri, Sat',
      bio: 'Native Arabic speaker specializing in classical and modern Arabic.',
      image: null
    },
    {
      id: 6,
      name: 'Sheikh Omar Al-Dawah',
      title: 'Dawah Specialist',
      specialty: 'Dawah & Outreach',
      experience: '14+ years',
      students: 200,
      rating: 4.8,
      reviews: 145,
      languages: ['Arabic', 'English', 'French'],
      availability: 'Flexible',
      bio: 'International dawah speaker with experience in interfaith dialogue.',
      image: null
    }
  ];

  const specialties = ['all', 'Quran & Tajweed', 'Islamic Jurisprudence', 'Islamic History', 'Hadith Sciences', 'Arabic Language', 'Dawah & Outreach'];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || mentor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-800">Fejrul Islam</span>
                <span className="text-xs text-emerald-600 block">HUMSJ</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-slate-600 hover:text-emerald-600 transition-colors">Home</Link>
              <Link href="/discover-islam" className="text-slate-600 hover:text-emerald-600 transition-colors">Discover Islam</Link>
              <Link href="/about" className="text-slate-600 hover:text-emerald-600 transition-colors">About</Link>
              <Link href="/contact" className="text-slate-600 hover:text-emerald-600 transition-colors">Contact</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-slate-600 hover:text-emerald-600 transition-colors">Login</Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Mentorship Program</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Connect with experienced scholars and mentors for personalized guidance in your Islamic education journey
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">One-on-One Guidance</h3>
              <p className="text-slate-600">Personalized attention from experienced scholars tailored to your learning needs</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Video className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Flexible Sessions</h3>
              <p className="text-slate-600">Online and in-person sessions to fit your schedule and preferences</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Certified Mentors</h3>
              <p className="text-slate-600">Learn from qualified scholars with authentic Islamic credentials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search mentors by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                {specialties.map(spec => (
                  <option key={spec} value={spec}>{spec === 'all' ? 'All Specialties' : spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {mentor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800">{mentor.name}</h3>
                      <p className="text-sm text-emerald-600">{mentor.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                        <span className="text-sm font-medium text-slate-700">{mentor.rating}</span>
                        <span className="text-sm text-slate-500">({mentor.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{mentor.bio}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span className="text-slate-600">{mentor.specialty}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span className="text-slate-600">{mentor.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span className="text-slate-600">{mentor.students} students mentored</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <span className="text-slate-600">{mentor.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="text-slate-600">{mentor.availability}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Request Session
                    </button>
                    <button className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No mentors found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Browse Mentors', desc: 'Explore our qualified mentors and their specialties' },
              { step: 2, title: 'Request Session', desc: 'Send a mentorship request to your chosen mentor' },
              { step: 3, title: 'Schedule Meeting', desc: 'Coordinate a time that works for both of you' },
              { step: 4, title: 'Start Learning', desc: 'Begin your personalized learning journey' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Sign up today and connect with experienced mentors who can guide you on your path to Islamic knowledge.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <p className="text-slate-400">© 2024 Fejrul Islam - HUMSJ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
