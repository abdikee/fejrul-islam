'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, BookOpen, Users, TrendingUp } from 'lucide-react';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';

export default function Sectors() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';
  const mentorBase = `${localePrefix}/mentor`;

  useEffect(() => {
    // Mock data
    setSectors([
      { id: 1, slug: 'qirat-ilm', name: 'Qirat & Ilm', students: 45, courses: 10, avgProgress: 78, color: 'emerald' },
      { id: 2, slug: 'tarbiya-idad', name: 'Tarbiya & Idad', students: 38, courses: 8, avgProgress: 82, color: 'blue' },
      { id: 3, slug: 'comparative-religion', name: 'Dawah & Comparative Religion', students: 32, courses: 7, avgProgress: 75, color: 'purple' },
      { id: 4, slug: 'literature', name: 'Literature & History', students: 28, courses: 9, avgProgress: 80, color: 'orange' },
      { id: 5, slug: 'ziyara', name: 'Ziyara & Khidma', students: 25, courses: 6, avgProgress: 85, color: 'teal' },
    ]);
    setLoading(false);
  }, []);

  const getColorClasses = (color) => {
    const colors = {
      emerald: 'from-emerald-500 to-green-500 border-emerald-200',
      blue: 'from-blue-500 to-cyan-500 border-blue-200',
      purple: 'from-purple-500 to-pink-500 border-purple-200',
      orange: 'from-orange-500 to-red-500 border-orange-200',
      teal: 'from-teal-500 to-emerald-500 border-teal-200'
    };
    return colors[color] || colors.emerald;
  };

  return (
    <MentorPageTemplate
      title="Sectors"
      description="Overview of all educational sectors"
      icon={Compass}
      loading={loading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectors.map((sector) => (
          <div key={sector.id} className={`bg-white rounded-2xl p-6 border-2 ${getColorClasses(sector.color).split(' ')[1]} hover:shadow-lg transition-shadow`}>
            <div className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(sector.color).split(' ').slice(0, 2).join(' ')} rounded-xl flex items-center justify-center mb-4`}>
              <Compass className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="font-bold text-slate-800 text-lg mb-4">{sector.name}</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  Students
                </div>
                <span className="font-bold text-slate-800">{sector.students}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <BookOpen className="w-4 h-4" />
                  Courses
                </div>
                <span className="font-bold text-slate-800">{sector.courses}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <TrendingUp className="w-4 h-4" />
                  Avg Progress
                </div>
                <span className="font-bold text-green-600">{sector.avgProgress}%</span>
              </div>
            </div>

            <Link
              href={`${mentorBase}/sectors/${sector.slug}`}
              className="block w-full mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-center"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </MentorPageTemplate>
  );
}
