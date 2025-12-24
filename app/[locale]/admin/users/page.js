'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import UserManagement from '@/components/admin/UserManagement';

export default function AdminUsersPage() {
  return (
    <AdminLayout showAnalytics={false} showActivity={false}>
      <div className="p-6">
        <UserManagement />
      </div>
    </AdminLayout>
  );
}