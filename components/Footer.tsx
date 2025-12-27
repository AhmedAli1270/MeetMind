import React from 'react';
import { Bot, Twitter, Linkedin, Github, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-primary-600 p-1.5 rounded-lg mr-2">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white">MeetMind</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              Making meetings productive again. Intelligent summaries, action items, and insights for modern teams.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Docs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary-600 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Customers</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} MeetMind Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;