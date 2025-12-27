import React, { useState } from 'react';
import { Upload, FileText, Loader2, Play, AlertCircle, Save, Download, Share2, Copy, Check, Lock } from 'lucide-react';
import { analyzeMeetingText, AnalysisResult } from '../utils/gemini';
import { Meeting } from '../App';
import { v4 as uuidv4 } from 'uuid'; // We need to add uuid, or use simple math.random

// Simple ID generator if uuid not available
const generateId = () => Math.random().toString(36).substr(2, 9);

interface NewMeetingProps {
  onSave: (meeting: Meeting) => void;
  apiKey: string;
  isPro: boolean;
  meetingCount: number;
  onUpgradeClick: () => void;
}

const NewMeeting: React.FC<NewMeetingProps> = ({ onSave, apiKey, isPro, meetingCount, onUpgradeClick }) => {
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const isLimitReached = !isPro && meetingCount >= 5;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (file.type.includes('text')) {
        const reader = new FileReader();
        reader.onload = (e) => setTranscript(e.target?.result as string);
        reader.readAsText(file);
      } else {
        setError("Audio transcription is not connected in this demo. Please paste text.");
      }
    }
  };

  const handleAnalyze = async () => {
    if (isLimitReached) return;

    if (!title || !transcript) {
      setError("Please provide a title and meeting transcript.");
      return;
    }
    
    if (!apiKey) {
      setError("API Key is missing. Go to Settings to add your Google Gemini API Key.");
      return;
    }

    setStep('analyzing');
    setError(null);

    try {
      const analysis = await analyzeMeetingText(transcript, apiKey);
      setResult(analysis);
      setStep('results');
    } catch (err: any) {
      setError(err.message || "Failed to analyze meeting.");
      setStep('input');
    }
  };

  const handleSave = () => {
    if (!result) return;

    const newMeeting: Meeting = {
      id: generateId(),
      title,
      date,
      transcript,
      summary: result.summary,
      decisions: result.decisions,
      actionItems: result.actionItems.map(item => ({ ...item, completed: false })),
      topics: result.topics,
      createdAt: new Date().toISOString()
    };

    onSave(newMeeting);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  const handleExportPDF = () => {
    if (!isPro) {
      onUpgradeClick();
    } else {
      alert("PDF Export started...");
    }
  };

  if (step === 'analyzing') {
    return (
      <div className="h-full flex flex-col items-center justify-center min-h-[500px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BotIcon className="w-6 h-6 text-primary-600 animate-pulse" />
          </div>
        </div>
        <h3 className="mt-8 text-xl font-bold text-slate-900 dark:text-white">Analyzing Meeting...</h3>
        <p className="text-slate-500 mt-2 text-center max-w-md">
          Our AI is reading the transcript, identifying speakers, extracting action items, and summarizing key decisions.
        </p>
      </div>
    );
  }

  if (step === 'results' && result) {
    return (
      <div className="animate-fade-in-up pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <span>{date}</span>
              <span>•</span>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">Analysis Complete</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExportPDF}
              className={`px-4 py-2 border rounded-lg font-medium flex items-center gap-2 transition-colors ${
                !isPro 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
               {!isPro ? <Lock size={14} /> : <Download size={16} />} 
               Export PDF
               {!isPro && <span className="ml-1 text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded font-bold">PRO</span>}
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-md flex items-center gap-2 transition-colors"
            >
              <Save size={16} /> Save Meeting
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Summary Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText size={18} className="text-primary-500" /> Executive Summary
                </h3>
                <button onClick={() => copyToClipboard(result.summary)} className="text-slate-400 hover:text-primary-600">
                  <Copy size={16} />
                </button>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {result.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.topics.map((topic, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium">
                    #{topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Decisions Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Check size={18} className="text-green-500" /> Key Decisions
              </h3>
              <ul className="space-y-3">
                {result.decisions.map((decision, i) => (
                  <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300">
                    <div className="min-w-[6px] h-[6px] rounded-full bg-slate-300 dark:bg-slate-600 mt-2.5"></div>
                    {decision}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Action Items Column */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-500" /> Action Items
                </h3>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 text-xs px-2 py-1 rounded-md font-bold">
                  {result.actionItems.length}
                </span>
              </div>
              <div className="space-y-3">
                {result.actionItems.map((item, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 group hover:border-primary-200 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        item.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-xs text-slate-400">{item.owner}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
                      {item.task}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">New Meeting Analysis</h1>
        <p className="text-slate-500 dark:text-slate-400">Upload a recording or paste a transcript to generate insights.</p>
      </div>

      {isLimitReached && (
        <div className="mb-8 p-6 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-lg text-white text-center">
            <h3 className="text-xl font-bold mb-2">Free Plan Limit Reached</h3>
            <p className="mb-4 opacity-90">You have analyzed 5 meetings this month. Upgrade to Pro for unlimited access.</p>
            <button 
              onClick={onUpgradeClick}
              className="px-6 py-2 bg-white text-primary-600 font-bold rounded-lg shadow-md hover:bg-slate-50 transition-colors"
            >
              Upgrade Now
            </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-300">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-opacity ${isLimitReached ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Meeting Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q4 Product Roadmap Review"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Transcript / Notes
            </label>
            <div className="relative">
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste the meeting transcript here..."
                className="w-full h-64 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none transition-all"
              ></textarea>
              <div className="absolute bottom-3 right-3 text-xs text-slate-400 pointer-events-none">
                {transcript.length} chars
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="w-full md:w-auto">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={handleFileChange}
                accept=".txt,.md" // Restricted for this demo
              />
              <label 
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-full md:w-auto"
              >
                <Upload size={18} />
                {fileName ? fileName : "Upload Text File"}
              </label>
            </div>
            
            <button 
              onClick={handleAnalyze}
              disabled={!title || !transcript}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white shadow-lg transition-all w-full md:w-auto ${
                !title || !transcript 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:shadow-primary-500/25 hover:scale-[1.02]'
              }`}
            >
              <Play size={18} fill="currentColor" />
              Analyze Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for loading icon
const BotIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

export default NewMeeting;