import Link from 'next/link';

export const metadata = {
  title: 'Settings - Mentor Portal',
};

export default function MentorSettingsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
      <p className="text-slate-600 mt-2">Manage your mentor portal preferences and access support links.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/mentor/contact" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Contact Admin</div>
          <div className="text-sm text-slate-600 mt-1">Request help or report an issue</div>
        </Link>
        <Link href="/mentor/support" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Technical Support</div>
          <div className="text-sm text-slate-600 mt-1">Common support entry point</div>
        </Link>
        <Link href="/mentor/privacy" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Privacy Policy</div>
          <div className="text-sm text-slate-600 mt-1">Confidentiality and data handling</div>
        </Link>
        <Link href="/mentor/terms" className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
          <div className="font-semibold text-slate-800">Mentor Guidelines</div>
          <div className="text-sm text-slate-600 mt-1">Mentor expectations and standards</div>
        </Link>
      </div>

      <div className="mt-6 text-sm text-slate-600">
        For signing out, use the logout button in the header.
      </div>
    </div>
  );
}
