'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Users, MessageCircle, BookMarked, Heart,
  GraduationCap, CheckCircle, Lock, ArrowRight, Clock,
  Award, TrendingUp, Target
} from 'lucide-react';
import Alert from '@/components/ui/Alert';
import DashboardPageLayout, { useDashboard } from '@/components/dashboard/DashboardPageLayout';

const sectorIcons = {
  'BookOpen': BookOpen,
  'Users': Users,
  'MessageCircle': MessageCircle,
  'BookMarked': BookMarked,
  'Heart': Heart
};

function SectorsContent() {
  const { user, genderColors } = useDashboard();
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState({
    motivation: '',
    studyHours: '',
    previousKnowledge: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch sectors
      const sectorsRes = await fetch('/api/sectors');
      const sectorsData = await sectorsRes.json();
      if (sectorsData.success) {
        setSectors(sectorsData.sectors);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to load sectors data'
      });
      setLoading(false);
    }
  };

  const handleEnrollClick = (sector) => {
    if (sector.is_enrolled) {
      // Navigate to sector page
      window.location.href = `/dashboard/sectors/${sector.code.toLowerCase()}`;
    } else {
      setSelectedSector(sector);
      setShowEnrollForm(true);
      setEnrollmentData({
        motivation: '',
        studyHours: '',
        previousKnowledge: ''
      });
    }
  };

  const handleEnrollment = async (e) => {
    e.preventDefault();
    setEnrolling(true);

    try {
      const response = await fetch(`/api/sectors/${selectedSector.id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollmentData)
      });

      const data = await response.json();

      if (data.success) {
        setAlert({
          type: 'success',
          title: 'Enrollment Successful!',
          message: `Welcome to ${selectedSector.name}! You have been enrolled in ${data.coursesEnrolled} courses.`
        });
        setShowEnrollForm(false);
        setSelectedSector(null);
        // Refresh data
        fetchData();
      } else {
        setAlert({
          type: 'error',
          title: 'Enrollment Failed',
          message: data.message || 'Failed to enroll in the sector'
        });
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'An error occurred during enrollment'
      });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-12 text-center">
        <div className={`w-16 h-16 border-4 border-${genderColors.primary}-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
        <p className="text-slate-600">Loading sectors...</p>
      </div>
    );
  }

  const enrolledSectors = sectors.filter(s => s.is_enrolled);
  const availableSectors = sectors.filter(s => !s.is_enrolled);

  return (
    <div className="container mx-auto px-4 lg:px-6 py-6">
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-6"
        />
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border-2 border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{sectors.length}</div>
                  <div className="text-sm text-slate-600">Total Sectors</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">{enrolledSectors.length}</div>
                  <div className="text-sm text-slate-600">Enrolled</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">{availableSectors.length}</div>
                  <div className="text-sm text-slate-600">Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enrolled Sectors */}
          {enrolledSectors.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">My Enrolled Sectors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledSectors.map((sector) => {
                  const Icon = sectorIcons[sector.icon] || BookOpen;
                  return (
                    <div
                      key={sector.id}
                      className="bg-white rounded-2xl border-2 border-emerald-300 shadow-lg overflow-hidden hover:shadow-xl transition-all"
                    >
                      <div className={`bg-gradient-to-r from-${sector.color}-500 to-${sector.color}-600 p-6 text-white`}>
                        <div className="flex items-center justify-between mb-3">
                          <Icon className="w-10 h-10" />
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{sector.name}</h3>
                        <p className="text-sm text-white/90">Enrolled</p>
                      </div>
                      <div className="p-6">
                        <p className="text-slate-600 text-sm mb-4 line-clamp-3">{sector.description}</p>
                        <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                          <span>{sector.level_count} Levels</span>
                          <span className="text-emerald-600 font-medium">{sector.sector_status}</span>
                        </div>
                        <Link
                          href="/dashboard/learning"
                          className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium block text-center"
                        >
                          Continue Learning →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Sectors */}
          {availableSectors.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                {enrolledSectors.length > 0 ? 'More Sectors to Explore' : 'Available Sectors'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableSectors.map((sector) => {
                  const Icon = sectorIcons[sector.icon] || BookOpen;
                  return (
                    <div
                      key={sector.id}
                      className="bg-white rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all"
                    >
                      <div className={`bg-gradient-to-r from-${sector.color}-500 to-${sector.color}-600 p-6 text-white`}>
                        <Icon className="w-10 h-10 mb-3" />
                        <h3 className="text-xl font-bold mb-2">{sector.name}</h3>
                        <p className="text-sm text-white/90">{sector.level_count} Levels Available</p>
                      </div>
                      <div className="p-6">
                        <p className="text-slate-600 text-sm mb-4 line-clamp-3">{sector.description}</p>
                        <div className="bg-slate-50 rounded-lg p-3 mb-4">
                          <p className="text-xs font-medium text-slate-700 mb-1">Focus Areas:</p>
                          <p className="text-xs text-slate-600 line-clamp-2">{sector.focus_areas}</p>
                        </div>
                        <button
                          onClick={() => handleEnrollClick(sector)}
                          className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition-colors font-medium"
                        >
                          Enroll Now →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

      {/* Enrollment Modal */}
      {showEnrollForm && selectedSector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Enroll in {selectedSector.name}</h2>
                <button
                  onClick={() => {
                    setShowEnrollForm(false);
                    setSelectedSector(null);
                  }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-700">{selectedSector.description}</p>
              </div>

              <form onSubmit={handleEnrollment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Why do you want to join this sector? *
                  </label>
                  <textarea
                    required
                    value={enrollmentData.motivation}
                    onChange={(e) => setEnrollmentData({...enrollmentData, motivation: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows="3"
                    placeholder="Share your motivation and goals..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    How many hours per week can you dedicate? *
                  </label>
                  <select
                    required
                    value={enrollmentData.studyHours}
                    onChange={(e) => setEnrollmentData({...enrollmentData, studyHours: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select hours...</option>
                    <option value="1-3">1-3 hours</option>
                    <option value="4-6">4-6 hours</option>
                    <option value="7-10">7-10 hours</option>
                    <option value="10+">10+ hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Previous Experience (Optional)
                  </label>
                  <textarea
                    value={enrollmentData.previousKnowledge}
                    onChange={(e) => setEnrollmentData({...enrollmentData, previousKnowledge: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows="2"
                    placeholder="Briefly describe your background..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={enrolling}
                    className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? 'Enrolling...' : 'Complete Enrollment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEnrollForm(false);
                      setSelectedSector(null);
                    }}
                    className="px-6 py-3 rounded-lg font-semibold bg-slate-200 hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SectorsPage() {
  return (
    <DashboardPageLayout 
      title="Islamic Study Sectors" 
      subtitle="Choose your learning path"
    >
      <SectorsContent />
    </DashboardPageLayout>
  );
}
