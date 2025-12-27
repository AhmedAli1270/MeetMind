import React, { useState } from 'react';
import { Check, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const PricingCard = ({ tier, price, features, recommended, isAnnual, delay }: { tier: string, price: number, features: string[], recommended?: boolean, isAnnual: boolean, delay: number }) => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  const displayPrice = isAnnual ? Math.round(price * 0.8) : price;
  
  return (
    <div 
      ref={ref}
      className={`relative p-8 rounded-2xl border flex flex-col h-full transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${
        recommended 
          ? 'bg-white dark:bg-slate-800 border-primary-500 shadow-2xl z-10 scale-105' 
          : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-xl'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
          Most Popular
        </div>
      )}
      
      <div className="mb-8">
        <h3 className={`text-lg font-semibold uppercase tracking-wider mb-2 ${recommended ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}>
          {tier}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${displayPrice}</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">/mo</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {isAnnual ? 'Billed annually' : 'Billed monthly'}
        </p>
      </div>

      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={`mt-0.5 p-0.5 rounded-full ${recommended ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-slate-600 dark:text-slate-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button className={`w-full py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
        recommended 
          ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-primary-500/30' 
          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
      }`}>
        {tier === 'Free' ? 'Get Started' : 'Start Free Trial'}
      </button>
    </div>
  );
};

interface FeatureRow {
  name: string;
  free: string | boolean;
  pro: string | boolean;
  team: string | boolean;
}

interface FeatureCategory {
  category: string;
  items: FeatureRow[];
}

const ComparisonTable = ({ isOpen }: { isOpen: boolean }) => {
  const featuresList: FeatureCategory[] = [
    { category: "Core Features", items: [
      { name: "Meeting Quota", free: "5/month", pro: "Unlimited", team: "Unlimited" },
      { name: "History Retention", free: "7 days", pro: "Unlimited", team: "Unlimited" },
      { name: "Audio Transcription", free: "Standard", pro: "High Accuracy", team: "High Accuracy" },
      { name: "Search", free: "Basic", pro: "Advanced", team: "Advanced + Filters" },
    ]},
    { category: "Intelligence", items: [
      { name: "AI Summaries", free: true, pro: true, team: true },
      { name: "Action Item Extraction", free: false, pro: true, team: true },
      { name: "Sentiment Analysis", free: false, pro: true, team: true },
      { name: "Topic Detection", free: false, pro: true, team: true },
    ]},
    { category: "Integrations & Export", items: [
      { name: "Calendar Integration", free: true, pro: true, team: true },
      { name: "PDF/Docx Export", free: false, pro: true, team: true },
      { name: "Slack/Teams", free: false, pro: true, team: true },
      { name: "CRM Integration (HubSpot, Salesforce)", free: false, pro: false, team: true },
    ]},
    { category: "Support & Security", items: [
      { name: "Support Level", free: "Community", pro: "Priority Email", team: "Dedicated Manager" },
      { name: "SSO (SAML/Okta)", free: false, pro: false, team: true },
      { name: "Admin Dashboard", free: false, pro: false, team: true },
    ]}
  ];

  const renderValue = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <div className="flex justify-center"><div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full"><Check size={16} className="text-green-600 dark:text-green-400" strokeWidth={3} /></div></div>
      ) : (
        <div className="flex justify-center"><Minus size={16} className="text-slate-300 dark:text-slate-600" /></div>
      );
    }
    return <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{val}</span>;
  };

  return (
    <div className={`mt-16 overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="p-6 text-left text-sm font-semibold text-slate-900 dark:text-white w-1/4">Features</th>
              <th className="p-6 text-center text-lg font-bold text-slate-900 dark:text-white w-1/4">Free</th>
              <th className="p-6 text-center text-lg font-bold text-primary-600 dark:text-primary-400 w-1/4">Pro</th>
              <th className="p-6 text-center text-lg font-bold text-slate-900 dark:text-white w-1/4">Team</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {featuresList.map((category) => (
              <React.Fragment key={category.category}>
                <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                  <td colSpan={4} className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {category.category}
                  </td>
                </tr>
                {category.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-center">{renderValue(item.free)}</td>
                    <td className="px-6 py-4 text-center bg-primary-50/30 dark:bg-primary-900/5">{renderValue(item.pro)}</td>
                    <td className="px-6 py-4 text-center">{renderValue(item.team)}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver();

  return (
    <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-950/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className={`text-center mb-16 transition-all duration-700 transform ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Start for free, scale as your team grows.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Yearly <span className="text-green-500 text-xs font-bold ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center mb-16">
          <PricingCard 
            tier="Free"
            price={0}
            isAnnual={isAnnual}
            features={[
              "5 meetings per month",
              "Basic AI summaries",
              "Email support",
              "7-day history retention",
              "1 user"
            ]}
            delay={0}
          />
          <PricingCard 
            tier="Pro"
            price={15}
            isAnnual={isAnnual}
            recommended={true}
            features={[
              "Unlimited meetings",
              "Advanced AI & Action Items",
              "PDF & Docx Export",
              "Priority support",
              "Unlimited history",
              "Google Calendar Integration"
            ]}
            delay={100}
          />
          <PricingCard 
            tier="Team"
            price={35}
            isAnnual={isAnnual}
            features={[
              "Everything in Pro",
              "Team sharing & workspace",
              "Admin dashboard",
              "Custom Integrations (API)",
              "Dedicated success manager",
              "SSO & Audit logs"
            ]}
            delay={200}
          />
        </div>

        {/* Comparison Toggle */}
        <div className="text-center">
          <button 
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            {showComparison ? 'Hide feature comparison' : 'Compare plans & features'}
            {showComparison ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <ComparisonTable isOpen={showComparison} />
      </div>
    </section>
  );
};

export default Pricing;