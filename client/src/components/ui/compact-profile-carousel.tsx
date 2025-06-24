"use client";

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';

interface ProfileData {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  role: string;
  isOnline?: boolean;
}

interface CompactProfileCarouselProps {
  profiles: ProfileData[];
  className?: string;
}

export const CompactProfileCarousel: React.FC<CompactProfileCarouselProps> = ({
  profiles,
  className = ""
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Simple Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Community Members
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors duration-200"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Compact Carousel */}
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex-shrink-0 w-[140px] bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:scale-[1.02] transition-all duration-200 overflow-hidden"
            >
              {/* Compact Profile Image */}
              <div className="relative aspect-square">
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Simple gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Online indicator */}
                {profile.isOnline && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm" />
                  </div>
                )}

                {/* Compact name overlay */}
                <div className="absolute bottom-2 left-2 right-2">
                  <h5 className="text-white text-sm font-medium truncate drop-shadow">
                    {profile.name}
                  </h5>
                </div>
              </div>
              
              {/* Minimal info section */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      @{profile.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                      {profile.role}
                    </p>
                  </div>
                  
                  <button 
                    className="w-7 h-7 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200 ml-2"
                    onClick={() => console.log(`Add ${profile.name}`)}
                  >
                    <UserPlus className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CompactProfileCarousel; 