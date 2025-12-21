'use client';

import { FileCheck, Clock, Star, MessageSquare } from 'lucide-react';

export default function SubmissionReview({ user }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <FileCheck className="w-16 h-16 text-green-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Review</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Review and grade student submissions for Idad programs, assignments, and practice sessions.
        </p>
        <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 font-medium">Coming Soon</p>
          <p className="text-green-600 text-sm mt-1">
            This feature will allow you to review student submissions, provide feedback, and assign grades.
          </p>
        </div>
      </div>
    </div>
  );
}