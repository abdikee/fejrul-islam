import Link from 'next/link';

export const metadata = {
  title: 'Teaching Resources - Mentor Portal',
};

export default function MentorResourcesPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800">Teaching Resources</h1>
      <p className="text-slate-600 mt-2">
        Reference materials and links to help you guide participants.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/mentor/curriculum" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Curriculum Guide</div>
          <div className="text-sm text-slate-600 mt-1">Program structure and topics</div>
        </Link>
        <Link href="/mentor/assessments" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Assessment Tools</div>
          <div className="text-sm text-slate-600 mt-1">Rubrics and evaluation helpers</div>
        </Link>
        <Link href="/mentor/best-practices" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Best Practices</div>
          <div className="text-sm text-slate-600 mt-1">Mentoring tips and guidance</div>
        </Link>
      </div>

      <div className="mt-6 text-sm text-slate-600">
        Looking for sector-specific content? Visit{' '}
        <Link href="/mentor/sectors" className="text-green-700 hover:underline">
          Sectors
        </Link>
        .
      </div>
    </div>
  );
}
