import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-black/20 backdrop-blur-md text-white rounded-xl px-4 py-3 shadow-lg border border-white/10">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="font-semibold text-2xl leading-none tracking-tighter">{formatNumber(timeLeft.days)}</div>
          <div className="text-xs opacity-80 leading-none mt-1">Days</div>
        </div>
        <div className="text-xl opacity-60">:</div>
        <div className="text-center">
          <div className="font-semibold text-2xl leading-none tracking-tighter">{formatNumber(timeLeft.hours)}</div>
          <div className="text-xs opacity-80 leading-none mt-1">Hours</div>
        </div>
        <div className="text-xl opacity-60">:</div>
        <div className="text-center">
          <div className="font-semibold text-2xl leading-none tracking-tighter">{formatNumber(timeLeft.minutes)}</div>
          <div className="text-xs opacity-80 leading-none mt-1">Minutes</div>
        </div>
        <div className="text-xl opacity-60">:</div>
        <div className="text-center">
          <div className="font-semibold text-2xl leading-none tracking-tighter">{formatNumber(timeLeft.seconds)}</div>
          <div className="text-xs opacity-80 leading-none mt-1">Seconds</div>
        </div>
      </div>
    </div>
  );
}; 