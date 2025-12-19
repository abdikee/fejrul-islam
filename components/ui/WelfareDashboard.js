'use client';

import { useState } from 'react';
import { studentWelfareData, departments } from '@/data/welfare';
import { Users, Search, Filter, AlertCircle, CheckCircle, AlertTriangle, Mail, Phone } from 'lucide-react';

const statusConfig = {
  green: {
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
    text: 'text-emerald-700',
    icon: CheckCircle,
    label: 'Good Standing'
  },
  yellow: {
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    text: 'text-amber-700',
    icon: AlertTriangle,
    label: 'Needs Attention'
  },
  red: {
    bg: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-700',
    icon: AlertCircle,
    label: 'Urgent'
  }
};

const WelfareDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = studentWelfareData.filter(student => {
    const matchesDept = selectedDepartment === 'all' || student.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  const statusCounts = {
    green: studentWelfareData.filter(s => s.status === 'green').length,
    yellow: studentWelfareData.filter(s => s.status === 'yellow').length,
    red: studentWelfareData.filter(s => s.status === 'red').length
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-100 border-2 border-emerald-300 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">Good Standing</p>
              <p className="text-4xl font-bold text-emerald-800">{statusCounts.green}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
        </div>

        <div className="bg-amber-100 border-2 border-amber-300 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-700">Needs Attention</p>
              <p className="text-4xl font-bold text-amber-800">{statusCounts.yellow}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-amber-600" />
          </div>
        </div>

        <div className="bg-red-100 border-2 border-red-300 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-red-700">Urgent Care</p>
              <p className="text-4xl font-bold text-red-800">{statusCounts.red}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="green">✓ Good Standing</option>
              <option value="yellow">⚠ Needs Attention</option>
              <option value="red">⚠ Urgent</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600">
          Showing <span className="font-bold text-purple-600">{filteredStudents.length}</span> of <span className="font-bold">{studentWelfareData.length}</span> students
        </div>
      </div>

      {/* Student List */}
      <div className=\"space-y-4\">
        {filteredStudents.map((student) => {
          const statusInfo = statusConfig[student.status];
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={student.id}
              className={`bg-white rounded-xl shadow-md border-2 ${statusInfo.border} overflow-hidden hover:shadow-lg transition-shadow`}
            >
              <div className=\"p-6\">
                <div className=\"flex items-start justify-between\">
                  <div className=\"flex items-start gap-4 flex-1\">
                    {/* Status Indicator */}
                    <div className={`p-3 rounded-full ${statusInfo.bg}`}>
                      <StatusIcon className={`w-6 h-6 ${statusInfo.text}`} />
                    </div>

                    {/* Student Info */}
                    <div className=\"flex-1\">
                      <div className=\"flex items-start justify-between mb-3\">
                        <div>
                          <h3 className=\"text-xl font-bold text-slate-800\">{student.name}</h3>
                          <div className=\"flex items-center gap-3 mt-1 text-sm text-slate-600\">
                            <span>{student.department}</span>
                            <span>•</span>
                            <span>Year {student.year}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Metrics */}
                      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\">
                        <div className=\"bg-slate-50 p-3 rounded-lg\">
                          <p className=\"text-xs text-slate-600 mb-1\">Attendance Rate</p>
                          <div className=\"flex items-center gap-2\">
                            <div className=\"flex-1 bg-slate-200 rounded-full h-2\">
                              <div
                                className={`h-2 rounded-full ${
                                  student.attendance >= 80 ? 'bg-emerald-500' : 
                                  student.attendance >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${student.attendance}%` }}
                              ></div>
                            </div>
                            <span className=\"text-sm font-bold text-slate-800\">{student.attendance}%</span>
                          </div>
                        </div>

                        <div className=\"bg-slate-50 p-3 rounded-lg\">
                          <p className=\"text-xs text-slate-600 mb-1\">Last Contact</p>
                          <p className=\"text-sm font-semibold text-slate-800\">{student.lastContact}</p>
                        </div>

                        <div className=\"bg-slate-50 p-3 rounded-lg\">
                          <p className=\"text-xs text-slate-600 mb-1\">Contact</p>
                          <div className=\"flex items-center gap-2\">
                            <Mail className=\"w-4 h-4 text-slate-500\" />
                            <button className=\"text-sm text-blue-600 hover:underline\">
                              Email
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className=\"bg-slate-50 p-3 rounded-lg\">
                        <p className=\"text-xs font-semibold text-slate-700 mb-1\">Notes:</p>
                        <p className=\"text-sm text-slate-600\">{student.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredStudents.length === 0 && (
        <div className=\"text-center py-12 bg-white rounded-xl shadow-md border border-slate-200\">
          <Users className=\"w-16 h-16 text-slate-300 mx-auto mb-4\" />
          <h3 className=\"text-xl font-bold text-slate-800 mb-2\">No students found</h3>
          <p className=\"text-slate-600\">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default WelfareDashboard;
