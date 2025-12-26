'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Search, Users, FileText, Settings, 
  Calendar, Eye, Edit, Trash2, Filter
} from 'lucide-react';

function AdminSearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let isCancelled = false;

    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setErrorMessage('');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage('');

        if (filter === 'system') {
          const res = await fetch(`/api/admin/audit-logs?q=${encodeURIComponent(query)}&limit=50&offset=0`, {
            credentials: 'include'
          });
          const data = await res.json();
          if (!data?.success) throw new Error(data?.message || 'Search failed');

          const mapped = (data.logs || []).map((log) => ({
            id: log.id,
            type: 'system',
            title: String(log.action_type || 'system_event'),
            description: String(log.action_description || ''),
            details: log.email ? String(log.email) : (log.ip_address ? `IP: ${log.ip_address}` : ''),
            date: (log.created_at || log.timestamp || new Date().toISOString()),
            status: String(log.action_type || 'logged')
          }));

          if (!isCancelled) setResults(mapped);
          return;
        }

        const res = await fetch(`/api/admin/content/search?q=${encodeURIComponent(query)}&type=all&limit=50`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (!data?.success) throw new Error(data?.message || 'Search failed');

        const items = Array.isArray(data.results) ? data.results : [];
        const mapped = items.map((item) => {
          const type = item.type || item.content_type || 'content';

          if (type === 'user') {
            return {
              id: item.id,
              type: 'user',
              title: item.title || item.full_name || 'User',
              description: item.description || `${item.role || 'user'} - ${item.email || ''}`,
              details: item.email || '',
              date: item.created_at || new Date().toISOString(),
              status: item.role || 'active'
            };
          }

          if (type === 'course') {
            return {
              id: item.id,
              type: 'content',
              title: item.title || 'Course',
              description: item.description || 'Course',
              details: item.sector_name ? `Sector: ${item.sector_name}` : 'Course',
              date: item.created_at || new Date().toISOString(),
              status: 'published'
            };
          }

          if (type === 'resource') {
            return {
              id: item.id,
              type: 'content',
              title: item.title || 'Resource',
              description: item.description || 'Resource',
              details: item.sector_name ? `Sector: ${item.sector_name}` : (item.resource_type ? `Type: ${item.resource_type}` : 'Resource'),
              date: item.created_at || new Date().toISOString(),
              status: 'published'
            };
          }

          if (type === 'announcement') {
            return {
              id: item.id,
              type: 'content',
              title: item.title || 'Announcement',
              description: item.description || 'Announcement',
              details: item.priority ? `Priority: ${item.priority}` : 'Announcement',
              date: item.created_at || new Date().toISOString(),
              status: 'published'
            };
          }

          return {
            id: item.id,
            type: 'content',
            title: item.title || 'Result',
            description: item.description || '',
            details: '',
            date: item.created_at || new Date().toISOString(),
            status: 'published'
          };
        });

        const filtered = mapped.filter((row) => {
          if (filter === 'all') return true;
          if (filter === 'user') return row.type === 'user';
          if (filter === 'content') return row.type === 'content';
          return true;
        });

        if (!isCancelled) setResults(filtered);
      } catch (err) {
        console.error('Admin search error:', err);
        if (!isCancelled) {
          setErrorMessage(err?.message || 'Search failed');
          setResults([]);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchSearchResults();

    return () => {
      isCancelled = true;
    };
  }, [query, filter]);

  const filteredResults = results;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'user':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'content':
        return <FileText className="w-5 h-5 text-green-600" />;
      case 'system':
        return <Settings className="w-5 h-5 text-purple-600" />;
      default:
        return <Search className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'published':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'draft':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <AdminLayout showAnalytics={false} showActivity={false}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Search Results</h1>
          <p className="text-slate-600">
            {loading ? 'Searching...' : `Found ${filteredResults.length} results for "${query}"`}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filter by type:</span>
            {[
              { id: 'all', name: 'All Results' },
              { id: 'user', name: 'Users' },
              { id: 'content', name: 'Content' },
              { id: 'system', name: 'System' }
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                  filter === filterOption.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {filterOption.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg border border-slate-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Searching...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">No results found</h3>
              <p className="text-slate-600">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredResults.map((result) => (
                <div key={result.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-slate-800">{result.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                            {result.status}
                          </span>
                        </div>
                        <p className="text-slate-600 mb-1">{result.description}</p>
                        <p className="text-sm text-slate-500">{result.details}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {result.date}
                          </div>
                          <span className="capitalize">{result.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {result.type !== 'system' && (
                        <>
                          <button className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Dashboard */}
        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/admin/dashboard'}
            className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AdminSearchPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout showAnalytics={false} showActivity={false}>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-800">Search</h1>
            <p className="text-slate-600">Loading...</p>
          </div>
        </AdminLayout>
      }
    >
      <AdminSearchPageInner />
    </Suspense>
  );
}