import Link from 'next/link';

export const metadata = {
  title: 'Assessment Tools - Mentor Portal',
};

export default function MentorAssessmentsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800">Assessment Tools</h1>
      <p className="text-slate-600 mt-2">
        Use assignments and guidance submissions to assess participant growth.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/mentor/assignments" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Programs / Assignments</div>
          <div className="text-sm text-slate-600 mt-1">Create and review assigned work</div>
        </Link>
        <Link href="/mentor/submissions" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Review Submissions</div>
          <div className="text-sm text-slate-600 mt-1">Give feedback and track progress</div>
        </Link>
      </div>
    </div>
  );
}
