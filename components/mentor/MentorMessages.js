'use client';

import { MessageSquare, Send, Search, Filter } from 'lucide-react';

export default function MentorMessages({ user }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <MessageSquare className="w-16 h-16 text-orange-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Messages</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Communicate with your students through secure messaging for guidance and support.
        </p>
        <div className="mt-8 p-6 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-orange-700 font-medium">Coming Soon</p>
          <p className="text-orange-600 text-sm mt-1">
            This feature will provide a secure messaging system for mentor-student communication.
          </p>
        </div>
      </div>
    </div>
  );
}