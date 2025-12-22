'use client';

import Link from 'next/link';
import { BookOpen, GraduationCap } from 'lucide-react';

export default function AuthHeader() {
  return (
    <div className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-6 py-4">
        <Link href="/" className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Fejrul Islam HUMSJ</h1>
            <p className="text-sm text-slate-600">Haramaya University Muslim Students Jem'a</p>
          </div>
        </Link>
      </div>
    </div>
  );
}