'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, ArrowLeft, Filter, Search, Calendar, Clock, AlertTriangle,
  Info, CheckCircle, Star, Eye, Bookmark, Share2, MessageSquare
} from 'lucide-react';
import StudentFooter from '@/components/dashboard/StudentFooter';

export default function StudentAnnouncements() {
  const [user, setUser] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authResponse = await fetch('/api/auth/me');
        const authData = await authResponse.json();
        
        if (authData.success) {
          setUser(authData.user);
        }

        // Mock announcements data
        const mockAnnouncements = [
          {
            id: 1,
            title: 'Ramadan Schedule Update',
            content: 'Updated prayer and study schedule for the holy month of Ramadan. All classes will be adjusted to accommodate Iftar and Tarawih prayers.',
            announcement_type: 'schedule',
            priority: 'urgent',
            publish_date: '2024-12-22T10:00:00Z',
            expire_date: '2025-01-15T23:59:59Z',
            target_audience: 'all',
            author: 'Admin Team',
            read_status: false,
            is_bookmarked: false
          },
          {
            id: 2,
            title: 'New Islamic Finance Course Available',
            content: 'We are excited to announce a new comprehensive course on Islamic Finance principles. Registration opens next week.',
            announcement_type: 'course',
            priority: 'high',
            publish_date: '2024-12-20T14:30:00Z',
            expire_date: '2025-01-30T23:59:59Z',
            target_audience: 'students',
            author: 'Academic Department',
            read_status: true,
            is_bookmarked: true
          },
          {
            id: 3,
            title: 'Weekly Quran Study Circle',
            content: 'Join us every Friday for our weekly Quran study circle. This week we will be discussing Surah Al-Baqarah verses 255-260.',
            announcement_type: 'event',
            priority: 'normal',
            publish_date: '2024-12-18T09:00:00Z',
            expire_date: '2024-12-27T23:59:59Z',
            target_audience: user?.gender || 'all',
            author: 'Ustadh Omar',
            read_status: true,
            is_bookmarked: false
          },
          {
            id: 4,
            title: 'System Maintenance Notice',
            content: 'The learning platform will undergo scheduled maintenance on December 25th from 2:00 AM to 6:00 AM. Please save your work.',
            announcement_type: 'system',
            priority: 'normal',
            publish_date: '2024-12-15T16:00:00Z',
            expire_date: '2024-12-26T06:00:00Z',
            target_audience: 'all',
            author: 'IT Department',
            read_status: false,
            is_bookmarked: false
          },
          {
            id: 5,
            title: 'Arabic Language Workshop',
            content: 'Special workshop on Arabic grammar and vocabulary. Perfect for students looking to improve their Quranic understanding.',
            announcement_type: 'workshop',
            priority: 'high',
            publish_date: '2024-12-12T11:00:00Z',
            expire_date: '2025-01-05T23:59:59Z',
            target_audience: 'students',
            author: 'Language Department',
            read_status: true,
            is_bookmarked: true
          }
        ];
        
        setAnnouncements(mockAnnouncements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setUser({ firstName: 'Ahmad', gender: 'male' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const markAsRead = async (announcementId) => {
    try {
      await fetch('/api/dashboard/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'mark_announcement_read', 
          data: { announcementId } 
        })
      });
      
      setAnnouncements(prev => prev.map(ann => 
        ann.id === announcementId ? { ...ann, read_status: true } : ann
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const toggleBookmark = (announcementId) => {
    setAnnouncements(prev => prev.map(ann => 
      ann.id === announcementId ? { ...ann, is_bookmarked: !ann.is_bookmarked } : ann
    ));
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return AlertTriangle;
      case 'high': return Star;
      case 'normal': return Info;
      default: return Info;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'normal': return 'blue';
      default: return 'gray';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'schedule': return 'purple';
      case 'course': return 'green';
      case 'event': return 'blue';
      case 'system': return 'gray';
      case 'workshop': return 'teal';
      default: return 'slate';
    }
  };

  const filteredAnnouncements = announcements
    .filter(ann => 
      ann.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === 'all' || 
       filter === 'unread' && !ann.read_status ||
       filter === 'bookmarked' && ann.is_bookmarked ||
       ann.announcement_type === filter)
    )
    .sort((a, b) => {
      // Sort by priority first, then by date
      const priorityOrder = { urgent: 3, high: 2, normal: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.publish_date) - new Date(a.publish_date);
    });

  const genderColors = user?.gender === 'female' ? {
    primary: 'teal',
    secondary: 'purple',
    bgGradient: 'from-teal-50 to-purple-50'
  } : {
    primary: 'emerald',
    secondary: 'blue',
    bgGradient: 'from-emerald-50 to-blue-50'
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${genderColors.bgGradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-${genderColors.primary}-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
          <p className="text-slate-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  const unreadCount = announcements.filter(ann => !ann.read_status).length;
  const bookmarkedCount = announcements.filter(ann => ann.is_bookmarked).length;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${genderColors.bgGradient}`}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/dashboard/${user?.gender}`}
                className={`p-2 hover:bg-${genderColors.primary}-100 rounded-lg transition-colors`}
              >
                <ArrowLeft className={`w-5 h-5 text-${genderColors.primary}-600`} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>
                <p className="text-sm text-slate-600">Stay updated with important information</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <div className={`px-3 py-1 bg-${genderColors.primary}-100 text-${genderColors.primary}-700 rounded-full text-sm font-medium`}>
                  {unreadCount} unread
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-6 py-6">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Announcements</option>
                <option value="unread">Unread ({unreadCount})</option>
                <option value="bookmarked">Bookmarked ({bookmarkedCount})</option>
                <option value="schedule">Schedule Updates</option>
                <option value="course">Course Related</option>
                <option value="event">Events</option>
                <option value="system">System Notices</option>
                <option value="workshop">Workshops</option>
              </select>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-200">
              <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Announcements Found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => {
              const PriorityIcon = getPriorityIcon(announcement.priority);
              const priorityColor = getPriorityColor(announcement.priority);
              const typeColor = getTypeColor(announcement.announcement_type);
              
              return (
                <div 
                  key={announcement.id} 
                  className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 border-${priorityColor}-500 hover:shadow-xl transition-all ${
                    !announcement.read_status ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 bg-${priorityColor}-100 rounded-xl flex items-center justify-center`}>
                        <PriorityIcon className={`w-6 h-6 text-${priorityColor}-600`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-xl font-bold ${!announcement.read_status ? 'text-slate-900' : 'text-slate-700'}`}>
                            {announcement.title}
                          </h3>
                          {!announcement.read_status && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-2 py-1 bg-${typeColor}-100 text-${typeColor}-700 rounded-full text-xs font-medium`}>
                            {announcement.announcement_type}
                          </span>
                          <span className={`px-2 py-1 bg-${priorityColor}-100 text-${priorityColor}-700 rounded-full text-xs font-medium`}>
                            {announcement.priority} priority
                          </span>
                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            <Calendar className="w-3 h-3" />
                            {new Date(announcement.publish_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            <Clock className="w-3 h-3" />
                            {new Date(announcement.publish_date).toLocaleTimeString()}
                          </div>
                        </div>
                        
                        <p className="text-slate-600 leading-relaxed mb-4">{announcement.content}</p>
                        
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <span>By {announcement.author}</span>
                          {announcement.expire_date && (
                            <>
                              <span>•</span>
                              <span>Expires: {new Date(announcement.expire_date).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                      {!announcement.read_status && (
                        <button
                          onClick={() => markAsRead(announcement.id)}
                          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-${genderColors.primary}-600 hover:bg-${genderColors.primary}-50 rounded-lg transition-colors`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Read
                        </button>
                      )}
                      
                      <button
                        onClick={() => toggleBookmark(announcement.id)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          announcement.is_bookmarked
                            ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${announcement.is_bookmarked ? 'fill-current' : ''}`} />
                        {announcement.is_bookmarked ? 'Bookmarked' : 'Bookmark'}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <StudentFooter user={user} />
    </div>
  );
}