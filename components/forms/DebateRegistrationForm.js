'use client';

import { useState } from 'react';
import { MessageSquare, Check, Brain, Target, Award } from 'lucide-react';
import { debateTopics } from '@/data/library';
import PhoneNumberInput from '@/components/ui/PhoneNumberInput';

const DebateRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    selectedTopic: '',
    position: '', // 'for' or 'against'
    experience: '',
    logicSkills: '',
    researchAbility: '',
    argumentSample: '',
    teamPreference: 'solo',
    partnerName: '',
    partnerEmail: '',
    availability: []
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
    console.log('Debate Registration submitted:', formData);
    setSubmitted(true);
  };

  const selectedTopicData = debateTopics.find(t => t.id === parseInt(formData.selectedTopic));

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border-2 border-indigo-200">
        <div className="text-center">
          <div className="inline-flex p-4 bg-indigo-100 rounded-full mb-4">
            <Check className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Registration Confirmed!</h2>
          <p className="text-lg text-slate-600 mb-6">
            Welcome to the debate program, <span className="font-bold text-indigo-600">{formData.fullName}</span>!
          </p>
          <div className="bg-indigo-50 p-6 rounded-lg mb-6 text-left">
            <h3 className="font-bold text-slate-800 mb-3">Your Debate Details:</h3>
            <div className="space-y-2 text-slate-700">
              <p><strong>Topic:</strong> {selectedTopicData?.title}</p>
              <p><strong>Category:</strong> {selectedTopicData?.category}</p>
              <p><strong>Position:</strong> {formData.position === 'for' ? 'Supporting' : 'Opposing'}</p>
              <p><strong>Format:</strong> {formData.teamPreference === 'solo' ? 'Solo Debater' : 'Team Debate'}</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-amber-800 mb-2">📚 Preparation Resources</h4>
            <p className="text-sm text-amber-700">
              Check your email for debate preparation materials, evidence banks, and logical argument frameworks.
            </p>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            Schedule and venue details will be sent to <strong>{formData.email}</strong> within 3 days.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8 rounded-t-xl">
        <div className="flex items-center gap-4 mb-4">
          <MessageSquare className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold">Debate Topics Registration</h1>
            <p className="text-indigo-100">Register for Intellectual Dialogue & Logical Discourse</p>
          </div>
        </div>
        <p className="text-indigo-100">
          Develop your skills in logic, evidence-based argumentation, and respectful discourse on contemporary issues.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-b-xl shadow-lg border-x border-b border-slate-200 space-y-8">
        
        {/* Personal Information */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
              <PhoneNumberInput
                value={formData.phone}
                onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                required
                defaultCountry="ET"
                selectClassName="h-12 px-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                inputClassName="w-full h-12 px-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Year of Study *</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
                <option value="graduate">Graduate</option>
              </select>
            </div>
          </div>
        </section>

        {/* Topic Selection */}
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-600" />
            Select Your Debate Topic
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Available Topics *</label>
              <div className="space-y-3">
                {debateTopics.map(topic => (
                  <label
                    key={topic.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.selectedTopic === topic.id.toString()
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedTopic"
                      value={topic.id}
                      checked={formData.selectedTopic === topic.id.toString()}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 mb-1">{topic.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{topic.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                            {topic.category}
                          </span>
                          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                            {topic.difficulty}
                          </span>
                          <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                            {topic.availableSlots} slots available
                          </span>
                        </div>
                      </div>
                      {formData.selectedTopic === topic.id.toString() && (
                        <Check className="w-6 h-6 text-indigo-600 ml-4 flex-shrink-0" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {formData.selectedTopic && (
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-indigo-900 mb-2">Required Skills for this topic:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTopicData?.skills.map(skill => (
                    <span key={skill} className="text-xs px-3 py-1 bg-white text-indigo-700 rounded-full border border-indigo-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Your Position *</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, position: 'for' }))}
                  className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                    formData.position === 'for'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  ✓ Supporting Position
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, position: 'against' }))}
                  className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                    formData.position === 'against'
                      ? 'border-rose-600 bg-rose-50 text-rose-700'
                      : 'border-slate-200 text-slate-700 hover:border-rose-300'
                  }`}
                >
                  ✗ Opposing Position
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Assessment */}
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600" />
            Skills & Experience
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Previous Debate Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Experience Level</option>
                <option value="none">No experience - First time</option>
                <option value="beginner">Beginner - 1-2 debates</option>
                <option value="intermediate">Intermediate - 3-5 debates</option>
                <option value="advanced">Advanced - 6+ debates</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Logic & Reasoning Skills *</label>
                <select
                  name="logicSkills"
                  value={formData.logicSkills}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Rate Yourself</option>
                  <option value="developing">Developing</option>
                  <option value="competent">Competent</option>
                  <option value="strong">Strong</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Research Ability *</label>
                <select
                  name="researchAbility"
                  value={formData.researchAbility}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Rate Yourself</option>
                  <option value="developing">Developing</option>
                  <option value="competent">Competent</option>
                  <option value="strong">Strong</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Sample Argument (250-500 words) *
              </label>
              <textarea
                name="argumentSample"
                value={formData.argumentSample}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Provide a brief argument on any topic to demonstrate your logical reasoning and writing skills..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">
                Current count: {formData.argumentSample.split(' ').filter(word => word.length > 0).length} words
              </p>
            </div>
          </div>
        </section>

        {/* Team Preference */}
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Team Preference</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Debate Format *</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, teamPreference: 'solo' }))}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.teamPreference === 'solo'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <h4 className="font-bold text-slate-800 mb-1">Solo Debater</h4>
                  <p className="text-sm text-slate-600">Debate independently</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, teamPreference: 'team' }))}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.teamPreference === 'team'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <h4 className="font-bold text-slate-800 mb-1">Team Debate</h4>
                  <p className="text-sm text-slate-600">Debate with a partner</p>
                </button>
              </div>
            </div>

            {formData.teamPreference === 'team' && (
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="font-bold text-slate-800 mb-4">Partner Information (Optional)</h3>
                <p className="text-sm text-slate-600 mb-4">If you have a preferred partner, provide their details. Otherwise, we'll match you.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="partnerName"
                    value={formData.partnerName}
                    onChange={handleChange}
                    placeholder="Partner's Full Name"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    name="partnerEmail"
                    value={formData.partnerEmail}
                    onChange={handleChange}
                    placeholder="Partner's Email"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Availability (Select all that apply) *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings', 'Weekend Mornings', 'Weekend Afternoons', 'Weekend Evenings'].map(time => (
                  <label key={time} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(time)}
                      onChange={() => handleCheckboxChange('availability', time)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-slate-700 text-sm">{time}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="border-t pt-8">
          <div className="bg-indigo-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-slate-700">
              <strong>Important:</strong> Debates will be conducted with respect, evidence-based arguments, and Islamic etiquette (Adab). All participants must commit to fair play and intellectual honesty.
            </p>
          </div>
          <button
            type="submit"
            disabled={!formData.selectedTopic || !formData.position || formData.availability.length === 0}
            className="w-full py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg hover:bg-indigo-700 transition-colors shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Register for Debate
          </button>
        </div>
      </form>
    </div>
  );
};

export default DebateRegistrationForm;
