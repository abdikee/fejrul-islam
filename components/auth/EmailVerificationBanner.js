'use client';

import { useState, useEffect } from 'react';
import { Mail, X, RefreshCw, CheckCircle } from 'lucide-react';
import Alert from '@/components/ui/Alert';

export default function EmailVerificationBanner() {
  const [isVerified, setIsVerified] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (data.success && data.user) {
        setIsVerified(data.user.emailVerified || false);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setAlert(null);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST'
      });

      const data = await response.json();

      if (data.success) {
        setAlert({
          type: 'success',
          title: 'Code Sent!',
          message: data.message + (data.devOTP ? ` (Dev Code: ${data.devOTP})` : '')
        });
        setShowOTPInput(true);
      } else {
        setAlert({
          type: 'error',
          title: 'Failed to Send',
          message: data.message
        });
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setAlert({
        type: 'error',
        title: 'Invalid Code',
        message: 'Please enter a 6-digit verification code.'
      });
      return;
    }

    setIsVerifying(true);
    setAlert(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp })
      });

      const data = await response.json();

      if (data.success) {
        setAlert({
          type: 'success',
          title: 'Verified!',
          message: data.message
        });
        
        // Hide banner after successful verification
        setTimeout(() => {
          setIsVerified(true);
          setShowBanner(false);
          window.location.reload(); // Refresh to update UI
        }, 2000);
      } else {
        setAlert({
          type: 'error',
          title: 'Verification Failed',
          message: data.message
        });
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOTP(value);
  };

  // Don't show banner if email is verified or user dismissed it
  if (isVerified || !showBanner) {
    return null;
  }

  return (
    <div className="mb-6">
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
        />
      )}

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-amber-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-amber-900 mb-1">
              Verify Your Email Address
            </h3>
            <p className="text-sm text-amber-700 mb-3">
              Please enter the 6-digit verification code sent to your email. 
              Some features may be limited until you verify your email.
            </p>
            
            {showOTPInput ? (
              <form onSubmit={handleVerifyOTP} className="space-y-3">
                <div>
                  <label htmlFor="otp" className="block text-xs font-medium text-amber-800 mb-1">
                    Enter Verification Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={handleOTPChange}
                      placeholder="000000"
                      className="flex-1 px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center text-lg font-mono tracking-widest"
                      maxLength={6}
                      pattern="\d{6}"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isVerifying || otp.length !== 6}
                      className="px-6 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Verify
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-amber-600 mt-1">
                    Code expires in 10 minutes
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="text-xs text-amber-700 hover:text-amber-900 underline"
                >
                  {isResending ? 'Sending...' : 'Resend Code'}
                </button>
              </form>
            ) : (
              <button
                onClick={handleResendOTP}
                disabled={isResending}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Verification Code
                  </>
                )}
              </button>
            )}
          </div>

          <button
            onClick={() => setShowBanner(false)}
            className="text-amber-600 hover:text-amber-800 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
