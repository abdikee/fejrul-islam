'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Send, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

export default function ContactAdminForm({ onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setStatus({ type: 'error', message: 'Please sign in to send a message' });
      return;
    }

    if (!formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please enter a message' });
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      // Send message to admin
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          recipientRole: 'admin',
          subject: formData.subject || 'Message from Student/Mentor',
          content: formData.message,
          messageType: 'support',
          priority: formData.priority
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus({ 
          type: 'success', 
          message: 'Your message has been sent to the admin team. They will respond as soon as possible.' 
        });
        setFormData({ subject: '', message: '', priority: 'normal' });
        
        // Auto-close after success
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
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
    setFormData(prev => ({ ...prev, [field]: value }));
    if (status) setStatus(null); // Clear status when user starts typing
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Contact Admin</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Send a message to the admin team</p>
        </div>
      </div>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Subject (Optional)
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder="Brief description of your message"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Message *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Type your message here..."
            rows={4}
            required
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          >
            <option value="low">Low Priority</option>
            <option value="normal">Normal Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={sending || !formData.message.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Message
              </>
            )}
          </button>
          
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {user && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sending as: {user.firstName} {user.lastName} ({user.email})
          </p>
        </div>
      )}
    </div>
  );
}