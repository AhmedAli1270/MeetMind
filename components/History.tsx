import React, { useState } from 'react';
import { Calendar, ChevronRight, Trash2, Search, FileX } from 'lucide-react';
import { Meeting } from '../App';

interface HistoryProps {
  meetings: Meeting[];
  onViewMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ meetings, onViewMeeting, onDeleteMeeting }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Meeting History</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and review your past meeting insights.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search history..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full sm:w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          />
        </div>
      </div>

      {meetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <FileX className="text-slate-300" size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No meetings recorded</h3>
          <p className="text-slate-500">Analyze your first meeting to start building your history.</p>
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No meetings found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredMeetings.map((meeting) => (
              <li key={meeting.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="p-5 sm:p-6 flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center font-bold text-lg">
                    {meeting.title.charAt(0)}
                  </div>
                  
                  <div className="flex-grow min-w-0 cursor-pointer" onClick={() => onViewMeeting(meeting)}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                        {meeting.title}
                      </h3>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full w-fit">
                        <Calendar size={12} />
                        {meeting.date}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                      {meeting.summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {meeting.topics.slice(0, 3).map((topic, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                          #{topic}
                        </span>
                      ))}
                      {meeting.topics.length > 3 && (
                        <span className="text-xs px-2 py-0.5 text-slate-400">+{meeting.topics.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between self-stretch gap-2 ml-2">
                    <button 
                      onClick={() => onViewMeeting(meeting)}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if(confirm('Are you sure you want to delete this meeting?')) onDeleteMeeting(meeting.id);
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default History;