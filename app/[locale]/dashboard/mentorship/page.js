'use client';

import { useState, useEffect } from 'react';
import { Users, Star, MessageCircle, Calendar, Clock, Award, Search, Filter } from 'lucide-react';
import DashboardPageLayout from '@/components/dashboard/DashboardPageLayout';

export default function DashboardMentorshipPage() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');

  useEffect(() => {
    // Mock mentors data
    setMentors([
      { id: 1, name: 'Sheikh Ahmad Hassan', sector: 'Qirat & Ilm', specialty: 'Tajweed & Quran Memorization', rating: 4.9, students: 45, available: true },
      { id: 2, name: 'Ustadh Ibrahim Ali', sector: 'Dawah & Comparative Religion', specialty: 'Interfaith Dialogue', rating: 4.8, students: 32, available: true },
      { id: 3, name: 'Sheikh Mohammed Yusuf', sector: 'Tarbiya & Idad', specialty: 'Character Development', rating: 4.7, students: 28, available: false },
      { id: 4, name: 'Ustadh Khalid Omar', sector: 'Literature & History', specialty: 'Islamic History', rating: 4.9, students: 38, available: true },
    ]);
    setLoading(false);
  }, []);

  const sectors = ['all', 'Qirat & Ilm', 'Dawah & Comparative Religion', 'Tarbiya & Idad', 'Literature & History', 'Ziyara'];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || mentor.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <DashboardPageLayout title="Mentorship" subtitle="Connect with experienced mentors">
      <div className="container mx-auto px-4 lg:px-6 py-6">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>
                  {sector === 'all' ? 'All Sectors' : sector}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mentors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading mentors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map(mentor => (
              <div key={mentor.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{mentor.name}</h3>
                    <p className="text-sm text-emerald-600">{mentor.sector}</p>
                    <p className="text-xs text-slate-500">{mentor.specialty}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{mentor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{mentor.students} students</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs ${mentor.available ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {mentor.available ? 'Available' : 'Busy'}
                  </span>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                    Request Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
}
