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
            About Fejrul Islam
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Dawah & Irshad Sector - HUMSJ | Inviting to Islam with wisdom and providing spiritual guidance
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
              To spread the beautiful message of Islam through wisdom, compassion, and authentic guidance. 
              We invite people to the path of Allah while providing spiritual counseling and support to the Muslim community at Haramaya University.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-teal-200">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed">
              To be a leading Dawah and Irshad organization that effectively spreads Islam, builds bridges of understanding 
              with non-Muslims, and provides comprehensive spiritual guidance to create a strong, practicing Muslim community.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: 'Compassion', desc: 'Inviting with mercy and kindness' },
              { icon: BookOpen, title: 'Wisdom', desc: 'Dawah with knowledge and understanding' },
              { icon: Users, title: 'Community', desc: 'Building strong Muslim brotherhood' },
              { icon: Award, title: 'Excellence', desc: 'Highest standards in guidance' },
              { icon: Target, title: 'Purpose', desc: 'Clear mission to spread Islam' },
              { icon: Globe, title: 'Outreach', desc: 'Reaching all with the message' }
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
              'Dawah & Outreach Programs',
              'Spiritual Guidance & Counseling',
              'Interfaith Dialogue Initiatives',
              'Islamic Knowledge Sessions',
              'Community Engagement Events',
              'New Muslim Support Services',
              'Islamic Resources Distribution',
              'Public Lectures & Seminars',
              'One-on-One Irshad Sessions'
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
          <h2 className="text-3xl font-bold mb-4">Join Our Dawah Mission</h2>
          <p className="text-xl mb-8 text-emerald-100">
            Be part of spreading the beautiful message of Islam and providing guidance to those seeking the truth
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
