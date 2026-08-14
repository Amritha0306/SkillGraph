import React from 'react';

export const LoadingSkeleton: React.FC<{ type?: 'cards' | 'details' | 'skills' }> = ({
  type = 'cards',
}) => {
  if (type === 'skills') {
    return (
      <div className="w-full glass-panel rounded-2xl p-6 space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded-lg"></div>
        <div className="h-12 w-full bg-slate-800/60 rounded-xl"></div>
        <div className="flex gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-slate-800/80 rounded-lg"></div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="h-9 w-24 bg-slate-800/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'details') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="glass-panel rounded-2xl p-8 space-y-4">
          <div className="h-8 w-3/4 bg-slate-800 rounded-lg"></div>
          <div className="h-5 w-1/2 bg-slate-800/60 rounded-lg"></div>
          <div className="flex gap-3 pt-2">
            <div className="h-6 w-24 bg-slate-800 rounded-full"></div>
            <div className="h-6 w-24 bg-slate-800 rounded-full"></div>
          </div>
          <div className="h-24 w-full bg-slate-800/40 rounded-xl mt-4"></div>
        </div>
        <div className="glass-panel rounded-2xl p-8 h-64 bg-slate-800/30"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-6 w-3/4 bg-slate-800 rounded-lg"></div>
              <div className="h-4 w-1/2 bg-slate-800/60 rounded-lg"></div>
            </div>
            <div className="h-8 w-20 bg-slate-800 rounded-xl"></div>
          </div>
          <div className="h-16 w-full bg-slate-800/40 rounded-xl"></div>
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-16 bg-slate-800 rounded"></div>
            <div className="h-6 w-20 bg-slate-800 rounded"></div>
            <div className="h-6 w-16 bg-slate-800 rounded"></div>
          </div>
          <div className="h-10 w-full bg-slate-800/60 rounded-xl mt-4"></div>
        </div>
      ))}
    </div>
  );
};
