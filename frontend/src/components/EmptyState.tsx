import React from 'react';
import { SearchX, Sparkles, ArrowLeft } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Matching Jobs Found',
  description = 'Try adding broader skills or exploring related technologies to unlock more opportunities in the graph.',
  actionText,
  onAction,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-10 sm:p-14 text-center max-w-lg mx-auto space-y-4 border border-slate-800">
      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
        <SearchX className="w-7 h-7" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
          {description}
        </p>
      </div>

      {onAction && actionText && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm inline-flex items-center space-x-2 transition-all shadow-lg shadow-brand-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>{actionText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
