import React from 'react';
import { CountdownTimer } from './countdown-timer';

interface PollSkeletonProps {
  startDate?: string;
}

export const PollSkeleton: React.FC<PollSkeletonProps> = ({ startDate }) => {
  return (
    <div className="rounded-lg p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-80">
      {/* Poll Question Skeleton */}  
      <div className="flex items-center justify-between mb-5">
        <div className="flex-1">
          <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded w-1/2 opacity-60"></div>
        </div>
      </div>

      {/* Countdown Timer (if startDate provided) */}
      {startDate && (
        <div className="mb-4">
          <CountdownTimer startDate={startDate} />
        </div>
      )}

      {/* Poll Options Skeleton - Simple lines */}
      <div className="space-y-3 mb-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Radio Button Skeleton */}
            <div className="w-3.5 h-3.5 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 opacity-50"></div>
            
            {/* Option Text Skeleton */}
            <div className={`h-3.5 bg-gray-100 dark:bg-gray-700 rounded opacity-50 ${
              index === 1 ? 'w-28' : index === 2 ? 'w-36' : 'w-24'
            }`}></div>
          </div>
        ))}
      </div>

      {/* Poll Footer Skeleton */}
      <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700 rounded opacity-40"></div>
      </div>
    </div>
  );
}; 