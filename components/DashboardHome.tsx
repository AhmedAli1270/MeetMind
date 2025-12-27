import React from 'react';
import { FileText, CheckCircle2, TrendingUp, ArrowRight, Calendar, Play } from 'lucide-react';
import { Meeting } from '../App'; // We'll define types in App or a types file

interface DashboardHomeProps {
  meetings: Meeting[];
  onNewMeeting: () => void;
  onViewMeeting: (meeting: Meeting) => void;
  userName: string;
}

const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2.5 rounded-xl ${colorClass}`}>
        <Icon size={20} />
      </div>
      <span className="text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full">+12% vs last week</span>
    </div>
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
  </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ meetings, onNewMeeting, onViewMeeting, userName }) => {
  const totalMeetings = meetings.length;
  // Calculate total pending action items
  const totalActionItems = meetings.reduce((acc, m) => 
    acc + (m.actionItems ? m.actionItems.filter((i: any) => !i.completed).length : 0), 0
  );
  
  // Get this week's meetings (mock logic for now, just filtering recent)
  const thisWeekCount = meetings.filter(m => {
    const d = new Date(m.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7;
  }).length;

  const recentMeetings = [...meetings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {userName}</h1>
          <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your meetings.</p>
        </div>
        <button 
          onClick={onNewMeeting}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-full font-medium shadow-lg hover:shadow-primary-500/25 transition-all flex items-center gap-2"
        >
          <Play size={16} fill="currentColor" />
          Analyze New Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Meetings" 
          value={totalMeetings} 
          icon={FileText} 
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard 
          title="Meetings This Week" 
          value={thisWeekCount} 
          icon={TrendingUp} 
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
        <StatCard 
          title="Pending Actions" 
          value={totalActionItems} 
          icon={CheckCircle2} 
          colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Meetings</h2>
          <button onClick={() => onNewMeeting()} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View all <ArrowRight size={14} />
          </button>
        </div>

        {recentMeetings.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No meetings yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Get started by analyzing your first meeting transcript or uploading an audio recording.</p>
            <button 
              onClick={onNewMeeting}
              className="text-primary-600 font-medium hover:underline"
            >
              Analyze your first meeting
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentMeetings.map(meeting => (
                <div 
                  key={meeting.id} 
                  onClick={() => onViewMeeting(meeting)}
                  className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{meeting.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                        <Calendar size={14} />
                        {meeting.date}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {meeting.topics.slice(0, 2).map((topic: string, i: number) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {meeting.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;