'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import ContentManagement from '@/components/admin/ContentManagement';

export default function AdminContentPage() {
  return (
    <AdminLayout showAnalytics={false} showActivity={true}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Content Management</h1>
          <p className="text-slate-600">Manage courses, announcements, and resources</p>
        </div>
        <ContentManagement />
      </div>
    </AdminLayout>
  );
}