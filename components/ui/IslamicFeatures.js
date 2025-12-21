'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Compass, 
  Heart, 
  Moon, 
  Sun, 
  Calendar,
  MapPin,
  Volume2,
  Star,
  Bookmark,
  Users
} from 'lucide-react';

const IslamicFeatures = () => {
  const [activeFeature, setActiveFeature] = useState('quran');

  const islamicFeatures = [
    {
      id: 'quran',
      title: 'Quran & Tafsir',
      icon: BookOpen,
      color: 'emerald',
      description: 'Complete Quran with multiple translations and tafsir',
      features: [
        'Full Quran text in Arabic',
        'Multiple translations (English, Amharic)',
        'Audio recitation by famous Qaris',
        'Tafsir Ibn Kathir & other commentaries',
        'Bookmark and note-taking',
        'Search by topic or keyword'
      ]
    },
    {
      id: 'prayer',
      title: 'Prayer Times & Qibla',
      icon: Compass,
      color: 'blue',
      description: 'Accurate prayer times and Qibla direction',
      features: [
        'Location-based prayer times',
        'Qibla compass with GPS',
        'Prayer notifications',
        'Mosque finder nearby',
        'Prayer tracking & statistics',
        'Dua after prayers'
      ]
    },
    {
      id: 'dhikr',
      title: 'Dhikr & Duas',
      icon: Heart,
      color: 'rose',
      description: 'Collection of authentic dhikr and supplications',
      features: [
        'Morning & evening adhkar',
        'Duas from Quran & Sunnah',
        'Digital tasbih counter',
        'Audio pronunciation guide',
        'Daily dhikr reminders',
        'Personal dhikr tracker'
      ]
    },
    {
      id: 'calendar',
      title: 'Islamic Calendar',
      icon: Calendar,
      color: 'purple',
      description: 'Hijri calendar with important Islamic dates',
      features: [
        'Hijri to Gregorian conversion',
        'Islamic holidays & events',
        'Ramadan & fasting tracker',
        'Hajj & Umrah dates',
        'Local Islamic events',
        'Personal Islamic milestones'
      ]
    },
    {
      id: 'learning',
      title: 'Islamic Learning',
      icon: Star,
      color: 'amber',
      description: 'Structured Islamic education resources',
      features: [
        'Hadith collections (Bukhari, Muslim)',
        'Fiqh rulings & fatwas',
        'Islamic history timeline',
        'Arabic language lessons',
        'Tajweed tutorials',
        'Islamic quiz & tests'
      ]
    },
    {
      id: 'community',
      title: 'Community Features',
      icon: Users,
      color: 'indigo',
      description: 'Connect with Muslim community',
      features: [
        'Local mosque information',
        'Islamic event announcements',
        'Study circle coordination',
        'Volunteer opportunities',
        'Charity & zakat calculator',
        'Community discussion forums'
      ]
    }
  ];

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      icon: 'text-emerald-600'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-600'
    },
    rose: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-700',
      button: 'bg-rose-600 hover:bg-rose-700',
      icon: 'text-rose-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      button: 'bg-purple-600 hover:bg-purple-700',
      icon: 'text-purple-600'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      button: 'bg-amber-600 hover:bg-amber-700',
      icon: 'text-amber-600'
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
      button: 'bg-indigo-600 hover:bg-indigo-700',
      icon: 'text-indigo-600'
    }
  };

  const activeFeatureData = islamicFeatures.find(f => f.id === activeFeature);
  const activeColors = colorClasses[activeFeatureData?.color || 'emerald'];

  return (
    <div className="space-y-8">
      {/* Header with Logo */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-6">
          <div className="w-full h-full rounded-full border-4 border-emerald-600 bg-white flex items-center justify-center">
            {/* Logo placeholder - you can replace this with the actual logo */}
            <div className="relative">
              <BookOpen className="w-8 h-8 text-emerald-600" />
              <div className="absolute -top-2 -right-1">
                <Sun className="w-4 h-4 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">
          Islamic Digital Companion
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Comprehensive Islamic tools and resources to support your spiritual journey and daily worship
        </p>
      </div>

      {/* Feature Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {islamicFeatures.map((feature) => {
          const Icon = feature.icon;
          const colors = colorClasses[feature.color];
          const isActive = activeFeature === feature.id;
          
          return (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                isActive 
                  ? `${colors.bg} ${colors.border} ${colors.text} shadow-lg scale-105` 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-2 ${isActive ? colors.icon : 'text-slate-500'}`} />
              <div className="text-sm font-semibold text-center">{feature.title}</div>
            </button>
          );
        })}
      </div>

      {/* Active Feature Details */}
      {activeFeatureData && (
        <div className={`${activeColors.bg} ${activeColors.border} border-2 rounded-2xl p-8`}>
          <div className="flex items-start gap-6">
            <div className={`p-4 bg-white rounded-xl shadow-md ${activeColors.border} border`}>
              <activeFeatureData.icon className={`w-12 h-12 ${activeColors.icon}`} />
            </div>
            
            <div className="flex-1">
              <h3 className={`text-2xl font-bold ${activeColors.text} mb-2`}>
                {activeFeatureData.title}
              </h3>
              <p className="text-slate-700 mb-6 text-lg">
                {activeFeatureData.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeFeatureData.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full ${activeColors.button.split(' ')[0]} mt-2 flex-shrink-0`}></div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex gap-4">
                <button className={`px-6 py-3 ${activeColors.button} text-white font-semibold rounded-lg transition-colors shadow-md`}>
                  Explore Feature
                </button>
                <button className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Access Tools */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 rounded-2xl shadow-xl">
        <h3 className="text-2xl font-bold mb-6 text-center">Quick Islamic Tools</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/30 transition-colors cursor-pointer">
            <Clock className="w-10 h-10 mx-auto mb-3" />
            <h4 className="font-bold mb-2">Prayer Times</h4>
            <p className="text-sm text-emerald-100">Next: Maghrib in 2h 15m</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/30 transition-colors cursor-pointer">
            <Compass className="w-10 h-10 mx-auto mb-3" />
            <h4 className="font-bold mb-2">Qibla Direction</h4>
            <p className="text-sm text-emerald-100">Northeast 67°</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/30 transition-colors cursor-pointer">
            <Calendar className="w-10 h-10 mx-auto mb-3" />
            <h4 className="font-bold mb-2">Islamic Date</h4>
            <p className="text-sm text-emerald-100">15 Rajab 1446 AH</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/30 transition-colors cursor-pointer">
            <Heart className="w-10 h-10 mx-auto mb-3" />
            <h4 className="font-bold mb-2">Daily Dhikr</h4>
            <p className="text-sm text-emerald-100">SubhanAllah x100</p>
          </div>
        </div>
      </div>

      {/* Islamic Reminders */}
      <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Daily Islamic Reminders
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-amber-50 rounded-xl border border-amber-200">
            <Sun className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h4 className="font-bold text-amber-800 mb-2">Morning Adhkar</h4>
            <p className="text-sm text-amber-700">Start your day with remembrance of Allah</p>
            <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              Begin Now
            </button>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h4 className="font-bold text-blue-800 mb-2">Quran Reading</h4>
            <p className="text-sm text-blue-700">Continue from Surah Al-Baqarah, Ayah 156</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Continue Reading
            </button>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
            <Moon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h4 className="font-bold text-purple-800 mb-2">Evening Reflection</h4>
            <p className="text-sm text-purple-700">Reflect on your day and seek forgiveness</p>
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Start Reflection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslamicFeatures;