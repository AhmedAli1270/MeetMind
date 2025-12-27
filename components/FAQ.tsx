import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggle: () => void;
  delay: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggle, delay }) => {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <div 
      ref={ref}
      className={`border-b border-slate-200 dark:border-slate-800 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <button 
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
        onClick={toggle}
      >
        <span className="text-lg font-medium text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
          {question}
        </span>
        <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-primary-50 dark:bg-slate-800 text-primary-600' : 'bg-transparent text-slate-400 group-hover:text-primary-600'}`}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-48 opacity-100 mb-6' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed pr-8">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver();

  const faqs = [
    {
      question: "How does the AI work?",
      answer: "We use state-of-the-art Large Language Models (LLMs) specifically fine-tuned for conversational speech. The system listens to audio, transcribes it to text with high accuracy, and then processes that text to extract summaries, tasks, and key insights."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. Security is our top priority. We are SOC2 Type II compliant. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We do not use your meeting data to train our general models without your explicit enterprise consent."
    },
    {
      question: "Which platforms do you integrate with?",
      answer: "MeetMind integrates seamlessly with Zoom, Google Meet, and Microsoft Teams for recording. For task management, we push action items to Jira, Asana, Linear, Trello, and Monday.com."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll retain access to your premium features until the end of your current billing cycle."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 14-day money-back guarantee for all new Pro and Team subscriptions. If you're not satisfied, just contact our support team."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div ref={headerRef} className={`lg:col-span-4 transition-all duration-700 transform ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Can't find the answer you're looking for? Reach out to our customer support team.
            </p>
            <button className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Contact Support &rarr;
            </button>
          </div>
          
          <div className="lg:col-span-8">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-2 sm:p-8">
              {faqs.map((faq, index) => (
                <FAQItem 
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  toggle={() => setOpenIndex(openIndex === index ? null : index)}
                  delay={index * 100}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;