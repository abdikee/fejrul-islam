'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Bell, FileText, Plus, Edit, Trash2, Save, X, Globe, Eye } from 'lucide-react';

export default function ContentManagement() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);
  const [articles, setArticles] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [formData, setFormData] = useState({});

  // Get active filter from URL
  const activeFilter = searchParams.get('filter') || 'all';

  // Set initial tab from URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['announcements', 'courses', 'resources', 'articles', 'pages'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'announcements') {
        const res = await fetch('/api/admin/announcements', {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) setAnnouncements(data.announcements);
      } else if (activeTab === 'courses') {
        const res = await fetch('/api/admin/courses', {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) setCourses(data.courses);
      } else if (activeTab === 'resources') {
        const res = await fetch('/api/admin/resources', {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) setResources(data.resources);
      } else if (activeTab === 'articles') {
        const res = await fetch('/api/admin/articles', {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) setArticles(data.articles);
      } else if (activeTab === 'pages') {
        const res = await fetch('/api/admin/pages', {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) setPages(data.pages);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = activeTab === 'pages' ? '/api/admin/pages' : `/api/admin/${activeTab}`;
      const method = editingItem ? 'PUT' : 'POST';

      let body = editingItem ? { ...formData } : { ...formData };
      if (activeTab === 'announcements' && editingItem) {
        body = { ...formData, announcementId: editingItem.id };
      } else if (activeTab === 'articles' && editingItem) {
        body = { ...formData, id: editingItem.id };
      } else if (activeTab === 'pages' && editingItem) {
        body = { ...formData, id: editingItem.id };
      }
      
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(body)
      });

      const data = await res.json();
      
      if (data.success) {
        const label = activeTab === 'pages' ? 'page' : activeTab.slice(0, -1);
        alert(`${label} ${editingItem ? 'updated' : 'created'} successfully!`);
        setShowForm(false);
        setEditingItem(null);
        setFormData({});
        loadData();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const endpoint = activeTab === 'pages'
        ? `/api/admin/pages?id=${id}`
        : activeTab === 'announcements'
          ? `/api/admin/announcements?announcementId=${id}`
          : activeTab === 'articles'
            ? `/api/admin/articles?id=${id}`
            : `/api/admin/${activeTab}?id=${id}`;

      const res = await fetch(endpoint, {
        method: 'DELETE',
        credentials: 'include' // Include cookies for authentication
      });

      const data = await res.json();
      if (data.success) {
        alert('Deleted successfully!');
        loadData();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
  };

  // Apply filter to data
  const getFilteredData = (data) => {
    if (activeFilter === 'all') return data;
    if (activeFilter === 'pending') return data.filter(item => item.status === 'draft' || !item.status);
    if (activeFilter === 'published') return data.filter(item => item.status === 'published' || item.is_active);
    if (activeFilter === 'archived') return data.filter(item => item.status === 'archived' || item.is_active === false);
    return data;
  };

  const filteredAnnouncements = getFilteredData(announcements);
  const filteredCourses = getFilteredData(courses);
  const filteredResources = getFilteredData(resources);
  const filteredArticles = getFilteredData(articles);
  const filteredPages = getFilteredData(pages);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          {activeFilter !== 'all' && (
            <p className="text-sm text-blue-600 mt-1">
              Showing <span className="font-semibold">{activeFilter}</span> content
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'announcements'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Bell className="w-5 h-5" />
          Announcements
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'courses'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          Courses
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'resources'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-5 h-5" />
          Resources
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'articles'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-5 h-5" />
          Articles
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'pages'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Globe className="w-5 h-5" />
          Website Pages
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  {editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'announcements' && <AnnouncementForm formData={formData} setFormData={setFormData} />}
                {activeTab === 'courses' && <CourseForm formData={formData} setFormData={setFormData} />}
                {activeTab === 'resources' && <ResourceForm formData={formData} setFormData={setFormData} />}
                {activeTab === 'articles' && <ArticleForm formData={formData} setFormData={setFormData} />}
                {activeTab === 'pages' && <PageForm formData={formData} setFormData={setFormData} />}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <>
            {activeTab === 'announcements' && (
              <AnnouncementsList 
                announcements={filteredAnnouncements} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                activeFilter={activeFilter}
              />
            )}
            {activeTab === 'courses' && (
              <CoursesList 
                courses={filteredCourses} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                activeFilter={activeFilter}
              />
            )}
            {activeTab === 'resources' && (
              <ResourcesList 
                resources={filteredResources} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                activeFilter={activeFilter}
              />
            )}
            {activeTab === 'articles' && (
              <ArticlesList 
                articles={filteredArticles} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                activeFilter={activeFilter}
              />
            )}
            {activeTab === 'pages' && (
              <PagesList
                pages={filteredPages}
                onEdit={handleEdit}
                onDelete={handleDelete}
                activeFilter={activeFilter}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Announcement Form Component
function AnnouncementForm({ formData, setFormData }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          required
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
        <textarea
          required
          rows={4}
          value={formData.content || ''}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={formData.announcementType || 'general'}
            onChange={(e) => setFormData({ ...formData, announcementType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General</option>
            <option value="academic">Academic</option>
            <option value="event">Event</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={formData.priority || 'normal'}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
          <select
            value={formData.targetAudience || 'all'}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="students">Students Only</option>
            <option value="mentors">Mentors Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expire Date</label>
          <input
            type="date"
            value={formData.expireDate || ''}
            onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </>
  );
}

// Course Form Component
function CourseForm({ formData, setFormData }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
        <input
          type="text"
          required
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          required
          rows={3}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sector *</label>
          <select
            required
            value={formData.sectorId || ''}
            onChange={(e) => setFormData({ ...formData, sectorId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Sector</option>
            <option value="1">Dawah</option>
            <option value="2">Irshad</option>
            <option value="3">Tarbiya</option>
            <option value="4">Idad</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <select
            value={formData.level || 'Beginner'}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (weeks)</label>
          <input
            type="number"
            min="1"
            value={formData.durationWeeks || ''}
            onChange={(e) => setFormData({ ...formData, durationWeeks: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </>
  );
}

// Resource Form Component
function ResourceForm({ formData, setFormData }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title *</label>
        <input
          type="text"
          required
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows={3}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select
            required
            value={formData.resourceType || ''}
            onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            <option value="pdf">PDF Document</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="link">External Link</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
          <select
            value={formData.sectorId || ''}
            onChange={(e) => setFormData({ ...formData, sectorId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sectors</option>
            <option value="1">Dawah</option>
            <option value="2">Irshad</option>
            <option value="3">Tarbiya</option>
            <option value="4">Idad</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">File Path / URL *</label>
        <input
          type="text"
          required
          value={formData.filePath || ''}
          onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
          placeholder="e.g., /uploads/document.pdf or https://example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
        <select
          value={formData.accessLevel || 'public'}
          onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="public">Public</option>
          <option value="student">Students Only</option>
          <option value="mentor">Mentors Only</option>
          <option value="admin">Admin Only</option>
        </select>
      </div>
    </>
  );
}

// Article Form Component
function ArticleForm({ formData, setFormData }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Article Title *</label>
        <input
          type="text"
          required
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          required
          rows={3}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the article"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
        <textarea
          required
          rows={10}
          value={formData.content || ''}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Enter the full article content here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
          <select
            value={formData.sector || ''}
            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Sector</option>
            <option value="Qirat & Ilm">Qirat & Ilm</option>
            <option value="Literature & History">Literature & History</option>
            <option value="Dawah & Comparative Religion">Dawah & Comparative Religion</option>
            <option value="Tarbiya & Idad">Tarbiya & Idad</option>
            <option value="Ziyara">Ziyara</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
          <select
            value={formData.targetAudience || 'all'}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="students">Students Only</option>
            <option value="mentors">Mentors Only</option>
            <option value="male">Male Students</option>
            <option value="female">Female Students</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input
            type="text"
            value={formData.author || 'Fejrul Islam'}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status || 'draft'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="review">Pending Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="url"
          value={formData.imageUrl || ''}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  );
}

// Website Pages Form Component
function PageForm({ formData, setFormData }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
        <input
          type="text"
          required
          value={formData.slug || ''}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="e.g., home, about, sectors"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">This should match the route name used by the public page (e.g. /about → about).</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          required
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea
          rows={10}
          value={formData.content || ''}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Enter page content (Markdown supported)."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={formData.is_active ?? formData.isActive ?? true}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="h-4 w-4"
          />
          Active
        </label>
      </div>
    </>
  );
}

// Lists Components
function AnnouncementsList({ announcements, onEdit, onDelete, activeFilter }) {
  if (announcements.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {activeFilter === 'all' ? 'No announcements yet' : `No ${activeFilter} announcements found`}
      </div>
    );
  }

  return (
    <div className="divide-y">
      {announcements.map((item) => (
        <div key={item.id} className="p-4 hover:bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.content}</p>
              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{item.announcement_type}</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">{item.priority}</span>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(item)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CoursesList({ courses, onEdit, onDelete, activeFilter }) {
  if (courses.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {activeFilter === 'all' ? 'No courses yet' : `No ${activeFilter} courses found`}
      </div>
    );
  }

  return (
    <div className="divide-y">
      {courses.map((item) => (
        <div key={item.id} className="p-4 hover:bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">{item.level}</span>
                <span>{item.duration_weeks} weeks</span>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(item)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResourcesList({ resources, onEdit, onDelete, activeFilter }) {
  if (resources.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {activeFilter === 'all' ? 'No resources yet' : `No ${activeFilter} resources found`}
      </div>
    );
  }

  return (
    <div className="divide-y">
      {resources.map((item) => (
        <div key={item.id} className="p-4 hover:bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">{item.resource_type}</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">{item.access_level}</span>
                <span>Downloads: {item.download_count || 0}</span>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(item)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ArticlesList({ articles, onEdit, onDelete, activeFilter }) {
  if (articles.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {activeFilter === 'all' ? 'No articles yet' : `No ${activeFilter} articles found`}
      </div>
    );
  }

  return (
    <div className="divide-y">
      {articles.map((item) => (
        <div key={item.id} className="p-4 hover:bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  item.status === 'published' ? 'bg-green-100 text-green-700' :
                  item.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                  item.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
              <div className="flex gap-3 text-xs text-gray-500">
                {item.sector && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{item.sector}</span>
                )}
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">{item.target_audience}</span>
                <span>By: {item.author}</span>
                <span>Views: {item.views || 0}</span>
                <span>Likes: {item.likes || 0}</span>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              {item.status === 'published' && (
                <a
                  href={`/articles/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                  title="View Article"
                >
                  <Eye className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={() => onEdit(item)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PagesList({ pages, onEdit, onDelete, activeFilter }) {
  if (pages.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {activeFilter === 'all' ? 'No pages yet' : `No ${activeFilter} pages found`}
      </div>
    );
  }

  return (
    <div className="divide-y">
      {pages.map((item) => (
        <div key={item.id} className="p-4 hover:bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{item.slug}</span>
                <span className={`px-2 py-1 rounded text-xs ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.is_active ? 'active' : 'inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.content || '—'}</p>
              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                <span>Updated: {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '—'}</span>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(item)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
