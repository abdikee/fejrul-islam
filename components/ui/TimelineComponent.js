'use client';

import { jemeaHistory } from '@/data/history';
import { Calendar, Star } from 'lucide-react';

const TimelineComponent = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-blue-400 to-purple-400"></div>

        {/* Timeline Items */}
        <div className="space-y-12">
          {jemeaHistory.map((event, index) => (
            <div
              key={event.year}
              className={`relative flex items-center ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex-col md:gap-8`}
            >
              {/* Year Badge */}
              <div className={`absolute left-0 md:left-1/2 transform md:-translate-x-1/2 ${
                event.milestone ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'
              } text-white px-4 py-2 rounded-full shadow-lg z-10 flex items-center gap-2`}>
                {event.milestone && <Star className="w-4 h-4 fill-current" />}
                <span className="font-bold">{event.year}</span>
              </div>

              {/* Content Card */}
              <div className={`w-full md:w-5/12 mt-16 md:mt-0 ${
                index % 2 === 0 ? 'md:text-right' : 'md:text-left'
              }`}>
                <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${
                  event.milestone ? 'border-emerald-500' : 'border-blue-500'
                } hover:shadow-2xl transition-shadow duration-300`}>
                  <div className="flex items-start gap-3 mb-3">
                    <Calendar className={`w-5 h-5 flex-shrink-0 ${
                      event.milestone ? 'text-emerald-600' : 'text-blue-600'
                    }`} />
                    <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{event.description}</p>
                  {event.milestone && (
                    <div className="mt-3">
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                        Major Milestone
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="hidden md:block w-5/12"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineComponent;
