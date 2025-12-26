'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';
import { FileCheck, Download } from 'lucide-react';

export default function SubmissionReviewPage({ params }) {
  const router = useRouter();
  const pathname = usePathname();
  const supportedLocales = ['en', 'ar', 'om', 'am'];
  const maybeLocale = pathname?.split('/')?.[1];
  const localePrefix = supportedLocales.includes(maybeLocale) ? `/${maybeLocale}` : '';
  const mentorBase = `${localePrefix}/mentor`;

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [reviewStatus, setReviewStatus] = useState('reviewed');
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  const canSave = useMemo(() => !saving && reviewStatus, [saving, reviewStatus]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`/api/mentor/submissions/${params.id}`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.message || 'Failed to load submission');

        const s = data.submission;
        setSubmission(s);
        setReviewStatus(s.review_status || 'pending');
        setScore(s.score ?? '');
        setFeedback(s.feedback ?? '');
      } catch (e) {
        console.error(e);
        setError(e?.message || 'Failed to load submission');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  const onSave = async (e) => {
    e.preventDefault();
    if (!canSave) return;

    try {
      setSaving(true);
      setError('');

      const scoreValue = score === '' ? null : Number(score);
      if (score !== '' && Number.isNaN(scoreValue)) {
        throw new Error('Score must be a number');
      }

      const res = await fetch(`/api/mentor/submissions/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewStatus,
          score: scoreValue,
          feedback: feedback?.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Failed to update submission');

      router.push(`${mentorBase}/submissions`);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e?.message || 'Failed to update submission');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MentorPageTemplate
      title={submission?.assignment_title ? submission.assignment_title : `Submission #${params.id}`}
      description="Review and provide feedback"
      icon={FileCheck}
      loading={loading}
    >
      {error ? (
        <div className="bg-white rounded-2xl p-6 border border-red-200 text-red-700 mb-6">{error}</div>
      ) : null}

      {submission ? (
        <div className="bg-white rounded-2xl p-6 border border-green-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-medium text-slate-800">Student</p>
              <p className="text-sm text-slate-600">{submission.student_name}</p>
              {submission.student_email ? (
                <p className="text-xs text-slate-500">{submission.student_email}</p>
              ) : null}
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-medium text-slate-800">Assignment</p>
              <p className="text-sm text-slate-600">{submission.assignment_title}</p>
            </div>
          </div>

          {submission.description ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-medium text-slate-800 mb-2">Submission Notes</p>
              <p className="text-sm text-slate-600">{submission.description}</p>
            </div>
          ) : null}

          {submission.file_path ? (
            <a
              href={submission.file_path}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Download file
            </a>
          ) : null}

          <form onSubmit={onSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">Status</label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="graded">Graded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">Score</label>
                <input
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  type="number"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Write feedback for the student"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!canSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Review'}
              </button>
              <Link
                href={`${mentorBase}/submissions`}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      ) : null}
    </MentorPageTemplate>
  );
}
