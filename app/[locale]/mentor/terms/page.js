import Link from 'next/link';

export const metadata = {
  title: 'Mentor Guidelines - Mentor Portal',
};

export default function MentorTermsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800">Mentor Guidelines</h1>
      <p className="text-slate-600 mt-2">
        Please follow respectful communication and mentorship standards.
      </p>

      <div className="mt-6 text-sm text-slate-700 space-y-2">
        <p>Communicate professionally and with adab.</p>
        <p>Keep participant information confidential.</p>
        <p>Escalate concerns through admin channels when needed.</p>
      </div>

      <div className="mt-6">
        <Link href="/mentor/contact" className="text-green-700 hover:underline">
          Contact Admin
        </Link>
      </div>
    </div>
  );
}
