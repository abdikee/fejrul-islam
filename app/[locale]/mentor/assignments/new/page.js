'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';
import { BookOpen } from 'lucide-react';

export default function MentorAssignmentsNewPage() {
  const router = useRouter();
  const pathname = usePathname();
  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';
  const mentorBase = `${localePrefix}/mentor`;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignmentType, setAssignmentType] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignAll, setAssignAll] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => title.trim().length > 0 && !submitting, [title, submitting]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setError('');

      const res = await fetch('/api/mentor/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          assignmentType: assignmentType.trim() || null,
          dueDate: dueDate || null,
          priority,
          assignAll,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to create assignment');
      }

      router.push(`${mentorBase}/assignments`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MentorPageTemplate
      title="New Assignment"
      description="Create an assignment for your students"
      icon={BookOpen}
    >
      <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 border border-green-200 space-y-4">
        {error ? (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-red-700">{error}</div>
        ) : null}

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Assignment title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="What should students submit?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">Type</label>
            <input
              value={assignmentType}
              onChange={(e) => setAssignmentType(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g. essay"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="assignAll"
            type="checkbox"
            checked={assignAll}
            onChange={(e) => setAssignAll(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="assignAll" className="text-sm text-slate-700">
            Assign to all my current students
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Creating…' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => router.push(`${mentorBase}/assignments`)}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </MentorPageTemplate>
  );
}
