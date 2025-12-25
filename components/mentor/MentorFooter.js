'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Users, FileCheck, BookOpen, Calendar, Heart, Award, MessageSquare, Settings, BarChart3, Compass } from 'lucide-react';

export default function MentorFooter({ user }) {
  const pathname = usePathname();
  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';
  const mentorBase = `${localePrefix}/mentor`;
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    mentorship: [
      { name: 'My Students', href: `${mentorBase}/students` },
      { name: 'Assignments', href: `${mentorBase}/assignments` },
      { name: 'Review Submissions', href: `${mentorBase}/submissions` },
      { name: 'Schedule Sessions', href: `${mentorBase}/sessions` }
    ],
    management: [
      { name: 'Student Progress', href: `${mentorBase}/progress` },
      { name: 'Performance Analytics', href: `${mentorBase}/analytics` },
      { name: 'Reports & Insights', href: `${mentorBase}/reports` },
      { name: 'Attendance Tracking', href: `${mentorBase}/attendance` }
    ],
    sectors: [
      { name: 'Tarbiya & Idad', href: `${mentorBase}/sectors/tarbiya-idad` },
      { name: 'Literature', href: `${mentorBase}/sectors/literature` },
      { name: 'Comparative Religion', href: `${mentorBase}/sectors/comparative-religion` },
      { name: 'Ziyara', href: `${mentorBase}/sectors/ziyara` },
      { name: 'Qirat & Ilm', href: `${mentorBase}/sectors/qirat-ilm` }
    ],
    resources: [
      { name: 'Teaching Resources', href: `${mentorBase}/resources` },
      { name: 'Assessment Tools', href: `${mentorBase}/assessments` },
      { name: 'Curriculum Guide', href: `${mentorBase}/curriculum` },
      { name: 'Best Practices', href: `${mentorBase}/best-practices` }
    ],
    support: [
      { name: 'Mentor Handbook', href: `${mentorBase}/handbook` },
      { name: 'Training Materials', href: `${mentorBase}/training` },
      { name: 'Technical Support', href: `${mentorBase}/support` },
      { name: 'Feedback & Reports', href: `${mentorBase}/feedback` }
    ]
  };

  return (
    <footer className="bg-white border-t border-green-200 mt-12">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Fejrul Islam</h3>
                <p className="text-xs text-slate-600">HUMSJ Mentor Portal</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Empowering mentors to guide and nurture the next generation of Muslim leaders through comprehensive Islamic education.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-green-600" />
              <span className="text-slate-600">Mentorship Excellence</span>
            </div>
          </div>

          {/* Mentorship Links */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-green-600" />
              Mentorship
            </h4>
            <ul className="space-y-2">
              {footerLinks.mentorship.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-green-700 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-600" />
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-green-700 transition-colors"
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
              <MessageSquare className="w-4 h-4 text-green-600" />
              Support
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-green-700 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mentor Stats Section */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-800">{user?.totalStudents || 0}</div>
              <div className="text-xs text-slate-600">Total Students</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg">
              <FileCheck className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-800">{user?.activeAssignments || 0}</div>
              <div className="text-xs text-slate-600">Active Assignments</div>
            </div>
            <div className="p-4 bg-teal-50 rounded-lg">
              <Calendar className="w-6 h-6 text-teal-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-800">{user?.pendingReviews || 0}</div>
              <div className="text-xs text-slate-600">Pending Reviews</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-slate-800">{user?.completionRate || 0}%</div>
              <div className="text-xs text-slate-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-2 md:mb-0">
              <p className="text-sm">
                © {currentYear} Fejrul Islam HUMSJ. Guiding the next generation of Muslim leaders.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href={`${mentorBase}/privacy`} className="hover:text-white/80 transition-colors">
                Privacy Policy
              </Link>
              <Link href={`${mentorBase}/terms`} className="hover:text-white/80 transition-colors">
                Mentor Guidelines
              </Link>
              <Link href={`${mentorBase}/contact`} className="hover:text-white/80 transition-colors">
                Contact Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Islamic Quote for Mentors */}
      <div className="bg-green-50 py-4 border-t border-green-200">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <p className="text-sm text-green-800 font-medium mb-1">
            "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ"
          </p>
          <p className="text-xs text-green-700 italic">
            "The best of people are those who benefit others" - Hadith
          </p>
        </div>
      </div>
    </footer>
  );
}