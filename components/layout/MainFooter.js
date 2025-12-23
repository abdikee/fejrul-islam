'use client';

import Link from 'next/link';
import { GraduationCap, Heart, BookOpen, Users, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function MainFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Fejrul Islam HUMSJ</h3>
                <p className="text-xs text-slate-400">Haramaya University</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Empowering Muslim students through comprehensive Islamic education and spiritual development.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Haramaya University, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>info@humsj.edu.et</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+251 25 553 0325</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/sectors" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Sectors
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Sectors */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Learning Sectors</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Qirat & Ilm
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Users className="w-4 h-4 text-amber-400" />
                Literature & History
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Heart className="w-4 h-4 text-rose-400" />
                Tarbiya & Idad
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MessageCircle className="w-4 h-4 text-blue-400" />
                Dawah & Comparative Religion
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Users className="w-4 h-4 text-purple-400" />
                Ziyara (Student Welfare)
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Get Started</h4>
            <p className="text-sm text-slate-400 mb-4">
              Join thousands of students on the path of Islamic knowledge and spiritual growth.
            </p>
            <div className="space-y-3">
              <Link
                href="/auth/signup"
                className="block w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all"
              >
                Sign Up Now
              </Link>
              <Link
                href="/auth/login"
                className="block w-full px-4 py-2 border border-slate-600 text-slate-300 text-center rounded-lg font-semibold hover:border-emerald-500 hover:text-emerald-400 transition-all"
              >
                Member Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © {currentYear} Fejrul Islam HUMSJ. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Islamic Quote */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 mb-1">
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
