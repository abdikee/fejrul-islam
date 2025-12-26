'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';
import { Calendar } from 'lucide-react';

export default function MentorSessionsSchedulePage() {
  const router = useRouter();
  const pathname = usePathname();
  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';
  const mentorBase = `${localePrefix}/mentor`;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [studentId, setStudentId] = useState('');
  const [sessionType, setSessionType] = useState('Counseling');
  const [scheduledDate, setScheduledDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState('');

  const canSubmit = useMemo(
    () => !!studentId && !!sessionType && !!scheduledDate && !submitting,
    [studentId, sessionType, scheduledDate, submitting]
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('/api/mentor/students', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.message || 'Failed to load students');
        setStudents(data.students || []);
      } catch (e) {
        console.error(e);
        setError(e?.message || 'Failed to load students');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      setError('');
      const res = await fetch('/api/mentor/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          sessionType,
          scheduledDate,
          durationMinutes,
          notes: notes.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Failed to schedule session');
      router.push(`${mentorBase}/sessions`);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e?.message || 'Failed to schedule session');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MentorPageTemplate
      title="Schedule Session"
      description="Create a new mentoring session"
      icon={Calendar}
      loading={loading}
    >
      <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 border border-green-200 space-y-4">
        {error ? (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-red-700">{error}</div>
        ) : null}

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">Student</label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a student…</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || s.email || s.id}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">Session Type</label>
            <input
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Counseling"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value || 60))}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              min={15}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Optional"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Scheduling…' : 'Schedule'}
          </button>
          <button
            type="button"
            onClick={() => router.push(`${mentorBase}/sessions`)}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </MentorPageTemplate>
  );
}
