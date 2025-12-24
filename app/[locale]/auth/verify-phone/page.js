'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Phone } from 'lucide-react';
import PhoneVerification from '@/components/auth/PhoneVerification';
import Alert from '@/components/ui/Alert';

export default function VerifyPhonePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (data.success) {
          setUser(data.user);
          
          // If phone is already verified, show success message
          if (data.user.phone_verified) {
            setAlert({
              type: 'success',
              title: 'Already Verified',
              message: `Your phone number ${data.user.phone} is already verified.`
            });
          }
        } else {
          // Redirect to login if not authenticated
          window.location.href = '/auth/login';
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        window.location.href = '/auth/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleVerificationComplete = (phoneNumber) => {
    setAlert({
      type: 'success',
      title: 'Phone Verified!',
      message: `Your phone number ${phoneNumber} has been successfully verified.`
    });
    
    // Update user state
    setUser(prev => ({
      ...prev,
      phone: phoneNumber,
      phone_verified: true
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10">
                <img
                  src="/logo.svg"
                  alt="Fejrul Islam Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Fejrul Islam</h1>
                <p className="text-xs text-slate-600">Phone Verification</p>
              </div>
            </Link>
            <Link
              href={user?.gender ? `/dashboard/${user.gender}` : '/dashboard'}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Verify Your Phone</h1>
            <p className="text-slate-600">
              Secure your account by verifying your phone number with SMS
            </p>
          </div>

          {/* Alert Display */}
          {alert && (
            <Alert
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onClose={() => setAlert(null)}
              className="mb-6"
            />
          )}

          {/* Phone Verification Component */}
          <PhoneVerification
            user={user}
            onVerificationComplete={handleVerificationComplete}
            showTitle={false}
          />

          {/* Additional Information */}
          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Why verify your phone?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Enhanced account security</li>
                <li>• Receive important notifications</li>
                <li>• Account recovery options</li>
                <li>• Two-factor authentication</li>
              </ul>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-800 mb-2">SMS Rates</h3>
              <p className="text-sm text-emerald-700">
                Standard SMS rates may apply. We use secure SMS delivery to protect your verification codes.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="text-center mt-8 space-y-2">
            <Link 
              href={user?.gender ? `/dashboard/${user.gender}` : '/dashboard'}
              className="block text-sm text-slate-600 hover:text-slate-800"
            >
              Skip for now (not recommended)
            </Link>
            <Link href="/auth/verify-email" className="block text-sm text-slate-500 hover:text-slate-700">
              Verify Email Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}