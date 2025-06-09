import React from 'react';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

interface EventErrorStateProps {
  error: string;
  onBack: () => void;
  onRetry: () => void;
}

export const EventErrorState: React.FC<EventErrorStateProps> = ({
  error,
  onBack,
  onRetry
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-sm mx-auto text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h1>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {error}
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}; 