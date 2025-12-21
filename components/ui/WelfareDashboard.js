'use client';

import { useState, useMemo } from 'react';
import { studentWelfareData, departments } from '@/data/welfare';
import { Users, Search, Filter, AlertTriangle, CheckCircle, Clock, Mail, Phone } from 'lucide-react';

const WelfareDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter students based on department, search term, and status
  const filteredStudents = useMemo(() => {
    return studentWelfareData.filter(student => {
      const matchesDepartment = selectedDepartment === 'All' || student.department === selectedDepartment;
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
      
      return matchesDepartment && matchesSearch && matchesStatus;
    });
  }, [selectedDepartment, searchTerm, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = studentWelfareData.length;
    const green = studentWelfareData.filter(s => s.status === 'green').length;
    const yellow = studentWelfareData.filter(s => s.status === 'yellow').length;
    const red = studentWelfareData.filter(s => s.status === 'red').length;
    const avgAttendance = Math.round(
      studentWelfareData.reduce((sum, s) => sum + s.attendance, 0) / total
    );

    return { total, green, yellow, red, avgAttendance };
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'green':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'yellow':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'red':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">Total Students</p>
              <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
            </div>
            <Users className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl shadow-md border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700">Good Standing</p>
              <p className="text-3xl font-bold text-green-800">{stats.green}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow-md border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-yellow-700">Need Check-in</p>
              <p className="text-3xl font-bold text-yellow-800">{stats.yellow}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-xl shadow-md border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-red-700">Urgent Care</p>
              <p className="text-3xl font-bold text-red-800">{stats.red}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">Avg Attendance</p>
              <p className="text-3xl font-bold text-blue-800">{stats.avgAttendance}%</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="green">Good Standing</option>
            <option value="yellow">Need Check-in</option>
            <option value="red">Urgent Care</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800">
            Student Welfare Overview ({filteredStudents.length} students)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Year</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Attendance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Last Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-slate-800">{student.name}</div>
                      <div className="text-sm text-slate-600">{student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{student.department}</td>
                  <td className="px-6 py-4 text-slate-700">Year {student.year}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(student.status)}`}>
                      {getStatusIcon(student.status)}
                      <span className="capitalize">{student.status === 'green' ? 'Good' : student.status === 'yellow' ? 'Check-in' : 'Urgent'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            student.attendance >= 80 ? 'bg-green-500' : 
                            student.attendance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{student.lastContact}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No students found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition-colors text-left">
            <AlertTriangle className="w-6 h-6 mb-2" />
            <div className="font-semibold">Follow Up Urgent Cases</div>
            <div className="text-sm text-purple-100">Contact {stats.red} students needing immediate attention</div>
          </button>
          <button className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition-colors text-left">
            <Clock className="w-6 h-6 mb-2" />
            <div className="font-semibold">Schedule Check-ins</div>
            <div className="text-sm text-purple-100">Arrange meetings with {stats.yellow} students</div>
          </button>
          <button className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition-colors text-left">
            <Users className="w-6 h-6 mb-2" />
            <div className="font-semibold">Generate Report</div>
            <div className="text-sm text-purple-100">Export welfare data for leadership review</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelfareDashboard;