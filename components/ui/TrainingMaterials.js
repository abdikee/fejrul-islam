'use client';

import { weeklyTrainingMaterials } from '@/data/training';
import { Download, Calendar, Tag } from 'lucide-react';

const categoryColors = {
  Tarbiya: 'bg-rose-100 text-rose-700 border-rose-300',
  Dawah: 'bg-blue-100 text-blue-700 border-blue-300',
  Idad: 'bg-purple-100 text-purple-700 border-purple-300',
  Irshad: 'bg-emerald-100 text-emerald-700 border-emerald-300'
};

const TrainingMaterials = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {weeklyTrainingMaterials.map((material) => (
        <div
          key={material.id}
          className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
        >
          {/* Header with Week Number */}
          <div className={`${categoryColors[material.category]} border-b-2 p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-bold text-sm">{material.week}</span>
              </div>
              <span className="text-xs px-3 py-1 bg-white/70 rounded-full font-semibold">
                {material.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
              {material.title}
            </h3>
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">
              {material.description}
            </p>

            {/* Topics */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700">Topics Covered:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {material.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-md"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center justify-center gap-2 group-hover:scale-105 transform shadow-md">
              <Download className="w-4 h-4" />
              Download Material
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainingMaterials;
