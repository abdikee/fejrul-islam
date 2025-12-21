'use client';

import { BarChart3, TrendingUp, Target, Eye, Compass } from 'lucide-react';

export default function IslamicAnalyticsDashboard() {
  return (
    <div className="space-y-8">
      {/* Islamic Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BarChart3 className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Hikmah Analytics</h1>
          <Compass className="w-8 h-8 text-amber-400" />
        </div>
        <p className="text-xl text-purple-200 font-semibold mb-2">تحليلات الحكمة</p>
        <p className="text-white/80">Gain wisdom through data and community insights</p>
      </div>

      {/* Coming Soon with Islamic Design */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <BarChart3 className="w-12 h-12 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">Islamic Analytics Dashboard</h3>
          <p className="text-purple-200 font-semibold mb-2">لوحة التحليلات الإسلامية</p>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Comprehensive analytics and reporting system with Islamic insights - 
            track community growth, learning progress, and spiritual development with wisdom.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-200 mb-1">Growth Metrics</h4>
              <p className="text-xs text-blue-300/80">Community expansion</p>
            </div>
            <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
              <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h4 className="font-semibold text-emerald-200 mb-1">Learning Goals</h4>
              <p className="text-xs text-emerald-300/80">Educational progress</p>
            </div>
            <div className="p-4 bg-purple-500/20 rounded-xl border border-purple-400/30">
              <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-200 mb-1">Engagement</h4>
              <p className="text-xs text-purple-300/80">User activity insights</p>
            </div>
            <div className="p-4 bg-amber-500/20 rounded-xl border border-amber-400/30">
              <Compass className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h4 className="font-semibold text-amber-200 mb-1">Spiritual Metrics</h4>
              <p className="text-xs text-amber-300/80">Islamic development</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl p-6 border border-purple-400/30">
            <p className="text-purple-200 font-semibold mb-2">
              "وَفَوْقَ كُلِّ ذِي عِلْمٍ عَلِيمٌ"
            </p>
            <p className="text-white/80 text-sm">
              "And above every knowledgeable person is one [more] knowing" - Quran 12:76
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}