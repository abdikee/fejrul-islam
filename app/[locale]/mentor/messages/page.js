'use client';

import { useEffect, useState } from 'react';

function displayName(first, last, fallback = 'User') {
  const name = `${first || ''} ${last || ''}`.trim();
  return name || fallback;
}

export default function MentorMessagesPage() {
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const [newRecipientRole, setNewRecipientRole] = useState('student');
  const [newRecipientId, setNewRecipientId] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);

  const loadThreads = async () => {
    const res = await fetch('/api/messages');
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to load conversations');
    setThreads(data.threads || []);
  };

  const loadThread = async (threadId) => {
    const res = await fetch(`/api/messages?threadId=${encodeURIComponent(threadId)}`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to load thread');
    setActiveThread(data.thread);
    setMessages(data.messages || []);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        await loadThreads();
      } catch (e) {
        setError(e.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!activeThreadId) {
      setActiveThread(null);
      setMessages([]);
      return;
    }

    const run = async () => {
      try {
        setError(null);
        await loadThread(activeThreadId);
      } catch (e) {
        setError(e.message || 'Failed to load thread');
      }
    };

    run();
  }, [activeThreadId]);

  const handleReply = async () => {
    try {
      if (!activeThreadId) return;
      setSending(true);
      setError(null);

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId: activeThreadId, message: reply }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to send reply');

      setReply('');
      await loadThread(activeThreadId);
      await loadThreads();
    } catch (e) {
      setError(e.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleCreateThread = async () => {
    try {
      setCreateStatus(null);
      if (!newMessage.trim()) {
        setCreateStatus({ type: 'error', text: 'Message is required.' });
        return;
      }

      const payload = {
        recipientRole: newRecipientRole,
        subject: newSubject.trim() || null,
        message: newMessage.trim(),
      };

      if (newRecipientRole === 'student') {
        const recipientIdNum = Number(newRecipientId);
        if (!recipientIdNum || Number.isNaN(recipientIdNum)) {
          setCreateStatus({ type: 'error', text: 'Student ID is required.' });
          return;
        }
        payload.recipientId = recipientIdNum;
      }

      setCreating(true);
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to send message');

      setNewSubject('');
      setNewMessage('');
      setCreateStatus({ type: 'success', text: 'Message sent.' });

      await loadThreads();
      if (data.thread?.id) setActiveThreadId(String(data.thread.id));
    } catch (e) {
      setCreateStatus({ type: 'error', text: e.message || 'Failed to send message' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="font-semibold text-slate-800">Start new conversation</div>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Recipient</label>
              <select
                value={newRecipientRole}
                onChange={(e) => setNewRecipientRole(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              >
                <option value="student">Student (by ID)</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {newRecipientRole === 'student' && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Student ID</label>
                <input
                  value={newRecipientId}
                  onChange={(e) => setNewRecipientId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g., 4"
                  inputMode="numeric"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Subject (optional)</label>
              <input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                placeholder="Subject"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Message</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm min-h-[90px]"
                placeholder="Write your message..."
              />
            </div>
            {createStatus && (
              <div
                className={`rounded-lg p-3 text-sm border ${
                  createStatus.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {createStatus.text}
              </div>
            )}
            <button
              onClick={handleCreateThread}
              disabled={creating || !newMessage.trim()}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
            >
              {creating ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Conversations</h2>
          <button
            onClick={async () => {
              try {
                setError(null);
                await loadThreads();
              } catch (e) {
                setError(e.message || 'Failed to refresh');
              }
            }}
            className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-4 text-sm text-slate-600">Loading...</div>
          ) : threads.length === 0 ? (
            <div className="p-4 text-sm text-slate-600">No conversations yet.</div>
          ) : (
            threads.map((t) => {
              const id = String(t.id);
              const isActive = id === String(activeThreadId);
              const studentName = displayName(t.student_first_name, t.student_last_name, 'Student');
              const adminName = displayName(t.admin_first_name, t.admin_last_name, 'Admin');
              const counterpart = t.student_id ? studentName : adminName;
              return (
                <button
                  key={id}
                  onClick={() => setActiveThreadId(id)}
                  className={`w-full text-left p-4 hover:bg-slate-50 ${isActive ? 'bg-slate-50' : ''}`}
                >
                  <div className="text-sm font-medium text-slate-800 truncate">
                    {t.subject || `Conversation: ${counterpart}`}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{t.last_message || '—'}</div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Messages</h2>
          <p className="text-xs text-slate-500 mt-1">
            {activeThread ? (activeThread.subject || `Thread #${activeThread.id}`) : 'Select a conversation to view messages.'}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm">{error}</div>
        )}

        <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto">
          {activeThreadId && messages.length === 0 ? (
            <p className="text-sm text-slate-600">No messages yet.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="border border-slate-200 rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">
                  {displayName(m.sender_first_name, m.sender_last_name, 'Sender')} • {m.created_at ? new Date(m.created_at).toLocaleString() : ''}
                </div>
                <div className="text-sm text-slate-800 whitespace-pre-wrap">{m.body}</div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex gap-3">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2"
              placeholder={activeThreadId ? 'Write a reply...' : 'Select a conversation first'}
              disabled={!activeThreadId}
            />
            <button
              onClick={handleReply}
              disabled={!activeThreadId || sending || !reply.trim()}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Reply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
