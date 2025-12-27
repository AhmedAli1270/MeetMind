import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Clock, 
  Settings, 
  Zap, 
  Search, 
  Bell, 
  Menu, 
  X,
  LogOut,
  Bot,
  BarChart2,
  User as UserIcon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: { name: string; email: string };
  isPro: boolean;
  onLogout: () => void;
  onUpgradeClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, isPro, onLogout, onUpgradeClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-meeting', label: 'New Meeting', icon: PlusCircle },
    { id: 'history', label: 'Meeting History', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full transition-all duration-300">
        <div className="p-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800">
          <div className="bg-gradient-to-br from-primary-500 to-secondary-600 p-1.5 rounded-lg shadow-md">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            MeetMind
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          {!isPro && (
            <div 
              onClick={onUpgradeClick}
              className="mb-4 p-4 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl shadow-lg text-white relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white opacity-10 rounded-full"></div>
              <div className="flex items-center gap-2 font-bold mb-1">
                <Zap size={16} fill="currentColor" />
                Upgrade to Pro
              </div>
              <p className="text-xs text-blue-100 mb-3">Get unlimited AI summaries and advanced exports.</p>
              <button className="w-full py-1.5 bg-white/20 hover:bg-white/30 rounded text-xs font-semibold backdrop-blur-sm transition-colors">
                View Plans
              </button>
            </div>
          )}
          
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            </button>
            
            {/* Popover Menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up">
                <div className="p-1">
                  <button 
                    onClick={() => { handleNavClick('settings'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                  >
                    <Settings size={16} /> Account Settings
                  </button>
                  <button 
                    onClick={() => { setActiveTab('subscription'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                  >
                    <Zap size={16} /> Subscription
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-left"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search meetings..." 
                className="pl-9 pr-4 py-1.5 w-64 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <button 
              className="md:hidden w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
              onClick={onLogout}
            >
              {user.name.charAt(0)}
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative w-64 bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-slide-in">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-xl text-slate-900 dark:text-white">MeetMind</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
                      activeTab === item.id
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-auto p-4 border-t border-slate-100 dark:border-slate-800">
                 {!isPro && (
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); onUpgradeClick(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg font-bold mb-2"
                  >
                    <Zap size={18} /> Upgrade Plan
                  </button>
                 )}
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg font-medium"
                >
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;