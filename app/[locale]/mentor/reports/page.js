import Link from 'next/link';

export const metadata = {
  title: 'Reports & Insights - Mentor Portal',
};

export default function MentorReportsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800">Reports & Insights</h1>
      <p className="text-slate-600 mt-2">
        View summaries and insights for your mentorship activities.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/mentor/analytics" className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800">
          Open Analytics
        </Link>
        <Link href="/mentor/attendance" className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
          Attendance Tracking
        </Link>
      </div>

      <div className="mt-6 text-sm text-slate-600">
        If you need an export or an official report for admin, use{' '}
        <Link href="/mentor/contact" className="text-green-700 hover:underline">
          Contact Admin
        </Link>
        .
      </div>
    </div>
  );
}
