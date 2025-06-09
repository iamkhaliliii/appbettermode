import React from 'react';

export const EventLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          
          {/* Actions Bar */}
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          
          {/* Hero */}
          <div className="aspect-[2/1] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          
          {/* Quick Stats */}
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          
          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 