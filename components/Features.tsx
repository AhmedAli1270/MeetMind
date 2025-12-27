import React from 'react';
import { Zap, CheckSquare, Search, Brain, Share2, Shield } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay }) => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  
  return (
    <div 
      ref={ref}
      className={`p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary-500/30 dark:hover:border-primary-500/30 transition-all duration-500 group transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const Features: React.FC = () => {
  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver();

  const features = [
    {
      icon: Zap,
      title: "Instant AI Summaries",
      description: "Get comprehensive meeting highlights in under 30 seconds. Our AI captures context, nuance, and key decisions accurately."
    },
    {
      icon: CheckSquare,
      title: "Smart Action Items",
      description: "Automatically extract tasks, assign owners, and set due dates. Sync directly with Jira, Linear, or Asana."
    },
    {
      icon: Search,
      title: "Meeting History",
      description: "Search across all your past meetings. Ask questions like 'What did we decide about the Q3 budget?' and get instant answers."
    },
    {
      icon: Brain,
      title: "Sentiment Analysis",
      description: "Understand team morale and engagement levels with advanced emotional intelligence tracking across calls."
    },
    {
      icon: Share2,
      title: "Automated Sharing",
      description: "Push summaries to Slack channels or email attendees immediately after the call ends. Keep everyone aligned."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC2 Type II certified. Your data is encrypted at rest and in transit. We never train our models on your data."
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 transform ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase text-sm mb-3">
            Powerful Features
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything you need to run better meetings
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Stop worrying about taking notes. Let MeetMind handle the documentation while you focus on the conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;