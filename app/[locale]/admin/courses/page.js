'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { 
  BookOpen, Plus, Search, Edit, Trash2, Eye, Filter, 
  Users, Clock, Award, TrendingUp, Download, Grid, List
} from 'lucide-react';

export default function AdminCoursesPage() {
  const searchParams = useSearchParams();
  const { toasts, removeToast, success, error, warning } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSector, setFilterSector] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sectorId: '',
    level: 'Beginner',
    durationWeeks: '',
    status: 'draft'
  });

  // Get active filter from URL
  const activeFilter = searchParams.get('filter') || 'all';

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.sectorId || !formData.durationWeeks) {
      warning('Please fill in all required fields');
      return;
    }
    
    try {
      const url = editingCourse 
        ? `/api/admin/courses`
        : '/api/admin/courses';
      
      const method = editingCourse ? 'PUT' : 'POST';

      // Map form data to API format
      const payload = {
        title: formData.title,
        description: formData.description,
        sectorId: parseInt(formData.sectorId),
        level: formData.level,
        durationWeeks: parseInt(formData.durationWeeks),
        isActive: formData.status === 'published',
        ...(editingCourse && { id: editingCourse.id })
      };

      console.log('Submitting course:', payload);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Response:', data);

      if (data.success) {
        success(editingCourse ? 'Course updated successfully!' : 'Course created successfully!');
        setShowModal(false);
        setEditingCourse(null);
        resetForm();
        fetchCourses();
      } else {
        error('Error: ' + (data.message || 'Operation failed'));
        console.error('API Error:', data);
      }
    } catch (err) {
      console.error('Submit Error:', err);
      error('An error occurred: ' + err.message);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      sectorId: course.sector_id || '',
      level: course.level,
      durationWeeks: course.duration_weeks,
      status: course.status
    });
    setShowModal(true);
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`/api/admin/courses?id=${courseId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        success('Course deleted successfully');
        fetchCourses();
      } else {
        error(data.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Error:', err);
      error('An error occurred while deleting');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      sectorId: '',
      level: 'Beginner',
      durationWeeks: '',
      status: 'draft'
    });
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses');
      const data = await response.json();
      console.log('Fetched courses:', data);
      if (data.success) {
        setCourses(data.courses || []);
      } else {
        console.error('Failed to fetch courses:', data.message);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = filterSector === 'all' || course.sector_name === filterSector;
    
    let matchesStatus = true;
    if (activeFilter === 'pending') matchesStatus = course.status === 'draft';
    else if (activeFilter === 'published') matchesStatus = course.status === 'published';
    else if (activeFilter === 'archived') matchesStatus = course.status === 'archived';
    
    return matchesSearch && matchesSector && matchesStatus;
  });

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    totalStudents: courses.reduce((sum, c) => sum + (c.enrolled_students || 0), 0)
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading courses...</p>
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Program Management</h1>
                <p className="text-blue-100">Manage all dawah programs across sectors</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingCourse(null);
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              New Program
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Total Programs</div>
                <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Published</div>
                <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Draft</div>
                <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Total Participants</div>
                <div className="text-2xl font-bold text-purple-600">{stats.totalStudents}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Programs</option>
              <option value="Dawah & Outreach">Dawah & Outreach</option>
              <option value="Irshad & Counseling">Irshad & Counseling</option>
              <option value="Interfaith Dialogue">Interfaith Dialogue</option>
              <option value="Community Development">Community Development</option>
              <option value="Islamic Resources">Islamic Resources</option>
            </select>
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          {activeFilter !== 'all' && (
            <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Showing <span className="font-semibold">{activeFilter}</span> programs ({filteredCourses.length} items)
              </p>
            </div>
          )}
        </div>

        {/* Courses Grid/List */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">
              {activeFilter === 'all' 
                ? 'No programs found' 
                : `No ${activeFilter} programs found`}
            </p>
            <button
              onClick={() => {
                setEditingCourse(null);
                resetForm();
                setShowModal(true);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create First Program
            </button>
          </div>
        ) : (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-3 py-1 bg-${course.sector_color}-100 text-${course.sector_color}-700 rounded-full text-sm font-medium`}>
                    {course.sector_name}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : course.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {course.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2">{course.title}</h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{course.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Award className="w-4 h-4" />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration_weeks} weeks</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolled_students} participants enrolled</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <button 
                    onClick={() => warning('View course details coming soon!')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button 
                    onClick={() => handleEdit(course)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(course.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {editingCourse ? 'Edit Program' : 'Create New Program'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingCourse(null);
                      resetForm();
                    }}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Program Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Introduction to Dawah"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe what participants will learn in this program..."
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Sector *
                      </label>
                      <select
                        required
                        value={formData.sectorId}
                        onChange={(e) => setFormData({...formData, sectorId: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Program Type</option>
                        <option value="1">Dawah & Outreach</option>
                        <option value="2">Irshad & Counseling</option>
                        <option value="3">Interfaith Dialogue</option>
                        <option value="4">Community Development</option>
                        <option value="5">Islamic Resources</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Level *
                      </label>
                      <select
                        required
                        value={formData.level}
                        onChange={(e) => setFormData({...formData, level: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Duration (weeks) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.durationWeeks}
                        onChange={(e) => setFormData({...formData, durationWeeks: e.target.value})}
                        placeholder="e.g., 8"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Status *
                      </label>
                      <select
                        required
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {editingCourse ? 'Update Program' : 'Create Program'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingCourse(null);
                        resetForm();
                      }}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
