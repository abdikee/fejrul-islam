'use client';

import { useState, useEffect } from 'react';
import { Bell, Calendar, Users, BookOpen, Clock, ChevronRight, Filter } from 'lucide-react';

export default function AnnouncementBoard({ colorScheme }) {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Mock announcements data - replace with API call
    const mockAnnouncements = [
      {
        id: 1,
        title: 'Midterm Examinations Schedule Released',
        category: 'academic',
        content: 'The midterm examination schedule for all sectors has been published. Please check your respective sector pages for detailed timing.',
        timestamp: '2024-12-21T10:30:00Z',
        priority: 'high',
        author: 'Academic Committee'
      },
      {
        id: 2,
        title: 'Weekly Ziyara Program - Community Outreach',
        category: 'spiritual',
        content: 'Join us for this week\'s community outreach program. We will be visiting local orphanages and elderly care centers.',
        timestamp: '2024-12-21T09:15:00Z',
        priority: 'medium',
        author: 'Ziyara Department'
      },
      {
        id: 3,
        title: 'HUMSJ History Documentation Project',
        category: 'community',
        content: 'We are collecting stories and memories from alumni to document our organization\'s rich history. Share your experiences!',
        timestamp: '2024-12-20T16:45:00Z',
        priority: 'low',
        author: 'Literature Sector'
      },
      {
        id: 4,
        title: 'New Qirat & Ilm Course Registration Open',
        category: 'academic',
        content: 'Registration is now open for the advanced Tajweed course. Limited seats available. Register before December 25th.',
        timestamp: '2024-12-20T14:20:00Z',
        priority: 'high',
        author: 'Qirat & Ilm Department'
      }
    ];
    
    setAnnouncements(mockAnnouncements);
  }, []);

  const categories = [
    { id: 'all', name: 'All Updates', icon: Bell, color: 'text-slate-600' },
    { id: 'academic', name: 'Academic', icon: BookOpen, color: 'text-blue-600' },
    { id: 'spiritual', name: 'Spiritual', icon: Calendar, color: 'text-purple-600' },
    { id: 'community', name: 'Community', icon: Users, color: 'text-green-600' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-amber-500 bg-amber-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-slate-500 bg-slate-50';
    }
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.icon : Bell;
  };

  const getCategoryColor = (category) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.color : 'text-slate-600';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const filteredAnnouncements = selectedCategory === 'all' 
    ? announcements 
    : announcements.filter(ann => ann.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${colorScheme.buttonPrimary} rounded-lg flex items-center justify-center`}>
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Jeme'a Updates</h2>
            <p className="text-slate-600">Critical announcements and community news</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(category => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                isActive
                  ? `${colorScheme.buttonPrimary} text-white shadow-md`
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.name}
              {category.id === 'all' && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {announcements.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Announcements List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No announcements in this category</p>
          </div>
        ) : (
          filteredAnnouncements.map(announcement => {
            const CategoryIcon = getCategoryIcon(announcement.category);
            
            return (
              <div
                key={announcement.id}
                className={`bg-white rounded-xl shadow-sm border-l-4 ${getPriorityColor(announcement.priority)} p-6 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <CategoryIcon className={`w-5 h-5 ${getCategoryColor(announcement.category)}`} />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(announcement.category)} bg-current bg-opacity-10`}>
                        {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                      </span>
                      <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(announcement.timestamp)}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                      {announcement.title}
                    </h3>

                    {/* Content */}
                    <p className="text-slate-600 mb-3 line-clamp-2">
                      {announcement.content}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        By {announcement.author}
                      </span>
                      <button className={`flex items-center gap-1 ${colorScheme.textPrimary} hover:${colorScheme.iconColor} font-medium text-sm transition-colors`}>
                        Read More
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Priority Indicator */}
                  <div className={`w-3 h-3 rounded-full ${
                    announcement.priority === 'high' ? 'bg-red-500' :
                    announcement.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* View All Button */}
      {filteredAnnouncements.length > 0 && (
        <div className="text-center">
          <button className={`${colorScheme.buttonPrimary} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all`}>
            View All Announcements
          </button>
        </div>
      )}
    </div>
  );
}