'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Users, Plus, Search, Edit, Trash2, Mail, Phone, 
  Calendar, CheckCircle, XCircle, Filter, Download,
  UserCheck, BookOpen, Award
} from 'lucide-react';
import Alert from '@/components/ui/Alert';
import PhoneNumberInput from '@/components/ui/PhoneNumberInput';

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: 'male',
    phone: '',
    specialization: '',
    bio: ''
  });

  useEffect(() => {
    fetchMentors();
  }, []);

  const readResponse = async (response) => {
    const text = await response.text();
    try {
      return { ok: response.ok, status: response.status, data: JSON.parse(text) };
    } catch {
      return { ok: response.ok, status: response.status, data: null, text };
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await fetch('/api/admin/mentors', { credentials: 'include' });
      const { data, text, status } = await readResponse(response);

      if (data?.success) {
        setMentors(data.mentors);
      } else {
        setAlert({
          type: 'error',
          title: 'Error',
          message: data?.message || (text ? `Request failed (${status}): ${text}` : 'Failed to load mentors')
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setAlert({
        type: 'error',
        title: 'Error',
        message: error?.message || 'Failed to load mentors'
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    try {
      const url = editingMentor 
        ? `/api/admin/mentors/${editingMentor.id}`
        : '/api/admin/mentors';
      
      const method = editingMentor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const { data, text, status } = await readResponse(response);

      if (data.success) {
        setAlert({
          type: 'success',
          title: 'Success',
          message: editingMentor ? 'Mentor updated successfully' : 'Mentor added successfully'
        });
        setShowAddModal(false);
        setEditingMentor(null);
        resetForm();
        fetchMentors();
      } else {
        setAlert({
          type: 'error',
          title: 'Error',
          message: data?.message || (text ? `Request failed (${status}): ${text}` : 'Operation failed')
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({
        type: 'error',
        title: 'Error',
        message: error?.message || 'An error occurred'
      });
    }
  };

  const handleDelete = async (mentorId) => {
    if (!confirm('Are you sure you want to delete this mentor?')) return;

    try {
      const response = await fetch(`/api/admin/mentors/${mentorId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const { data, text, status } = await readResponse(response);

      if (data.success) {
        setAlert({
          type: 'success',
          title: 'Success',
          message: 'Mentor deleted successfully'
        });
        fetchMentors();
      } else {
        setAlert({
          type: 'error',
          title: 'Error',
          message: data?.message || (text ? `Request failed (${status}): ${text}` : 'Delete failed')
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({
        type: 'error',
        title: 'Error',
        message: error?.message || 'An error occurred'
      });
    }
  };

  const handleEdit = (mentor) => {
    setEditingMentor(mentor);
    setFormData({
      firstName: mentor.first_name,
      lastName: mentor.last_name,
      email: mentor.email,
      password: '',
      gender: mentor.gender,
      phone: mentor.phone || '',
      specialization: mentor.specialization || '',
      bio: mentor.bio || ''
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      gender: 'male',
      phone: '',
      specialization: '',
      bio: ''
    });
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = 
      mentor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = filterGender === 'all' || mentor.gender === filterGender;
    
    return matchesSearch && matchesGender;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading mentors...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Mentor Management</h1>
            <p className="text-slate-600">Add and manage mentors in the system</p>
          </div>
          <button
            onClick={() => {
              setEditingMentor(null);
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Mentor
          </button>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
            className="mb-4"
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Mentors</p>
                <p className="text-2xl font-bold text-slate-800">{mentors.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Male Mentors</p>
                <p className="text-2xl font-bold text-slate-800">
                  {mentors.filter(m => m.gender === 'male').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Female Mentors</p>
                <p className="text-2xl font-bold text-slate-800">
                  {mentors.filter(m => m.gender === 'female').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Active</p>
                <p className="text-2xl font-bold text-slate-800">
                  {mentors.filter(m => m.is_active).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search mentors by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {/* Mentors Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Mentor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMentors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No mentors found
                  </td>
                </tr>
              ) : (
                filteredMentors.map((mentor) => (
                  <tr key={mentor.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          mentor.gender === 'male' ? 'bg-blue-500' : 'bg-rose-500'
                        }`}>
                          {mentor.first_name[0]}{mentor.last_name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {mentor.first_name} {mentor.last_name}
                          </p>
                          <p className="text-sm text-slate-500">ID: {mentor.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          {mentor.email}
                        </div>
                        {mentor.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4" />
                            {mentor.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        mentor.gender === 'male' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {mentor.gender === 'male' ? 'Brother' : 'Sister'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {mentor.specialization || 'Not specified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {mentor.is_active ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400 text-sm">
                          <XCircle className="w-4 h-4" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(mentor)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(mentor.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingMentor ? 'Edit Mentor' : 'Add New Mentor'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMentor(null);
                    resetForm();
                  }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password {editingMentor ? '(leave blank to keep current)' : '*'}
                  </label>
                  <input
                    type="password"
                    required={!editingMentor}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Gender *
                    </label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone
                    </label>
                    <PhoneNumberInput
                      value={formData.phone}
                      onChange={(phone) => setFormData({...formData, phone})}
                      defaultCountry="ET"
                      selectClassName="h-10 px-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      inputClassName="w-full h-10 px-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      aria-label="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    placeholder="e.g., Quranic Studies, Hadith, Fiqh"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={3}
                    placeholder="Brief description about the mentor..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    {editingMentor ? 'Update Mentor' : 'Add Mentor'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingMentor(null);
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
