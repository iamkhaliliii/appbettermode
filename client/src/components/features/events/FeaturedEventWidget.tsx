import React from 'react';
import { CountdownTimer } from './CountdownTimer';
import { ArrowRight, Clock, MapPin, Users, Star } from 'lucide-react';

export const FeaturedEventWidget: React.FC = () => {
  return (
    <div className="w-full">
      <div className="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 cursor-pointer rounded-lg">
        {/* Wide banner with blurred background */}
        <div className="relative overflow-hidden rounded-lg aspect-[3/1]">
          {/* Blurred Background Image */}
          <img 
            src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=400&fit=crop&crop=center&auto=format&q=80"
            alt="Tech Conference 2024"
            className="w-full h-full object-cover blur-lg scale-125 transition-transform duration-300 group-hover:scale-130"
          />
          
          {/* Overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
          
          {/* Clean Square Image - Right Side */}
          <div className="absolute top-0 right-0 bottom-0 w-1/3 z-20 p-2">
            <div className="w-full h-full rounded-md overflow-hidden shadow-lg border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=400&fit=crop&crop=center&auto=format&q=80"
                alt="Tech Conference 2024"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
          
          {/* Countdown Timer - Top Left */}
          <div className="absolute top-3 left-3 z-10">
            <CountdownTimer targetDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()} />
          </div>
          
          {/* Date Badge - Top Right */}
          <div className="absolute top-3 right-3 z-30">
            <div className="bg-black/90 backdrop-blur-sm text-white rounded-md px-1.5 py-1 shadow-lg">
              <div className="text-center">
                <div className="text-xs font-medium uppercase tracking-wide opacity-80 leading-none">
                  Dec
                </div>
                <div className="text-sm font-bold leading-none">
                  15
                </div>
              </div>
            </div>
          </div>
          
          {/* Event Content - Left Side Next to Image */}
          <div className="absolute inset-0 p-4 pr-[36%] z-10 flex flex-col justify-end">
            <div className="max-w-full space-y-2">
              {/* Category */}
              <div className="flex justify-start">
                <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 font-medium rounded-md shadow-sm border-0">
                  Conference
                </span>
              </div>
              
              {/* Title */}
              <h3 className="font-bold text-lg text-white leading-tight drop-shadow-lg">
                Tech Conference 2024<br/>
                <span className="text-base font-medium text-blue-200">Future of AI</span>
                <ArrowRight className="inline w-4 h-4 text-white/60 group-hover:text-white opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300 ml-1" />
              </h3>
              
              {/* Event Meta Information */}
              <div className="space-y-1 text-white/90">
                <div className="flex items-center gap-1.5 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>Dec 15, 2024 • 10:00 AM</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <MapPin className="w-3 h-3" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <div className="flex items-center gap-1 bg-white/10 rounded px-1.5 py-0.5">
                    <Users className="w-3 h-3 text-blue-300" />
                    <span>245</span>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-500/20 rounded px-1.5 py-0.5">
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    <span>Featured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 