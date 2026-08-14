import React from 'react';

interface MatchBadgeProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ percentage, size = 'md' }) => {
  const getColor = (pct: number) => {
    if (pct >= 80) return {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20',
      fill: '#10b981',
    };
    if (pct >= 50) return {
      bg: 'bg-brand-500/15',
      text: 'text-brand-400',
      border: 'border-brand-500/30',
      glow: 'shadow-brand-500/20',
      fill: '#0284c7',
    };
    return {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/20',
      fill: '#f59e0b',
    };
  };

  const style = getColor(percentage);

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
        {percentage}% Match
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${style.bg} ${style.border} ${style.glow} shadow-lg backdrop-blur-md`}>
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Circular progress SVG */}
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="currentColor"
              strokeWidth="6"
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke={style.fill}
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={2 * Math.PI * 34 * (1 - percentage / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-extrabold tracking-tight ${style.text}`}>{percentage}%</span>
          </div>
        </div>
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-1">
          Graph Match
        </span>
      </div>
    );
  }

  // Medium (Default)
  return (
    <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border ${style.bg} ${style.text} ${style.border} shadow-sm font-bold text-sm`}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.fill }}></span>
      <span>{percentage}% Match</span>
    </div>
  );
};
