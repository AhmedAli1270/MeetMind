import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Meeting } from '../App';
import { Zap, Clock, CheckCircle2, TrendingUp, Lock } from 'lucide-react';

interface AnalyticsProps {
  meetings: Meeting[];
  isPro: boolean;
  onUpgradeClick: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ meetings, isPro, onUpgradeClick }) => {
  // Usage Stats
  const maxFreeMeetings = 5;
  const usagePercentage = Math.min((meetings.length / maxFreeMeetings) * 100, 100);
  
  const totalMeetings = meetings.length;
  
  // Calculate average duration (estimate based on transcript length)
  // Assuming 150 words per minute
  const avgDurationMinutes = totalMeetings > 0 
    ? Math.round(meetings.reduce((acc, m) => acc + (m.transcript.split(' ').length / 150), 0) / totalMeetings)
    : 0;

  // Action Items
  const totalActionItems = meetings.reduce((acc, m) => acc + m.actionItems.length, 0);
  const completedActionItems = meetings.reduce((acc, m) => acc + m.actionItems.filter(i => i.completed).length, 0);
  const completionRate = totalActionItems > 0 ? Math.round((completedActionItems / totalActionItems) * 100) : 0;

  // Topics Frequency
  const allTopics = meetings.flatMap(m => m.topics);
  const topicCounts = allTopics.reduce((acc: Record<string, number>, topic) => {
    acc[topic] = (acc[topic] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => ({ name: topic, value: count }));

  // Chart Data: Meetings per Week (Last 8 weeks)
  const getWeeklyData = () => {
    const data = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7));
      const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((i - 1) * 7));
      const count = meetings.filter(m => {
        const d = new Date(m.date);
        return d >= weekStart && d < weekEnd;
      }).length;
      data.push({ name: `Week ${8-i}`, count });
    }
    return data;
  };

  // Chart Data: Meetings by Day of Week
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayDistribution = Array(7).fill(0).map((_, i) => ({ name: days[i], count: 0 }));
  meetings.forEach(m => {
    const day = new Date(m.date).getDay();
    dayDistribution[day].count++;
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Insights into your meeting habits and productivity.</p>
        </div>
        {!isPro && (
          <button 
            onClick={onUpgradeClick}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Zap size={18} fill="currentColor" /> Upgrade to Pro
          </button>
        )}
      </div>

      {/* Usage Progress (Free Plan Only) */}
      {!isPro && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 relative z-10">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              Free Plan Usage <span className="text-slate-400 font-normal text-sm">({totalMeetings}/{maxFreeMeetings} meetings)</span>
            </h3>
            <span className="text-primary-600 font-bold text-sm">{usagePercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 relative z-10">
            <div 
              className={`h-2.5 rounded-full transition-all duration-1000 ${usagePercentage >= 100 ? 'bg-red-500' : 'bg-primary-600'}`} 
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          {usagePercentage >= 80 && (
            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 relative z-10">
              <Zap size={14} className="text-amber-500" />
              <span>You're reaching your limit. Upgrade for unlimited meetings.</span>
            </div>
          )}
          {/* Background decorative blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -z-0 transform translate-x-1/2 -translate-y-1/2"></div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400"><TrendingUp size={18} /></div>
            <span className="text-sm font-medium">Total Meetings</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalMeetings}</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400"><Clock size={18} /></div>
            <span className="text-sm font-medium">Avg. Duration</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{avgDurationMinutes} <span className="text-sm font-normal text-slate-500">min</span></p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400"><CheckCircle2 size={18} /></div>
            <span className="text-sm font-medium">Action Completion</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{completionRate}%</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400"><Zap size={18} /></div>
            <span className="text-sm font-medium">Top Topic</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{topTopics[0]?.name || "N/A"}</p>
          <p className="text-xs text-slate-500 mt-1">Most discussed theme</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Meeting Frequency (Last 8 Weeks)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getWeeklyData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Distribution Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Meetings by Day</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {dayDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#8b5cf6' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Topics Cloud */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Trending Topics</h3>
        {allTopics.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {topTopics.map((topic, index) => (
              <div 
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  index === 0 ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 text-lg px-6 py-3' :
                  index === 1 ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-base' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                #{topic.name} <span className="opacity-60 ml-1">({topic.value})</span>
              </div>
            ))}
            {allTopics.length > 5 && (
              <div className="px-4 py-2 rounded-full text-sm font-medium bg-slate-50 text-slate-500 dark:bg-slate-800/50">
                +{Object.keys(topicCounts).length - 5} more
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-500 italic">No topics analyzed yet.</p>
        )}
      </div>

    </div>
  );
};

export default Analytics;