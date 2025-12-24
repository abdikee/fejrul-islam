import Link from 'next/link';

export const metadata = {
  title: 'Student Progress - Mentor Portal',
};

export default function MentorProgressPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800">Student Progress</h1>
      <p className="text-slate-600 mt-2">
        Review participant progress across programs and guidance submissions.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/mentor/students" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Participants</div>
          <div className="text-sm text-slate-600 mt-1">View your assigned students</div>
        </Link>
        <Link href="/mentor/submissions" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Guidance Reviews</div>
          <div className="text-sm text-slate-600 mt-1">Review submissions and feedback</div>
        </Link>
        <Link href="/mentor/analytics" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Analytics</div>
          <div className="text-sm text-slate-600 mt-1">See performance trends</div>
        </Link>
      </div>
    </div>
  );
}
