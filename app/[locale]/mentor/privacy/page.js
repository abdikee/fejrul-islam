export const metadata = {
  title: 'Privacy Policy - Mentor Portal',
};

export default function MentorPrivacyPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800">Privacy Policy</h1>
      <p className="text-slate-600 mt-2">
        Mentor portal activity may include participant information and guidance records.
      </p>
      <div className="mt-6 text-sm text-slate-700 space-y-2">
        <p>Use the portal only for approved mentorship activities.</p>
        <p>Do not share participant details outside authorized channels.</p>
        <p>For privacy questions, contact admin.</p>
      </div>
    </div>
  );
}
