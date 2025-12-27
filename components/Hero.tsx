import React from 'react';
import { Play, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Hero: React.FC = () => {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/30 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] bg-blue-400/30 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-400/30 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center" ref={ref}>
        <div className="flex flex-col items-center">
          
          <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-primary-600 dark:text-primary-400 font-medium text-sm mb-8 hover:scale-105 transition-transform cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-primary-500 mr-2 animate-pulse"></span>
              v2.0 is now live: Enhanced AI capabilities
            </div>
          </div>

          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight transition-all duration-700 delay-100 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Never Miss a <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 animate-gradient">
              Meeting Detail Again
            </span>
          </h1>

          <p className={`max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed transition-all duration-700 delay-200 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            MeetMind uses advanced AI to automatically generate summaries, extract action items, and track decisions in seconds. Save 5+ hours every week.
          </p>

          <div className={`flex flex-col sm:flex-row justify-center gap-4 mb-16 transition-all duration-700 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-primary-500/30 flex items-center justify-center gap-2 group transform hover:scale-105">
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 font-bold rounded-full transition-all flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transform hover:scale-105">
              <Play className="w-4 h-4 fill-current" />
              Watch Demo
            </button>
          </div>
          
          {/* Social Proof Bar */}
          <div className={`pt-8 border-t border-slate-200/60 dark:border-slate-800/60 max-w-4xl mx-auto w-full transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">
              Trusted by 2,500+ innovative teams
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {['Acme Corp', 'GlobalTech', 'Nebula', 'FoxRun', 'Circle'].map((company, i) => (
                <div key={i} className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-200">
                  <div className="w-6 h-6 bg-slate-400 rounded-sm"></div>
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;