"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Users, UserPlus } from 'lucide-react';

interface ProfileData {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  avatarImage: string;
  timeAgo: string;
  role: string;
  isOnline?: boolean;
  stats?: {
    posts: number;
    followers: number;
    following: number;
  };
}

interface AdvancedProfileCarouselProps {
  profiles: ProfileData[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showStats?: boolean;
  className?: string;
}

export const AdvancedProfileCarousel: React.FC<AdvancedProfileCarouselProps> = ({
  profiles,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showStats = true,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isHovered && !isDragging) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % profiles.length);
      }, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, isHovered, isDragging, profiles.length, autoPlayInterval]);

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + profiles.length) % profiles.length);
  }, [profiles.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % profiles.length);
  }, [profiles.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Touch/Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(currentIndex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    // Add drag logic here if needed
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
      setTouchStart(0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case ' ':
          setIsAutoPlaying(!isAutoPlaying);
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext, isAutoPlaying]);

  const carouselStyles = {
    '--primary-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--secondary-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    '--accent-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    '--shadow-soft': '0 10px 40px rgba(0, 0, 0, 0.1)',
    '--shadow-medium': '0 15px 60px rgba(0, 0, 0, 0.15)',
    '--shadow-strong': '0 25px 80px rgba(0, 0, 0, 0.25)',
    '--transition-smooth': 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
    '--transition-bounce': 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  } as React.CSSProperties;

  return (
    <>
      <style>{`
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          50% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>

      <div className={`w-full ${className}`} style={carouselStyles}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Community Members
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Meet our talented community members and contributors
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
              {currentIndex + 1} of {profiles.length}
            </div>
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                isAutoPlaying 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {isAutoPlaying ? '⏸️' : '▶️'}
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div 
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          ref={carouselRef}
        >
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {profiles.map((profile, index) => (
              <div
                key={profile.id}
                className="w-full flex-shrink-0 px-6 py-8"
                style={{ opacity: index === currentIndex ? 1 : 0.7 }}
              >
                <div className="max-w-md mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border border-white/20 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-3 transition-all duration-700 ease-out">
                  {/* Profile Image */}
                  <div className="relative aspect-square overflow-hidden group">
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-400" />
                    
                    {/* Online Status */}
                    {profile.isOnline && (
                      <div className="absolute top-4 right-4">
                        <div 
                          className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"
                          style={{ animation: 'pulse-green 2s infinite' }}
                        />
                      </div>
                    )}

                    {/* Profile Name Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent drop-shadow-lg">
                        {profile.name}
                      </h2>
                      <p className="text-white/90 text-sm font-medium backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full inline-block">
                        {profile.role}
                      </p>
                    </div>
                  </div>
                  
                  {/* Profile Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-full overflow-hidden p-[3px] bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-110 hover:rotate-6 transition-all duration-500 ease-out shadow-lg hover:shadow-blue-500/30"
                        >
                          <img
                            src={profile.avatarImage}
                            alt={profile.username}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-500 hover:translate-x-2 cursor-pointer">
                            @{profile.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Active {profile.timeAgo}
                          </div>
                        </div>
                      </div>

                      <button 
                        className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/30 active:scale-95 transition-all duration-500 ease-out relative overflow-hidden group"
                        onClick={() => console.log(`Add ${profile.name} as member`)}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                        <UserPlus className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Add Member</span>
                      </button>
                    </div>

                    {/* Stats */}
                    {showStats && profile.stats && (
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-center group cursor-pointer hover:-translate-y-1 transition-all duration-300">
                          <div className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400">
                            {profile.stats.posts}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">Posts</div>
                        </div>
                        <div className="text-center group cursor-pointer hover:-translate-y-1 transition-all duration-300">
                          <div className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400">
                            {profile.stats.followers}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">Followers</div>
                        </div>
                        <div className="text-center group cursor-pointer hover:-translate-y-1 transition-all duration-300">
                          <div className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400">
                            {profile.stats.following}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">Following</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:scale-110 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={profiles.length <= 1}
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:scale-110 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={profiles.length <= 1}
          >
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Dots Indicator */}
        {showDots && profiles.length > 1 && (
          <div className="flex items-center justify-center mt-8 gap-3">
            {profiles.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ease-out cursor-pointer ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-125 shadow-lg shadow-blue-500/40'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:scale-110'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdvancedProfileCarousel; 