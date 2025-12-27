import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
  plan: string;
  price: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, price, onClose, onSuccess }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate API processing
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in-up border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Upgrade Successful!</h2>
          <p className="text-slate-600 dark:text-slate-400">
            You are now subscribed to the <span className="font-bold text-primary-600">{plan}</span> plan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-up border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upgrade to {plan}</h2>
            <p className="text-sm text-slate-500">{price} / month • Cancel anytime</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'processing' ? (
             <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Processing Payment...</h3>
                <p className="text-slate-500 text-sm">Please do not close this window.</p>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg flex items-start gap-3 border border-blue-100 dark:border-blue-900/30">
                <ShieldCheck className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  This is a secure 256-bit SSL encrypted payment. Your information is safe.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Cardholder Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Card Information</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value.replace(/\D/g,'').match(/.{1,4}/g)?.join(' ') || '')}
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Expiry Date</label>
                  <input 
                    type="text" 
                    required
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CVC</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      required
                      value={cvc}
                      onChange={e => setCvc(e.target.value)}
                      placeholder="123"
                      maxLength={3}
                      className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 mt-4"
              >
                Pay {price} & Upgrade
              </button>
              
              <p className="text-xs text-center text-slate-500">
                By clicking pay, you agree to our Terms of Service.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;