'use client';

import Link from 'next/link';
import {
  BookOpen,
  MessageSquare,
  Heart,
  Shield,
  FileText,
  ArrowRight,
  Users,
  Star,
} from 'lucide-react';

const sectors = [
  {
    name: 'Qirat & Ilm',
    slug: 'qirat-ilm',
    description: 'The Lifelong Pursuit of authentic knowledge',
    fullDescription: 'Islam emphasizes seeking knowledge from the cradle to the grave. Through Quranic recitation and Islamic sciences, we connect with divine wisdom and build a foundation of authentic understanding.',
    icon: BookOpen,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    aspect: 'Knowledge & Wisdom'
  },
  {
    name: 'Literature & History',
    slug: 'literature-history',
    description: 'Preserving our rich Islamic heritage',
    fullDescription: 'Understanding our history shapes our future. Through literature and historical studies, we preserve the intellectual legacy of the Muslim Ummah and inspire creative expression rooted in faith.',
    icon: FileText,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    aspect: 'Heritage & Identity'
  },
  {
    name: 'Dawah & Comparative Religion',
    slug: 'dawah-comparative-religion',
    description: 'The Wisdom to outreach with compassion',
    fullDescription: 'Islam calls us to invite others with wisdom and beautiful preaching. Through dawah and interfaith dialogue, we share the message of Islam while building bridges of understanding.',
    icon: MessageSquare,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    aspect: 'Outreach & Dialogue'
  },
  {
    name: 'Tarbiya & Idad',
    slug: 'tarbiya-idad',
    description: 'The Compassion to provide spiritual support',
    fullDescription: 'True leadership begins with character. Through spiritual purification and leadership training, we develop individuals who embody Islamic values and serve their communities with excellence.',
    icon: Heart,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    aspect: 'Character & Leadership'
  },
  {
    name: 'Ziyara',
    slug: 'ziyara',
    description: 'The Duty to strengthen our neighbors',
    fullDescription: 'Islam teaches us to care for one another. Through welfare services and community support, we ensure every member of our community has the support they need to thrive.',
    icon: Shield,
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    aspect: 'Welfare & Community'
  }
];

export default function DiscoverIslamPage() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-teal-600/10 to-blue-600/10"></div>
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Quranic Verse */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 rounded-3xl p-5 sm:p-8 mb-10 sm:mb-12 border-2 border-emerald-300/50">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold">
                  سورة النحل ١٦:١٢٥ • Surah An-Nahl 16:125
                </span>
              </div>
              <p className="text-2xl sm:text-4xl md:text-5xl text-emerald-800 mb-4 font-quran leading-relaxed">
                ٱدۡعُ إِلَىٰ سَبِيلِ رَبِّكَ بِٱلۡحِكۡمَةِ وَٱلۡمَوۡعِظَةِ ٱلۡحَسَنَةِۖ
              </p>
              <p className="text-base sm:text-xl text-slate-700 italic">
                "Call to the way of your Lord with wisdom and good counsel"
              </p>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-slate-900 mb-6 sm:mb-8">
              Discover <span className="text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">Islam</span>
            </h1>
            
            <p className="text-lg sm:text-2xl text-slate-600 leading-relaxed mb-8">
              Islam is a path of holistic guidance that transforms the individual and the community.
            </p>
          </div>
        </div>
      </section>

      {/* Main Description */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-3xl p-6 sm:p-10 border border-emerald-200 shadow-lg">
              <p className="text-base sm:text-xl lg:text-2xl text-slate-700 leading-relaxed text-center">
                Islam is a path of holistic guidance that transforms the individual and the community. 
                It is the <span className="font-bold text-blue-600">Wisdom to outreach</span> (Dawah), 
                the <span className="font-bold text-rose-600">Compassion to provide spiritual support</span> (Irshad), 
                the <span className="font-bold text-purple-600">Openness to build bridges</span> (Interfaith), 
                the <span className="font-bold text-orange-600">Duty to strengthen our neighbors</span> (Community Development), 
                and the <span className="font-bold text-emerald-600">Lifelong Pursuit of authentic knowledge</span> (Islamic Resources).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Five Pillars of Our Approach */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Islam Through Our Five Sectors
            </h2>
            <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto">
              At Fejrul Islam, we explore and practice Islam through five interconnected sectors, 
              each addressing a vital aspect of Muslim life and community.
            </p>
          </div>

          <div className="space-y-8 max-w-5xl mx-auto">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={sector.slug}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
                >
                  <div className="flex-1">
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${sector.gradient} rounded-2xl flex items-center justify-center shadow-md`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <span className={`text-sm font-semibold text-${sector.color}-600`}>{sector.aspect}</span>
                          <h3 className="text-2xl font-bold text-slate-900">{sector.name}</h3>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
                        {sector.fullDescription}
                      </p>
                      
                      <Link 
                        href={`/sectors/${sector.slug}`}
                        className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${sector.gradient} text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md`}
                      >
                        Explore {sector.name}
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="hidden lg:flex w-24 items-center justify-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${sector.gradient} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                      {index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Core Islamic Values We Embody
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Hikmah (Wisdom)', desc: 'Acting with insight and understanding', icon: Star },
              { name: 'Rahmah (Mercy)', desc: 'Showing compassion to all creation', icon: Heart },
              { name: 'Ilm (Knowledge)', desc: 'Pursuing authentic Islamic learning', icon: BookOpen },
              { name: 'Ukhuwwah (Brotherhood)', desc: 'Building strong community bonds', icon: Users }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl p-6 border border-emerald-200 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{value.name}</h3>
                  <p className="text-slate-600 text-sm">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Begin Your Journey
            </h2>
            <p className="text-base sm:text-xl text-emerald-100 mb-10">
              Whether you're new to Islam or seeking to deepen your understanding, 
              HUMSJ welcomes you to explore the beauty of this faith with us.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-colors shadow-lg"
              >
                <Heart className="w-5 h-5" />
                Join Our Community
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/30 transition-colors border-2 border-white/50"
              >
                <MessageSquare className="w-5 h-5" />
                Ask Questions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
