'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Activity, Filter, RefreshCw, Download, Eye } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchLogs();
    
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, filterType]);

  const fetchLogs = async () => {
    try {
      const url = filterType === 'all' 
        ? '/api/admin/audit-logs?limit=100'
        : `/api/admin/audit-logs?limit=100&actionType=${filterType}`;
      
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (actionType) => {
    const colors = {
      'IMPERSONATE_START': 'bg-purple-100 text-purple-700',
      'IMPERSONATE_END': 'bg-purple-100 text-purple-700',
      'CONTENT_CREATE': 'bg-green-100 text-green-700',
      'CONTENT_UPDATE': 'bg-blue-100 text-blue-700',
      'CONTENT_DELETE': 'bg-red-100 text-red-700',
      'USER_LOGIN': 'bg-emerald-100 text-emerald-700',
      'USER_LOGOUT': 'bg-slate-100 text-slate-700',
      'USER_CREATE': 'bg-green-100 text-green-700',
      'USER_UPDATE': 'bg-blue-100 text-blue-700',
      'USER_DELETE': 'bg-red-100 text-red-700'
    };
    return colors[actionType] || 'bg-slate-100 text-slate-700';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading audit logs...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Audit Logs</h1>
                <p className="text-blue-100">Real-time system activity monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`}></div>
              <span className="text-sm">{autoRefresh ? 'Live' : 'Paused'}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Actions</option>
              <option value="IMPERSONATE_START">Impersonation</option>
              <option value="CONTENT_CREATE">Content Created</option>
              <option value="CONTENT_UPDATE">Content Updated</option>
              <option value="CONTENT_DELETE">Content Deleted</option>
              <option value="USER_CREATE">User Created</option>
              <option value="USER_UPDATE">User Updated</option>
            </select>

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                autoRefresh
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
            </button>

            <button
              onClick={fetchLogs}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Now
            </button>

            <button
              onClick={() => alert('Export feature coming soon!')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Logs List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-slate-800">
                          {log.first_name} {log.last_name}
                        </div>
                        <div className="text-slate-500">{log.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action_type)}`}>
                        {log.action_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {log.action_description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {log.ip_address || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {logs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No audit logs found</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Total Logs</div>
            <div className="text-2xl font-bold text-slate-800">{logs.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Today</div>
            <div className="text-2xl font-bold text-slate-800">
              {logs.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Unique Users</div>
            <div className="text-2xl font-bold text-slate-800">
              {new Set(logs.map(l => l.user_id)).size}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Action Types</div>
            <div className="text-2xl font-bold text-slate-800">
              {new Set(logs.map(l => l.action_type)).size}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
