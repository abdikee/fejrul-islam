'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import UserManagement from '@/components/admin/UserManagement';

export default function AdminUsersPage() {
  return (
    <AdminLayout showAnalytics={false} showActivity={true}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-600">Manage students, mentors, and administrators</p>
        </div>
        <UserManagement />
      </div>
    </AdminLayout>
  );
}