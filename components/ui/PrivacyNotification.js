'use client';

import { useState, useEffect } from 'react';
import { Lock, X, MessageSquare, Shield, Eye, EyeOff } from 'lucide-react';

const PrivacyNotification = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // Simulate fetching confidential notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'counseling',
        title: 'Counseling Session Reminder',
        message: 'Your scheduled session with the counselor is tomorrow at 2:00 PM.',
        timestamp: '2 hours ago',
        isRead: false,
        priority: 'normal'
      },
      {
        id: 2,
        type: 'welfare',
        title: 'Welfare Check-in',
        message: 'A welfare coordinator would like to schedule a check-in with you.',
        timestamp: '1 day ago',
        isRead: false,
        priority: 'low'
      }
    ];

    setNotifications(mockNotifications);
    setHasUnread(mockNotifications.some(n => !n.isRead));
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    
    // Check if there are still unread notifications
    const stillHasUnread = notifications.some(n => n.id !== notificationId && !n.isRead);
    setHasUnread(stillHasUnread);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setHasUnread(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'counseling':
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'welfare':
        return <Shield className="w-5 h-5 text-emerald-600" />;
      default:
        return <Lock className="w-5 h-5 text-slate-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'normal':
        return 'border-amber-300 bg-amber-50';
      case 'low':
        return 'border-blue-300 bg-blue-50';
      default:
        return 'border-slate-300 bg-slate-50';
    }
  };

  if (!user || notifications.length === 0) {
    return null;
  }

  return (
    <>
      {/* Notification Button */}
      <div className="fixed top-20 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
            title="Confidential Notifications"
          >
            <Lock className="w-5 h-5" />
          </button>
          {hasUnread && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-6 pt-24">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-20"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-purple-800">Confidential Messages</h3>
              </div>
              <div className="flex items-center gap-2">
                {hasUnread && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 mb-1">
                    Amanah Privacy Protection
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    These messages are completely confidential and encrypted. 
                    Only you and authorized counselors can access this content.
                  </p>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={`text-sm font-semibold ${
                          !notification.isRead ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {notification.timestamp}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                            >
                              Mark read
                            </button>
                          )}
                          <button className="text-xs text-purple-600 hover:text-purple-700 font-semibold">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <EyeOff className="w-4 h-4" />
                  <span>End-to-end encrypted</span>
                </div>
                <button className="text-xs text-purple-600 hover:text-purple-700 font-semibold">
                  View All Messages
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivacyNotification;