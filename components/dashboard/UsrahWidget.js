'use client';

import { User, MessageCircle, Users, Phone, Mail, Calendar } from 'lucide-react';

const UsrahWidget = ({ mentor, usrahGroup }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Users className="w-6 h-6 text-purple-600" />
        My Usrah (Mentorship)
      </h3>

      {/* Assigned Mentor */}
      <div className="mb-6">
        <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600" />
          Assigned Mentor
        </h4>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="font-semibold text-emerald-800">
                {mentor?.name || 'Sheikh Abdullah Omar'}
              </div>
              <div className="text-sm text-emerald-600">
                Senior Mentor & Islamic Scholar
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
            <button className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium">
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Usrah Group */}
      <div className="mb-6">
        <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          Tarbiya Circle
        </h4>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-blue-800">
                {usrahGroup || 'Tarbiya Circle Alpha'}
              </div>
              <div className="text-sm text-blue-600">
                8 members • Weekly meetings
              </div>
            </div>
            <div className="flex -space-x-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-blue-100 border-2 border-white rounded-full flex items-center justify-center"
                >
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              ))}
              <div className="w-8 h-8 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center text-white text-xs font-bold">
                +4
              </div>
            </div>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <MessageCircle className="w-4 h-4" />
            Join Group Chat
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h4 className="font-semibold text-slate-700 mb-3">Recent Activity</h4>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-800">
                New message from Sheikh Abdullah
              </div>
              <div className="text-xs text-slate-600">
                "Excellent progress on your Tarbiya assignments"
              </div>
              <div className="text-xs text-slate-500 mt-1">2 hours ago</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-800">
                Usrah meeting scheduled
              </div>
              <div className="text-xs text-slate-600">
                Tomorrow at 7:00 PM - "Purification of the Heart"
              </div>
              <div className="text-xs text-slate-500 mt-1">1 day ago</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-800">
                Feedback received on Khutbah practice
              </div>
              <div className="text-xs text-slate-600">
                Score: 85/100 - "Great improvement in delivery"
              </div>
              <div className="text-xs text-slate-500 mt-1">3 days ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium">
            <Mail className="w-4 h-4" />
            Email Mentor
          </button>
          <button className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium">
            <Calendar className="w-4 h-4" />
            View Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsrahWidget;