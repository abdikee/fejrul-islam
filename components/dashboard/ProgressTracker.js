'use client';

import { MessageCircle, BookOpen, Heart, GraduationCap, TrendingUp } from 'lucide-react';

const ProgressTracker = ({ progress }) => {
  const sectors = [
    {
      id: 'dawah',
      name: 'Dawah Sector',
      icon: MessageCircle,
      color: 'blue',
      progress: progress?.dawah || 0,
      description: 'Outreach & Comparative Religion'
    },
    {
      id: 'irshad',
      name: 'Irshad Sector',
      icon: BookOpen,
      color: 'emerald',
      progress: progress?.irshad || 0,
      description: 'Qirat & Islamic Knowledge'
    },
    {
      id: 'tarbiya',
      name: 'Tarbiya Sector',
      icon: Heart,
      color: 'rose',
      progress: progress?.tarbiya || 0,
      description: 'Character & Spiritual Development'
    },
    {
      id: 'idad',
      name: 'Idad Sector',
      icon: GraduationCap,
      color: 'purple',
      progress: progress?.idad || 0,
      description: 'Leadership Training'
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'text-blue-600',
      progress: 'bg-blue-500'
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      icon: 'text-emerald-600',
      progress: 'bg-emerald-500'
    },
    rose: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-700',
      icon: 'text-rose-600',
      progress: 'bg-rose-500'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      icon: 'text-purple-600',
      progress: 'bg-purple-500'
    }
  };

  const getProgressCircles = (progress) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-4 h-4 rounded-full border-2 ${
          i < Math.floor(progress / 20) 
            ? 'bg-orange-500 border-orange-500' 
            : 'bg-white border-slate-300'
        }`}
      />
    ));
  };

  const overallProgress = Math.round(
    sectors.reduce((sum, sector) => sum + sector.progress, 0) / sectors.length
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Four Pillars Progress Tracker
          </h2>
          <p className="text-slate-600">
            Your journey through the comprehensive Islamic development program
          </p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-1">
            {overallProgress}%
          </div>
          <div className="text-sm text-slate-600">Overall Progress</div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {sectors.map((sector) => {
          const Icon = sector.icon;
          const colors = colorClasses[sector.color];
          
          return (
            <div
              key={sector.id}
              className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-white rounded-lg ${colors.border} border`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${colors.text}`}>
                      {sector.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {sector.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${colors.text}`}>
                    {sector.progress}%
                  </div>
                </div>
              </div>

              {/* Progress Circles */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  {getProgressCircles(sector.progress)}
                </div>
                <span className="text-sm text-slate-600 font-medium">
                  {Math.floor(sector.progress / 20)}/5 Complete
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white rounded-full h-2 border border-slate-200">
                <div
                  className={`h-2 rounded-full ${colors.progress} transition-all duration-500`}
                  style={{ width: `${sector.progress}%` }}
                />
              </div>

              {/* Action Button */}
              <button className={`mt-3 w-full py-2 px-4 ${colors.progress} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}>
                Continue Learning
              </button>
            </div>
          );
        })}
      </div>

      {/* Visual Radar Chart Representation */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Progress Overview
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sectors.map((sector) => {
            const colors = colorClasses[sector.color];
            return (
              <div key={sector.id} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-2 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center`}>
                  <sector.icon className={`w-8 h-8 ${colors.icon}`} />
                </div>
                <div className={`text-lg font-bold ${colors.text}`}>
                  {sector.progress}%
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {sector.name.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational Message */}
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
          <p className="text-center text-emerald-800 font-semibold">
            "وَمَن يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا"
          </p>
          <p className="text-center text-sm text-emerald-600 mt-1">
            "And whoever is given wisdom has certainly been given much good" - Quran 2:269
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;