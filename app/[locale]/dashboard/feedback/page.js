'use client';

import { useEffect, useMemo, useState } from 'react';
import DashboardPageLayout from '@/components/dashboard/DashboardPageLayout';

function displayName(first, last, fallback = 'User') {
  const name = `${first || ''} ${last || ''}`.trim();
  return name || fallback;
}

export default function DashboardFeedbackPage() {
  const [me, setMe] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);

  const [subject, setSubject] = useState('');
  const [recipientRole, setRecipientRole] = useState('mentor');
  const [newMessage, setNewMessage] = useState('');
  const [reply, setReply] = useState('');

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const canMessageMentor = useMemo(() => Boolean(mentor?.id), [mentor]);

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

        // Uses dashboard/user because it includes mentor mapping.
        const userRes = await fetch('/api/dashboard/user');
        const userData = await userRes.json();
        if (!userRes.ok || !userData.success) {
          window.location.href = '/auth/login';
          return;
        }

        setMe(userData.user);
        setMentor(userData.user?.mentor || null);

        await loadThreads();
      } catch (e) {
        setError(e.message || 'Failed to load support messages');
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
        setError(e.message || 'Failed to load messages');
      }
    };

    run();
  }, [activeThreadId]);

  const handleStartConversation = async () => {
    try {
      setSending(true);
      setError(null);

      const payload = {
        recipientRole,
        subject: subject || undefined,
        message: newMessage,
      };

      if (recipientRole === 'mentor') {
        if (!mentor?.id) throw new Error('No mentor assigned yet');
        payload.recipientId = mentor.id;
      }

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to send message');

      setSubject('');
      setNewMessage('');

      await loadThreads();
      if (data.thread?.id) setActiveThreadId(String(data.thread.id));
    } catch (e) {
      setError(e.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

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

  return (
    <DashboardPageLayout
      title="Support & Messages"
      subtitle="Message your mentor or admin"
      showBackButton={true}
    >
      <div className="container mx-auto px-4 lg:px-6 py-6">
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-slate-600">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
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
                <p className="text-xs text-slate-500 mt-1">
                  Logged in as {displayName(me?.firstName, me?.lastName, me?.email)}
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {threads.length === 0 ? (
                  <div className="p-4 text-sm text-slate-600">No conversations yet.</div>
                ) : (
                  threads.map((t) => {
                    const id = String(t.id);
                    const isActive = id === String(activeThreadId);

                    const studentName = displayName(t.student_first_name, t.student_last_name, 'Student');
                    const mentorName = displayName(t.mentor_first_name, t.mentor_last_name, 'Mentor');
                    const adminName = displayName(t.admin_first_name, t.admin_last_name, 'Admin');

                    // For a student view: show who they’re talking to
                    let partnerLabel = 'Conversation';
                    if (t.mentor_id) partnerLabel = `Mentor: ${mentorName}`;
                    if (t.admin_id && !t.mentor_id) partnerLabel = `Admin: ${adminName}`;
                    if (me?.role !== 'student') partnerLabel = `Student: ${studentName}`;

                    return (
                      <button
                        key={id}
                        onClick={() => setActiveThreadId(id)}
                        className={`w-full text-left p-4 hover:bg-slate-50 ${isActive ? 'bg-slate-50' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-800 truncate">
                              {t.subject || partnerLabel}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {t.last_message || '—'}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-400 whitespace-nowrap">
                            {t.last_message_at ? new Date(t.last_message_at).toLocaleDateString() : ''}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Thread / Composer */}
            <div className="lg:col-span-2 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                  {error}
                </div>
              )}

              {/* New message */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <h2 className="font-semibold text-slate-800">Start a new message</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Recipient</label>
                    <select
                      value={recipientRole}
                      onChange={(e) => setRecipientRole(e.target.value)}
                      className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2"
                    >
                      <option value="mentor" disabled={!canMessageMentor}>My Mentor</option>
                      <option value="admin">Admin</option>
                    </select>
                    {!canMessageMentor && (
                      <p className="mt-1 text-xs text-slate-500">No mentor assigned yet.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Subject (optional)</label>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2"
                      placeholder="e.g. Need guidance on courses"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 min-h-[120px]"
                    placeholder="Write your message..."
                  />
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <button
                    onClick={handleStartConversation}
                    disabled={sending || !newMessage.trim() || (recipientRole === 'mentor' && !canMessageMentor)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>

              {/* Thread view */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                  <h2 className="font-semibold text-slate-800">Conversation</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeThread ? (activeThread.subject || `Thread #${activeThread.id}`) : 'Select a conversation to view messages.'}
                  </p>
                </div>

                <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
                  {activeThreadId && messages.length === 0 ? (
                    <p className="text-sm text-slate-600">No messages yet.</p>
                  ) : (
                    messages.map((m) => {
                      const isMine = String(m.sender_id) === String(me?.id);
                      const senderLabel = isMine
                        ? 'You'
                        : displayName(m.sender_first_name, m.sender_last_name, 'Sender');

                      return (
                        <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-xl px-3 py-2 border ${isMine ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="text-xs text-slate-500 mb-1">
                              {senderLabel} • {m.created_at ? new Date(m.created_at).toLocaleString() : ''}
                            </div>
                            <div className="text-sm text-slate-800 whitespace-pre-wrap">{m.body}</div>
                          </div>
                        </div>
                      );
                    })
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
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
}
