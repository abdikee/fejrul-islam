import Link from 'next/link';

export const metadata = {
  title: 'Curriculum Guide - Mentor Portal',
};

export default function MentorCurriculumPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800">Curriculum Guide</h1>
      <p className="text-slate-600 mt-2">
        Browse sector content and align sessions with current learning goals.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/mentor/sectors" className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800">
          Browse Sectors
        </Link>
        <Link href="/mentor/resources" className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
          Back to Resources
        </Link>
      </div>
    </div>
  );
}
