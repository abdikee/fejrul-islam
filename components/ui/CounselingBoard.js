'use client';

import { counselingCategories } from '@/data/welfare';
import { HeartPulse, Calendar, MessageCircle } from 'lucide-react';

const CounselingBoard = () => {
  const colorMap = {
    blue: 'from-blue-500 to-blue-700',
    purple: 'from-purple-500 to-purple-700',
    rose: 'from-rose-500 to-rose-700',
    emerald: 'from-emerald-500 to-emerald-700',
    amber: 'from-amber-500 to-amber-700',
    indigo: 'from-indigo-500 to-indigo-700'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <HeartPulse className="w-12 h-12" />
          <div>
            <h2 className="text-3xl font-bold">Student Counseling Services</h2>
            <p className="text-purple-100">Confidential support for your wellbeing</p>
          </div>
        </div>
        <p className="text-purple-100">
          All counseling sessions are completely confidential and conducted in a safe, Islamic environment. 
          Our trained counselors are here to support you through academic, personal, and spiritual challenges.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {counselingCategories.map((category, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
          >
            {/* Colored Header */}
            <div className={`bg-gradient-to-r ${colorMap[category.color]} p-4`}>
              <h3 className="text-xl font-bold text-white">{category.name}</h3>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-slate-600 mb-4 leading-relaxed">{category.description}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold">Available: {category.availability}</span>
                </div>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Book Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Information */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">How to Access Counseling</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-emerald-600">1</span>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Choose Service</h4>
            <p className="text-sm text-slate-600">Select the counseling category that matches your need</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Book Appointment</h4>
            <p className="text-sm text-slate-600">Schedule a session at your convenience</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Attend Session</h4>
            <p className="text-sm text-slate-600">Meet with our trained counselor confidentially</p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <HeartPulse className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800 mb-2">Crisis Support</h3>
            <p className="text-red-700 mb-3">
              If you're experiencing a mental health emergency or crisis, please contact our 24/7 helpline immediately.
            </p>
            <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">
              Emergency Contact: +251-XXX-XXXX
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselingBoard;
