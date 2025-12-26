'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, BookOpen, Users, MessageCircle, Calendar, Award, Compass, GraduationCap, Scroll, Mosque } from 'lucide-react';

export default function StudentFooter({ user }) {
  const pathname = usePathname();
  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';

  const withLocale = (href) => {
    if (!href || typeof href !== 'string') return href;
    if (!href.startsWith('/')) return href;
    if (localePrefix && href.startsWith(`${localePrefix}/`)) return href;
    return `${localePrefix}${href}`;
  };

  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    learning: [
      { name: 'My Courses', href: '/dashboard/courses' },
      { name: 'Available Courses', href: '/dashboard/courses' },
      { name: 'Schedule', href: '/dashboard/schedule' },
      { name: 'Resources', href: '/dashboard/resources' }
    ],
    sectors: [
      { name: 'Tarbiya & Idad', href: '/dashboard/sectors/tarbiya-idad' },
      { name: 'Literature', href: '/dashboard/sectors/literature' },
      { name: 'Comparative Religion', href: '/dashboard/sectors/comparative-religion' },
      { name: 'Ziyara (Student Welfare)', href: '/dashboard/sectors/ziyara' },
      { name: 'Qirat & Ilm', href: '/dashboard/qirat' }
    ],
    community: [
      { name: 'Study Groups', href: '/dashboard/study-groups' },
      { name: 'Mentorship', href: '/dashboard/mentorship' },
      { name: 'Events', href: '/dashboard/events' },
      { name: 'Announcements', href: '/dashboard/announcements' }
    ],
    support: [
      { name: 'Help Center', href: '/dashboard/help' },
      { name: 'Contact Mentor', href: '/dashboard/contact-mentor' },
      { name: 'Settings', href: '/dashboard/settings' },
      { name: 'Feedback', href: '/dashboard/feedback' }
    ]
  };

  const genderColorScheme = user?.gender === 'female' ? {
    primary: 'teal',
    secondary: 'purple',
    bgGradient: 'from-teal-600 to-purple-700',
    textColor: 'text-teal-600',
    hoverColor: 'hover:text-teal-700'
  } : {
    primary: 'emerald',
    secondary: 'blue', 
    bgGradient: 'from-emerald-600 to-blue-700',
    textColor: 'text-emerald-600',
    hoverColor: 'hover:text-emerald-700'
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${genderColorScheme.bgGradient} rounded-lg flex items-center justify-center`}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Fejrul Islam</h3>
                <p className="text-xs text-slate-600">HUMSJ Student Portal</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Empowering Muslim students through comprehensive Islamic education and spiritual development.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Heart className={`w-4 h-4 ${genderColorScheme.textColor}`} />
              <span className="text-slate-600">
                {user?.gender === 'female' ? 'Sisters' : 'Brothers'} Wing
              </span>
            </div>
          </div>

          {/* Learning Links */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen className={`w-4 h-4 ${genderColorScheme.textColor}`} />
              Learning
            </h4>
            <ul className="space-y-2">
              {footerLinks.learning.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={withLocale(link.href)}
                    className={`text-sm text-slate-600 ${genderColorScheme.hoverColor} transition-colors`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectors Links */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Compass className={`w-4 h-4 ${genderColorScheme.textColor}`} />
              Sectors
            </h4>
            <ul className="space-y-2">
              {footerLinks.sectors.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={withLocale(link.href)}
                    className={`text-sm text-slate-600 ${genderColorScheme.hoverColor} transition-colors`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Users className={`w-4 h-4 ${genderColorScheme.textColor}`} />
              Community
            </h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={withLocale(link.href)}
                    className={`text-sm text-slate-600 ${genderColorScheme.hoverColor} transition-colors`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <MessageCircle className={`w-4 h-4 ${genderColorScheme.textColor}`} />
              Support
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={withLocale(link.href)}
                    className={`text-sm text-slate-600 ${genderColorScheme.hoverColor} transition-colors`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Student Stats Section */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-lg">
              <Award className={`w-6 h-6 ${genderColorScheme.textColor} mx-auto mb-2`} />
              <div className="text-lg font-bold text-slate-800">{user?.completedCourses || 0}</div>
              <div className="text-xs text-slate-600">Courses Completed</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <BookOpen className={`w-6 h-6 ${genderColorScheme.textColor} mx-auto mb-2`} />
              <div className="text-lg font-bold text-slate-800">{user?.currentCourses || 0}</div>
              <div className="text-xs text-slate-600">Active Courses</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <Calendar className={`w-6 h-6 ${genderColorScheme.textColor} mx-auto mb-2`} />
              <div className="text-lg font-bold text-slate-800">{user?.streak || 0}</div>
              <div className="text-xs text-slate-600">Day Streak</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <Users className={`w-6 h-6 ${genderColorScheme.textColor} mx-auto mb-2`} />
              <div className="text-lg font-bold text-slate-800">{user?.points || 0}</div>
              <div className="text-xs text-slate-600">Total Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`bg-gradient-to-r ${genderColorScheme.bgGradient} text-white py-4`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-2 md:mb-0">
              <p className="text-sm">
                © {currentYear} Fejrul Islam HUMSJ. Empowering Muslim minds through Islamic education.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/privacy" className="hover:text-white/80 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white/80 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-white/80 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Islamic Quote */}
      <div className="bg-slate-50 py-4 border-t border-slate-200">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <p className="text-sm text-slate-700 font-medium mb-1">
            "وَقُل رَّبِّ زِدْنِي عِلْمًا"
          </p>
          <p className="text-xs text-slate-600 italic">
            "And say: My Lord, increase me in knowledge" - Quran 20:114
          </p>
        </div>
      </div>
    </footer>
  );
}