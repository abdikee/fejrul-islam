'use client';

import { Settings, Shield, Database, Globe, Crown, Key } from 'lucide-react';

export default function IslamicSystemSettings() {
  return (
    <div className="space-y-8">
      {/* Islamic Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Settings className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold text-white">Tanzeem Settings</h1>
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <p className="text-xl text-amber-200 font-semibold mb-2">إعدادات التنظيم</p>
        <p className="text-white/80">Configure system with Islamic principles and security</p>
      </div>

      {/* Coming Soon with Islamic Design */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Settings className="w-12 h-12 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">Islamic System Configuration</h3>
          <p className="text-amber-200 font-semibold mb-2">تكوين النظام الإسلامي</p>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Comprehensive system settings with Islamic guidelines - configure platform 
            preferences, security, privacy, and operational parameters according to Islamic principles.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-200 mb-1">General Settings</h4>
              <p className="text-xs text-blue-300/80">Platform configuration</p>
            </div>
            <div className="p-4 bg-red-500/20 rounded-xl border border-red-400/30">
              <Shield className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h4 className="font-semibold text-red-200 mb-1">Security & Privacy</h4>
              <p className="text-xs text-red-300/80">Islamic privacy principles</p>
            </div>
            <div className="p-4 bg-purple-500/20 rounded-xl border border-purple-400/30">
              <Database className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-200 mb-1">Data Management</h4>
              <p className="text-xs text-purple-300/80">Backup & recovery</p>
            </div>
            <div className="p-4 bg-amber-500/20 rounded-xl border border-amber-400/30">
              <Key className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h4 className="font-semibold text-amber-200 mb-1">Access Control</h4>
              <p className="text-xs text-amber-300/80">Role-based permissions</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-xl p-6 border border-amber-400/30">
            <p className="text-amber-200 font-semibold mb-2">
              "وَاتَّقُوا اللَّهَ وَيُعَلِّمُكُمُ اللَّهُ"
            </p>
            <p className="text-white/80 text-sm">
              "Fear Allah and Allah will teach you" - Quran 2:282
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}