import React from 'react';
import { Check, Shield, Zap, Info } from 'lucide-react';

interface SubscriptionProps {
  currentPlan: 'free' | 'pro' | 'team';
  onUpgrade: (plan: string, price: string) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ currentPlan, onUpgrade }) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: ['5 meetings/month', 'Basic AI summaries', 'Email support', '7-day retention'],
      current: currentPlan === 'free'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$15',
      description: 'For power users and freelancers',
      features: ['Unlimited meetings', 'Advanced AI & Actions', 'PDF Export', 'Priority support', 'Unlimited history'],
      current: currentPlan === 'pro',
      popular: true
    },
    {
      id: 'team',
      name: 'Team',
      price: '$35',
      description: 'For growing teams and collaboration',
      features: ['Everything in Pro', 'Team sharing', 'Admin dashboard', 'API Access', 'SSO'],
      current: currentPlan === 'team'
    }
  ];

  return (
    <div className="animate-fade-in-up space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Subscription & Billing</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your plan, billing details, and invoices.</p>
      </div>

      {/* Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative flex flex-col p-6 rounded-2xl border transition-all ${
              plan.current 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ring-2 ring-blue-500 dark:ring-blue-400' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            {plan.popular && !plan.current && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                Most Popular
              </div>
            )}
            
            <div className="mb-4">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
               <div className="flex items-baseline gap-1 mt-1">
                 <span className="text-3xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                 <span className="text-sm text-slate-500">/mo</span>
               </div>
               <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled={plan.current}
              onClick={() => onUpgrade(plan.name, plan.price)}
              className={`w-full py-2.5 rounded-xl font-bold transition-all ${
                plan.current 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-default' 
                  : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-primary-500/30'
              }`}
            >
              {plan.current ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      {/* Billing FAQ */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Info size={20} className="text-primary-500" /> Billing FAQ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">How does billing work?</h4>
            <p className="text-sm text-slate-500 leading-relaxed">We bill monthly or annually. You can upgrade, downgrade, or cancel at any time. Changes take effect immediately.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Is payment secure?</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Yes, we use Stripe for payment processing. We never store your credit card information on our servers.</p>
          </div>
          <div>
             <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Can I get a refund?</h4>
            <p className="text-sm text-slate-500 leading-relaxed">We offer a 14-day money-back guarantee if you're not satisfied with the Pro or Team plans.</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
        <Shield size={14} />
        <span>Secure payments encrypted with 256-bit SSL</span>
      </div>
    </div>
  );
};

export default Subscription;