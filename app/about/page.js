'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Users, BookOpen, Target, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      <main className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            About Fejrul Islam HUMSJ
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Haramaya University Muslim Students Jem'a - Empowering Muslim students through Islamic education and community
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              To provide comprehensive Islamic education and foster a strong Muslim community at Haramaya University, 
              guiding students in their spiritual, academic, and personal development through authentic Islamic teachings.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-teal-200">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed">
              To be a leading Islamic student organization that produces well-rounded Muslim graduates who are 
              knowledgeable in their faith, excel in their studies, and contribute positively to society.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: 'Faith & Devotion', desc: 'Strengthening our connection with Allah' },
              { icon: BookOpen, title: 'Knowledge', desc: 'Pursuing Islamic and academic excellence' },
              { icon: Users, title: 'Community', desc: 'Building strong brotherhood and sisterhood' },
              { icon: Award, title: 'Excellence', desc: 'Striving for the highest standards' },
              { icon: Target, title: 'Purpose', desc: 'Living with Islamic purpose and direction' },
              { icon: Globe, title: 'Service', desc: 'Serving humanity with compassion' }
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center p-6 hover:bg-emerald-50 rounded-xl transition-colors">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-600">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Islamic Education Programs',
              'Quranic Studies & Memorization',
              'Hadith & Seerah Classes',
              'Islamic Leadership Training',
              'Mentorship Programs',
              'Community Service Projects',
              'Study Groups & Circles',
              'Islamic Events & Lectures',
              'Spiritual Development'
            ].map((offering, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <p className="font-medium text-slate-800">{offering}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 text-emerald-100">
            Be part of a vibrant Islamic community dedicated to growth and excellence
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup" className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
              Get Started
            </Link>
            <Link href="/contact" className="px-8 py-3 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
