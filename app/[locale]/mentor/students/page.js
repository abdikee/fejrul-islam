'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, Search, Filter, Mail, Phone, Calendar, 
  TrendingUp, BookOpen, MessageSquare, MoreVertical,
  Download, UserPlus
} from 'lucide-react';
import MentorPageTemplate from '@/components/mentor/MentorPageTemplate';
import notify from '@/lib/notify';
import { usePrompt } from '@/components/ui/PromptProvider';

export default function MyStudents() {
  const promptDialog = usePrompt();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const assignStudent = async () => {
    const studentEmail = await promptDialog({
      title: 'Assign Student',
      description: 'Enter student email to assign:',
      confirmText: 'Assign',
      cancelText: 'Cancel',
      placeholder: 'student@example.com',
    });
    if (!studentEmail) return;

    try {
      const response = await fetch('/api/mentor/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ studentEmail })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to assign student');
      }

      notify.success('Student assigned successfully');

      // Refresh list
      const studentsResponse = await fetch('/api/mentor/students', { credentials: 'include' });
      const studentsData = await studentsResponse.json();
      if (studentsData.success) setStudents(studentsData.students);
    } catch (err) {
      console.error('Assign student error:', err);
      notify.error(err?.message || 'Failed to assign student');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const studentsResponse = await fetch('/api/mentor/students');
        const studentsData = await studentsResponse.json();
        
        if (studentsData.success) {
          setStudents(studentsData.students);
        } else {
          throw new Error('Failed to fetch students');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch students');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <MentorPageTemplate
      title="My Students"
      description="Manage and track your students' progress"
      icon={Users}
      loading={loading}
      error={error}
      actions={
        <button
          onClick={assignStudent}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Student
        </button>
      }
    >
      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-6 border border-green-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Students</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{student.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{student.name}</h3>
                  <p className="text-sm text-slate-600">{student.email}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Progress</span>
                <span className="text-sm font-bold text-green-600">{student.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Active Courses</span>
                <span className="text-sm font-bold text-slate-800">{student.courses}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
              <Link
                href={`/mentor/students/${student.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-green-200">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No students found</p>
        </div>
      )}
    </MentorPageTemplate>
  );
}
