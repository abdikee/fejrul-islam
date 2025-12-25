'use client';

import { useState } from 'react';
import { BookOpen, FileText, Check, AlertCircle } from 'lucide-react';

const CourseRegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    year: '',
    track: '', // 'quran' or 'kitab'
    // Quran Track
    tajweedLevel: '',
    memorization: '',
    // Kitab Track
    language: '', // 'amharic' or 'oromo'
    subject: '', // 'fiqh', 'aqidah', 'seerah'
    previousKnowledge: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send data to your API
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className=\"max-w-2xl mx-4 sm:mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-lg border-2 border-emerald-200\">
        <div className=\"text-center\">
          <div className=\"inline-flex p-4 bg-emerald-100 rounded-full mb-4\">
            <Check className=\"w-12 h-12 text-emerald-600\" />
          </div>
          <h2 className=\"text-3xl font-bold text-slate-800 mb-4\">Registration Successful!</h2>
          <p className=\"text-lg text-slate-600 mb-6\">
            Thank you for registering, <span className=\"font-bold text-emerald-600\">{formData.fullName}</span>!
          </p>
          <div className=\"bg-emerald-50 p-4 rounded-lg mb-6\">
            <p className=\"text-slate-700\">
              <strong>Track:</strong> {formData.track === 'quran' ? 'Quran Track' : 'Kitab Track'}
            </p>
            {formData.track === 'kitab' && (
              <>
                <p className=\"text-slate-700\">
                  <strong>Language:</strong> {formData.language}
                </p>
                <p className=\"text-slate-700\">
                  <strong>Subject:</strong> {formData.subject}
                </p>
              </>
            )}
          </div>
          <p className=\"text-slate-600\">
            You will receive a confirmation email at <strong>{formData.email}</strong> with course details within 24 hours.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                fullName: '',
                email: '',
                department: '',
                year: '',
                track: '',
                tajweedLevel: '',
                memorization: '',
                language: '',
                subject: '',
                previousKnowledge: ''
              });
              setStep(1);
            }}
            className=\"mt-6 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors\"
          >
            Register Another Student
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=\"max-w-3xl mx-auto px-4 sm:px-6\">
      {/* Progress Indicator */}
      <div className=\"mb-8\">
        <div className=\"flex items-center justify-between mb-2\">
          {[1, 2, 3].map((s) => (
            <div key={s} className=\"flex items-center\">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`h-1 w-8 sm:w-16 md:w-32 mx-2 ${
                  step > s ? 'bg-emerald-600' : 'bg-slate-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className=\"flex justify-between text-sm text-slate-600 px-2\">
          <span>Personal Info</span>
          <span>Track Selection</span>
          <span>Details</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className=\"bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border border-slate-200\">
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className=\"space-y-6\">
            <h2 className=\"text-2xl font-bold text-slate-800 mb-6\">Personal Information</h2>
            
            <div>
              <label className=\"block text-sm font-semibold text-slate-700 mb-2\">
                Full Name *
              </label>
              <input
                type=\"text\"
                name=\"fullName\"
                value={formData.fullName}
                onChange={handleChange}
                required
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent\"
                placeholder=\"Enter your full name\"
              />
            </div>

            <div>
              <label className=\"block text-sm font-semibold text-slate-700 mb-2\">
                Email Address *
              </label>
              <input
                type=\"email\"
                name=\"email\"
                value={formData.email}
                onChange={handleChange}
                required
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent\"
                placeholder=\"your.email@example.com\"
              />
            </div>

            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
              <div>
                <label className=\"block text-sm font-semibold text-slate-700 mb-2\">
                  Department *
                </label>
                <select
                  name=\"department\"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent\"
                >
                  <option value=\"\">Select Department</option>
                  <option value=\"Computer Science\">Computer Science</option>
                  <option value=\"Engineering\">Engineering</option>
                  <option value=\"Medicine\">Medicine</option>
                  <option value=\"Agriculture\">Agriculture</option>
                  <option value=\"Business\">Business Administration</option>
                  <option value=\"Education\">Education</option>
                  <option value=\"Natural Sciences\">Natural Sciences</option>
                  <option value=\"Social Sciences\">Social Sciences</option>
                </select>
              </div>

              <div>
                <label className=\"block text-sm font-semibold text-slate-700 mb-2\">
                  Year of Study *
                </label>
                <select
                  name=\"year\"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent\"
                >
                  <option value=\"\">Select Year</option>
                  <option value=\"1\">1st Year</option>
                  <option value=\"2\">2nd Year</option>
                  <option value=\"3\">3rd Year</option>
                  <option value=\"4\">4th Year</option>
                  <option value=\"5\">5th Year</option>
                  <option value=\"graduate\">Graduate</option>
                </select>
              </div>
            </div>

            <button
              type=\"button\"
              onClick={() => setStep(2)}
              disabled={!formData.fullName || !formData.email || !formData.department || !formData.year}
              className=\"w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed\"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Track Selection */}
        {step === 2 && (
          <div className=\"space-y-6\">
            <h2 className=\"text-2xl font-bold text-slate-800 mb-6\">Choose Your Learning Track</h2>
            
            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
              <button
                type=\"button\"
                onClick={() => {
                  setFormData(prev => ({ ...prev, track: 'quran' }));
                  setStep(3);
                }}
                className={`p-6 border-2 rounded-xl transition-all hover:shadow-lg ${
                  formData.track === 'quran'
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <BookOpen className=\"w-12 h-12 text-emerald-600 mx-auto mb-4\" />
                <h3 className=\"text-xl font-bold text-slate-800 mb-2\">Quran Track</h3>
                <p className=\"text-slate-600 text-sm\">
                  Focus on Tajweed, Recitation, Memorization, and Tadabbur
                </p>
              </button>

              <button
                type=\"button\"
                onClick={() => {
                  setFormData(prev => ({ ...prev, track: 'kitab' }));
                  setStep(3);
                }}
                className={`p-6 border-2 rounded-xl transition-all hover:shadow-lg ${
                  formData.track === 'kitab'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <FileText className=\"w-12 h-12 text-blue-600 mx-auto mb-4\" />
                <h3 className=\"text-xl font-bold text-slate-800 mb-2\">Kitab Track</h3>
                <p className=\"text-slate-600 text-sm\">
                  Study Fiqh, Aqidah, Seerah in Amharic or Oromo
                </p>
              </button>
            </div>

            <button
              type=\"button\"
              onClick={() => setStep(1)}
              className=\"w-full py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors\"
            >
              Back
            </button>
          </div>
        )}

        {/* Step 3: Track Details */}
        {step === 3 && (
          <div className=\"space-y-6\">
            {formData.track === 'quran' ? (
              <>
                <h2 className=\"text-2xl font-bold text-slate-800 mb-6\">Quran Track Details</h2>
                
                <div>
                  <label className=\"block text-sm font-semibold text-slate-700 mb-2\">
                    Current Tajweed Level *
                  </label>
                  <select
                    name=\"tajweedLevel\"
                    value={formData.tajweedLevel}
                    onChange={handleChange}
                    required
                    className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent\"
                  >
                    <option value=\"\">Select Level</option>
                    <option value=\"beginner\">Beginner - Learning basics</option>
                    <option value=\"intermediate\">Intermediate - Can recite with rules</option>
                    <option value=\"advanced\">Advanced - Mastering beautification</option>
                  </select>
                </div>

                <div>
                  <label className=\"block text-sm font-semibold text-slate-700 mb-2\">
                    Memorization Status *
                  </label>
                  <select
                    name=\"memorization\"
                    value={formData.memorization}
                    onChange={handleChange}
                    required
                    className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent\"
                  >
                    <option value=\"\">Select Status</option>
                    <option value=\"none\">Not started</option>
                    <option value=\"juz1-3\">1-3 Juz</option>
                    <option value=\"juz4-10\">4-10 Juz</option>
                    <option value=\"juz11-20\">11-20 Juz</option>
                    <option value=\"juz21-30\">21-30 Juz (Hafiz)</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <h2 className=\"text-2xl font-bold text-slate-800 mb-6\">Kitab Track Details</h2>
                
                <div>
                  <label className=\"block text-sm font-semibold text-slate-700 mb-2\">
                    Preferred Language *
                  </label>
                  <div className=\"grid grid-cols-2 gap-4\">
                    <button
                      type=\"button\"
                      onClick={() => setFormData(prev => ({ ...prev, language: 'amharic' }))}
                      className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                        formData.language === 'amharic'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      Amharic
                    </button>
                    <button
                      type=\"button\"
                      onClick={() => setFormData(prev => ({ ...prev, language: 'oromo' }))}
                      className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                        formData.language === 'oromo'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      Oromo
                    </button>
                  </div>
                </div>

                <div>
                  <label className=\"block text-sm font-semibold text-slate-700 mb-2\">
                    Subject Area *
                  </label>
                  <select
                    name=\"subject\"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
                  >
                    <option value=\"\">Select Subject</option>
                    <option value=\"fiqh\">Fiqh (Islamic Jurisprudence)</option>
                    <option value=\"aqidah\">Aqidah (Islamic Creed)</option>
                    <option value=\"seerah\">Seerah (Prophetic Biography)</option>
                    <option value=\"hadith\">Hadith Studies</option>
                    <option value=\"tafsir\">Tafsir (Quranic Exegesis)</option>
                  </select>
                </div>

                <div>
                  <label className=\"block text-sm font-semibold text-slate-700 mb-2\">
                    Previous Islamic Knowledge
                  </label>
                  <textarea
                    name=\"previousKnowledge\"
                    value={formData.previousKnowledge}
                    onChange={handleChange}
                    rows=\"3\"
                    className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
                    placeholder=\"Briefly describe your prior Islamic education (optional)\"
                  ></textarea>
                </div>
              </>
            )}

            <div className=\"flex gap-4\">
              <button
                type=\"button\"
                onClick={() => setStep(2)}
                className=\"flex-1 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors\"
              >
                Back
              </button>
              <button
                type=\"submit\"
                disabled={
                  formData.track === 'quran' 
                    ? !formData.tajweedLevel || !formData.memorization
                    : !formData.language || !formData.subject
                }
                className=\"flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed\"
              >
                Submit Registration
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CourseRegistrationForm;
