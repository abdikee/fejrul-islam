'use client';

import { Heart, Users, Home, Sunrise } from 'lucide-react';
import Link from 'next/link';

const subsections = [
  {
    title: 'Tazkiyat al-Nafs',
    icon: Heart,
    color: 'rose',
    items: ['Heart Purification', 'Spiritual Diseases', 'Self-Accountability']
  },
  {
    title: 'Usrah Circles',
    icon: Users,
    color: 'purple',
    items: ['Peer Mentorship', 'Accountability Groups', 'Brotherhood & Sisterhood']
  },
  {
    title: 'Family Tarbiya',
    icon: Home,
    color: 'blue',
    items: ['Marriage (Sakinah)', 'Parenting as Amanah', 'Adab of Divorce']
  },
  {
    title: 'Spiritual Discipline',
    icon: Sunrise,
    color: 'emerald',
    items: ['Daily Adhkar', 'Tahajjud Routines', 'Quranic Tadabbur']
  }
];

const trainingTopics = [
  'Building Taqwa in Daily Life',
  'Overcoming Spiritual Laziness',
  'The Art of Making Dua',
  'Patience Through Trials',
  'Gratitude as a Way of Life',
  'Fighting Heedlessness (Ghaflah)'
];

const colorClasses = {
  rose: 'bg-rose-100 text-rose-700 border-rose-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
  blue: 'bg-blue-100 text-blue-700 border-blue-300',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300'
};

export default function TerbiyetuDuatPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1543525238-54e3d131f7ca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxwcmF5ZXJ8ZW58MHx8fHwxNzY2MDM5MjYwfDA&ixlib=rb-4.1.0&q=85"
            alt="Spiritual Growth" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 to-rose-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-serif font-bold mb-4">Terbiyetu Du'at</h1>
          <p className="text-2xl font-light">Character, Spiritual Growth, Mentorship</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <span>/</span>
            <span className="text-rose-600 font-semibold">Terbiyetu Du'at</span>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Nurturing the Soul</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Terbiyetu Du'at focuses on the holistic development of character and spirituality. Through 
              systematic self-purification, peer support, and spiritual practices, we cultivate individuals 
              who embody Islamic values and serve as beacons of guidance for others.
            </p>
          </div>
        </div>
      </section>

      {/* Subsections */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Spiritual Development Tracks</h2>
          
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

      {/* Weekly Training Topics */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Weekly Training Topics</h2>
          
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingTopics.map((topic, idx) => (
              <div 
                key={idx}
                className="bg-rose-50 rounded-lg p-4 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-rose-600 font-bold text-lg">{idx + 1}.</span>
                  <span className="text-slate-800 font-medium">{topic}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 bg-gradient-to-r from-rose-600 to-rose-800">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <p className="text-2xl md:text-3xl font-serif italic mb-4">
              "Indeed, he succeeds who purifies his soul, and he fails who corrupts it."
            </p>
            <p className="text-rose-200">Surah Ash-Shams (91:9-10)</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">Join a Tarbiya Circle</h2>
          <p className="text-xl text-slate-600 mb-6">Connect with peers on the path of spiritual growth and self-improvement</p>
          <button className="px-8 py-3 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-colors">
            Find Your Circle
          </button>
        </div>
      </section>
    </div>
  );
}