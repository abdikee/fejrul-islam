'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout showAnalytics={true} showActivity={true}>
      <div className="p-6">
        <AnalyticsDashboard />
      </div>
    </AdminLayout>
  );
}