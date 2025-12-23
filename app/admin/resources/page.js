'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import CreateResourceModal from '@/components/admin/CreateResourceModal';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { Upload, Search, Filter, Download, Eye, Edit, Trash2, Plus, FileText } from 'lucide-react';

export default function ResourcesPage() {
  const searchParams = useSearchParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toasts, removeToast, success, error } = useToast();

  // Get active filter from URL
  const activeFilter = searchParams.get('filter') || 'all';

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/admin/resources');
      const data = await response.json();
      if (data.success) {
        setResources(data.resources || []);
      } else {
        error(data.message || 'Failed to fetch resources');
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (message, type = 'success') => {
    if (type === 'success') {
      success(message);
      fetchResources(); // Refresh the list
    } else {
      error(message);
    }
  };

  // Apply both search and filter
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'pending') return matchesSearch && resource.status === 'draft';
    if (activeFilter === 'published') return matchesSearch && resource.status === 'published';
    if (activeFilter === 'archived') return matchesSearch && resource.status === 'archived';
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading resources...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Learning Resources</h1>
                <p className="text-green-100">Manage educational materials and downloads</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Upload Resource
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Total Resources</div>
            <div className="text-2xl font-bold text-slate-800">{resources.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Total Downloads</div>
            <div className="text-2xl font-bold text-blue-600">
              {resources.reduce((sum, r) => sum + (r.downloads || 0), 0)}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">PDF Documents</div>
            <div className="text-2xl font-bold text-green-600">
              {resources.filter(r => r.type === 'PDF').length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Video Content</div>
            <div className="text-2xl font-bold text-purple-600">
              {resources.filter(r => r.type === 'Video').length}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          {activeFilter !== 'all' && (
            <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Showing <span className="font-semibold">{activeFilter}</span> resources ({filteredResources.length} items)
              </p>
            </div>
          )}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  resource.type === 'PDF' ? 'bg-red-100' : 'bg-purple-100'
                }`}>
                  <FileText className={`w-6 h-6 ${
                    resource.type === 'PDF' ? 'text-red-600' : 'text-purple-600'
                  }`} />
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  resource.type === 'PDF' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {resource.type}
                </span>
              </div>

              <h3 className="font-bold text-slate-800 mb-2">{resource.title}</h3>
              
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-medium">{resource.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloads:</span>
                  <span className="font-medium">{resource.downloads}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded:</span>
                  <span className="font-medium">{resource.uploaded}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Upload className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">
              {activeFilter === 'all' 
                ? 'No resources found' 
                : `No ${activeFilter} resources found`}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload First Resource
            </button>
          </div>
        )}
      </div>

      {/* Create Resource Modal */}
      <CreateResourceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </AdminLayout>
  );
}
