'use client';

import { useState } from 'react';
import { 
  Mic, 
  Video, 
  Upload, 
  MessageSquare, 
  Star, 
  Clock, 
  User,
  Play,
  Download,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const IdadStudio = ({ userId, userRole }) => {
  const [activeTab, setActiveTab] = useState('submissions');

  // Mock data - in production, fetch from backend
  const submissions = [
    {
      id: 1,
      type: 'khutbah',
      title: 'Friday Khutbah: The Importance of Seeking Knowledge',
      submittedAt: '2025-01-18',
      status: 'reviewed',
      score: 85,
      feedback: 'Excellent content and structure. Work on voice modulation and eye contact.',
      instructor: 'Sheikh Abdullah Omar',
      duration: '12:30'
    },
    {
      id: 2,
      type: 'quran',
      title: 'Surah Al-Baqarah (Verses 1-10)',
      submittedAt: '2025-01-15',
      status: 'pending',
      instructor: 'Qari Yusuf Ahmed',
      duration: '8:45'
    },
    {
      id: 3,
      type: 'khutbah',
      title: 'Community Service in Islam',
      submittedAt: '2025-01-12',
      status: 'reviewed',
      score: 78,
      feedback: 'Good message delivery. Focus on clearer pronunciation and slower pace.',
      instructor: 'Sheikh Abdullah Omar',
      duration: '15:20'
    }
  ];

  const assignments = [
    {
      id: 1,
      title: 'Weekly Khutbah Practice',
      description: 'Prepare and record a 10-15 minute khutbah on "Youth and Technology in Islam"',
      dueDate: '2025-01-25',
      type: 'khutbah',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Tajweed Assessment',
      description: 'Record recitation of Surah Al-Mulk with proper tajweed rules',
      dueDate: '2025-01-28',
      type: 'quran',
      priority: 'medium'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'reviewed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Video className="w-6 h-6 text-purple-600" />
          Idad Practice Studio
        </h3>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'submissions'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            My Submissions
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'assignments'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Assignments
          </button>
        </div>
      </div>

      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {/* Upload Section */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200 mb-6">
            <h4 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Record & Upload New Submission
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 p-4 bg-white border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition-colors">
                <Video className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <div className="font-semibold text-purple-800">Record Khutbah</div>
                  <div className="text-sm text-purple-600">Video submission for sermon practice</div>
                </div>
              </button>
              
              <button className="flex items-center justify-center gap-3 p-4 bg-white border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition-colors">
                <Mic className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <div className="font-semibold text-purple-800">Record Quran</div>
                  <div className="text-sm text-purple-600">Audio submission for recitation</div>
                </div>
              </button>
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      {submission.type === 'khutbah' ? (
                        <Video className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Mic className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-800 mb-1">
                        {submission.title}
                      </h5>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {submission.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {submission.instructor}
                        </span>
                        <span>Submitted: {submission.submittedAt}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(submission.status)}
                    <span className="text-sm font-medium text-slate-600 capitalize">
                      {submission.status}
                    </span>
                  </div>
                </div>

                {submission.status === 'reviewed' && (
                  <div className="bg-slate-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-700">Feedback & Score</span>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        <span className={`text-xl font-bold ${getScoreColor(submission.score)}`}>
                          {submission.score}/100
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {submission.feedback}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    <Play className="w-4 h-4" />
                    View Submission
                  </button>
                  {submission.status === 'reviewed' && (
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                      <Download className="w-4 h-4" />
                      Download Feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-semibold text-slate-800 mb-2">
                    {assignment.title}
                  </h5>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                    {assignment.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-4 h-4" />
                      Due: {assignment.dueDate}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      assignment.priority === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : assignment.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {assignment.priority} priority
                    </span>
                  </div>
                </div>
                
                <div className="p-2 bg-purple-100 rounded-lg">
                  {assignment.type === 'khutbah' ? (
                    <Video className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Mic className="w-5 h-5 text-purple-600" />
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  Start Recording
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}

          {assignments.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-600 mb-2">No Active Assignments</h4>
              <p className="text-slate-500">Check back later for new practice assignments from your instructors.</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-sm text-slate-600">Total Submissions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">82</div>
            <div className="text-sm text-slate-600">Average Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">2</div>
            <div className="text-sm text-slate-600">Pending Review</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdadStudio;