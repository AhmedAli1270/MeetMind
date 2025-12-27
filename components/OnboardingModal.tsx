import React from 'react';
import { Sparkles, ArrowRight, Upload, Zap, Search } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: () => void;
  userName: string;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, userName }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"></div>
      
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-up border border-slate-200 dark:border-slate-800">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
        
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-primary-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome to MeetMind, {userName.split(' ')[0]}!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            You're all set to transform your meetings. Here are a few ways to get started:
          </p>
          
          <div className="space-y-4 text-left mb-8">
            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm h-fit">
                <Upload size={20} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Analyze a Transcript</h3>
                <p className="text-sm text-slate-500">Paste your meeting notes or upload a text file to extract insights instantly.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm h-fit">
                <Zap size={20} className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Track Action Items</h3>
                <p className="text-sm text-slate-500">We automatically detect tasks and assignees so nothing falls through the cracks.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm h-fit">
                <Search size={20} className="text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Search History</h3>
                <p className="text-sm text-slate-500">Easily find what was decided in past meetings with semantic search.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onComplete}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            Let's Go <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;