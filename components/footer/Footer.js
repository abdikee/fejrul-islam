'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, Calendar } from 'lucide-react';
import { useRealtimeContext } from '@/components/realtime/RealtimeProvider';

export default function Footer() {
  const { nextPrayer, timeToNext } = useRealtimeContext();
  const currentYear = new Date().getFullYear();

  // Get current Hijri date (simplified)
  const getHijriDate = () => {
    const hijriMonths = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ];
    
    const hijriYear = 1446;
    const hijriMonth = hijriMonths[5];
    const hijriDay = 15;
    
    return `${hijriDay} ${hijriMonth} ${hijriYear}`;
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Quick Access Bar */}
      <div className="bg-emerald-600 text-white py-3">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {nextPrayer ? `Next Prayer: ${nextPrayer.name} ${timeToNext ? `in ${timeToNext}` : ''}` : 'Loading prayer times...'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Hijri: {getHijriDate()}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="hover:text-emerald-200 transition-colors">
                Member Login
              </Link>
              <a 
                href="tel:+251911234567" 
                className="flex items-center gap-2 hover:text-emerald-200 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Emergency: +251 911 234 567
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Organization Info */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 mr-3">
                  <Image
                    src="/images/humsj-logo.svg"
                    alt="HUMSJ Logo"
                    width={40}
                    height={40}
                    className="w-full h-full opacity-90"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-400">Fejrul Islam HUMSJ</h3>
                  <p className="text-sm text-slate-400">Haramaya University Muslim Students' Jama'a</p>
                </div>
              </div>
              
              <p className="text-slate-400 mb-4 leading-relaxed">
                Fostering Islamic education, character development, and academic excellence.
              </p>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Haramaya University, Dire Dawa, Ethiopia</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">info@humsj.edu.et</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">+251 25 553 0325</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Home</Link></li>
                <li><Link href="/about" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">About Us</Link></li>
                <li><Link href="/auth/login" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Login</Link></li>
                <li><Link href="/auth/signup" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Sign Up</Link></li>
              </ul>
            </div>

            {/* Our Sectors */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Our Sectors</h4>
              <ul className="space-y-2">
                <li>Qirat & Ilm</li>
                <li>Literature</li>
                <li>Tarbiya & Idad</li>
                <li>Dawah</li>
                <li>Ziyara</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <p className="text-sm text-slate-400">
              © {currentYear} Haramaya University Muslim Students' Jama'a. All rights reserved.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Built by A2K for the Muslim Ummah
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}