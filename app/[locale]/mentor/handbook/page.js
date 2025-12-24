import Link from 'next/link';

export const metadata = {
  title: 'Mentor Handbook - Mentor Portal',
};

export default function MentorHandbookPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800">Mentor Handbook</h1>
      <p className="text-slate-600 mt-2">
        Quick references for mentoring workflow, communication, and expectations.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/mentor/messages" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Messages</div>
          <div className="text-sm text-slate-600 mt-1">Communicate with participants</div>
        </Link>
        <Link href="/mentor/training" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Training Materials</div>
          <div className="text-sm text-slate-600 mt-1">Review training resources</div>
        </Link>
        <Link href="/mentor/support" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Technical Support</div>
          <div className="text-sm text-slate-600 mt-1">Get help from admin</div>
        </Link>
      </div>

      <div className="mt-6 text-sm text-slate-600">
        Please keep communication respectful and follow portal guidelines.
      </div>
    </div>
  );
}
