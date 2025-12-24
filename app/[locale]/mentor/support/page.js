import Link from 'next/link';

export const metadata = {
  title: 'Technical Support - Mentor Portal',
};

export default function MentorSupportPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800">Technical Support</h1>
      <p className="text-slate-600 mt-2">
        For portal issues or account help, contact admin.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/mentor/contact" className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800">
          Contact Admin
        </Link>
        <Link href="/mentor/feedback" className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
          Send Feedback
        </Link>
      </div>
    </div>
  );
}
