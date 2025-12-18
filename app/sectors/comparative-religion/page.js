'use client';

import { MessageCircle, Lightbulb, BookOpen, Users } from 'lucide-react';
import { books } from '@/data/books';
import Link from 'next/link';

const subsections = [
  {
    title: 'Comparative Religion',
    icon: BookOpen,
    color: 'blue',
    items: ['Interfaith Dialogue', 'Ahl al-Kitab Studies', 'World Religions Overview']
  },
  {
    title: 'Modern Ideologies',
    icon: Lightbulb,
    color: 'purple',
    items: ['Atheism & Agnosticism', 'Nihilism', 'Materialism & Secularism']
  },
  {
    title: 'Revert Journey',
    icon: Users,
    color: 'emerald',
    items: ['Mentorship Programs', 'Integration Support', 'Basic Fiqh for Reverts']
  },
  {
    title: 'Debate & Dialogue',
    icon: MessageCircle,
    color: 'amber',
    items: ['Topic Registration', 'Logic & Burhan', 'Hikmah-based Discourse']
  }
];

const upcomingTopics = [
  {
    title: 'Islam and Modern Atheism',
    date: 'January 25, 2025',
    description: 'Exploring responses to contemporary atheistic arguments'
  },
  {
    title: 'Science and Faith: A Muslim Perspective',
    date: 'February 8, 2025',
    description: 'Understanding the compatibility of Islamic belief and scientific inquiry'
  },
  {
    title: 'Interfaith Panel: Abrahamic Traditions',
    date: 'February 22, 2025',
    description: 'Dialogue with Christian and Jewish scholars on shared values'
  }
];

const colorClasses = {
  blue: 'bg-blue-100 text-blue-700 border-blue-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  amber: 'bg-amber-100 text-amber-700 border-amber-300'
};

export default function ComparativeReligionPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxib29rc3xlbnwwfHx8fDE3NjYwNTEwMjd8MA&ixlib=rb-4.1.0&q=85"
            alt="Dawah and Dialogue" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-serif font-bold mb-4">Dawah & Comparative Religion</h1>
          <p className="text-2xl font-light">Outreach, Logic, Intellectual Defense</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-blue-600 font-semibold">Dawah & Comparative Religion</span>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Engaging the World with Wisdom</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              The Dawah & Comparative Religion sector equips students with the knowledge and skills to 
              engage in meaningful dialogue, defend Islamic principles with wisdom and logic, and support 
              those entering or exploring Islam. We emphasize respectful discourse, intellectual rigor, 
              and the prophetic example of hikmah (wisdom) in all interactions.
            </p>
          </div>
        </div>
      </section>

      {/* Subsections */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Areas of Focus</h2>
          
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

      {/* Upcoming Events */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Upcoming Discussions</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {upcomingTopics.map((topic, idx) => (
              <div 
                key={idx}
                className="bg-blue-50 rounded-lg p-6 border border-blue-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{topic.title}</h3>
                    <p className="text-slate-600">{topic.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                    {topic.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Library Preview */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Digital Library</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {books.slice(0, 3).map((book) => (
              <div 
                key={book.id}
                className="bg-white rounded-lg shadow-md border border-slate-200 p-5 hover:shadow-lg transition-shadow"
              >
                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {book.category}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-3 mb-2">{book.title}</h3>
                <p className="text-sm text-slate-600 mb-2">by {book.author}</p>
                <p className="text-sm text-slate-500">{book.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Join the Conversation</h2>
          <p className="text-xl mb-6 text-blue-100">Register for upcoming debates and dialogue sessions</p>
          <button className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors">
            Register Now
          </button>
        </div>
      </section>
    </div>
  );
}