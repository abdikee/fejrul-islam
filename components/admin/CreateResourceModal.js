'use client';

import { useEffect, useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';

export default function CreateResourceModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resourceType: 'PDF',
    filePath: '',
    sectorId: '',
    courseId: '',
    accessLevel: 'public',
    fileSize: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const loadCourses = async () => {
      try {
        const res = await fetch('/api/admin/courses?limit=200', { credentials: 'include' });
        const data = await res.json();
        if (!cancelled && data?.success && Array.isArray(data.courses)) {
          setCourses(data.courses);
        }
      } catch {
        // Optional; ignore.
      }
    };

    loadCourses();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const uploadFileIfNeeded = async () => {
    if (!selectedFile) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', selectedFile);

      const res = await fetch('/api/admin/uploads', {
        method: 'POST',
        body: fd,
        credentials: 'include'
      });

      const data = await res.json();
      if (!data?.success || !data?.url) {
        throw new Error(data?.message || 'Upload failed');
      }
      return data;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let filePath = formData.filePath;
      let fileSize = formData.fileSize;

      if (selectedFile) {
        const uploaded = await uploadFileIfNeeded();
        filePath = uploaded.url;
        fileSize = uploaded.size;
      }

      const response = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          filePath,
          fileSize
        })
      });

      const data = await response.json();

      if (data.success) {
        onSuccess('Resource created successfully!');
        onClose();
        setFormData({
          title: '',
          description: '',
          resourceType: 'PDF',
          filePath: '',
          sectorId: '',
          courseId: '',
          accessLevel: 'public',
          fileSize: ''
        });
        setSelectedFile(null);
      } else {
        onSuccess(data.message || 'Failed to create resource', 'error');
      }
    } catch (error) {
      console.error('Error creating resource:', error);
      onSuccess('Failed to create resource', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Upload Resource</h2>
              <p className="text-sm text-slate-600">Add a new learning resource</p>
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
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Quran Recitation Guide"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Brief description of the resource..."
            />
          </div>

          {/* Resource Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Resource Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.resourceType}
              onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="PDF">PDF Document</option>
              <option value="Video">Video</option>
              <option value="Audio">Audio</option>
              <option value="Image">Image</option>
              <option value="Archive">Archive (ZIP)</option>
            </select>
          </div>

          {/* File Path */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload File (optional)</label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              If selected, the file will be uploaded on submit.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              File Path/URL {!selectedFile && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              required={!selectedFile}
              value={formData.filePath}
              onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="/uploads/resources/file.pdf"
            />
            <p className="text-xs text-slate-500 mt-1">
              Enter the file path or URL where the resource is stored
            </p>
          </div>

          {/* Sector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sector
            </label>
            <select
              value={formData.sectorId}
              onChange={(e) => setFormData({ ...formData, sectorId: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">General (No Sector)</option>
              <option value="1">Tarbiya & Idad</option>
              <option value="2">Qirat & Ilm</option>
              <option value="3">Literature</option>
              <option value="4">Comparative Religion</option>
              <option value="5">Ziyara</option>
            </select>
          </div>

          {/* Course (optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Target Course (optional)
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">No specific course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Attach this resource directly to a course.
            </p>
          </div>

          {/* File Size */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              File Size (bytes)
            </label>
            <input
              type="number"
              value={formData.fileSize}
              onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., 2500000 (2.5 MB)"
            />
          </div>

          {/* Access Level */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Access Level
            </label>
            <select
              value={formData.accessLevel}
              onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="public">Public (All Users)</option>
              <option value="students">Students Only</option>
              <option value="mentors">Mentors Only</option>
              <option value="premium">Premium Members</option>
            </select>
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
              disabled={loading || uploading || (!selectedFile && !formData.filePath)}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : loading ? 'Creating...' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
