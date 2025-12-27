import React, { useState } from 'react';
import { Bot, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft, Loader2, Mail, Lock, User, Zap } from 'lucide-react';
import { login, signup, validateEmail, checkPasswordStrength, loginAsDemoUser } from '../utils/auth';

interface AuthPageProps {
  onLoginSuccess: (user: any, isSignup: boolean) => void;
  onCancel: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onCancel }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const passwordStrength = checkPasswordStrength(password);

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const result = loginAsDemoUser();
      setIsLoading(false);
      onLoginSuccess(result.user, false);
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'forgot') {
      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMsg("If an account exists with this email, you will receive a reset link shortly.");
      }, 1500);
      return;
    }

    if (mode === 'login') {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }
      setIsLoading(true);
      
      // Simulate network delay
      setTimeout(() => {
        const result = login(email, password);
        setIsLoading(false);
        if (result.success && result.user) {
          onLoginSuccess(result.user, false);
        } else {
          setError(result.error || "Login failed");
        }
      }, 1000);
    }

    if (mode === 'signup') {
      if (!name || !email || !password || !confirmPassword) {
        setError("Please fill in all fields");
        return;
      }
      if (!validateEmail(email)) {
        setError("Invalid email format");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (passwordStrength < 3) {
        setError("Password is too weak. Include numbers and special characters.");
        return;
      }
      if (!termsAgreed) {
        setError("You must agree to the Terms of Service");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        const result = signup(name, email, password);
        setIsLoading(false);
        if (result.success && result.user) {
          onLoginSuccess(result.user, true);
        } else {
          setError(result.error || "Signup failed");
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      {/* Left Side - Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1574&q=80')] bg-cover bg-center z-0"></div>
        
        <div className="relative z-20 flex flex-col justify-between p-16 h-full text-white">
          <div className="flex items-center gap-2">
             <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
             </div>
             <span className="font-bold text-2xl tracking-tight">MeetMind</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Turn your meetings into <span className="text-blue-200">actionable insights</span>.
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Join thousands of teams who save hours every week by letting AI handle their meeting notes, summaries, and action items.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-200" />
                ))}
              </div>
              <div className="text-sm font-medium">
                <span className="text-yellow-400">★★★★★</span> 5.0 from 2,500+ users
              </div>
            </div>
          </div>

          <div className="text-sm text-blue-200">
            © 2024 MeetMind Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-24 overflow-y-auto">
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 lg:top-10 lg:right-10 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="max-w-sm w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {mode === 'login' && 'Welcome back'}
              {mode === 'signup' && 'Create an account'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {mode === 'login' && 'Please enter your details to log in.'}
              {mode === 'signup' && 'Start your 14-day free trial today.'}
              {mode === 'forgot' && 'Enter your email to receive reset instructions.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 text-red-700 dark:text-red-300 animate-fade-in-up">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3 text-green-700 dark:text-green-300 animate-fade-in-up">
              <CheckCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {mode === 'signup' && password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1 mb-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level} 
                          className={`h-full flex-1 rounded-full transition-colors ${
                            passwordStrength >= level 
                              ? passwordStrength <= 2 ? 'bg-red-500' : passwordStrength === 3 ? 'bg-yellow-500' : 'bg-green-500'
                              : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      Use 8+ chars, numbers & symbols
                    </p>
                  </div>
                )}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              {mode === 'login' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                </label>
              )}
              {mode === 'signup' && (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    I agree to the <a href="#" className="text-primary-600 hover:underline">Terms</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>
              )}
              {mode === 'login' && (
                <button type="button" onClick={() => setMode('forgot')} className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Forgot password?
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {mode === 'login' ? 'Log In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          {mode !== 'forgot' && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-950 text-slate-500">Or continue with</span>
                </div>
              </div>

              <button className="w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mb-4">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <button 
                onClick={handleDemoLogin}
                type="button"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Zap size={18} fill="currentColor" />
                Try Demo Account (All Features)
              </button>
            </>
          )}

          <div className="mt-8 text-center text-sm">
            {mode === 'login' ? (
              <p className="text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-primary-600 font-bold hover:underline">Sign up</button>
              </p>
            ) : mode === 'signup' ? (
              <p className="text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-primary-600 font-bold hover:underline">Log in</button>
              </p>
            ) : (
              <button onClick={() => setMode('login')} className="text-primary-600 font-bold hover:underline flex items-center justify-center gap-1 w-full">
                <ArrowLeft size={14} /> Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;