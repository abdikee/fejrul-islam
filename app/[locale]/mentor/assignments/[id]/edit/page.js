import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';
import { BookOpen } from 'lucide-react';

export default function EditAssignmentPage({ params }) {
  return (
    <MentorPageTemplate
      title={`Edit Assignment #${params.id}`}
      description="Update assignment information"
      icon={BookOpen}
    >
      <div className="bg-white rounded-2xl p-6 border border-green-200">
        <p className="text-slate-600">
          This edit page was missing and has been created so the Edit link works.
        </p>
      </div>
    </MentorPageTemplate>
  );
}
