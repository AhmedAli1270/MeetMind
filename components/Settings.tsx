import React, { useState } from 'react';
import { User, Sun, Moon, Trash2, Save, Check, Key } from 'lucide-react';

interface SettingsProps {
  user: { name: string; email: string };
  onUpdateUser: (user: { name: string; email: string }) => void;
  apiKey: string;
  onUpdateApiKey: (key: string) => void;
  onClearData: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  user, onUpdateUser, apiKey, onUpdateApiKey, onClearData, darkMode, toggleDarkMode 
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [isSaved, setIsSaved] = useState(false);
  const [isKeySaved, setIsKeySaved] = useState(false);

  const handleSaveProfile = () => {
    onUpdateUser({ name, email });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSaveKey = () => {
    onUpdateApiKey(localApiKey);
    setIsKeySaved(true);
    setTimeout(() => setIsKeySaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and integrations.</p>
      </div>

      {/* Profile Section */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <User size={20} className="text-primary-500" /> Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="pt-2 flex justify-end">
             <button 
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              {isSaved ? <Check size={16} /> : <Save size={16} />}
              Save Profile
            </button>
          </div>
        </div>
      </section>

      {/* API Key Section */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Key size={20} className="text-amber-500" /> API Configuration
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Google Gemini API Key</label>
            <div className="flex gap-2">
              <input 
                type="password" 
                value={localApiKey} 
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="AIza..."
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono"
              />
               <button 
                onClick={handleSaveKey}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                {isKeySaved ? <Check size={16} /> : <Save size={16} />}
                Save
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Your API key is stored locally in your browser and used directly to communicate with Google's servers.
            </p>
          </div>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
         <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Appearance
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Toggle between light and dark mode.
            </p>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
      </section>

      {/* Danger Zone */}
      <section className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 p-6">
        <h2 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Danger Zone</h2>
        <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
          Permanently delete all stored meetings and reset settings. This action cannot be undone.
        </p>
        <button 
          onClick={() => {
            if(confirm('Are you sure you want to delete all data?')) onClearData();
          }}
          className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
        >
          <Trash2 size={16} /> Delete All Data
        </button>
      </section>
    </div>
  );
};

export default Settings;