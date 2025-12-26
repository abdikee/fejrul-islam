'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  BookOpen, Megaphone, Upload, FileText, 
  Save, X, Plus, Calendar, Users, Tag
} from 'lucide-react';
import notify from '@/lib/notify';

export default function NewContentPage() {
  const [contentType, setContentType] = useState('course');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    sector: '',
    targetAudience: '',
    status: 'draft'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle content creation
    console.log('Creating content:', { type: contentType, ...formData });
    notify.success(`${contentType} "${formData.title}" created successfully!`);
    // Redirect back to content management
    window.location.href = '/admin/content';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contentTypes = [
    { id: 'course', name: 'Course', icon: BookOpen, description: 'Educational course content' },
    { id: 'announcement', name: 'Announcement', icon: Megaphone, description: 'System-wide announcements' },
    { id: 'resource', name: 'Resource', icon: Upload, description: 'Learning materials and documents' },
    { id: 'article', name: 'Article', icon: FileText, description: 'Educational articles and guides' }
  ];

  const sectors = [
    'Tarbiya & Idad',
    'Literature', 
    'Comparative Religion',
    'Ziyara',
    'Qirat & Ilm'
  ];

  const audiences = [
    'All Students',
    'Male Students',
    'Female Students',
    'Mentors',
    'Advanced Level',
    'Beginner Level'
  ];

  return (
    <AdminLayout showAnalytics={false} showActivity={false}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Create New Content</h1>
            <p className="text-slate-600">Add new educational content to the system</p>
          </div>
          <button
            onClick={() => window.location.href = '/admin/content'}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Type Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Content Type</h3>
              <div className="space-y-3">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setContentType(type.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                        contentType === type.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">{type.name}</p>
                        <p className="text-xs opacity-75">{type.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${contentType} title`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Brief description of the ${contentType}`}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter the main ${contentType} content here...`}
                  />
                </div>

                {/* Sector */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Sector
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => handleInputChange('sector', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a sector</option>
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Target Audience
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select target audience</option>
                    {audiences.map((audience) => (
                      <option key={audience} value={audience}>{audience}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Pending Review</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Create {contentType}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        title: '',
                        description: '',
                        content: '',
                        sector: '',
                        targetAudience: '',
                        status: 'draft'
                      });
                    }}
                    className="px-6 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}