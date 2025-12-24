'use client';

import { useState, useEffect } from 'react';
import { 
  User, Bell, Shield, Palette, Globe, Moon, Sun,
  Save, Eye, EyeOff, Camera, Mail, Phone, MapPin, Calendar,
  Lock, Key, Download, AlertCircle, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import DashboardPageLayout, { useDashboard } from '@/components/dashboard/DashboardPageLayout';
import PhoneNumberInput from '@/components/ui/PhoneNumberInput';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

function SettingsContent() {
  const { user, genderColors } = useDashboard();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const { toasts, removeToast, success, error } = useToast();
  const [settings, setSettings] = useState({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      location: '',
      bio: ''
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      courseUpdates: true,
      announcements: true,
      reminders: true,
      weeklyDigest: false
    },
    privacy: {
      profileVisibility: 'students',
      showProgress: true,
      showAchievements: true,
      allowMessages: true
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'Africa/Addis_Ababa',
      dateFormat: 'DD/MM/YYYY',
      autoSave: true
    }
  });

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || ''
        }
      }));
    }
  }, [user]);

  const handleSave = async (section) => {
    try {
      console.log(`Saving ${section} settings:`, settings[section]);
      success('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      error('Failed to save settings. Please try again.');
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette }
  ];

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        activeTab === tab.id
                          ? `bg-${genderColors.primary}-100 text-${genderColors.primary}-700`
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">Profile Information</h2>
                    <button
                      onClick={() => handleSave('profile')}
                      className={`flex items-center gap-2 px-4 py-2 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors`}
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>

                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <div className={`w-24 h-24 bg-gradient-to-br from-${genderColors.primary}-400 to-${genderColors.secondary}-500 rounded-full flex items-center justify-center`}>
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Profile Picture</h3>
                      <button className={`flex items-center gap-2 px-4 py-2 border border-${genderColors.primary}-300 text-${genderColors.primary}-600 rounded-xl hover:bg-${genderColors.primary}-50 transition-colors`}>
                        <Camera className="w-4 h-4" />
                        Change Photo
                      </button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={settings.profile.firstName}
                        onChange={(e) => updateSetting('profile', 'firstName', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={settings.profile.lastName}
                        onChange={(e) => updateSetting('profile', 'lastName', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <PhoneNumberInput
                        value={settings.profile.phone}
                        onChange={(phone) => updateSetting('profile', 'phone', phone)}
                        defaultCountry="ET"
                        selectClassName="h-12 px-3 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        inputClassName="w-full h-12 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        aria-label="Phone number"
                      />
                      {user?.phone && !user?.phone_verified && (
                        <div className="mt-2">
                          <Link
                            href="/auth/verify-phone"
                            className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
                          >
                            <AlertCircle className="w-4 h-4" />
                            Verify your phone number
                          </Link>
                        </div>
                      )}
                      {user?.phone_verified && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                          <CheckCircle className="w-4 h-4" />
                          Phone number verified
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="date"
                          value={settings.profile.dateOfBirth}
                          onChange={(e) => updateSetting('profile', 'dateOfBirth', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          value={settings.profile.location}
                          onChange={(e) => updateSetting('profile', 'location', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                    <textarea
                      value={settings.profile.bio}
                      onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">Notification Preferences</h2>
                    <button
                      onClick={() => handleSave('notifications')}
                      className={`flex items-center gap-2 px-4 py-2 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors`}
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                        <div>
                          <h3 className="font-medium text-slate-800 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {key === 'emailNotifications' && 'Receive notifications via email'}
                            {key === 'pushNotifications' && 'Receive push notifications on your device'}
                            {key === 'courseUpdates' && 'Get notified about course updates and new content'}
                            {key === 'announcements' && 'Receive important announcements'}
                            {key === 'reminders' && 'Get reminders for upcoming classes and deadlines'}
                            {key === 'weeklyDigest' && 'Receive a weekly summary of your progress'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${genderColors.primary}-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-${genderColors.primary}-600`}></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy & Security Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">Privacy & Security</h2>
                    <button
                      onClick={() => handleSave('privacy')}
                      className={`flex items-center gap-2 px-4 py-2 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors`}
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>

                  {/* Password Change */}
                  <div className="p-6 border border-slate-200 rounded-xl">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      <button className={`px-4 py-2 bg-${genderColors.secondary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.secondary}-700 transition-colors`}>
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                      <div>
                        <h3 className="font-medium text-slate-800">Profile Visibility</h3>
                        <p className="text-sm text-slate-600">Who can see your profile information</p>
                      </div>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="public">Everyone</option>
                        <option value="students">Students Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    {Object.entries(settings.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                        <div>
                          <h3 className="font-medium text-slate-800 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {key === 'showProgress' && 'Display your learning progress to others'}
                            {key === 'showAchievements' && 'Show your achievements and badges'}
                            {key === 'allowMessages' && 'Allow other students to send you messages'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => updateSetting('privacy', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${genderColors.primary}-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-${genderColors.primary}-600`}></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences Settings */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">Preferences</h2>
                    <button
                      onClick={() => handleSave('preferences')}
                      className={`flex items-center gap-2 px-4 py-2 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors`}
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateSetting('preferences', 'theme', 'light')}
                          className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-colors ${
                            settings.preferences.theme === 'light'
                              ? `border-${genderColors.primary}-500 bg-${genderColors.primary}-50`
                              : 'border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <Sun className="w-5 h-5" />
                          Light
                        </button>
                        <button
                          onClick={() => updateSetting('preferences', 'theme', 'dark')}
                          className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-colors ${
                            settings.preferences.theme === 'dark'
                              ? `border-${genderColors.primary}-500 bg-${genderColors.primary}-50`
                              : 'border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <Moon className="w-5 h-5" />
                          Dark
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <select
                          value={settings.preferences.language}
                          onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="en">English</option>
                          <option value="ar">العربية</option>
                          <option value="am">አማርኛ</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                      <select
                        value={settings.preferences.timezone}
                        onChange={(e) => updateSetting('preferences', 'timezone', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="Africa/Addis_Ababa">East Africa Time (EAT)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="Europe/London">GMT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
                      <select
                        value={settings.preferences.dateFormat}
                        onChange={(e) => updateSetting('preferences', 'dateFormat', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                    <div>
                      <h3 className="font-medium text-slate-800">Auto-save Progress</h3>
                      <p className="text-sm text-slate-600">Automatically save your progress while learning</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.preferences.autoSave}
                        onChange={(e) => updateSetting('preferences', 'autoSave', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${genderColors.primary}-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-${genderColors.primary}-600`}></div>
                    </label>
                  </div>

                  {/* Data Export */}
                  <div className="p-6 border border-slate-200 rounded-xl">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Data Export</h3>
                    <p className="text-slate-600 mb-4">Download your learning data and progress reports</p>
                    <button className={`flex items-center gap-2 px-4 py-2 border border-${genderColors.primary}-300 text-${genderColors.primary}-600 rounded-xl hover:bg-${genderColors.primary}-50 transition-colors`}>
                      <Download className="w-4 h-4" />
                      Export My Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function StudentSettings() {
  return (
    <DashboardPageLayout 
      title="Settings" 
      subtitle="Manage your account and preferences"
    >
      <SettingsContent />
    </DashboardPageLayout>
  );
}
