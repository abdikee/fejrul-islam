'use client';

import { BookOpen, Plus, Calendar, Users } from 'lucide-react';

export default function AssignmentManagement({ user }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-blue-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Management</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Create, manage, and track assignments for your students across different Islamic studies areas.
        </p>
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-700 font-medium">Coming Soon</p>
          <p className="text-blue-600 text-sm mt-1">
            This feature will allow you to create assignments, set due dates, and track student progress.
          </p>
        </div>
      </div>
    </div>
  );
}