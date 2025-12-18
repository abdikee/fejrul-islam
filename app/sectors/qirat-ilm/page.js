'use client';

import { BookOpen, FileText, Languages, Download } from 'lucide-react';
import { courses } from '@/data/courses';
import Link from 'next/link';

const subsections = [
  {
    title: 'Quran Track',
    icon: BookOpen,
    color: 'emerald',
    items: ['Tajweed & Recitation', 'Tadabbur Sessions', 'Memorization Support']
  },
  {
    title: 'Kitab Track',
    icon: FileText,
    color: 'blue',
    items: ['Fiqh (Student Fiqh, Worship)', 'Aqidah (Foundations)', 'Seerah & Islamic History']
  },
  {
    title: 'Islam Essentials',
    icon: Languages,
    color: 'amber',
    items: ['5 Pillars', 'Aqidah Basics', 'Seerah for Beginners']
  },
  {
    title: 'Resource Vault',
    icon: Download,
    color: 'purple',
    items: ['PDFs', 'Recorded Lessons', 'Study Outlines']
  }
];

const colorClasses = {
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  blue: 'bg-blue-100 text-blue-700 border-blue-300',
  amber: 'bg-amber-100 text-amber-700 border-amber-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300'
};

export default function QiratIlmPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1437603568260-1950d3ca6eab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxwcmF5ZXJ8ZW58MHx8fHwxNzY2MDM5MjYwfDA&ixlib=rb-4.1.0&q=85"
            alt="Quran and Knowledge" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-serif font-bold mb-4">Qirat & Ilm</h1>
          <p className="text-2xl font-light">Knowledge, Learning, Academic Faith Development</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-emerald-600">Home</Link>
            <span>/</span>
            <span className="text-emerald-600 font-semibold">Qirat & Ilm</span>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Deepen Your Islamic Knowledge</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              The Qirat & Ilm sector is dedicated to building a strong foundation of Islamic knowledge through 
              systematic study of the Quran, Islamic sciences, and essential religious texts. Whether you're 
              beginning your journey or advancing your understanding, we provide structured learning paths 
              tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Subsections */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Learning Tracks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>
      </section>

      {/* Available Courses */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Available Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id}
                className="bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                    {course.track}
                  </span>
                  <span className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {course.level}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{course.description}</p>
                
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="font-semibold">Duration:</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Instructor:</span>
                    <span>{course.instructor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-emerald-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-6 text-emerald-100">Join thousands of students on their journey to Islamic knowledge</p>
          <button className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors">
            Enroll Now
          </button>
        </div>
      </section>
    </div>
  );
}