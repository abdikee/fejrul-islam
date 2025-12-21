'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  FileCheck, 
  BookOpen, 
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
  Award,
  Heart,
  CheckCircle
} from 'lucide-react';

export default function MentorOverview({ user }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingSubmissions: 0,
    activeAssignments: 0,
    upcomingSessions: 0,
    messagesUnread: 0,
    completionRate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentorStats();
    fetchRecentActivity();
  }, []);

  const fetchMentorStats = async () => {
    try {
      const response = await fetch('/api/mentor/stats', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching mentor stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/mentor/activity', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setRecentActivity(data.activities);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'My Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+2 this month'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingSubmissions,
      icon: FileCheck,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      change: '3 urgent'
    },
    {
      title: 'Active Assignments',
      value: stats.activeAssignments,
      icon: BookOpen,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      change: '2 due soon'
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      icon: Calendar,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      change: 'Today: 2'
    },
    {
      title: 'Unread Messages',
      value: stats.messagesUnread,
      icon: MessageSquare,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      change: 'Last 24h'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      change: '+5% this week'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-green-100 mb-4">
              You're making a difference in {stats.totalStudents} students' lives. 
              Keep up the excellent mentorship work!
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Mentor since {new Date(user.enrollmentDate).getFullYear()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Senior Mentor</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.change}</p>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{stat.title}</h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center">
                <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-blue-700">Create Assignment</span>
              </button>
              <button className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-center">
                <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-purple-700">Schedule Session</span>
              </button>
              <button className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-center">
                <FileCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-green-700">Review Submissions</span>
              </button>
              <button className="p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors text-center">
                <MessageSquare className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-orange-700">Send Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inspirational Quote */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-6 border border-emerald-200">
        <div className="text-center">
          <p className="text-lg font-semibold text-emerald-800 mb-2">
            "The best of people are those who benefit others."
          </p>
          <p className="text-emerald-600 text-sm">- Prophet Muhammad (ﷺ)</p>
        </div>
      </div>
    </div>
  );
}