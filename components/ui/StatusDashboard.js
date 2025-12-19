'use client';

import { achievements } from '@/data/history';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';

const iconMap = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: BookOpen },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Users },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Award },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', icon: TrendingUp }
};

const StatusDashboard = () => {
  return (
    <div className="space-y-8">
      {achievements.map((section) => {
        const { bg, text, icon: Icon } = iconMap[section.color];
        
        return (
          <div key={section.category} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className={`${bg} p-6 border-b border-slate-200`}>
              <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${text}`} />
                <h3 className="text-2xl font-bold text-slate-800">{section.category}</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {section.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="text-center p-6 rounded-lg bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="text-4xl font-bold text-slate-800 mb-2">
                      {metric.value}
                    </div>
                    <div className="text-sm font-semibold text-slate-600">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Overall Progress Visualization */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-8 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-center">Our Growing Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-5xl font-bold mb-2">38+</div>
            <div className="text-emerald-100">Years of Service</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">1200+</div>
            <div className="text-blue-100">Active Members</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">500+</div>
            <div className="text-emerald-100">Resources</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">5</div>
            <div className="text-blue-100">Integrated Sectors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDashboard;
