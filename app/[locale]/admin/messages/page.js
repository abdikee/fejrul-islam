'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  MessageSquare, 
  Send, 
  Users, 
  UserCheck, 
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Plus,
  Target
} from 'lucide-react';

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [sectorStats, setSectorStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const [messageForm, setMessageForm] = useState({
    subject: '',
    content: '',
    messageType: 'admin_broadcast',
    priority: 'normal',
    sendToAll: false,
    filterBy: '',
    recipientIds: []
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchMessagingData();
    }
  }, [user]);

  const fetchMessagingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/messages', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.templates);
        setUserStats(data.userStats);
        setSectorStats(data.sectorStats);
      }
    } catch (error) {
      console.error('Error fetching messaging data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setMessageForm(prev => ({
      ...prev,
      subject: template.subject,
      content: template.content,
      messageType: template.template_type === 'announcement' ? 'admin_broadcast' : 'system'
    }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageForm.content.trim()) {
      setStatus({ type: 'error', message: 'Message content is required' });
      return;
    }

    if (!messageForm.sendToAll && messageForm.recipientIds.length === 0) {
      setStatus({ type: 'error', message: 'Please select recipients or choose "Send to All"' });
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(messageForm)
      });

      const result = await response.json();

      if (result.success) {
        setStatus({ 
          type: 'success', 
          message: `Message sent successfully to ${result.recipientCount} recipients` 
        });
        setMessageForm({
          subject: '',
          content: '',
          messageType: 'admin_broadcast',
          priority: 'normal',
          sendToAll: false,
          filterBy: '',
          recipientIds: []
        });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to send message. Please try again.' 
      });
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (field, value) => {
    setMessageForm(prev => ({ ...prev, [field]: value }));
    if (status) setStatus(null);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Messaging</h1>
              <p className="text-slate-600 dark:text-slate-400">Send messages to users and manage communications</p>
            </div>
          </div>

          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Users</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                {userStats.total_users || 0}
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Students</span>
              </div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                {userStats.students || 0}
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Mentors</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                {userStats.mentors || 0}
              </p>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Admins</span>
              </div>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
                {userStats.admins || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Send Message</h2>

              {status && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                  status.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}>
                  {status.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="text-sm">{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="space-y-4">
                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Recipients
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={messageForm.sendToAll}
                        onChange={(e) => handleInputChange('sendToAll', e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Send to all users</span>
                    </label>

                    {messageForm.sendToAll && (
                      <select
                        value={messageForm.filterBy}
                        onChange={(e) => handleInputChange('filterBy', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      >
                        <option value="">All Users</option>
                        <option value="students">Students Only</option>
                        <option value="mentors">Mentors Only</option>
                        {sectorStats.map(sector => (
                          <option key={sector.sector_name} value={`sector:${sector.sector_name}`}>
                            {sector.sector_name} Sector ({sector.enrolled_users} users)
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={messageForm.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Message subject"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* Message Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Message Type
                  </label>
                  <select
                    value={messageForm.messageType}
                    onChange={(e) => handleInputChange('messageType', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="admin_broadcast">Admin Broadcast</option>
                    <option value="system">System Message</option>
                    <option value="support">Support Message</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={messageForm.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="low">Low Priority</option>
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Message Content *
                  </label>
                  <textarea
                    value={messageForm.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Type your message here..."
                    rows={6}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={sending || !messageForm.content.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Templates Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Template className="w-5 h-5" />
                Message Templates
              </h3>

              {loading ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Loading templates...</p>
                </div>
              ) : templates.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">No templates available</p>
              ) : (
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="p-3 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm mb-1">
                        {template.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                        {template.subject}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        template.template_type === 'welcome' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : template.template_type === 'announcement'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : template.template_type === 'reminder'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {template.template_type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sector Statistics */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mt-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Sector Enrollment
              </h3>

              <div className="space-y-2">
                {sectorStats.map((sector) => (
                  <div key={sector.sector_name} className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{sector.sector_name}</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {sector.enrolled_users} users
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}