'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminPerformanceReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [system, setSystem] = useState(null);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/analytics?metric=system&range=30d');
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to load performance data');
      }
      setSystem(data.analytics?.system || null);
    } catch (e) {
      setError(e?.message || 'Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const perf = system?.performance;
  const storage = system?.storage;
  const security = system?.security;

  return (
    <AdminLayout showAnalytics={false} showActivity={false}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Performance Reports</h1>
              <p className="text-sm text-slate-600">System performance, storage, and security snapshot</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchPerformance}
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
              <p className="font-semibold text-red-700">Couldn’t load performance data</p>
              <p className="text-sm text-slate-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <p className="text-sm font-semibold text-slate-900 mb-4">Performance</p>
              {loading && <p className="text-sm text-slate-500">Loading…</p>}
              {!loading && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-600">Avg response</span><span className="font-semibold text-slate-900">{perf?.avgResponseTime ?? '—'} ms</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Uptime</span><span className="font-semibold text-slate-900">{perf?.uptime ?? '—'}%</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Error rate</span><span className="font-semibold text-slate-900">{typeof perf?.errorRate === 'number' ? `${perf.errorRate.toFixed(2)}%` : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Throughput</span><span className="font-semibold text-slate-900">{perf?.throughput ?? '—'} req/min</span></div>
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <p className="text-sm font-semibold text-slate-900 mb-4">Storage</p>
              {loading && <p className="text-sm text-slate-500">Loading…</p>}
              {!loading && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-600">Used</span><span className="font-semibold text-slate-900">{storage?.totalUsed ?? '—'} MB</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Available</span><span className="font-semibold text-slate-900">{storage?.totalAvailable ?? '—'} MB</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Growth rate</span><span className="font-semibold text-slate-900">{storage?.growthRate ?? '—'}%</span></div>
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <p className="text-sm font-semibold text-slate-900 mb-4">Security</p>
              {loading && <p className="text-sm text-slate-500">Loading…</p>}
              {!loading && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-600">Login attempts</span><span className="font-semibold text-slate-900">{security?.loginAttempts ?? '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Failed logins</span><span className="font-semibold text-slate-900">{security?.failedLogins ?? '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Active sessions</span><span className="font-semibold text-slate-900">{security?.activeSessions ?? '—'}</span></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
