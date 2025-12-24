'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import SystemSettings from '@/components/admin/SystemSettings';

export default function AdminSettingsPage() {
  return (
    <AdminLayout showAnalytics={false} showActivity={false}>
      <div className="p-6">
        <SystemSettings />
      </div>
    </AdminLayout>
  );
}