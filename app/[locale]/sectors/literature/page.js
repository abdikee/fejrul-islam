'use client';

import { useState } from 'react';
import { History, TrendingUp, Feather, FileText, ArrowRight, Calendar, User, Eye } from 'lucide-react';
import Link from 'next/link';

const subsections = [
  {
    id: 'history',
    title: 'Jemea History',
    icon: History,
    color: 'amber',
    description: 'Explore the timeline, milestones, and legacy of HUMSJ'
  },
  {
    id: 'dashboard',
    title: 'Status Dashboard',
    icon: TrendingUp,
    color: 'blue',
    description: 'Track achievements, growth indicators, and community impact'
  },
  {
    id: 'creative',
    title: 'Student Creative Works',
    icon: Feather,
    color: 'rose',
    description: 'Poems, blogs, essays, and artistic expressions from our community'
  },
  {
    id: 'publications',
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
    excerpt: 'A reflection on finding spiritual clarity in turbulent times...',
    views: 245,
    category: 'creative'
  },
  {
    id: 2,
    title: 'Building Tomorrow\'s Ummah',
    author: 'Ibrahim Yusuf',
    type: 'Essay',
    date: '2025-01-08',
    excerpt: 'An analysis of youth leadership in contemporary Islamic movements...',
    views: 189,
    category: 'publications'
  },
  {
    id: 3,
    title: 'Ramadan Reflections 2024',
    author: 'Fatima Ali',
    type: 'Blog',
    date: '2025-01-05',
    excerpt: 'Personal insights from a month of spiritual transformation...',
    views: 312,
    category: 'creative'
  }
];

const historyTimeline = [
  {
    year: '2010',
    title: 'Foundation of HUMSJ',
    description: 'Establishment of the organization with a vision for Islamic education'
  },
  {
    year: '2015',
    title: 'First Major Conference',
    description: 'Hosted the inaugural Islamic Youth Leadership Conference'
  },
  {
    year: '2020',
    title: 'Digital Transformation',
    description: 'Launched online learning platform and digital resources'
  },
  {
    year: '2025',
    title: 'Platform Launch',
    description: 'Comprehensive digital platform for holistic Islamic education'
  }
];

const statusMetrics = [
  { label: 'Total Members', value: '1,247', change: '+12%' },
  { label: 'Active Students', value: '892', change: '+8%' },
  { label: 'Mentors', value: '45', change: '+3%' },
  { label: 'Courses Completed', value: '2,156', change: '+25%' }
];

const colorClasses = {
  amber: 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200',
  rose: 'bg-rose-100 text-rose-700 border-rose-300 hover:bg-rose-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'
};

export default function LiteraturePage() {
  const [activeSection, setActiveSection] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);

  const handleSectionClick = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'history':
        return (
          <div className="mt-6 p-6 bg-white rounded-lg border border-amber-200">
            <h4 className="text-xl font-bold text-amber-800 mb-4">HUMSJ Timeline</h4>
            <div className="space-y-4">
              {historyTimeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {event.year}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-slate-800">{event.title}</h5>
                    <p className="text-slate-600 text-sm">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'dashboard':
        return (
          <div className="mt-6 p-6 bg-white rounded-lg border border-blue-200">
            <h4 className="text-xl font-bold text-blue-800 mb-4">Community Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statusMetrics.map((metric, index) => (
                <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-800">{metric.value}</p>
                  <p className="text-sm text-blue-600">{metric.label}</p>
                  <p className="text-xs text-green-600 font-semibold">{metric.change}</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'creative':
        return (
          <div className="mt-6 p-6 bg-white rounded-lg border border-rose-200">
            <h4 className="text-xl font-bold text-rose-800 mb-4">Student Creative Works</h4>
            <div className="space-y-3">
              {recentWorks.filter(work => work.category === 'creative').map((work) => (
                <div key={work.id} className="p-4 bg-rose-50 rounded-lg border border-rose-200 hover:border-rose-300 cursor-pointer transition-colors"
                     onClick={() => setSelectedWork(work)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-800">{work.title}</h5>
                      <p className="text-sm text-slate-600">by {work.author}</p>
                      <p className="text-xs text-slate-500 mt-1">{work.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Eye className="w-3 h-3" />
                      {work.views}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'publications':
        return (
          <div className="mt-6 p-6 bg-white rounded-lg border border-purple-200">
            <h4 className="text-xl font-bold text-purple-800 mb-4">Academic Publications</h4>
            <div className="space-y-3">
              {recentWorks.filter(work => work.category === 'publications').map((work) => (
                <div key={work.id} className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 cursor-pointer transition-colors"
                     onClick={() => setSelectedWork(work)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-800">{work.title}</h5>
                      <p className="text-sm text-slate-600">by {work.author}</p>
                      <p className="text-xs text-slate-500 mt-1">{work.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Eye className="w-3 h-3" />
                      {work.views}
                    </div>
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

      {/* Interactive Subsections */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Explore Our Archives</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subsections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <div key={section.title} className="space-y-4">
                  <button
                    onClick={() => handleSectionClick(section.id)}
                    className={`w-full rounded-xl p-6 border-2 ${colorClasses[section.color]} transition-all text-left`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon className="w-8 h-8" />
                        <h3 className="text-2xl font-bold">{section.title}</h3>
                      </div>
                      <ArrowRight className={`w-5 h-5 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                    </div>
                    <p className="text-slate-700">{section.description}</p>
                  </button>
                  
                  {isActive && renderSectionContent(section.id)}
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
                className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedWork(work)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{work.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <User className="w-4 h-4" />
                        {work.author}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {work.date}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Eye className="w-4 h-4" />
                        {work.views} views
                      </div>
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                    {work.type}
                  </span>
                </div>
                <p className="text-slate-700 italic">{work.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Detail Modal */}
      {selectedWork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedWork.title}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-slate-600">by {selectedWork.author}</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                      {selectedWork.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedWork(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-slate-700 leading-relaxed">
                  {selectedWork.excerpt}
                </p>
                <p className="text-slate-700 leading-relaxed mt-4">
                  This is a preview of the full work. The complete content would be displayed here 
                  with proper formatting, images, and full text. This modal demonstrates how individual 
                  works can be viewed in detail.
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>Published: {selectedWork.date}</span>
                  <span>{selectedWork.views} views</span>
                </div>
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                  Read Full Work
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-12 bg-amber-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Share Your Voice</h2>
          <p className="text-xl mb-6 text-amber-100">Contribute your creative works and become part of our living history</p>
          <button 
            onClick={() => alert('Submission form coming soon! You will be able to submit your creative works, essays, and publications.')}
            className="px-8 py-3 bg-white text-amber-700 font-bold rounded-lg hover:bg-amber-50 transition-colors"
          >
            Submit Your Work
          </button>
        </div>
      </section>
    </div>
  );
}