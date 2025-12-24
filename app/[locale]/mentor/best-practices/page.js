import Link from 'next/link';

export const metadata = {
  title: 'Best Practices - Mentor Portal',
};

export default function MentorBestPracticesPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800">Best Practices</h1>
      <p className="text-slate-600 mt-2">
        Simple mentoring guidelines to keep sessions effective and consistent.
      </p>

      <div className="mt-6 space-y-3 text-sm text-slate-700">
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="font-semibold text-slate-800">Keep a steady rhythm</div>
          <div className="mt-1 text-slate-600">Schedule sessions regularly and follow up on agreed action items.</div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="font-semibold text-slate-800">Give clear feedback</div>
          <div className="mt-1 text-slate-600">Use guidance submissions to give actionable, respectful feedback.</div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="font-semibold text-slate-800">Escalate concerns</div>
          <div className="mt-1 text-slate-600">
            If something needs admin attention, use{' '}
            <Link href="/mentor/contact" className="text-green-700 hover:underline">
              Contact Admin
            </Link>
            .
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/mentor/handbook" className="text-green-700 hover:underline">
          Open Mentor Handbook
        </Link>
      </div>
    </div>
  );
}
