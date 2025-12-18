'use client';

import { History, TrendingUp, Feather, FileText } from 'lucide-react';
import Link from 'next/link';

const subsections = [
  {
    title: 'Jeme'a History',
    icon: History,
    color: 'amber',
    description: 'Explore the timeline, milestones, and legacy of HUMSJ'
  },
  {
    title: 'Status Dashboard',
    icon: TrendingUp,
    color: 'blue',
    description: 'Track achievements, growth indicators, and community impact'
  },
  {
    title: 'Student Creative Works',
    icon: Feather,
    color: 'rose',
    description: 'Poems, blogs, essays, and artistic expressions from our community'
  },
  {
    title: 'Publications',
    icon: FileText,
    color: 'purple',
    description: 'Articles, editorials, and academic writings'
  }
];

const recentWorks = [
  {
    id: 1,
    title: 'The Light of Guidance',
    author: 'Amina Hassan',
    type: 'Poetry',
    date: '2025-01-10',
    excerpt: 'A reflection on finding spiritual clarity in turbulent times...'
  },
  {
    id: 2,
    title: 'Building Tomorrow\'s Ummah',
    author: 'Ibrahim Yusuf',
    type: 'Essay',
    date: '2025-01-08',
    excerpt: 'An analysis of youth leadership in contemporary Islamic movements...'
  },
  {
    id: 3,
    title: 'Ramadan Reflections 2024',
    author: 'Fatima Ali',
    type: 'Blog',
    date: '2025-01-05',
    excerpt: 'Personal insights from a month of spiritual transformation...'
  }
];

const colorClasses = {
  amber: 'bg-amber-100 text-amber-700 border-amber-300',
  blue: 'bg-blue-100 text-blue-700 border-blue-300',
  rose: 'bg-rose-100 text-rose-700 border-rose-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300'
};

export default function LiteraturePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1604866830893-c13cafa515d5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxib29rc3xlbnwwfHx8fDE3NjYwNTEwMjd8MA&ixlib=rb-4.1.0&q=85"
            alt="Literature and History" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-serif font-bold mb-4">Literature & History</h1>
          <p className="text-2xl font-light">Identity, Memory, Intellectual Expression</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-amber-600">Home</Link>
            <span>/</span>
            <span className="text-amber-600 font-semibold">Literature & History</span>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Preserving Our Legacy</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              The Literature & History sector is dedicated to preserving the rich heritage of HUMSJ, 
              celebrating student creativity, and documenting our journey. Through historical archives, 
              creative works, and academic publications, we build a lasting legacy for future generations.
            </p>
          </div>
        </div>
      </section>

      {/* Subsections */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Explore Our Archives</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subsections.map((section) => {
              const Icon = section.icon;
              return (
                <div 
                  key={section.title}
                  className={`rounded-xl p-6 border-2 ${colorClasses[section.color]} hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">{section.title}</h3>
                  </div>
                  <p className="text-slate-700">{section.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Creative Works */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Recent Student Works</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {recentWorks.map((work) => (
              <div 
                key={work.id}
                className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{work.title}</h3>
                    <p className="text-sm text-slate-600">by {work.author}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                      {work.type}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{work.date}</p>
                  </div>
                </div>
                <p className="text-slate-700 italic">{work.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-amber-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Share Your Voice</h2>
          <p className="text-xl mb-6 text-amber-100">Contribute your creative works and become part of our living history</p>
          <button className="px-8 py-3 bg-white text-amber-700 font-bold rounded-lg hover:bg-amber-50 transition-colors">
            Submit Your Work
          </button>
        </div>
      </section>
    </div>
  );
}