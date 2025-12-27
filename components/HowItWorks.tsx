import React from 'react';
import { Upload, Cpu, FileText } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Step = ({ number, icon: Icon, title, description, isLast, delay }: { number: number, icon: any, title: string, description: string, isLast?: boolean, delay: number }) => {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <div 
      ref={ref} 
      className={`relative flex flex-col items-center text-center max-w-sm mx-auto transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      
      {!isLast && (
        <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-slate-200 to-slate-200 dark:from-slate-800 dark:to-slate-800 -z-10"></div>
      )}
      
      <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-800 shadow-xl flex items-center justify-center mb-8 relative z-10 group transition-transform hover:scale-110 duration-300">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Icon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center justify-center text-sm border-2 border-white dark:border-slate-900">
          {number}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  const { ref: titleRef, isVisible: titleVisible } = useIntersectionObserver();
  const { ref: timelineRef, isVisible: timelineVisible } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className={`text-center mb-20 transition-all duration-700 transform ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How MeetMind Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From raw audio to actionable insights in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 mb-20">
          <Step 
            number={1}
            icon={Upload}
            title="Upload or Connect"
            description="Upload an audio/video file, or connect your calendar for MeetMind to auto-join your Zoom, Teams, or Meet calls."
            delay={0}
          />
          <Step 
            number={2}
            icon={Cpu}
            title="AI Analysis"
            description="Our advanced NLP models transcribe the audio, identify speakers, and extract key context and sentiment in real-time."
            delay={200}
          />
          <Step 
            number={3}
            icon={FileText}
            title="Get Insights"
            description="Receive a perfectly formatted summary, a list of action items assigned to owners, and key decision logs instantly."
            isLast={true}
            delay={400}
          />
        </div>

        {/* Visual Flow Representation - Simple Timeline Box */}
        <div ref={timelineRef} className={`max-w-5xl mx-auto bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-inner transition-all duration-1000 transform ${timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
           <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-mono text-slate-500 dark:text-slate-400 overflow-x-auto">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 min-w-[200px] w-full md:w-auto transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-wider font-semibold text-slate-400">Input</div>
                <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
              <div className="hidden md:flex text-primary-500 animate-pulse">→</div>
              <div className="flex md:hidden text-primary-500 animate-pulse">↓</div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-primary-200 dark:border-primary-900 min-w-[200px] w-full md:w-auto relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute inset-0 bg-primary-50 dark:bg-primary-900/10 animate-pulse"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-wider font-semibold text-primary-500">Processing</div>
                    <div className="h-2 w-full bg-primary-100 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-2 w-2/3 bg-primary-100 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
              <div className="hidden md:flex text-primary-500 animate-pulse">→</div>
              <div className="flex md:hidden text-primary-500 animate-pulse">↓</div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-lg border-l-4 border-green-500 min-w-[200px] w-full md:w-auto transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-wider font-semibold text-green-600">Output</div>
                <div className="flex items-start gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-100 border border-green-400 mt-0.5"></div>
                    <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                 <div className="flex items-start gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-100 border border-green-400 mt-0.5"></div>
                    <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;