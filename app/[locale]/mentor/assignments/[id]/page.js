import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';
import { BookOpen } from 'lucide-react';

export default function AssignmentDetailsPage({ params }) {
  return (
    <MentorPageTemplate
      title={`Assignment #${params.id}`}
      description="Assignment details"
      icon={BookOpen}
    >
      <div className="bg-white rounded-2xl p-6 border border-green-200">
        <p className="text-slate-600">
          This assignment details page was missing and has been created so links work.
        </p>
      </div>
    </MentorPageTemplate>
  );
}
