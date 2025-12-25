'use client';

export default function PhoneVerification() {
  return null;
}
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