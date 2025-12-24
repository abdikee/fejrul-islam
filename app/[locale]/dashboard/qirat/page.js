'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, GraduationCap, FileText, ClipboardCheck, 
  Lock, CheckCircle, Award, TrendingUp, BookMarked,
  History, Scroll, Users, Lightbulb, Languages,
  Bell, Settings, Clock
} from 'lucide-react';
import Alert from '@/components/ui/Alert';
import DashboardPageLayout, { useDashboard } from '@/components/dashboard/DashboardPageLayout';

const categoryIcons = {
  'Aqida': Lightbulb,
  'Hadis': Scroll,
  'Musxalah': Users,
  'Fiqh': BookOpen,
  'Nahw': Languages,
  'Sira': History
};

const categoryColors = {
  'Aqida': 'bg-purple-100 text-purple-700 border-purple-300',
  'Hadis': 'bg-blue-100 text-blue-700 border-blue-300',
  'Musxalah': 'bg-green-100 text-green-700 border-green-300',
  'Fiqh': 'bg-amber-100 text-amber-700 border-amber-300',
  'Nahw': 'bg-rose-100 text-rose-700 border-rose-300',
  'Sira': 'bg-teal-100 text-teal-700 border-teal-300'
};

function QiratContent() {
  const { user, genderColors } = useDashboard();
  const router = useRouter();
  const [userProgress, setUserProgress] = useState(null);
  const [levels, setLevels] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
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
      // Fetch user progress
      const progressRes = await fetch('/api/qirat/progress');
      const progressData = await progressRes.json();
      if (progressData.success) {
        setUserProgress(progressData.progress);
        setSelectedLevel(progressData.progress.current_level);
      }

      // Fetch levels and books
      const levelsRes = await fetch('/api/qirat/levels');
      const levelsData = await levelsRes.json();
      if (levelsData.success) {
        setLevels(levelsData.levels);
        setBooks(levelsData.books);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to load course data'
      });
      setLoading(false);
    }
  };

  const isLevelLocked = (levelNumber) => {
    if (!userProgress) return levelNumber > 1;
    if (levelNumber === 1) return false;
    if (levelNumber === 2) return !userProgress.level_1_completed;
    if (levelNumber === 3) return !userProgress.level_2_completed;
    return false;
  };

  const getLevelBooks = (levelNumber) => {
    return books.filter(book => book.level_id === levelNumber);
  };

  const getProgressPercentage = () => {
    if (!userProgress) return 0;
    const currentBook = userProgress.current_book;
    return (currentBook / 10) * 100;
  };

  const handleEnrollment = async (e) => {
    e.preventDefault();
    setEnrolling(true);

    try {
      const response = await fetch('/api/qirat/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollmentData)
      });

      const data = await response.json();

      if (data.success) {
        setAlert({
          type: 'success',
          title: 'Enrollment Successful!',
          message: 'Welcome to the Qirat & Ilm Course System. You can now start your learning journey.'
        });
        setShowEnrollForm(false);
        // Refresh data to show enrolled status
        fetchData();
      } else {
        setAlert({
          type: 'error',
          title: 'Enrollment Failed',
          message: data.message || 'Failed to enroll in the course'
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
        <p className="text-slate-600">Loading Qirat & Ilm System...</p>
      </div>
    );
  }

  const currentLevelBooks = getLevelBooks(selectedLevel);

  return (
    <div className="container mx-auto px-4 lg:px-6 py-6">
      <div className="max-w-7xl mx-auto">

        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
            className="mb-6"
          />
        )}

        {/* Enrollment Form - Show if not enrolled */}
        {!userProgress && (
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-8 mb-6 text-white">
            <div className="text-center mb-6">
              <GraduationCap className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Enroll in Qirat & Ilm Course</h2>
              <p className="text-emerald-100">
                Begin your structured Islamic education journey with our comprehensive 3-level program
              </p>
            </div>

            {!showEnrollForm ? (
              <div className="text-center">
                <button
                  onClick={() => setShowEnrollForm(true)}
                  className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                >
                  Start Enrollment
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnrollment} className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Why do you want to join this course? *
                    </label>
                    <textarea
                      required
                      value={enrollmentData.motivation}
                      onChange={(e) => setEnrollmentData({...enrollmentData, motivation: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      rows="3"
                      placeholder="Share your motivation and goals..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      How many hours per week can you dedicate? *
                    </label>
                    <select
                      required
                      value={enrollmentData.studyHours}
                      onChange={(e) => setEnrollmentData({...enrollmentData, studyHours: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                      <option value="" className="text-slate-800">Select hours...</option>
                      <option value="1-3" className="text-slate-800">1-3 hours</option>
                      <option value="4-6" className="text-slate-800">4-6 hours</option>
                      <option value="7-10" className="text-slate-800">7-10 hours</option>
                      <option value="10+" className="text-slate-800">10+ hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Previous Islamic Studies Experience
                    </label>
                    <textarea
                      value={enrollmentData.previousKnowledge}
                      onChange={(e) => setEnrollmentData({...enrollmentData, previousKnowledge: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      rows="2"
                      placeholder="Briefly describe your background (optional)..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={enrolling}
                      className="flex-1 bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling ? 'Enrolling...' : 'Complete Enrollment'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEnrollForm(false)}
                      className="px-6 py-3 rounded-lg font-semibold bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Progress Overview */}
        {userProgress && (
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Your Progress</h2>
                <p className="text-slate-600">Level {userProgress.current_level} - Book {userProgress.current_book}/10</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-emerald-600">{Math.round(getProgressPercentage())}%</div>
                <p className="text-sm text-slate-600">Complete</p>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <CheckCircle className={`w-6 h-6 mx-auto mb-1 ${userProgress.level_1_completed ? 'text-emerald-600' : 'text-slate-400'}`} />
                <p className="text-sm font-medium">Level 1</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <CheckCircle className={`w-6 h-6 mx-auto mb-1 ${userProgress.level_2_completed ? 'text-emerald-600' : 'text-slate-400'}`} />
                <p className="text-sm font-medium">Level 2</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <CheckCircle className={`w-6 h-6 mx-auto mb-1 ${userProgress.level_3_completed ? 'text-emerald-600' : 'text-slate-400'}`} />
                <p className="text-sm font-medium">Level 3</p>
              </div>
            </div>
          </div>
        )}

        {/* Level Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {levels.map((level) => {
            const locked = isLevelLocked(level.level_number);
            const isActive = selectedLevel === level.level_number;
            
            return (
              <button
                key={level.id}
                onClick={() => !locked && setSelectedLevel(level.level_number)}
                disabled={locked}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  locked 
                    ? 'bg-slate-100 border-slate-300 cursor-not-allowed opacity-60' 
                    : isActive
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-600 text-white shadow-lg'
                    : 'bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-bold ${isActive ? 'text-white' : locked ? 'text-slate-500' : 'text-slate-800'}`}>
                    {level.level_name}
                  </h3>
                  {locked ? (
                    <Lock className="w-5 h-5 text-slate-500" />
                  ) : (
                    <Award className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                  )}
                </div>
                <p className={`text-sm ${isActive ? 'text-emerald-100' : locked ? 'text-slate-500' : 'text-slate-600'}`}>
                  {level.description}
                </p>
                {locked && (
                  <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Complete previous level to unlock
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Books Grid */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Level {selectedLevel} Books
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentLevelBooks.map((book) => {
              const Icon = categoryIcons[book.category] || BookOpen;
              const colorClass = categoryColors[book.category] || 'bg-slate-100 text-slate-700 border-slate-300';
              
              return (
                <button
                  key={book.id}
                  onClick={() => {
                    setSelectedBook(book);
                    setActiveTab('learning');
                  }}
                  className="p-4 border-2 border-slate-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${colorClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-500">Book {book.book_number}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>
                          {book.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                        {book.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Book Detail Modal would go here */}
        {selectedBook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">{selectedBook.title}</h2>
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-slate-600 mb-6">{selectedBook.description}</p>
                
                {/* Tabs for Learning, Assignments, Exams */}
                <div className="border-b border-slate-200 mb-6">
                  <div className="flex gap-4">
                    {['learning', 'assignments', 'exams'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-4 font-medium capitalize transition-colors ${
                          activeTab === tab
                            ? 'text-emerald-600 border-b-2 border-emerald-600'
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === 'learning' && (
                    <div className="prose max-w-none">
                      <p className="text-slate-600">Learning materials will be displayed here...</p>
                    </div>
                  )}
                  {activeTab === 'assignments' && (
                    <div>
                      <p className="text-slate-600">Assignments will be displayed here...</p>
                    </div>
                  )}
                  {activeTab === 'exams' && (
                    <div>
                      <p className="text-slate-600">Exams will be displayed here...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QiratPage() {
  return (
    <DashboardPageLayout 
      title="Qirat & Ilm Course System" 
      subtitle="Structured Islamic Education Program"
    >
      <QiratContent />
    </DashboardPageLayout>
  );
}
