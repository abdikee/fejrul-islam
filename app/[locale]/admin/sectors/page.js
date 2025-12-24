'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import CreateSectorModal from '@/components/admin/CreateSectorModal';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { Compass, Search, Plus, Edit, Eye, Users, BookOpen, TrendingUp } from 'lucide-react';

export default function SectorsPage() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSector, setEditingSector] = useState(null);
  const { toasts, removeToast, success, error } = useToast();

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      const response = await fetch('/api/sectors');
      const data = await response.json();
      if (data.success) {
        setSectors(data.sectors || []);
      } else {
        error(data.message || 'Failed to fetch sectors');
      }
    } catch (err) {
      console.error('Error fetching sectors:', err);
      error('Failed to load sectors');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (message, type = 'success') => {
    if (type === 'success') {
      success(message);
      fetchSectors(); // Refresh the list
    } else {
      error(message);
    }
    setEditingSector(null);
  };

  const handleEdit = (sector) => {
    setEditingSector(sector);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingSector(null);
  };

  const getColorClasses = (color) => {
    const colors = {
      emerald: { bg: 'from-emerald-500 to-green-500', border: 'border-emerald-200', text: 'text-emerald-600' },
      blue: { bg: 'from-blue-500 to-cyan-500', border: 'border-blue-200', text: 'text-blue-600' },
      purple: { bg: 'from-purple-500 to-pink-500', border: 'border-purple-200', text: 'text-purple-600' },
      orange: { bg: 'from-orange-500 to-red-500', border: 'border-orange-200', text: 'text-orange-600' },
      teal: { bg: 'from-teal-500 to-emerald-500', border: 'border-teal-200', text: 'text-teal-600' }
    };
    return colors[color] || colors.emerald;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading sectors...</p>
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
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Educational Sectors</h1>
                <p className="text-indigo-100">Manage all 5 sectors of Islamic education</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Sector
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Total Sectors</div>
            <div className="text-2xl font-bold text-slate-800">{sectors.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Total Students</div>
            <div className="text-2xl font-bold text-blue-600">
              {sectors.reduce((sum, s) => sum + (s.enrolled_students || 0), 0)}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Total Courses</div>
            <div className="text-2xl font-bold text-green-600">
              {sectors.reduce((sum, s) => sum + (s.course_count || 0), 0)}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600 mb-1">Avg Students/Sector</div>
            <div className="text-2xl font-bold text-purple-600">
              {sectors.length > 0 ? Math.round(sectors.reduce((sum, s) => sum + (s.enrolled_students || 0), 0) / sectors.length) : 0}
            </div>
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector) => {
            const colors = getColorClasses(sector.color);
            return (
              <div key={sector.id} className={`bg-white rounded-2xl p-6 border-2 ${colors.border} hover:shadow-lg transition-shadow`}>
                <div className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Compass className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="font-bold text-slate-800 text-lg mb-2">{sector.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{sector.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4" />
                      Students
                    </div>
                    <span className="font-bold text-slate-800">{sector.enrolled_students || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <BookOpen className="w-4 h-4" />
                      Courses
                    </div>
                    <span className="font-bold text-slate-800">{sector.course_count || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <TrendingUp className="w-4 h-4" />
                      Status
                    </div>
                    <span className={`font-bold ${sector.is_active ? 'text-green-600' : 'text-slate-400'}`}>
                      {sector.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button 
                    onClick={() => handleEdit(sector)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {sectors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Compass className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No sectors found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create First Sector
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Sector Modal */}
      <CreateSectorModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSuccess={handleCreateSuccess}
        editData={editingSector}
      />
    </AdminLayout>
  );
}
