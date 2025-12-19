'use client';

import Link from 'next/link';
import { BookOpen, Users, Heart, MessageCircle, Shield, ArrowRight } from 'lucide-react';
import AnnouncementsBoard from '@/components/announcements/AnnouncementsBoard';

const sectors = [
  {
    id: 1,
    title: 'Qirat & Ilm',
    description: 'Knowledge, Learning, Academic Faith Development',
    icon: BookOpen,
    color: 'emerald',
    href: '/sectors/qirat-ilm',
    features: ['Quran Track', 'Kitab Track', 'Islam Essentials', 'Resource Vault']
  },
  {
    id: 2,
    title: 'Literature & History',
    description: 'Identity, Memory, Intellectual Expression',
    icon: Users,
    color: 'amber',
    href: '/sectors/literature',
    features: ['Jemea History', 'Status Dashboard', 'Creative Works', 'Publications']
  },
  {
    id: 3,
    title: 'Tarbiya & Idad',
    description: 'Character, Spiritual Growth, Leadership Training',
    icon: Heart,
    color: 'rose',
    href: '/sectors/tarbiya-idad',
    features: ['Tazkiyat al-Nafs', 'Usrah Circles', 'Training Materials', 'Idad Programs']
  },
  {
    id: 4,
    title: 'Dawah & Comparative Religion',
    description: 'Outreach, Logic, Intellectual Defense',
    icon: MessageCircle,
    color: 'blue',
    href: '/sectors/comparative-religion',
    features: ['Comparative Religion', 'Modern Ideologies', 'Revert Journey', 'Debate']
  },
  {
    id: 5,
    title: 'Ziyara (Protected)',
    description: 'Student Welfare & Leadership',
    icon: Shield,
    color: 'purple',
    href: '/sectors/ziyara',
    features: ['Student Welfare', 'Mental Health', 'Leadership Academy', 'Idad Programs']
  }
];

const colorMap = {
  emerald: 'from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800',
  amber: 'from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800',
  rose: 'from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800',
  blue: 'from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800',
  purple: 'from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800'
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/10638082/pexels-photo-10638082.jpeg" 
            alt="Islamic Education" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-emerald-400">
            Fejrul Islam
          </h1>
          <p className="text-2xl md:text-3xl mb-4 font-light">HUMSJ</p>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-slate-200">
            A Comprehensive Platform for Faith, Knowledge, Character Development, and Service
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-lg">
            <span className="px-4 py-2 bg-emerald-600/80 rounded-full">Faith</span>
            <span className="px-4 py-2 bg-amber-600/80 rounded-full">Knowledge</span>
            <span className="px-4 py-2 bg-rose-600/80 rounded-full">Character</span>
            <span className="px-4 py-2 bg-blue-600/80 rounded-full">Service</span>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <AnnouncementsBoard />
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-4xl font-serif font-bold text-slate-800 mb-6">
            Welcome to Fejrul Islam
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Fejrul Islam HUMSJ is a holistic platform designed to nurture the spiritual, intellectual, 
            and social development of Muslim students. Through our five integrated sectors, we provide 
            comprehensive resources for Quranic learning, academic knowledge, character building, 
            interfaith dialogue, and student welfare.
          </p>
        </div>
      </section>

      {/* Five Sectors */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-serif font-bold text-center text-slate-800 mb-4">
            Our Five Sectors
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Each sector is carefully designed to address different aspects of holistic Islamic development
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <Link 
                  key={sector.id} 
                  href={sector.href}
                  className="group"
                >
                  <div className="h-full bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200">
                    <div className={`h-3 bg-gradient-to-r ${colorMap[sector.color]}`}></div>
                    
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorMap[sector.color]} text-white`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
                            {sector.title}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {sector.description}
                          </p>
                        </div>
                      </div>
                      
                      <ul className="space-y-2 mb-6">
                        {sector.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-slate-700">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex items-center text-emerald-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                        Explore Sector
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Begin Your Journey Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-emerald-100">
            Explore our comprehensive platform and start your path towards holistic Islamic development
          </p>
          <Link 
            href="/sectors/qirat-ilm" 
            className="inline-block px-8 py-4 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}