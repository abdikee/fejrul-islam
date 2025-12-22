'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import SystemSettings from '@/components/admin/SystemSettings';

export default function AdminSettingsPage() {
  return (
    <AdminLayout showAnalytics={false} showActivity={false}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
          <p className="text-slate-600">Configure system preferences and security</p>
        </div>
        <SystemSettings />
      </div>
    </AdminLayout>
  );
}