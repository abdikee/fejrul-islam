import Link from 'next/link';

export const metadata = {
  title: 'Attendance Tracking - Mentor Portal',
};

export default function MentorAttendancePage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800">Attendance Tracking</h1>
      <p className="text-slate-600 mt-2">
        Track session attendance and participation.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/mentor/sessions" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Sessions</div>
          <div className="text-sm text-slate-600 mt-1">Manage and review sessions</div>
        </Link>
        <Link href="/mentor/students" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Participants</div>
          <div className="text-sm text-slate-600 mt-1">View participant profiles</div>
        </Link>
      </div>
    </div>
  );
}
