'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, BookOpen, ArrowLeft, Heart, Phone, Calendar, MapPin, Flower } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import PhoneNumberInput from '@/components/ui/PhoneNumberInput';

export default function FemaleSignupPage() {
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [shouldEnroll, setShouldEnroll] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    city: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });

  // Show enrollment notice if coming from sector page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    const enroll = params.get('enroll') === 'true';
    setRedirectUrl(redirect);
    setShouldEnroll(enroll);

    if (redirect && enroll) {
      setAlert({
        type: 'info',
        title: 'Register to Enroll',
        message: 'Complete registration to enroll in your selected sector.'
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null); // Clear any existing alerts
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setAlert({
        type: 'error',
        title: 'Password Mismatch',
        message: 'Passwords do not match. Please ensure both passwords are identical.'
      });
      return;
    }
    
    // Validate terms agreement
    if (!formData.agreeToTerms) {
      setAlert({
        type: 'warning',
        title: 'Terms Required',
        message: 'Please agree to the terms and conditions to continue.'
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          gender: 'female',
          department: null,
          academicYear: null
        })
      });

      const data = await response.json();

      if (data.success) {
        setAlert({
          type: 'success',
          title: 'Registration Successful!',
          message: data.requiresVerification
            ? 'Account created. Please verify your email to continue.'
            : (redirectUrl ? 'Redirecting to complete enrollment...' : 'Welcome to the Sisterhood! Redirecting to your dashboard...')
        });
        
        // Redirect to sector page for enrollment or dashboard
        setTimeout(() => {
          if (data.requiresVerification) {
            window.location.href = '/auth/verify-email';
          } else if (redirectUrl && shouldEnroll) {
            window.location.href = redirectUrl;
          } else {
            window.location.href = '/dashboard/female';
          }
        }, 1500);
      } else {
        setAlert({
          type: 'error',
          title: 'Registration Failed',
          message: data.message || 'Unable to complete registration. Please try again.'
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'An error occurred during registration. Please try again.'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
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
                <p className="text-xs text-slate-600">Sisters Registration</p>
              </div>
            </Link>
            <Link 
              href="/auth/signup" 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Selection</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-lg mx-auto">
          {/* Registration Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header with Islamic Pattern */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-8 text-white text-center relative">
              {/* Decorative Islamic Floral Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="floral-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                    <circle cx="12.5" cy="12.5" r="8" fill="none" stroke="white" strokeWidth="0.5" />
                    <path d="M12.5,4.5 Q16.5,8.5 12.5,12.5 Q8.5,8.5 12.5,4.5" fill="white" opacity="0.3" />
                    <path d="M20.5,12.5 Q16.5,16.5 12.5,12.5 Q16.5,8.5 20.5,12.5" fill="white" opacity="0.3" />
                    <path d="M12.5,20.5 Q8.5,16.5 12.5,12.5 Q16.5,16.5 12.5,20.5" fill="white" opacity="0.3" />
                    <path d="M4.5,12.5 Q8.5,8.5 12.5,12.5 Q8.5,16.5 4.5,12.5" fill="white" opacity="0.3" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#floral-pattern)" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Join the Sisterhood</h2>
                <p className="text-rose-100">Register as a Sister in Islam</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-8">
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                        placeholder="Fatima"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      placeholder="Hassan"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      placeholder="fatima.hassan@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone and Date of Birth */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <PhoneNumberInput
                      value={formData.phone}
                      onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                      required
                      defaultCountry="ET"
                      selectClassName="h-12 px-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      inputClassName="w-full h-12 px-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      aria-label="Phone number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-slate-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      placeholder="Your city"
                      required
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                        placeholder="Create a strong password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-slate-300 rounded mt-1"
                      required
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-slate-700">
                      I agree to the{' '}
                      <Link href="/terms" className="text-rose-600 hover:text-rose-700 underline">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-rose-600 hover:text-rose-700 underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      id="subscribeNewsletter"
                      name="subscribeNewsletter"
                      type="checkbox"
                      checked={formData.subscribeNewsletter}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-slate-300 rounded mt-1"
                    />
                    <label htmlFor="subscribeNewsletter" className="ml-2 block text-sm text-slate-700">
                      Subscribe to our newsletter for Islamic learning updates
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-rose-700 hover:to-rose-800 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Join the Sisterhood
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-center text-sm text-slate-600 mb-4">
                  Already have an account?
                </p>
                  <Link
                    href="/auth/login"
                  className="w-full block text-center py-3 px-4 border border-rose-600 text-rose-600 rounded-lg font-semibold hover:bg-rose-50 transition-colors"
                >
                  Sign In to Sisters Portal
                </Link>
              </div>

              {/* Islamic Quote */}
              <div className="mt-6 p-4 bg-rose-50 rounded-lg border border-rose-200">
                <p className="text-sm text-rose-800 text-center font-medium mb-1">
                  "الدُّنْيَا مَتَاعٌ وَخَيْرُ مَتَاعِ الدُّنْيَا الْمَرْأَةُ الصَّالِحَةُ"
                </p>
                <p className="text-xs text-rose-600 text-center italic">
                  "This world is green and beautiful, and Allah has appointed you as His stewards over it" - Hadith
                </p>
              </div>

              {/* Decorative Element */}
              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-2 text-rose-300">
                  <Flower className="w-4 h-4" />
                  <div className="w-8 h-px bg-rose-200"></div>
                  <Flower className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Links */}
          <div className="text-center mt-6 space-y-2">
            <Link href="/auth/signup/male" className="block text-sm text-slate-600 hover:text-slate-800">
              Register for Brothers Portal instead
            </Link>
            <Link href="/" className="block text-sm text-slate-500 hover:text-slate-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}