'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';
import { BookOpen, Calendar, Users } from 'lucide-react';

export default function AssignmentDetailsPage({ params }) {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pathname = usePathname();
  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';
  const mentorBase = `${localePrefix}/mentor`;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`/api/mentor/assignments/${params.id}`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.message || 'Failed to load assignment');
        setAssignment(data.assignment);
      } catch (e) {
        console.error(e);
        setError(e?.message || 'Failed to load assignment');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  return (
    <MentorPageTemplate
      title={assignment?.title ? assignment.title : `Assignment #${params.id}`}
      description="Assignment details"
      icon={BookOpen}
      loading={loading}
    >
      {error ? (
        <div className="bg-white rounded-2xl p-6 border border-red-200 text-red-700">{error}</div>
      ) : null}

      {assignment ? (
        <div className="bg-white rounded-2xl p-6 border border-green-200 space-y-4">
          <div>
            <p className="text-sm text-slate-600">Course</p>
            <p className="text-slate-800 font-medium">{assignment.course}</p>
          </div>

          {assignment.description ? (
            <div>
              <p className="text-sm text-slate-600">Description</p>
              <p className="text-slate-800">{assignment.description}</p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-medium text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Due Date
              </p>
              <p className="text-sm text-slate-600">
                {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : '—'}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-medium text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4" /> Submissions
              </p>
              <p className="text-sm text-slate-600">
                {assignment.submissions}/{assignment.total}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-medium text-slate-800">Priority</p>
              <p className="text-sm text-slate-600">{assignment.priority || '—'}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`${mentorBase}/assignments`}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Back to Assignments
            </Link>
          </div>
        </div>
      ) : null}
    </MentorPageTemplate>
  );
}
