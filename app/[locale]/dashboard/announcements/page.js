'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, Filter, Search, Calendar, Clock, AlertTriangle,
  Info, CheckCircle, Star, Bookmark, Share2, MessageSquare
} from 'lucide-react';
import DashboardPageLayout, { useDashboard } from '@/components/dashboard/DashboardPageLayout';

function AnnouncementsContent() {
  const { user, genderColors } = useDashboard();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const announcementsResponse = await fetch('/api/announcements');
        const announcementsData = await announcementsResponse.json();
        
        if (announcementsData.success && announcementsData.announcements) {
          setAnnouncements(announcementsData.announcements);
        } else {
          throw new Error(announcementsData.message || 'Failed to fetch announcements');
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setAnnouncements([]);
        setErrorMessage(error?.message || 'Failed to load announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [user]);

  if (errorMessage && !loading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-12 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 font-semibold">Failed to load announcements</p>
        <p className="text-slate-600 mt-2">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className={`mt-6 px-4 py-2 ${genderColors.buttonPrimary} text-white rounded-lg hover:shadow-lg transition-all`}
        >
          Retry
        </button>
      </div>
    );
  }

  const markAsRead = async (announcementId) => {
    try {
      await fetch('/api/dashboard/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_announcement_read', data: { announcementId } })
      });
      setAnnouncements(prev => prev.map(ann => ann.id === announcementId ? { ...ann, read_status: true } : ann));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const toggleBookmark = (announcementId) => {
    setAnnouncements(prev => prev.map(ann => ann.id === announcementId ? { ...ann, is_bookmarked: !ann.is_bookmarked } : ann));
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
       (filter === 'unread' && !ann.read_status) ||
       (filter === 'bookmarked' && ann.is_bookmarked) ||
       ann.announcement_type === filter)
    )
    .sort((a, b) => {
      const priorityOrder = { urgent: 3, high: 2, normal: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.publish_date) - new Date(a.publish_date);
    });

  const unreadCount = announcements.filter(ann => !ann.read_status).length;
  const bookmarkedCount = announcements.filter(ann => ann.is_bookmarked).length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-12 text-center">
        <div className={`w-16 h-16 border-4 border-${genderColors.primary}-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
        <p className="text-slate-600">Loading announcements...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="text" placeholder="Search announcements..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
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
              <div key={announcement.id} className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 border-${priorityColor}-500 hover:shadow-xl transition-all ${!announcement.read_status ? 'bg-blue-50/30' : ''}`}>
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
                        {!announcement.read_status && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
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
                      <button onClick={() => markAsRead(announcement.id)} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-${genderColors.primary}-600 hover:bg-${genderColors.primary}-50 rounded-lg transition-colors`}>
                        <CheckCircle className="w-4 h-4" />
                        Mark as Read
                      </button>
                    )}
                    <button onClick={() => toggleBookmark(announcement.id)} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${announcement.is_bookmarked ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' : 'text-slate-600 hover:bg-slate-100'}`}>
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
  );
}

export default function StudentAnnouncements() {
  const [unreadCount, setUnreadCount] = useState(0);
  
  return (
    <DashboardPageLayout 
      title="Announcements" 
      subtitle="Stay updated with important information"
      rightContent={
        unreadCount > 0 && (
          <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            {unreadCount} unread
          </div>
        )
      }
    >
      <AnnouncementsContent />
    </DashboardPageLayout>
  );
}
