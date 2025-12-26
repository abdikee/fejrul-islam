'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, User, Mail, TrendingUp } from 'lucide-react';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';

export default function MentorStudentDetailsPage() {
  const params = useParams();
  const studentId = useMemo(() => String(params?.id || ''), [params]);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/mentor/students', { credentials: 'include' });
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Failed to fetch students');

        const found = (data.students || []).find((s) => String(s.id) === studentId);
        if (!found) throw new Error('Student not found or not assigned to you');

        setStudent(found);
      } catch (e) {
        console.error('Mentor student details error:', e);
        setError(e?.message || 'Failed to load student');
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) load();
  }, [studentId]);

  return (
    <MentorPageTemplate
      title="Student Details"
      description="View assigned student information"
      icon={User}
      loading={loading}
      error={error}
      actions={
        <Link
          href="/mentor/students"
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      }
    >
      {student && (
        <div className="bg-white rounded-2xl p-6 border border-green-200">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                {student.name}
              </h2>
              <p className="text-slate-600 mt-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {student.email}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">Overall Progress</div>
              <div className="text-2xl font-bold text-green-600 flex items-center justify-end gap-2">
                <TrendingUp className="w-5 h-5" />
                {student.progress}%
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm text-slate-600">Active Courses</div>
              <div className="text-lg font-bold text-slate-800 flex items-center gap-2 mt-1">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                {student.courses}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm text-slate-600">Status</div>
              <div className="text-lg font-bold text-slate-800 mt-1">
                {student.status}
              </div>
            </div>
          </div>

          {student.notes ? (
            <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-700">Mentor Notes</div>
              <div className="text-sm text-slate-600 mt-2">{student.notes}</div>
            </div>
          ) : null}
        </div>
      )}
    </MentorPageTemplate>
  );
}
