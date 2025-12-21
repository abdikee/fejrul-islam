'use client';

import { BookOpen, FileText, Bell, Video, Star } from 'lucide-react';

export default function IslamicContentManagement() {
  return (
    <div className="space-y-8">
      {/* Islamic Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">Ilm Management</h1>
          <Star className="w-8 h-8 text-amber-400" />
        </div>
        <p className="text-xl text-emerald-200 font-semibold mb-2">إدارة العلم</p>
        <p className="text-white/80">Manage Islamic knowledge and educational content</p>
      </div>

      {/* Coming Soon with Islamic Design */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">Islamic Content Management</h3>
          <p className="text-emerald-200 font-semibold mb-2">نظام إدارة المحتوى الإسلامي</p>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Comprehensive content management for Islamic education - manage courses, 
            announcements, resources, and media with Islamic guidelines and quality control.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-200 mb-1">Quranic Studies</h4>
              <p className="text-xs text-blue-300/80">Quran & Hadith content</p>
            </div>
            <div className="p-4 bg-purple-500/20 rounded-xl border border-purple-400/30">
              <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-200 mb-1">Islamic Literature</h4>
              <p className="text-xs text-purple-300/80">Books & articles</p>
            </div>
            <div className="p-4 bg-green-500/20 rounded-xl border border-green-400/30">
              <Bell className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-green-200 mb-1">Announcements</h4>
              <p className="text-xs text-green-300/80">Community updates</p>
            </div>
            <div className="p-4 bg-amber-500/20 rounded-xl border border-amber-400/30">
              <Video className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h4 className="font-semibold text-amber-200 mb-1">Media Library</h4>
              <p className="text-xs text-amber-300/80">Videos & audio</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl p-6 border border-emerald-400/30">
            <p className="text-emerald-200 font-semibold mb-2">
              "وَقُل رَّبِّ زِدْنِي عِلْمًا"
            </p>
            <p className="text-white/80 text-sm">
              "And say: My Lord, increase me in knowledge" - Quran 20:114
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}