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
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate search results
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          type: 'user',
          title: 'Ahmad Ibrahim',
          description: 'Student - Advanced Level',
          details: 'ahmad.ibrahim@example.com',
          date: '2024-01-15',
          status: 'active'
        },
        {
          id: 2,
          type: 'content',
          title: 'Islamic Finance Basics',
          description: 'Course - Tarbiya & Idad Sector',
          details: 'Published course with 150 enrolled students',
          date: '2024-01-10',
          status: 'published'
        },
        {
          id: 3,
          type: 'user',
          title: 'Fatima Al-Zahra',
          description: 'Student - Intermediate Level',
          details: 'fatima.alzahra@example.com',
          date: '2024-01-12',
          status: 'active'
        },
        {
          id: 4,
          type: 'content',
          title: 'Ramadan Schedule Update',
          description: 'Announcement - System Wide',
          details: 'Important schedule changes for Ramadan',
          date: '2024-01-20',
          status: 'published'
        },
        {
          id: 5,
          type: 'system',
          title: 'Database Backup Log',
          description: 'System Log - Backup Operation',
          details: 'Successful backup completed at 2:00 AM',
          date: '2024-01-22',
          status: 'completed'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, [query]);

  const filteredResults = results.filter(result => 
    filter === 'all' || result.type === filter
  );

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