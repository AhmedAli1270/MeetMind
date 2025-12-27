import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar'; 
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Layout from './components/Layout';
import DashboardHome from './components/DashboardHome';
import NewMeeting from './components/NewMeeting';
import History from './components/History';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import Subscription from './components/Subscription';
import AuthPage from './components/AuthPage';
import OnboardingModal from './components/OnboardingModal';
import PaymentModal from './components/PaymentModal';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import { getCurrentSession, logout, UserAccount } from './utils/auth';

// Types
export interface Meeting {
  id: string;
  title: string;
  date: string;
  transcript: string;
  summary: string;
  decisions: string[];
  actionItems: { task: string; owner: string; priority: string; completed: boolean }[];
  topics: string[];
  createdAt: string;
}

interface UserSettings {
  apiKey: string;
  theme: 'light' | 'dark';
}

// App View State
type AppView = 'landing' | 'auth' | 'dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    apiKey: '',
    theme: 'light',
  });
  const [darkMode, setDarkMode] = useState(false);
  
  // Payment Flow State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: string} | null>(null);

  // Landing Page Intersection Observer
  const { ref: ctaRef, isVisible: ctaVisible } = useIntersectionObserver();

  // 1. Initialization: Check Session & Load Data
  useEffect(() => {
    // Check if user is logged in
    const user = getCurrentSession();
    if (user) {
      setCurrentUser(user);
      setCurrentView('dashboard');
    }

    // Load Local Data
    const storedMeetings = localStorage.getItem('meetmind_meetings');
    if (storedMeetings) setMeetings(JSON.parse(storedMeetings));

    const storedSettings = localStorage.getItem('meetmind_settings');
    if (storedSettings) setSettings(JSON.parse(storedSettings));

    const isDark = localStorage.getItem('darkMode') === 'true' || 
      (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
  }, []);

  // 2. Persistence
  useEffect(() => {
    localStorage.setItem('meetmind_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('meetmind_settings', JSON.stringify(settings));
  }, [settings]);

  // 3. Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // --- Auth Handlers ---

  const handleStartAuth = () => {
    setCurrentView('auth');
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (user: UserAccount, isSignup: boolean) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    setActiveTab('dashboard');
    if (isSignup) {
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setCurrentView('landing');
    // Optional: Clear meeting data from state if you want to ensure privacy on shared devices
    // setMeetings([]); 
  };

  // --- Dashboard Handlers ---

  const handleSaveMeeting = (meeting: Meeting) => {
    setMeetings(prev => [meeting, ...prev]);
    setActiveTab('history');
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateApiKey = (key: string) => {
    setSettings(prev => ({ ...prev, apiKey: key }));
  };

  const handleClearData = () => {
    setMeetings([]);
    setSettings(prev => ({ ...prev, apiKey: '' }));
    localStorage.removeItem('meetmind_meetings');
    handleLogout(); // Force logout on data clear
  };

  const handleUpgradeClick = (planName: string = 'Pro', price: string = '$15') => {
    setSelectedPlan({ name: planName, price });
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (currentUser && selectedPlan) {
      const updatedUser: UserAccount = {
        ...currentUser,
        plan: selectedPlan.name.toLowerCase() === 'team' ? 'team' : 'pro'
      };
      // Update local storage for auth (hacky MVP update)
      const users = JSON.parse(localStorage.getItem('meetmind_users') || '[]');
      const newUsers = users.map((u: UserAccount) => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem('meetmind_users', JSON.stringify(newUsers));
      
      setCurrentUser(updatedUser);
      setPaymentModalOpen(false);
      setActiveTab('dashboard');
    }
  };

  // ------------------------------------------------------------------
  // RENDER: Auth Page
  // ------------------------------------------------------------------
  if (currentView === 'auth') {
    return (
      <AuthPage 
        onLoginSuccess={handleLoginSuccess}
        onCancel={() => setCurrentView('landing')}
      />
    );
  }

  // ------------------------------------------------------------------
  // RENDER: Landing Page
  // ------------------------------------------------------------------
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen flex flex-col overflow-hidden">
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          onOpenAuth={handleStartAuth} 
        />
        <main className="flex-grow">
          {/* Override Hero button to trigger Auth */}
          <div onClick={(e) => {
            // Very hacky way to intercept clicks on buttons inside Hero without rewriting Hero
            // Ideally pass a prop to Hero
            const target = e.target as HTMLElement;
            if (target.closest('button')) handleStartAuth();
          }}>
             <Hero />
          </div>
          <Features />
          <HowItWorks />
          <Pricing />
          <FAQ />
          
          <section ref={ctaRef} className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-700 opacity-90 dark:opacity-80 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
              <div className={`transition-all duration-700 transform ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  Ready to transform your meetings?
                </h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={handleStartAuth}
                    className="px-8 py-4 bg-white text-primary-600 font-bold rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl text-lg"
                  >
                    Start Your Free Trial
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER: Dashboard (App Product)
  // ------------------------------------------------------------------
  const isPro = currentUser?.plan !== 'free';

  return (
    <>
      {showOnboarding && currentUser && (
        <OnboardingModal 
          userName={currentUser.name} 
          onComplete={() => setShowOnboarding(false)} 
        />
      )}

      {paymentModalOpen && selectedPlan && (
        <PaymentModal 
          plan={selectedPlan.name}
          price={selectedPlan.price}
          onClose={() => setPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={{ name: currentUser?.name || 'User', email: currentUser?.email || '' }}
        isPro={isPro} 
        onLogout={handleLogout}
        onUpgradeClick={() => { setActiveTab('subscription'); }}
      >
        {activeTab === 'dashboard' && (
          <DashboardHome 
            meetings={meetings} 
            onNewMeeting={() => setActiveTab('new-meeting')}
            onViewMeeting={(meeting) => {
               setActiveTab('history');
            }}
            userName={currentUser?.name || 'User'}
          />
        )}
        
        {activeTab === 'new-meeting' && (
          <NewMeeting 
            onSave={handleSaveMeeting} 
            apiKey={settings.apiKey}
            isPro={isPro}
            meetingCount={meetings.length}
            onUpgradeClick={() => setActiveTab('subscription')}
          />
        )}
        
        {activeTab === 'history' && (
          <History 
            meetings={meetings}
            onViewMeeting={(m) => {
              alert(`Summary for ${m.title}:\n\n${m.summary}`);
            }}
            onDeleteMeeting={handleDeleteMeeting}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics 
            meetings={meetings}
            isPro={isPro}
            onUpgradeClick={() => setActiveTab('subscription')}
          />
        )}

        {activeTab === 'subscription' && (
          <Subscription 
            currentPlan={currentUser?.plan || 'free'}
            onUpgrade={handleUpgradeClick}
          />
        )}
        
        {activeTab === 'settings' && (
          <Settings 
            user={{ name: currentUser?.name || '', email: currentUser?.email || '' }}
            onUpdateUser={() => {}} // User update not implemented in auth MVP
            apiKey={settings.apiKey}
            onUpdateApiKey={handleUpdateApiKey}
            onClearData={handleClearData}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
      </Layout>
    </>
  );
}

export default App;