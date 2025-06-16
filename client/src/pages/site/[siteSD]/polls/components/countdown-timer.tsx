import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  startDate: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ startDate }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(startDate).getTime();
      const difference = start - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  const formatStartDate = () => {
    const date = new Date(startDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="py-4 px-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Poll starts soon
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatStartDate()}
            </p>
          </div>
        </div>
        
        {/* Countdown */}
        <div className="flex items-center gap-1 text-xs font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
          {timeLeft.days > 0 && (
            <>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{timeLeft.days}d</span>
              <span className="text-gray-400">:</span>
            </>
          )}
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-gray-400">:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-gray-400">:</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}; 