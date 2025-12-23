'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import ContentManagement from '@/components/admin/ContentManagement';

export default function AdminContentPage() {
  return (
    <AdminLayout showAnalytics={false} showActivity={true}>
      <div className="p-6">
        <ContentManagement />
      </div>
    </AdminLayout>
  );
}