'use client';

import { useState, useEffect } from 'react';
import { Menu, Clock, MapPin, BookOpen, Sun, Moon } from 'lucide-react';

const DashboardHeader = ({ user, onMenuClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyContent, setDailyContent] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Fetch Islamic content from API
    const fetchIslamicContent = async () => {
      try {
        const response = await fetch('/api/dashboard/islamic-content');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setDailyContent(data.data);
            setPrayerTimes(data.data.prayerTimes);
          }
        }
      } catch (error) {
        console.error('Error fetching Islamic content:', error);
        // Fallback to default content
        setDailyContent({
          verse: {
            arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
            translation: "And say: My Lord, increase me in knowledge",
            reference: "Quran 20:114"
          },
          hadith: {
            text: "The seeking of knowledge is obligatory upon every Muslim.",
            reference: "Ibn Majah"
          }
        });
        setPrayerTimes({
          fajr: '05:30',
          dhuhr: '12:15',
          asr: '15:45',
          maghrib: '18:20',
          isha: '19:45',
          location: 'Addis Ababa, Ethiopia'
        });
      }
    };

    fetchIslamicContent();

    return () => clearInterval(timer);
  }, []);

  const getIslamicDate = () => {
    // Simple Hijri date calculation (approximate)
    const gregorianDate = new Date();
    const hijriYear = Math.floor((gregorianDate.getFullYear() - 622) * 1.030684) + 1;
    const hijriMonths = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
      'Ramadan', 'Shawwal', 'Dhu al-Qidah', 'Dhu al-Hijjah'
    ];
    const monthIndex = Math.floor(Math.random() * 12); // Simplified for demo
    return `15 ${hijriMonths[monthIndex]} ${hijriYear} AH`;
  };

  const getNextPrayer = () => {
    if (!prayerTimes) return null;
    
    const now = currentTime;
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const prayers = [
      { name: 'Fajr', time: prayerTimes.fajr, icon: Sun },
      { name: 'Dhuhr', time: prayerTimes.dhuhr, icon: Sun },
      { name: 'Asr', time: prayerTimes.asr, icon: Sun },
      { name: 'Maghrib', time: prayerTimes.maghrib, icon: Moon },
      { name: 'Isha', time: prayerTimes.isha, icon: Moon }
    ];

    for (let prayer of prayers) {
      if (prayer.time > currentTimeStr) {
        return prayer;
      }
    }
    
    return prayers[0]; // Next day's Fajr
  };

  const nextPrayer = getNextPrayer();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
      <div className="px-6 py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                السلام عليكم، {user?.gender === 'male' ? 'Brother' : 'Sister'} {user?.firstName}
              </h1>
              <p className="text-slate-600">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • {getIslamicDate()}
              </p>
            </div>
          </div>

          {/* Prayer Times Widget */}
          {nextPrayer && (
            <div className="hidden md:flex items-center gap-4 bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-sm font-semibold text-emerald-800">
                    Next: {nextPrayer.name}
                  </div>
                  <div className="text-xs text-emerald-600">
                    {nextPrayer.time}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <MapPin className="w-3 h-3" />
                <span>{prayerTimes?.location}</span>
              </div>
            </div>
          )}
        </div>

        {/* Daily Islamic Content */}
        {dailyContent && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Daily Verse */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-emerald-800 mb-2">Daily Verse</h3>
                  <p className="text-lg font-quran text-emerald-900 mb-2 leading-relaxed">
                    {dailyContent.verse.arabic}
                  </p>
                  <p className="text-sm text-emerald-700 mb-1">
                    "{dailyContent.verse.translation}"
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold">
                    {dailyContent.verse.reference}
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Hadith */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-white text-xs font-bold">ﷺ</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Daily Hadith</h3>
                  <p className="text-sm text-blue-700 mb-2 leading-relaxed">
                    "{dailyContent.hadith.text}"
                  </p>
                  <p className="text-xs text-blue-600 font-semibold">
                    Prophet Muhammad ﷺ - {dailyContent.hadith.reference}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Prayer Times */}
        {nextPrayer && (
          <div className="md:hidden mt-4 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-800">
                  Next Prayer: {nextPrayer.name} at {nextPrayer.time}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <MapPin className="w-3 h-3" />
                <span>{prayerTimes?.location}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;