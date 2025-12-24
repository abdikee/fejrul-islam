'use client';

import { useState, useEffect } from 'react';
import { Phone, Shield, CheckCircle, AlertCircle, Clock, Send } from 'lucide-react';
import PhoneNumberInput from '@/components/ui/PhoneNumberInput';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Alert from '@/components/ui/Alert';

export default function PhoneVerification({ 
  user, 
  onVerificationComplete, 
  initialPhone = '',
  showTitle = true,
  className = '' 
}) {
  const [step, setStep] = useState('phone'); // 'phone' or 'verify'
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || user?.phone || '');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const sendOTP = async () => {
    if (!phoneNumber) {
      setAlert({
        type: 'error',
        title: 'Phone Required',
        message: 'Please enter your phone number'
      });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const response = await fetch('/api/auth/send-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();

      if (data.success) {
        setStep('verify');
        setCountdown(60); // 1 minute cooldown
        setAttempts(prev => prev + 1);
        setAlert({
          type: 'success',
          title: 'Code Sent',
          message: `Verification code sent to ${data.phoneNumber}`,
          devOTP: data.devOTP // Show in development
        });
      } else {
        setAlert({
          type: 'error',
          title: 'Failed to Send',
          message: data.message
        });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to send verification code. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setAlert({
        type: 'error',
        title: 'Invalid Code',
        message: 'Please enter the complete 6-digit verification code'
      });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const response = await fetch('/api/auth/verify-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otpCode })
      });

      const data = await response.json();

      if (data.success) {
        setAlert({
          type: 'success',
          title: 'Verified!',
          message: 'Your phone number has been verified successfully'
        });
        
        // Call completion callback
        onVerificationComplete?.(data.phoneNumber);
        
        // Reset form
        setTimeout(() => {
          setStep('phone');
          setOtpCode('');
          setAlert(null);
        }, 2000);
      } else {
        setAlert({
          type: 'error',
          title: 'Verification Failed',
          message: data.message
        });
        
        // Clear OTP on error
        setOtpCode('');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to verify code. Please try again.'
      });
      setOtpCode('');
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden ${className}`}>
      {showTitle && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Phone Verification</h2>
              <p className="text-emerald-100">Secure your account with phone verification</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Alert Display */}
        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
            className="mb-6"
          >
            {alert.devOTP && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Development Mode:</strong> Use code: <code className="font-mono font-bold">{alert.devOTP}</code>
                </p>
              </div>
            )}
          </Alert>
        )}

        {step === 'phone' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <PhoneNumberInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                defaultCountry="ET"
                selectClassName="h-12 px-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                inputClassName="w-full h-12 px-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                aria-label="Phone number for verification"
              />
              <p className="text-xs text-slate-500 mt-1">
                We'll send a verification code to this number
              </p>
            </div>

            <button
              onClick={sendOTP}
              disabled={loading || !phoneNumber}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Verification Code
                </>
              )}
            </button>

            {user?.phone && user.phone !== phoneNumber && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Changing Phone Number</p>
                    <p className="text-xs text-blue-600 mt-1">
                      This will replace your current phone number ({user.phone}) and require verification.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Enter Verification Code</h3>
              <p className="text-slate-600">
                We sent a 6-digit code to <strong>{phoneNumber}</strong>
              </p>
            </div>

            <div className="flex justify-center">
              <InputOTP
                value={otpCode}
                onChange={setOtpCode}
                maxLength={6}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={verifyOTP}
                disabled={loading || otpCode.length !== 6}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Verify Phone Number
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => {
                    setStep('phone');
                    setOtpCode('');
                    setAlert(null);
                  }}
                  className="text-slate-600 hover:text-slate-800 transition-colors"
                >
                  ← Change Phone Number
                </button>

                {countdown > 0 ? (
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>Resend in {formatCountdown(countdown)}</span>
                  </div>
                ) : (
                  <button
                    onClick={sendOTP}
                    disabled={loading}
                    className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>

            {attempts > 1 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Multiple Attempts</p>
                    <p className="text-xs text-amber-600 mt-1">
                      If you continue having issues, please check your phone number or contact support.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}