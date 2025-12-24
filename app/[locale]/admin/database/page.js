'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Database, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminDatabasePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);

  const fetchDbStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/activity?limit=1');
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to load database status');
      }
      setSystemHealth(data.systemHealth || null);
    } catch (e) {
      setError(e?.message || 'Failed to load database status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbStatus();
  }, []);

  return (
    <AdminLayout showAnalytics={false} showActivity={false}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Database className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Database</h1>
              <p className="text-sm text-slate-600">Connection status and basic health indicators</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchDbStatus}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700">Couldn’t load database status</p>
              <p className="text-sm text-slate-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {!error && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            {loading && <p className="text-sm text-slate-500">Loading…</p>}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500">Status</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{systemHealth?.database || 'unknown'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500">Active Sessions</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{systemHealth?.activeSessions ?? 0}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500">Last Backup</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {systemHealth?.lastBackup ? new Date(systemHealth.lastBackup).toLocaleString() : '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500">Uptime</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{systemHealth?.uptime || '—'}</p>
                </div>
              </div>
            )}

            <div className="mt-6 text-sm text-slate-600">
              Database management tools can be added here (backups, maintenance tasks, migrations) when required.
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
