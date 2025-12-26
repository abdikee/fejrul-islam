'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import notify from '@/lib/notify';
import { useConfirm } from '@/components/ui/ConfirmProvider';
import AdminLayout from '@/components/admin/AdminLayout';
import { FileText, Plus, Edit, Trash2, Eye, Save, X } from 'lucide-react';

export default function ContentManagerPage() {
  const searchParams = useSearchParams();
  const confirmDialog = useConfirm();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contentKey: '',
    contentType: 'text',
    title: '',
    content: '',
    imageUrl: '',
    status: 'draft'
  });

  // Get active filter from URL
  const activeFilter = searchParams.get('filter') || 'all';

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content-manager');
      const data = await response.json();
      if (data.success) {
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter content based on active filter
  const filteredContent = content.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return item.status === 'draft';
    if (activeFilter === 'published') return item.status === 'published';
    if (activeFilter === 'archived') return item.status === 'archived';
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/content-manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        notify.success(data.message || 'Content saved');
        fetchContent();
        resetForm();
      } else {
        notify.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      notify.error('Failed to save content');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      contentKey: item.content_key,
      contentType: item.content_type,
      title: item.title || '',
      content: item.content || '',
      imageUrl: item.image_url || '',
      status: item.status
    });
    setEditingContent(item);
    setShowForm(true);
  };

  const handleDelete = async (contentKey) => {
    const ok = await confirmDialog({
      title: 'Delete Content',
      description: `Are you sure you want to delete "${contentKey}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
    if (!ok) return;

    try {
      const response = await fetch(`/api/admin/content-manager?key=${contentKey}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        notify.success('Content deleted successfully');
        fetchContent();
      } else {
        notify.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      notify.error('Failed to delete content');
    }
  };

  const resetForm = () => {
    setFormData({
      contentKey: '',
      contentType: 'text',
      title: '',
      content: '',
      imageUrl: '',
      status: 'draft'
    });
    setEditingContent(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading content...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Content Manager</h1>
                <p className="text-green-100">Manage global website content</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              New Content
            </button>
          </div>
        </div>

        {/* Content Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {editingContent ? 'Edit Content' : 'Create New Content'}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Content Key *
                  </label>
                  <input
                    type="text"
                    value={formData.contentKey}
                    onChange={(e) => setFormData({ ...formData, contentKey: e.target.value })}
                    placeholder="e.g., homepage_hero_title"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={editingContent !== null}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Content Type *
                  </label>
                  <select
                    value={formData.contentType}
                    onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="text">Text</option>
                    <option value="html">HTML</option>
                    <option value="image">Image</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Display title"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter content here..."
                  rows={6}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {formData.contentType === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingContent ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Filter Info */}
          {activeFilter !== 'all' && (
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
              <p className="text-sm text-blue-700">
                Showing <span className="font-semibold">{activeFilter}</span> content ({filteredContent.length} items)
              </p>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Content Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Updated</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {item.content_key}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {item.content_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.title || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(item.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.content_key)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">
                {activeFilter === 'all' 
                  ? 'No content found' 
                  : `No ${activeFilter} content found`}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Content
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
