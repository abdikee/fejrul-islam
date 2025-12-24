import Link from 'next/link';

export const metadata = {
  title: 'Feedback - Mentor Portal',
};

export default function MentorFeedbackPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800">Feedback & Reports</h1>
      <p className="text-slate-600 mt-2">
        Share feedback about the portal or report issues to admin.
      </p>

      <div className="mt-6">
        <Link href="/mentor/contact" className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800">
          Send a Message to Admin
        </Link>
      </div>

      <div className="mt-6 text-sm text-slate-600">
        You can also continue the conversation in{' '}
        <Link href="/mentor/messages" className="text-green-700 hover:underline">
          Messages
        </Link>
        .
      </div>
    </div>
  );
}
