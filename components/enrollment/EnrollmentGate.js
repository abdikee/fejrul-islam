'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import notify from '@/lib/notify';

/**
 * EnrollmentGate - Protects content and handles enrollment flow
 * Shows login/register prompts for unauthenticated users
 * Handles enrollment forms for authenticated users
 */
export default function EnrollmentGate({ 
  children, 
  programType, 
  programId, 
  programName,
  requiresForm = false,
  formFields = [],
  redirectAfterEnroll = null 
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      checkEnrollmentStatus();
    }
  }, [user, loading, programType, programId]);

  const checkEnrollmentStatus = async () => {
    try {
      const response = await fetch(`/api/enrollment/status?type=${programType}&id=${programId}`);
      const data = await response.json();
      setEnrollmentStatus(data);
      
      if (!data.enrolled && requiresForm) {
        setShowEnrollmentForm(true);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnrollment = async (formData = {}) => {
    setEnrolling(true);
    try {
      const response = await fetch('/api/enrollment/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programType,
          programId,
          enrollmentData: formData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setEnrollmentStatus({ enrolled: true, enrollment: result.enrollment });
        setShowEnrollmentForm(false);
        notify.success('Enrollment successful');
        
        if (redirectAfterEnroll) {
          router.push(redirectAfterEnroll);
        }
      } else {
        notify.error('Enrollment failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      notify.error('Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleAuthRedirect = (type) => {
    const currentUrl = encodeURIComponent(window.location.pathname);
    router.push(`/auth/${type}?returnUrl=${currentUrl}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated - show login/register prompt
  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md border">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sign in Required
          </h3>
          
          <p className="text-sm text-gray-600 mb-6">
            To access {programName || 'this program'}, you need to sign in to your account or create a new one.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => handleAuthRedirect('login')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
            
            <button
              onClick={() => handleAuthRedirect('signup')}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but not enrolled - show enrollment form or direct enrollment
  if (enrollmentStatus && !enrollmentStatus.enrolled) {
    if (showEnrollmentForm && requiresForm) {
      return (
        <EnrollmentForm
          programName={programName}
          formFields={formFields}
          onSubmit={handleEnrollment}
          loading={enrolling}
          onCancel={() => setShowEnrollmentForm(false)}
        />
      );
    }

    // Direct enrollment (no form required)
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md border">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Enroll in {programName}
          </h3>
          
          <p className="text-sm text-gray-600 mb-6">
            Click below to enroll and start accessing the program materials.
          </p>
          
          <button
            onClick={() => handleEnrollment()}
            disabled={enrolling}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
        </div>
      </div>
    );
  }

  // Enrolled - show content
  return children;
}

/**
 * Enrollment Form Component
 */
function EnrollmentForm({ programName, formFields, onSubmit, loading, onCancel }) {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md border">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Enroll in {programName}
        </h3>
        <p className="text-sm text-gray-600">
          Please fill out the form below to complete your enrollment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === 'select' ? (
              <select
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field.placeholder}
              />
            ) : (
              <input
                type={field.type || 'text'}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Enrolling...' : 'Complete Enrollment'}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}