import React, { useState, useEffect, useCallback } from 'react';

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

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const target = new Date(targetDate);
    
    const difference = target.getTime() - now.getTime();
    
    // Debug logging only for first few seconds
    if (Math.floor(Date.now() / 1000) % 30 === 0) {
      console.log('CountdownTimer Debug:');
      console.log('- Current date:', now.toISOString());
      console.log('- Target date:', target.toISOString());
      console.log('- Days left:', Math.floor(difference / (1000 * 60 * 60 * 24)));
    }
    
    if (difference > 0) {
      const newTimeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
      setTimeLeft(newTimeLeft);
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  }, [targetDate]);

  useEffect(() => {
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-black/20 backdrop-blur-md text-white rounded-xl px-3 py-2 shadow-lg border border-white/10">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center text-center gap-1">
          <div className=" font-semibold text-[0.9rem] leading-none tracking-tighter">{formatNumber(timeLeft.days)}</div>
          <div className="text-xs opacity-80 leading-none">D</div>
        </div>
        <div className="text-xl opacity-60">:</div>
        <div className="flex items-center justify-center text-center gap-1">
          <div className="font-semibold text-[0.9rem] leading-none tracking-tighter">{formatNumber(timeLeft.hours)}</div>
          <div className="text-xs opacity-80 leading-none">H</div>
        </div>
        <div className="text-xl opacity-60">:</div>
        <div className="flex items-center justify-center text-center gap-1">
          <div className="font-semibold text-[0.9rem] leading-none tracking-tighter">{formatNumber(timeLeft.minutes)}</div>
          <div className="text-xs opacity-80 leading-none">M</div>
        </div>
        <div className="text-xl opacity-60">:</div>
        <div className="flex items-center justify-center text-center gap-1">
          <div className="font-semibold text-[0.9rem] leading-none tracking-tighter">{formatNumber(timeLeft.seconds)}</div>
          <div className="text-xs opacity-80 leading-none">S</div>
        </div>
      </div>
    </div>
  );
}; 