'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout showAnalytics={true} showActivity={true}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Analytics & Reports</h1>
          <p className="text-slate-600">System performance and user engagement metrics</p>
        </div>
        <AnalyticsDashboard />
      </div>
    </AdminLayout>
  );
}