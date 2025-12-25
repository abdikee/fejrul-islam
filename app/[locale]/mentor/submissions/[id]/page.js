import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';
import { FileCheck } from 'lucide-react';

export default function SubmissionReviewPage({ params }) {
  return (
    <MentorPageTemplate
      title={`Submission #${params.id}`}
      description="Review and provide feedback"
      icon={FileCheck}
    >
      <div className="bg-white rounded-2xl p-6 border border-green-200 space-y-4">
        <p className="text-slate-600">
          This submission detail page was missing and has been created so review links work.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm font-medium text-slate-800">Student</p>
            <p className="text-sm text-slate-600">(mock) Student Name</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm font-medium text-slate-800">Assignment</p>
            <p className="text-sm text-slate-600">(mock) Assignment Title</p>
          </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm font-medium text-slate-800 mb-2">Notes</p>
          <p className="text-sm text-slate-600">Replace this with real submission content.</p>
        </div>
      </div>
    </MentorPageTemplate>
  );
}
