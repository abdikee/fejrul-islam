'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  MessageSquare, 
  Send, 
  Inbox, 
  Mail, 
  MailOpen, 
  Search, 
  Filter,
  Plus,
  ArrowLeft,
  Clock,
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import ContactAdminForm from '@/components/messaging/ContactAdminForm';

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, sent, received, unread
  const [searchTerm, setSearchTerm] = useState('');
  const [showContactAdmin, setShowContactAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user, filter]);

  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchMessages();
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [user, filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/messages?type=${filter}&limit=50`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isRead: true })
      });

      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      message.subject?.toLowerCase().includes(searchLower) ||
      message.content?.toLowerCase().includes(searchLower) ||
      message.sender_first_name?.toLowerCase().includes(searchLower) ||
      message.sender_last_name?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'admin_broadcast':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'system':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'support':
        return <MessageSquare className="w-4 h-4 text-orange-500" />;
      default:
        return <Mail className="w-4 h-4 text-slate-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-slate-600 bg-slate-50 border-slate-200';
      default:
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Please sign in to view messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Messages</h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    {unreadCount > 0 ? `${unreadCount} unread messages` : 'All messages read'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowContactAdmin(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Contact Admin
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'All', icon: MessageSquare },
                  { key: 'received', label: 'Inbox', icon: Inbox },
                  { key: 'sent', label: 'Sent', icon: Send },
                  { key: 'unread', label: 'Unread', icon: Mail }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                      filter === key
                        ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {key === 'unread' && unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-400">Loading messages...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    {searchTerm ? 'No messages found matching your search' : 'No messages yet'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.is_read && message.recipient_id === user.id) {
                          markAsRead(message.id);
                        }
                      }}
                      className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors ${
                        !message.is_read && message.recipient_id === user.id
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {getMessageTypeIcon(message.message_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                {message.sender_id === user.id 
                                  ? `To: ${message.recipient_first_name} ${message.recipient_last_name}`
                                  : `From: ${message.sender_first_name} ${message.sender_last_name}`
                                }
                              </p>
                              {message.priority && message.priority !== 'normal' && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(message.priority)}`}>
                                  {message.priority}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <Clock className="w-3 h-3" />
                              {formatDate(message.created_at || message.sent_at)}
                            </div>
                          </div>
                          <p className="font-medium text-slate-800 dark:text-slate-200 mb-1 truncate">
                            {message.subject || 'No Subject'}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {message.content}
                          </p>
                        </div>
                        {!message.is_read && message.recipient_id === user.id && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 sticky top-6">
              {selectedMessage ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Message Details</h3>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">From</label>
                      <p className="text-slate-900 dark:text-slate-100">
                        {selectedMessage.sender_first_name} {selectedMessage.sender_last_name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {selectedMessage.sender_email}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">To</label>
                      <p className="text-slate-900 dark:text-slate-100">
                        {selectedMessage.recipient_first_name} {selectedMessage.recipient_last_name}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                      <p className="text-slate-900 dark:text-slate-100">
                        {selectedMessage.subject || 'No Subject'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                      <p className="text-slate-900 dark:text-slate-100">
                        {new Date(selectedMessage.created_at || selectedMessage.sent_at).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                      <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                          {selectedMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Select a message to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Admin Modal */}
      {showContactAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <ContactAdminForm onClose={() => setShowContactAdmin(false)} />
        </div>
      )}
    </div>
  );
}