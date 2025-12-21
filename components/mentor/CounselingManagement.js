'use client';

import { Heart, Calendar, Clock, Users } from 'lucide-react';

export default function CounselingManagement({ user }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-purple-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Counseling Management</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Schedule and manage counseling sessions with your students for spiritual and personal guidance.
        </p>
        <div className="mt-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-purple-700 font-medium">Coming Soon</p>
          <p className="text-purple-600 text-sm mt-1">
            This feature will allow you to schedule counseling sessions, manage appointments, and track student wellbeing.
          </p>
        </div>
      </div>
    </div>
  );
}