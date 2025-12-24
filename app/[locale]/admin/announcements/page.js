'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import CreateAnnouncementModal from '@/components/admin/CreateAnnouncementModal';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { Megaphone, Search, Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react';

export default function AnnouncementsPage() {
  const searchParams = useSearchParams();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toasts, removeToast, success, error } = useToast();

  // Get active filter from URL
  const activeFilter = searchParams.get('filter') || 'all';

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements');
      const data = await response.json();
      if (data.success) {
        setAnnouncements(data.announcements || []);
      } else {
        error(data.message || 'Failed to fetch announcements');
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
      error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (message, type = 'success') => {
    if (type === 'success') {
      success(message);
      fetchAnnouncements(); // Refresh the list
    } else {
      error(message);
    }
  };

  // Apply both search and filter
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'pending') return matchesSearch && announcement.status === 'draft';
    if (activeFilter === 'published') return matchesSearch && announcement.status === 'published';
    if (activeFilter === 'archived') return matchesSearch && announcement.status === 'archived';
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading announcements...</p>
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
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Announcements</h1>
                <p className="text-orange-100">Manage system-wide announcements and notifications</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              New Announcement
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Total Announcements</div>
            <div className="text-2xl font-bold text-slate-800">{announcements.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Published</div>
            <div className="text-2xl font-bold text-green-600">
              {announcements.filter(a => a.status === 'published').length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Draft</div>
            <div className="text-2xl font-bold text-yellow-600">
              {announcements.filter(a => a.status === 'draft').length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">This Month</div>
            <div className="text-2xl font-bold text-blue-600">
              {announcements.filter(a => new Date(a.created).getMonth() === new Date().getMonth()).length}
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
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {activeFilter !== 'all' && (
            <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Showing <span className="font-semibold">{activeFilter}</span> announcements ({filteredAnnouncements.length} items)
              </p>
            </div>
          )}
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-800">{announcement.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      announcement.status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {announcement.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (announcement.target_audience || 'all') === 'all' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {announcement.target_audience || 'all'}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-3">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="View">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-green-100 rounded-lg transition-colors" title="Edit">
                    <Edit className="w-4 h-4 text-green-600" />
                  </button>
                  <button className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Megaphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">
              {activeFilter === 'all' 
                ? 'No announcements found' 
                : `No ${activeFilter} announcements found`}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create First Announcement
            </button>
          </div>
        )}
      </div>

      {/* Create Announcement Modal */}
      <CreateAnnouncementModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </AdminLayout>
  );
}
