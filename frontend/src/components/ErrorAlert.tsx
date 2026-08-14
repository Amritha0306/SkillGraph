import React from 'react';
import { AlertTriangle, RefreshCw, Database } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Database Connection Issue',
  message,
  onRetry,
}) => {
  return (
    <div className="w-full rounded-2xl p-5 bg-rose-950/40 border border-rose-500/30 text-rose-200 shadow-xl space-y-3">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="font-bold text-sm sm:text-base text-rose-100">{title}</h4>
          <p className="text-xs sm:text-sm text-rose-300 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      {onRetry && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-md shadow-rose-900/30"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
