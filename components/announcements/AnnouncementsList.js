'use client';

import { useState, useEffect } from 'react';
import { Bell, AlertCircle, Info, Megaphone } from 'lucide-react';

export default function AnnouncementsList({ limit = 5, audience = 'all' }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, [limit, audience]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`/api/announcements?limit=${limit}&audience=${audience}`);
      const data = await response.json();
      
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <Megaphone className="w-5 h-5 text-orange-500" />;
      case 'normal':
        return <Bell className="w-5 h-5 text-blue-500" />;
      case 'low':
        return <Info className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'normal':
        return 'border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-4 border-l-4 border-gray-300">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No announcements at this time</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className={`p-4 rounded-lg border-l-4 ${getPriorityColor(announcement.priority)} transition-all hover:shadow-md`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getPriorityIcon(announcement.priority)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 truncate">
                  {announcement.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  announcement.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                  announcement.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  announcement.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {announcement.priority}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-2">
                {announcement.content}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="capitalize">{announcement.announcement_type}</span>
                <span>•</span>
                <span>{new Date(announcement.publish_date).toLocaleDateString()}</span>
                {announcement.target_audience !== 'all' && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{announcement.target_audience}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}