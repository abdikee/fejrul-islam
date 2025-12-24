import Link from 'next/link';

export const metadata = {
  title: 'Training Materials - Mentor Portal',
};

export default function MentorTrainingPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800">Training Materials</h1>
      <p className="text-slate-600 mt-2">
        Reference training content to support consistent mentoring.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/mentor/resources" className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
          Teaching Resources
        </Link>
        <Link href="/mentor/best-practices" className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
          Best Practices
        </Link>
        <Link href="/mentor/handbook" className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
          Mentor Handbook
        </Link>
      </div>

      <div className="mt-6 text-sm text-slate-600">
        Need help accessing materials? Use{' '}
        <Link href="/mentor/support" className="text-green-700 hover:underline">
          Technical Support
        </Link>
        .
      </div>
    </div>
  );
}
