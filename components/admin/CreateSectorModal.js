'use client';

import { useState } from 'react';
import { X, Layers } from 'lucide-react';

export default function CreateSectorModal({ isOpen, onClose, onSuccess, editData = null }) {
  const [formData, setFormData] = useState(editData || {
    name: '',
    description: '',
    color: 'blue',
    icon: 'book',
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editData ? `/api/sectors?id=${editData.id}` : '/api/sectors';
      const method = editData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(editData ? 'Sector updated successfully!' : 'Sector created successfully!');
        onClose();
      } else {
        onSuccess(data.message || 'Failed to save sector', 'error');
      }
    } catch (error) {
      console.error('Error saving sector:', error);
      onSuccess('Failed to save sector', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const colors = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {editData ? 'Edit Sector' : 'Create Sector'}
              </h2>
              <p className="text-sm text-slate-600">
                {editData ? 'Update sector information' : 'Add a new learning sector'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sector Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Tarbiya & Idad"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Brief description of the sector..."
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`flex items-center gap-2 px-3 py-2 border-2 rounded-lg transition-all ${
                    formData.color === color.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${color.class}`}></div>
                  <span className="text-sm font-medium text-slate-700">{color.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Icon
            </label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="book">📚 Book</option>
              <option value="quran">📖 Quran</option>
              <option value="mosque">🕌 Mosque</option>
              <option value="star">⭐ Star</option>
              <option value="heart">❤️ Heart</option>
              <option value="light">💡 Light</option>
              <option value="globe">🌍 Globe</option>
              <option value="pen">✍️ Pen</option>
            </select>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
              Active (visible to students)
            </label>
          </div>

          {/* Preview */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-medium text-slate-600 mb-2">Preview:</p>
            <div className={`bg-${formData.color}-100 border-2 border-${formData.color}-200 rounded-lg p-4`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${formData.color}-500 rounded-lg flex items-center justify-center text-2xl`}>
                  {formData.icon === 'book' && '📚'}
                  {formData.icon === 'quran' && '📖'}
                  {formData.icon === 'mosque' && '🕌'}
                  {formData.icon === 'star' && '⭐'}
                  {formData.icon === 'heart' && '❤️'}
                  {formData.icon === 'light' && '💡'}
                  {formData.icon === 'globe' && '🌍'}
                  {formData.icon === 'pen' && '✍️'}
                </div>
                <div>
                  <h3 className={`font-bold text-${formData.color}-900`}>
                    {formData.name || 'Sector Name'}
                  </h3>
                  <p className={`text-sm text-${formData.color}-700`}>
                    {formData.description || 'Sector description...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : editData ? 'Update Sector' : 'Create Sector'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
