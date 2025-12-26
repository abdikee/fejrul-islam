'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, User } from 'lucide-react';

export default function MentorProfilePhotoSettings() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/dashboard/user', { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.success) {
          setPhotoPreview(data.user?.profilePhoto || null);
        }
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const handlePhotoSelected = async (file) => {
    try {
      setStatus(null);
      if (!file) return;
      if (!file.type?.startsWith('image/')) {
        setStatus({ type: 'error', text: 'Please select an image file.' });
        return;
      }

      setUploading(true);

      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/dashboard/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profilePhoto: dataUrl })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to update profile photo');
      }

      setPhotoPreview(data.profilePhoto || dataUrl);
      setStatus({ type: 'success', text: 'Profile photo updated.' });
    } catch (e) {
      setStatus({ type: 'error', text: e.message || 'Failed to update profile photo' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <div className="font-semibold text-slate-800">Profile Photo</div>
      <div className="text-sm text-slate-600 mt-1">This photo is used across your mentor and student views.</div>

      {status && (
        <div
          className={`mt-3 rounded-lg border p-3 text-sm ${
            status.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-slate-500" />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={loading || uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            {uploading ? 'Updating…' : 'Change Photo'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePhotoSelected(e.target.files?.[0] || null)}
          />
        </div>
      </div>
    </div>
  );
}
