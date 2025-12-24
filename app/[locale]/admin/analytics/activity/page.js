'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Activity, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminUserActivityPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/activity?limit=50');
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to load activity');
      }
      setActivities(Array.isArray(data.activities) ? data.activities : []);
      setSystemHealth(data.systemHealth || null);
    } catch (e) {
      setError(e?.message || 'Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return (
    <AdminLayout showAnalytics={false} showActivity={false}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">User Activity</h1>
              <p className="text-sm text-slate-600">Recent platform activity and system health</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchActivity}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {systemHealth && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500">Database</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{systemHealth.database || 'unknown'}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500">Active Sessions</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{systemHealth.activeSessions ?? 0}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500">Errors</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{systemHealth.errorCount ?? 0}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500">Uptime</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{systemHealth.uptime || '—'}</p>
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <p className="font-semibold text-slate-900">Recent Events</p>
            {loading && <p className="text-sm text-slate-500">Loading…</p>}
          </div>

          {error && (
            <div className="p-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700">Couldn’t load activity</p>
                <p className="text-sm text-slate-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {!error && !loading && activities.length === 0 && (
            <div className="p-6">
              <p className="text-sm text-slate-600">No recent activity found.</p>
            </div>
          )}

          {!error && activities.length > 0 && (
            <div className="divide-y divide-slate-100">
              {activities.map((a, idx) => (
                <div key={a.id ?? `${a.type}-${a.timestamp}-${idx}`} className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">{a.description}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{a.type}</span>
                    {a.metadata && <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{String(a.metadata)}</span>}
                    {a.timestamp && <span>{new Date(a.timestamp).toLocaleString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
