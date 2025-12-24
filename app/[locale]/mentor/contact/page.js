'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MentorContactAdminPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const send = async () => {
    try {
      setStatus(null);
      if (!message.trim()) {
        setStatus({ type: 'error', text: 'Message is required.' });
        return;
      }

      setSending(true);
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientRole: 'admin',
          subject: subject.trim() || null,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to send message');

      setSubject('');
      setMessage('');
      setStatus({ type: 'success', text: 'Message sent to admin.' });
    } catch (e) {
      setStatus({ type: 'error', text: e.message || 'Failed to send message' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800">Contact Admin</h1>
      <p className="text-slate-600 mt-2">
        Send a message to the admin team. You can continue the conversation in{' '}
        <Link href="/mentor/messages" className="text-green-700 hover:underline">
          Messages
        </Link>
        .
      </p>

      {status && (
        <div
          className={`mt-4 rounded-xl p-4 text-sm border ${
            status.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject (optional)</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2"
            placeholder="e.g., Portal issue, student concern, request"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 min-h-[140px]"
            placeholder="Write your message..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={send}
            disabled={sending || !message.trim()}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send to Admin'}
          </button>
          <Link
            href="/mentor/messages"
            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Open Messages
          </Link>
        </div>
      </div>
    </div>
  );
}
