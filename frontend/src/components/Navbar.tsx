import React from 'react';
import { Network, Sparkles, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { DatabaseHealth } from '../types';

interface NavbarProps {
  currentTab: 'match' | 'explore' | 'architecture';
  onSelectTab: (tab: 'match' | 'explore' | 'architecture') => void;
  dbHealth: DatabaseHealth | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, dbHealth }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div 
          onClick={() => onSelectTab('match')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-graph-purple p-[1px] shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Network className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SkillGraph
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Turn your skills into your next opportunity
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => onSelectTab('match')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              currentTab === 'match'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Match Career</span>
          </button>

          <button
            onClick={() => onSelectTab('explore')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              currentTab === 'explore'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Network className="w-4 h-4 text-graph-purple" />
            <span>Explore Skills</span>
          </button>
        </nav>

        {/* CognoDB Live Status Indicator & Know More */}
        <div className="flex flex-col items-end justify-center">
          <div className="flex items-center space-x-2 text-xs px-3 py-1 rounded-full border bg-slate-900/80 border-slate-800">
            <div className="w-2 h-2 rounded-full relative">
              <div className={`w-2 h-2 rounded-full ${dbHealth?.connected ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
              {dbHealth?.connected && (
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
              )}
            </div>
            <span className="text-slate-300 font-medium">
              {dbHealth?.connected ? 'CognoDB is Connected' : 'CognoDB Offline'}
            </span>
          </div>
          <button
            onClick={() => onSelectTab('architecture')}
            className="text-[11px] text-brand-400 hover:text-brand-300 underline underline-offset-2 mt-0.5 mr-1 font-medium transition-colors cursor-pointer"
          >
            Know more
          </button>
        </div>
      </div>
    </header>
  );
};
