'use client';

import { useState } from 'react';
import { MessageCircle, Check, BookOpen, Users, Lightbulb } from 'lucide-react';
import PhoneNumberInput from '@/components/ui/PhoneNumberInput';

const DuatVettingForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    // Islamic Knowledge Assessment
    quranMemorization: '',
    arabicLevel: '',
    fiqhKnowledge: '',
    aqidahKnowledge: '',
    hadithFamiliarity: '',
    // Experience & Skills
    dawahExperience: '',
    publicSpeaking: '',
    languageSkills: [],
    previousTraining: '',
    // Motivation
    motivation: '',
    availability: [],
    specialInterests: [],
    // References
    reference1Name: '',
    reference1Contact: '',
    reference2Name: '',
    reference2Contact: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Duat Vetting Form submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border-2 border-blue-200">
        <div className="text-center">
          <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
            <Check className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Application Submitted!</h2>
          <p className="text-lg text-slate-600 mb-6">
            Thank you for applying to the <span className="font-bold text-blue-600">Idad Al-Duat Program</span>, {formData.fullName}!
          </p>
          <div className="bg-blue-50 p-6 rounded-lg mb-6 text-left">
            <h3 className="font-bold text-slate-800 mb-3">Next Steps:</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">1.</span>
                <span>Your application will be reviewed by the Dawah committee within 5-7 days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">2.</span>
                <span>We will contact your references to verify your Islamic knowledge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">3.</span>
                <span>Shortlisted candidates will be invited for an interview</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">4.</span>
                <span>Selected participants will receive the training schedule via email</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-slate-600">
            Confirmation email sent to <strong>{formData.email}</strong>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-t-xl">
        <div className="flex items-center gap-4 mb-4">
          <MessageCircle className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold">Idad Al-Duat Vetting Form</h1>
            <p className="text-blue-100">Caller to Islam Training Program Application</p>
          </div>
        </div>
        <p className="text-blue-100">
          This program trains students in the art of dawah, dialogue, and intellectual defense of Islam. Applicants must demonstrate basic Islamic knowledge and commitment to outreach.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-b-xl shadow-lg border-x border-b border-slate-200 space-y-8">
        
        {/* Personal Information */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
              <PhoneNumberInput
                value={formData.phone}
                onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                required
                defaultCountry="ET"
                selectClassName="h-12 px-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                inputClassName="w-full h-12 px-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Department *</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Islamic Knowledge Assessment */}
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Islamic Knowledge Assessment
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Quran Memorization Status *</label>
              <select
                name="quranMemorization"
                value={formData.quranMemorization}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Status</option>
                <option value="juz30">Juz Amma (Last Juz)</option>
                <option value="juz1-5">1-5 Juz</option>
                <option value="juz6-15">6-15 Juz</option>
                <option value="juz16-30">16-30 Juz (Hafiz)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Arabic Language Level *</label>
              <select
                name="arabicLevel"
                value={formData.arabicLevel}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Level</option>
                <option value="basic">Basic - Can read Arabic script</option>
                <option value="intermediate">Intermediate - Understand basic texts</option>
                <option value="advanced">Advanced - Fluent in reading/writing</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Fiqh Knowledge *</label>
                <select
                  name="fiqhKnowledge"
                  value={formData.fiqhKnowledge}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Rate</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Aqidah Knowledge *</label>
                <select
                  name="aqidahKnowledge"
                  value={formData.aqidahKnowledge}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Rate</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Hadith Familiarity *</label>
                <select
                  name="hadithFamiliarity"
                  value={formData.hadithFamiliarity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Rate</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Experience & Skills */}
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            Experience & Skills
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Previous Dawah Experience</label>
              <textarea
                name="dawahExperience"
                value={formData.dawahExperience}
                onChange={handleChange}
                rows="3"
                placeholder="Describe any previous dawah activities, interfaith dialogues, or outreach work..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Public Speaking Comfort Level *</label>
              <select
                name="publicSpeaking"
                value={formData.publicSpeaking}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Level</option>
                <option value="uncomfortable">Uncomfortable - Nervous speaking publicly</option>
                <option value="moderate">Moderate - Can speak with preparation</option>
                <option value="confident">Confident - Comfortable public speaker</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Language Skills (Check all that apply)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['English', 'Arabic', 'Amharic', 'Oromo'].map(lang => (
                  <label key={lang} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.languageSkills.includes(lang)}
                      onChange={() => handleCheckboxChange('languageSkills', lang)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-slate-700">{lang}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Motivation & Availability */}
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Motivation & Commitment</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Why do you want to join Idad Al-Duat? *</label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Share your motivation and goals for joining this dawah training program..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Weekly Availability (Select all that apply) *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Weekday Evenings', 'Weekend Mornings', 'Weekend Afternoons', 'Friday After Jumuah'].map(time => (
                  <label key={time} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(time)}
                      onChange={() => handleCheckboxChange('availability', time)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-slate-700 text-sm">{time}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Special Interests in Dawah</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Interfaith Dialogue', 'Atheism Response', 'Social Media Dawah', 'Campus Outreach', 'Revert Support', 'Comparative Religion'].map(interest => (
                  <label key={interest} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.specialInterests.includes(interest)}
                      onChange={() => handleCheckboxChange('specialInterests', interest)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-slate-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* References */}
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">References</h2>
          <p className="text-slate-600 mb-4">Please provide two references who can attest to your Islamic knowledge and character</p>
          
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="font-bold text-slate-800 mb-4">Reference 1 *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="reference1Name"
                  value={formData.reference1Name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="reference1Contact"
                  value={formData.reference1Contact}
                  onChange={handleChange}
                  required
                  placeholder="Email or Phone"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="font-bold text-slate-800 mb-4">Reference 2 *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="reference2Name"
                  value={formData.reference2Name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="reference2Contact"
                  value={formData.reference2Contact}
                  onChange={handleChange}
                  required
                  placeholder="Email or Phone"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="border-t pt-8">
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-slate-700">
              <strong>Note:</strong> By submitting this form, you acknowledge that the information provided is accurate and complete. You understand that acceptance into the program is subject to verification of your references and an interview process.
            </p>
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default DuatVettingForm;
