'use client';

import { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Calendar, Clock, MapPin, Search, Filter,
  ArrowRight, Star, MessageCircle, Video
} from 'lucide-react';
import DashboardPageLayout, { useDashboard } from '@/components/dashboard/DashboardPageLayout';

function StudyGroupsContent() {
  const { user, genderColors } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const studyGroups = [
    {
      id: 1,
      name: 'Quran Memorization Circle',
      description: 'Weekly Quran memorization sessions with peer support and guidance',
      category: 'Quran',
      members: 24,
      maxMembers: 30,
      schedule: 'Every Saturday, 9:00 AM',
      location: 'Online (Zoom)',
      level: 'All Levels',
      language: 'Arabic/English',
      rating: 4.9,
      isOnline: true,
      isJoined: true
    },
    {
      id: 2,
      name: 'Fiqh Discussion Group',
      description: 'In-depth discussions on Islamic jurisprudence and contemporary issues',
      category: 'Fiqh',
      members: 18,
      maxMembers: 25,
      schedule: 'Every Tuesday, 7:00 PM',
      location: 'HUMSJ Campus, Room 201',
      level: 'Intermediate',
      language: 'English',
      rating: 4.7,
      isOnline: false,
      isJoined: false
    },
    {
      id: 3,
      name: 'Arabic Language Practice',
      description: 'Conversational Arabic practice for students at all levels',
      category: 'Language',
      members: 32,
      maxMembers: 40,
      schedule: 'Mon, Wed, Fri - 6:00 PM',
      location: 'Online (Discord)',
      level: 'Beginner to Advanced',
      language: 'Arabic',
      rating: 4.8,
      isOnline: true,
      isJoined: true
    },
    {
      id: 4,
      name: 'Hadith Study Circle',
      description: 'Systematic study of authentic hadith collections with scholarly commentary',
      category: 'Hadith',
      members: 15,
      maxMembers: 20,
      schedule: 'Every Sunday, 10:00 AM',
      location: 'HUMSJ Library',
      level: 'Advanced',
      language: 'Arabic/English',
      rating: 4.9,
      isOnline: false,
      isJoined: false
    },
    {
      id: 5,
      name: 'Dawah Training Workshop',
      description: 'Learn effective dawah techniques and communication skills',
      category: 'Dawah',
      members: 28,
      maxMembers: 35,
      schedule: 'Every Thursday, 5:00 PM',
      location: 'Online (Google Meet)',
      level: 'All Levels',
      language: 'English',
      rating: 4.6,
      isOnline: true,
      isJoined: false
    },
    {
      id: 6,
      name: 'Islamic History Book Club',
      description: 'Monthly reading and discussion of Islamic history books',
      category: 'History',
      members: 12,
      maxMembers: 20,
      schedule: 'First Saturday of each month',
      location: 'Online (Zoom)',
      level: 'All Levels',
      language: 'English',
      rating: 4.5,
      isOnline: true,
      isJoined: false
    }
  ];

  const categories = ['all', 'Quran', 'Fiqh', 'Language', 'Hadith', 'Dawah', 'History'];

  const filteredGroups = studyGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const myGroups = filteredGroups.filter(g => g.isJoined);
  const availableGroups = filteredGroups.filter(g => !g.isJoined);

  return (
    <>
      {/* Hero Section */}
      <section className={`py-8 bg-gradient-to-r from-${genderColors.primary}-600 to-${genderColors.secondary}-600 text-white`}>
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Grow Together in Knowledge</h2>
          <p className="text-white/90 max-w-xl mx-auto">
            Join study circles with fellow students and learn collaboratively
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-6 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search study groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-${genderColors.primary}-500 focus:border-${genderColors.primary}-500`}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-${genderColors.primary}-500 focus:border-${genderColors.primary}-500`}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* My Groups */}
        {myGroups.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users className={`w-5 h-5 text-${genderColors.primary}-600`} />
              My Study Groups
              <span className={`px-2 py-1 bg-${genderColors.primary}-100 text-${genderColors.primary}-700 rounded-full text-sm`}>
                {myGroups.length}
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGroups.map((group) => (
                <StudyGroupCard key={group.id} group={group} genderColors={genderColors} isJoined={true} />
              ))}
            </div>
          </div>
        )}

        {/* Available Groups */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen className={`w-5 h-5 text-${genderColors.secondary}-600`} />
            Available Study Groups
            <span className={`px-2 py-1 bg-${genderColors.secondary}-100 text-${genderColors.secondary}-700 rounded-full text-sm`}>
              {availableGroups.length}
            </span>
          </h3>
          
          {availableGroups.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No study groups found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableGroups.map((group) => (
                <StudyGroupCard key={group.id} group={group} genderColors={genderColors} isJoined={false} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StudyGroupCard({ group, genderColors, isJoined }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 bg-${genderColors.primary}-100 text-${genderColors.primary}-700 rounded-full text-sm font-medium`}>
            {group.category}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{group.rating}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-2">{group.name}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{group.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Users className={`w-4 h-4 text-${genderColors.primary}-600`} />
            <span>{group.members}/{group.maxMembers} members</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Calendar className={`w-4 h-4 text-${genderColors.primary}-600`} />
            <span>{group.schedule}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            {group.isOnline ? (
              <Video className={`w-4 h-4 text-${genderColors.primary}-600`} />
            ) : (
              <MapPin className={`w-4 h-4 text-${genderColors.primary}-600`} />
            )}
            <span className="truncate">{group.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <span className="text-xs text-slate-500">{group.level}</span>
          {isJoined ? (
            <button className={`flex items-center gap-2 px-4 py-2 bg-${genderColors.primary}-100 text-${genderColors.primary}-700 rounded-lg font-medium`}>
              <MessageCircle className="w-4 h-4" />
              Open Chat
            </button>
          ) : (
            <button className={`flex items-center gap-2 px-4 py-2 bg-${genderColors.primary}-600 text-white rounded-lg hover:bg-${genderColors.primary}-700 transition-colors font-medium`}>
              Join Group
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardStudyGroupsPage() {
  return (
    <DashboardPageLayout 
      title="Study Groups" 
      subtitle="Join collaborative learning circles"
    >
      <StudyGroupsContent />
    </DashboardPageLayout>
  );
}
